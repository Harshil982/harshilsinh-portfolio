import {
  BoxGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
} from "three";

/**
 * The robot, assembled from primitives in code.
 *
 * Deliberately not a loaded model. A rigged GLB would mean an external asset,
 * a licence to honour, a network fetch, and a skeleton whose joint names I
 * don't control — and the whole point here is a walk cycle that can be tuned
 * to the frame. Every joint below is a named `Object3D` in a parent-child
 * hierarchy, so the animator can rotate a hip and have the shin, foot and
 * everything under it follow for free.
 *
 * The hierarchy is what makes the walk read as a walk:
 *
 *   root            travel + turn
 *   └ bob           vertical bounce and body roll
 *     ├ torso
 *     │ ├ head      looks around, tracks the pointer
 *     │ │ └ antenna trails the head with a lag
 *     │ ├ armL/R    shoulder pivots, counter-swing to the legs
 *     └ hipL/R      thigh pivots
 *       └ kneeL/R   shin, bends only on the forward swing
 */

export interface RobotRig {
  root: Group;
  bob: Group;
  torso: Group;
  head: Group;
  antenna: Group;
  arms: { left: Group; right: Group };
  hips: { left: Group; right: Group };
  knees: { left: Group; right: Group };
  eyes: { left: Mesh; right: Mesh };
  shadow: Mesh;
  /** Everything that needs freeing when the scene tears down. */
  disposables: { dispose(): void }[];
}

interface Palette {
  shell: string;
  panel: string;
  accent: string;
  visor: string;
}

/** A pivot at a given point, so rotations happen at the joint, not the centre. */
function pivot(x: number, y: number, z: number): Group {
  const group = new Group();
  group.position.set(x, y, z);
  return group;
}

