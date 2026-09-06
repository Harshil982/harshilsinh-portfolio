import { MathUtils } from "three";
import type { RobotRig } from "./build-robot";

/**
 * What the robot is doing, and how it decides to do something else.
 *
 * A walk cycle is trigonometry — the interesting part is the behaviour on top
 * of it. Each action declares how long it runs and what may follow it, so the
 * robot reads as *deciding* rather than cycling through a playlist. The weights
 * keep walking dominant, because a robot that mostly stands still looks broken
 * rather than idle.
 */

export type Action = "idle" | "walk" | "turn" | "wave" | "lookAround" | "scan";

interface ActionSpec {
  /** Seconds, picked uniformly in range. */
  duration: [number, number];
  /** Candidate follow-ups and their relative weights. */
  next: Partial<Record<Action, number>>;
}

const SPEC: Record<Action, ActionSpec> = {
  idle: { duration: [0.8, 2.0], next: { walk: 5, lookAround: 2, wave: 1, scan: 1 } },
  walk: { duration: [2.2, 4.5], next: { idle: 2, turn: 3, scan: 1, walk: 1 } },
  turn: { duration: [0.7, 0.7], next: { walk: 6, idle: 1 } },
  wave: { duration: [1.9, 1.9], next: { idle: 2, walk: 3 } },
  lookAround: { duration: [1.8, 2.8], next: { walk: 4, idle: 1, scan: 1 } },
  scan: { duration: [1.6, 2.2], next: { walk: 4, idle: 2 } },
};

/** How far the robot may wander from centre, in world units. */
const RANGE = 1.25;
const WALK_SPEED = 0.62;