export function buildRobot(palette: Palette): RobotRig {
  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(item: T): T => {
    disposables.push(item);
    return item;
  };

  const shell = track(
    new MeshStandardMaterial({
      color: new Color(palette.shell),
      roughness: 0.42,
      metalness: 0.16,
    })
  );
  const panel = track(
    new MeshStandardMaterial({
      color: new Color(palette.panel),
      roughness: 0.55,
      metalness: 0.3,
    })
  );
  const accent = track(
    new MeshStandardMaterial({
      color: new Color(palette.accent),
      roughness: 0.3,
      metalness: 0.1,
      emissive: new Color(palette.accent),
      emissiveIntensity: 0.55,
    })
  );
  const visor = track(
    new MeshStandardMaterial({
      color: new Color(palette.visor),
      roughness: 0.15,
      metalness: 0.6,
    })
  );
  const glow = track(
    new MeshBasicMaterial({ color: new Color(palette.accent) })
  );

  const root = new Group();
  const bob = new Group();
  root.add(bob);

  // --- Torso -------------------------------------------------------------
  // Mini-robot proportions: oversized head, compact body. The first pass
  // used a tall chest with the skull sitting directly on it, and with no gap
  // between them the two boxes read as a single slab rather than a character.
  const torso = new Group();
  torso.position.y = 0.72;
  bob.add(torso);

  const chestGeo = track(new BoxGeometry(0.7, 0.52, 0.48));
  const chest = new Mesh(chestGeo, shell);
  torso.add(chest);

  const plateGeo = track(new BoxGeometry(0.38, 0.24, 0.05));
  const plate = new Mesh(plateGeo, panel);
  plate.position.set(0, -0.01, 0.26);
  torso.add(plate);

  const coreGeo = track(new CircleGeometry(0.062, 24));
  const core = new Mesh(coreGeo, glow);
  core.position.set(0, -0.01, 0.29);
  torso.add(core);

  // The neck is the gap made visible.
  // Wide enough to read as a join from the side, not a floating head.
  const neckGeo = track(new CylinderGeometry(0.13, 0.15, 0.14, 14));
  const neck = new Mesh(neckGeo, panel);
  neck.position.y = 0.29;
  torso.add(neck);

  // --- Head --------------------------------------------------------------
  // Pivot sits at the neck joint so the head rotates about its base.
  const head = pivot(0, 0.36, 0);
  torso.add(head);

  const skullGeo = track(new BoxGeometry(0.8, 0.66, 0.66));
  const skull = new Mesh(skullGeo, shell);
  skull.position.y = 0.35;
  head.add(skull);

  const visorGeo = track(new BoxGeometry(0.62, 0.3, 0.06));
  const visorMesh = new Mesh(visorGeo, visor);
  visorMesh.position.set(0, 0.36, 0.33);
  head.add(visorMesh);

  const eyeGeo = track(new SphereGeometry(0.062, 16, 12));
  const eyeL = new Mesh(eyeGeo, accent);
  const eyeR = new Mesh(eyeGeo, accent);
  eyeL.position.set(-0.15, 0.37, 0.36);
  eyeR.position.set(0.15, 0.37, 0.36);
  head.add(eyeL, eyeR);

  const podGeo = track(new CylinderGeometry(0.085, 0.085, 0.08, 16));
  const podL = new Mesh(podGeo, panel);
  const podR = new Mesh(podGeo, panel);
  podL.rotation.z = Math.PI / 2;
  podR.rotation.z = Math.PI / 2;
  podL.position.set(-0.42, 0.35, 0);
  podR.position.set(0.42, 0.35, 0);
  head.add(podL, podR);

  // --- Antenna -----------------------------------------------------------
  const antenna = pivot(0, 0.68, -0.02);
  head.add(antenna);

  const stalkGeo = track(new CylinderGeometry(0.018, 0.022, 0.26, 10));
  const stalk = new Mesh(stalkGeo, panel);
  stalk.position.y = 0.13;
  antenna.add(stalk);

  const bulbGeo = track(new SphereGeometry(0.055, 16, 12));
  const bulb = new Mesh(bulbGeo, accent);
  bulb.position.y = 0.29;
  antenna.add(bulb);

  // --- Arms --------------------------------------------------------------
  const armGeo = track(new CapsuleGeometry(0.07, 0.24, 4, 10));
  const handGeo = track(new SphereGeometry(0.08, 14, 12));

  function makeArm(side: -1 | 1): Group {
    const shoulder = pivot(side * 0.42, 0.14, 0);
    const upper = new Mesh(armGeo, shell);
    upper.position.y = -0.17;
    const hand = new Mesh(handGeo, panel);
    hand.position.y = -0.36;
    shoulder.add(upper, hand);
    return shoulder;
  }

  const armL = makeArm(-1);
  const armR = makeArm(1);
  torso.add(armL, armR);

  // --- Legs --------------------------------------------------------------
  const thighGeo = track(new CapsuleGeometry(0.078, 0.14, 4, 10));
  const shinGeo = track(new CapsuleGeometry(0.068, 0.12, 4, 10));
  const footGeo = track(new BoxGeometry(0.19, 0.085, 0.28));

  function makeLeg(side: -1 | 1): { hip: Group; knee: Group } {
    const hip = pivot(side * 0.18, 0.47, 0);
    const thigh = new Mesh(thighGeo, shell);
    thigh.position.y = -0.11;
    hip.add(thigh);

    const knee = pivot(0, -0.22, 0);
    const shin = new Mesh(shinGeo, shell);
    shin.position.y = -0.1;
    const foot = new Mesh(footGeo, panel);
    foot.position.set(0, -0.19, 0.04);
    knee.add(shin, foot);
    hip.add(knee);

    return { hip, knee };
  }

  const legL = makeLeg(-1);
  const legR = makeLeg(1);
  bob.add(legL.hip, legR.hip);

  // --- Contact shadow ----------------------------------------------------
  // A soft disc, not a shadow map: one extra draw call instead of a whole
  // depth pass, which is the right trade for a mascot this size.
  const shadowGeo = track(new CircleGeometry(0.38, 28));
  const shadowMat = track(
    new MeshBasicMaterial({
      color: new Color("#000000"),
      transparent: true,
      opacity: 0.24,
      depthWrite: false,
    })
  );
  const shadow = new Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  root.add(shadow);

  return {
    root,
    bob,
    torso,
    head,
    antenna,
    arms: { left: armL, right: armR },
    hips: { left: legL.hip, right: legR.hip },
    knees: { left: legL.knee, right: legR.knee },
    eyes: { left: eyeL, right: eyeR },
    shadow,
    disposables,
  };
}

/** Frees every geometry and material the rig owns. */
export function disposeRobot(rig: RobotRig) {
  rig.disposables.forEach((item) => item.dispose());
  rig.root.traverse((object: Object3D) => {
    if (object instanceof Mesh) {
      object.geometry = undefined as never;
      object.material = undefined as never;
    }
  });
}