function pick(weights: Partial<Record<Action, number>>): Action {
  const entries = Object.entries(weights) as [Action, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [action, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return action;
  }
  return entries[0][0];
}

export class RobotBehaviour {
  private action: Action = "idle";
  private elapsed = 0;
  private duration = 1;
  /** Travel along x, and which way the robot faces (1 = right). */
  private x = 0;
  private facing: 1 | -1 = 1;
  private targetYaw = Math.PI / 2;
  private yaw = Math.PI / 2;
  /** Phase of the walk cycle, kept continuous so gaits never snap. */
  private stride = 0;
  private headYaw = 0;
  private headPitch = 0;
  private blink = 0;
  private nextBlink = 2 + Math.random() * 3;

  constructor(private rig: RobotRig) {
    this.enter("walk");
  }

  private enter(action: Action) {
    this.action = action;
    this.elapsed = 0;
    const [min, max] = SPEC[action].duration;
    this.duration = min + Math.random() * (max - min);

    if (action === "turn") {
      this.facing = this.facing === 1 ? -1 : 1;
    }

    /*
     * Walking happens in profile; everything else turns to face the reader.
     *
     * Without this the robot spends most of its life side-on or facing away,
     * and a mascot whose face you rarely see is just a shape moving in a
     * corner. A neck can only turn so far, so the body has to do it — which is
     * also what a person does when something catches their attention.
     */
    if (action === "walk" || action === "turn") {
      this.targetYaw = this.facing === 1 ? Math.PI / 2 : -Math.PI / 2;
    } else {
      // Slightly off-square so it never looks like a mannequin.
      this.targetYaw = (Math.random() - 0.5) * 0.5;
    }

    if (action === "lookAround") {
      this.headYaw = (Math.random() - 0.5) * 1.4;
      this.headPitch = (Math.random() - 0.5) * 0.4;
    }
  }

  /**
   * @param pointer  Cursor position over the canvas, -1..1, or null when the
   *                 pointer is elsewhere. The robot glances toward it.
   */
  update(dt: number, elapsedTotal: number, pointer: { x: number; y: number } | null) {
    const rig = this.rig;
    this.elapsed += dt;

    if (this.elapsed >= this.duration) {
      this.enter(pick(SPEC[this.action].next));
    }

    const t = this.elapsed;
    const walking = this.action === "walk";

    // --- Travel ---------------------------------------------------------
    if (walking) {
      this.x += this.facing * WALK_SPEED * dt;
      // Turn around rather than walk out of frame.
      if (Math.abs(this.x) > RANGE) {
        this.x = MathUtils.clamp(this.x, -RANGE, RANGE);
        this.enter("turn");
      }
    }
    rig.root.position.x = this.x;

    this.yaw = MathUtils.damp(this.yaw, this.targetYaw, 9, dt);
    rig.root.rotation.y = this.yaw;

    // --- Gait -----------------------------------------------------------
    // Stride only advances while walking, so the legs settle where they are
    // instead of snapping to zero the moment the robot stops.
    const strideSpeed = walking ? 7.6 : 0;
    this.stride += strideSpeed * dt;
    const swing = Math.sin(this.stride);
    const swingB = Math.sin(this.stride + Math.PI);
    const settle = walking ? 1 : Math.max(0, 1 - (t * 3));

    const legAmp = 0.62 * settle;
    rig.hips.left.rotation.x = swing * legAmp;
    rig.hips.right.rotation.x = swingB * legAmp;

    // Knees bend only as the leg swings forward — a straight-through-the-floor
    // shin is the classic tell of a fake walk cycle.
    rig.knees.left.rotation.x = Math.max(0, -swing) * 0.85 * settle;
    rig.knees.right.rotation.x = Math.max(0, -swingB) * 0.85 * settle;

    // Arms counter-swing the legs.
    const armAmp = 0.5 * settle;
    rig.arms.left.rotation.x = swingB * armAmp;
    rig.arms.right.rotation.x = swing * armAmp;

    // Two bounces per stride, plus a little roll into the step.
    rig.bob.position.y = Math.abs(Math.sin(this.stride)) * 0.055 * settle;
    rig.bob.rotation.z = swing * 0.045 * settle;
    rig.bob.rotation.y = swing * 0.06 * settle;

    // Shadow tightens as the robot lifts off.
    const lift = rig.bob.position.y;
    const shadowScale = 1 - lift * 1.6;
    rig.shadow.scale.setScalar(MathUtils.clamp(shadowScale, 0.72, 1));
    (rig.shadow.material as { opacity: number }).opacity =
      0.24 * MathUtils.clamp(shadowScale, 0.55, 1);

    // --- Head -----------------------------------------------------------
    let wantYaw = this.headYaw;
    let wantPitch = this.headPitch;

    if (pointer) {
      // Look at the cursor, in the robot's own frame rather than the world's,
      // so it still turns the right way after it has spun around.
      // Cursor direction expressed in the robot's own frame, so it still
      // turns the correct way after the body has spun around.
      wantYaw = MathUtils.clamp(Math.atan2(pointer.x, 1.4) - this.yaw, -0.85, 0.85);
      wantPitch = MathUtils.clamp(-pointer.y * 0.5, -0.35, 0.45);
    } else if (this.action === "scan") {
      wantYaw = Math.sin(t * 2.1) * 0.75;
      wantPitch = 0.1;
    } else if (walking) {
      wantYaw = swing * 0.08;
      wantPitch = 0;
    }

    rig.head.rotation.y = MathUtils.damp(rig.head.rotation.y, wantYaw, 6, dt);
    rig.head.rotation.x = MathUtils.damp(rig.head.rotation.x, wantPitch, 6, dt);

    // Antenna trails the head, then wobbles.
    const lag = rig.head.rotation.y;
    rig.antenna.rotation.z = MathUtils.damp(
      rig.antenna.rotation.z,
      -lag * 0.5 + Math.sin(elapsedTotal * 3.4) * 0.07,
      5,
      dt
    );
    rig.antenna.rotation.x = Math.sin(elapsedTotal * 2.2) * 0.06;

    // --- Wave ------------------------------------------------------------
    if (this.action === "wave") {
      const p = MathUtils.clamp(t / this.duration, 0, 1);
      // Raise, flap, lower — eased at both ends so it doesn't snap back.
      const raise = Math.sin(Math.min(p, 1) * Math.PI);
      rig.arms.right.rotation.x = -raise * 2.5;
      rig.arms.right.rotation.z = -raise * (0.4 + Math.sin(t * 15) * 0.28);
      rig.head.rotation.z = raise * 0.1;
    } else {
      rig.arms.right.rotation.z = MathUtils.damp(rig.arms.right.rotation.z, 0, 8, dt);
      rig.head.rotation.z = MathUtils.damp(rig.head.rotation.z, 0, 8, dt);
    }

    // --- Blink ------------------------------------------------------------
    this.blink += dt;
    if (this.blink > this.nextBlink) {
      const phase = (this.blink - this.nextBlink) / 0.13;
      const shut = phase < 1 ? 1 - Math.abs(phase * 2 - 1) : 0;
      const open = 1 - shut;
      rig.eyes.left.scale.y = open;
      rig.eyes.right.scale.y = open;
      if (phase >= 1) {
        this.blink = 0;
        this.nextBlink = 2 + Math.random() * 4;
      }
    }
  }

  /** Used by the host to place the hit area over the robot. */
  get worldX() {
    return this.x;
  }

  /** Interrupts whatever it was doing and waves — for the "say hello" beat. */
  greet() {
    this.enter("wave");
  }
}
