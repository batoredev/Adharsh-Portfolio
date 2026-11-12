/* Drug–receptor hero.
   A stylised G-protein-coupled receptor (7 transmembrane helices) sitting in a lipid bilayer.
   An agonist drifts in, binds the orthosteric pocket, TM6 swings outward (activation) and a
   signal pulses into the cell; then the ligand dissociates and the cycle repeats.
   Loaded as a classic script so the site also works when opened straight from disk. */
(() => {
  'use strict';

  const mount = document.getElementById('receptor');
  if (!mount) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ui = {
    title: document.getElementById('bindTitle'),
    phase: document.getElementById('bindPhase'),
    time: document.getElementById('playerTime'),
    ring: document.getElementById('playerRing'),
    btn: document.getElementById('playerBtn'),
  };
  const callout = ui.title ? ui.title.closest('.callout') : null;

  const PHASES = {
    approach: ['Ligand approaching', 'Agonist diffusing to the pocket'],
    bound: ['Receptor activated', 'TM6 swings out · signal relayed'],
    release: ['Ligand dissociating', 'Relaxing to the inactive state'],
    rest: ['Receptor at rest', 'Inactive conformation'],
  };

  const fail = () => {
    document.documentElement.classList.add('no-webgl');
    if (ui.btn) ui.btn.hidden = true;
  };

  import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js').then(init, fail);

  function init(THREE) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
      fail();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const V3 = THREE.Vector3;
    const col = (hex) => new THREE.Color(hex);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    const lookTarget = new V3(0, 0.1, 0);

    /* ---------- Image-based lighting: a tiny studio of coloured light panels ---------- */
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(buildEnvironment(), 0.04).texture;
    pmrem.dispose();

    function buildEnvironment() {
      const env = new THREE.Scene();
      env.add(new THREE.Mesh(
        new THREE.SphereGeometry(20, 32, 16),
        new THREE.MeshBasicMaterial({ color: 0x0a0e26, side: THREE.BackSide })
      ));
      const panel = (hex, strength, w, h, pos) => {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ color: col(hex).multiplyScalar(strength), side: THREE.DoubleSide })
        );
        m.position.set(pos[0], pos[1], pos[2]);
        m.lookAt(0, 0, 0);
        env.add(m);
      };
      panel('#6f9bff', 3.2, 8, 12, [-10, 2, 4]);
      panel('#ff6fae', 3.0, 8, 12, [10, 0, 2]);
      panel('#ffffff', 4.0, 14, 4, [0, 12, 2]);
      panel('#8a5cff', 2.0, 12, 6, [0, 0, -12]);
      panel('#7cf0d0', 1.2, 10, 3, [0, -10, 4]);
      return env;
    }

    scene.add(new THREE.HemisphereLight(0xa9b8ff, 0x2a1640, 0.8));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(4, 8, 6);
    scene.add(key);
    const pinkLight = new THREE.PointLight(0xff6fae, 40, 22);
    pinkLight.position.set(5, -1, 4);
    scene.add(pinkLight);
    const blueLight = new THREE.PointLight(0x5b8cff, 40, 22);
    blueLight.position.set(-5, 2, 4);
    scene.add(blueLight);

    /* ---------- Helpers ---------- */
    function glowTexture() {
      const c = document.createElement('canvas');
      c.width = c.height = 128;
      const g = c.getContext('2d');
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.3, 'rgba(255,255,255,0.4)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, 128, 128);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    const GLOW = glowTexture();

    // Fresnel rim: bright at grazing angles, clear face-on. Gives the glassy outline.
    function rimMaterial(color, power, strength) {
      return new THREE.ShaderMaterial({
        uniforms: { uColor: { value: color.clone() }, uPower: { value: power }, uStrength: { value: strength } },
        vertexShader: `
          varying vec3 vN; varying vec3 vV;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform vec3 uColor; uniform float uPower; uniform float uStrength;
          varying vec3 vN; varying vec3 vV;
          void main() {
            float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
            gl_FragColor = vec4(uColor * f * uStrength, f);
            #include <colorspace_fragment>
          }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
    }

    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const clamp01 = (t) => Math.min(1, Math.max(0, t));
    const smooth = (e0, e1, x) => { const t = clamp01((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

    /* ---------- Scene graph ---------- */
    const root = new THREE.Group(); // parallax + framing
    scene.add(root);
    const rec = new THREE.Group(); // slow rotation
    root.add(rec);

    const H = 4.2;   // helix length
    const R = 1.5;   // bundle radius
    const N = 7;
    const palette = ['#4d7cff', '#5f6dff', '#7a5cff', '#9a57f5', '#c25ce0', '#e866bf', '#ff7aa8'].map(col);

    class HelixCurve extends THREE.Curve {
      constructor(r, h, turns) { super(); this.r = r; this.h = h; this.turns = turns; }
      getPoint(t, target = new V3()) {
        const a = t * this.turns * Math.PI * 2;
        return target.set(Math.cos(a) * this.r, (t - 0.5) * this.h, Math.sin(a) * this.r);
      }
    }

    const coilGeo = new THREE.TubeGeometry(new HelixCurve(0.3, H - 0.3, 6.5), 360, 0.1, 10, false);
    const shellGeo = new THREE.CapsuleGeometry(0.5, H - 0.9, 8, 28);
    const helices = [];

    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2 + 0.3;
      const radial = new V3(Math.cos(ang), 0, Math.sin(ang));
      const tangent = new V3(-Math.sin(ang), 0, Math.cos(ang));
      const tilt = new THREE.Quaternion()
        .setFromAxisAngle(tangent, (i % 2 ? 1 : -1) * 0.1)
        .multiply(new THREE.Quaternion().setFromAxisAngle(radial, 0.12 * Math.sin(i * 1.7)));

      const pivot = new THREE.Group(); // pivot at the extracellular end
      pivot.position.set(radial.x * R, H / 2, radial.z * R);
      pivot.quaternion.copy(tilt);
      const inner = new THREE.Group();
      inner.position.y = -H / 2;
      pivot.add(inner);

      const color = palette[i];
      const coilMat = new THREE.MeshPhysicalMaterial({
        color, roughness: 0.22, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.1,
        iridescence: 0.6, iridescenceIOR: 1.4, emissive: color, emissiveIntensity: 0.14,
      });
      const coil = new THREE.Mesh(coilGeo, coilMat);
      coil.rotation.y = i * 0.9;

      const tintMat = new THREE.MeshPhysicalMaterial({
        color: color.clone().lerp(col('#ffffff'), 0.45), roughness: 0.05, metalness: 0,
        clearcoat: 1, iridescence: 1, iridescenceIOR: 1.3,
        transparent: true, opacity: 0.16, depthWrite: false, envMapIntensity: 1.6,
      });
      const tint = new THREE.Mesh(shellGeo, tintMat);
      tint.renderOrder = 2;
      const rimMat = rimMaterial(color.clone().lerp(col('#ffffff'), 0.35), 2.4, 1.1);
      const rim = new THREE.Mesh(shellGeo, rimMat);
      rim.renderOrder = 3;
      inner.add(coil, tint, rim);
      rec.add(pivot);
      helices.push({ pivot, tilt, tangent, radial, coilMat, rimMat });
    }

    // End points of a helix axis, in receptor space.
    const DOWN = new V3(0, -H, 0);
    function endPoint(h, bottom, out) {
      out.copy(h.pivot.position);
      if (bottom) out.add(DOWN.clone().applyQuaternion(h.pivot.quaternion));
      return out;
    }

    // Loops: TM1 runs top→bottom, so loop i joins helices i and i+1 at the bottom when i is even.
    function loopCurve(a, b, bottom, lift) {
      const s = bottom ? -1 : 1;
      const ra = new V3(a.x, 0, a.z).normalize();
      const rb = new V3(b.x, 0, b.z).normalize();
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const rm = new V3(mid.x, 0, mid.z).normalize();
      mid.addScaledVector(rm, 0.55);
      mid.y += s * lift;
      const a2 = a.clone().addScaledVector(ra, 0.2); a2.y = a.y + s * lift * 0.55;
      const b2 = b.clone().addScaledVector(rb, 0.2); b2.y = b.y + s * lift * 0.55;
      return new THREE.CatmullRomCurve3([a.clone(), a2, mid, b2, b.clone()], false, 'centripetal');
    }

    const LOOP_R = 0.075;
    const loopMeshes = [];
    for (let i = 0; i < N - 1; i++) {
      const bottom = i % 2 === 0;
      const lift = i === 3 ? 1.25 : i === 4 ? 1.0 : 0.75; // ECL2 long, ICL3 long
      const a = endPoint(helices[i], bottom, new V3());
      const b = endPoint(helices[i + 1], bottom, new V3());
      const mat = new THREE.MeshPhysicalMaterial({
        color: palette[i].clone().lerp(palette[i + 1], 0.5), roughness: 0.25, clearcoat: 1,
        iridescence: 0.5, emissive: palette[i], emissiveIntensity: 0.12,
      });
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(loopCurve(a, b, bottom, lift), 64, LOOP_R, 8, false), mat);
      rec.add(mesh);
      loopMeshes.push({ mesh, bottom, lift });
    }

    // N-terminus (extracellular) and C-terminus with a short helix 8 (intracellular).
    {
      const h0 = helices[0], h6 = helices[N - 1];
      const a = endPoint(h0, false, new V3());
      const r0 = h0.radial, t0 = h0.tangent;
      const nTerm = new THREE.CatmullRomCurve3([
        a.clone(),
        a.clone().add(new V3(0, 0.5, 0)).addScaledVector(r0, 0.3),
        a.clone().add(new V3(0, 1.1, 0)).addScaledVector(r0, 0.9).addScaledVector(t0, 0.3),
        a.clone().add(new V3(0, 1.45, 0)).addScaledVector(r0, 1.5).addScaledVector(t0, -0.2),
        a.clone().add(new V3(0, 1.55, 0)).addScaledVector(r0, 2.0),
      ], false, 'centripetal');
      const b = endPoint(h6, true, new V3());
      const r6 = h6.radial, t6 = h6.tangent;
      const cTerm = new THREE.CatmullRomCurve3([
        b.clone(),
        b.clone().add(new V3(0, -0.35, 0)).addScaledVector(r6, 0.3),
        b.clone().add(new V3(0, -0.5, 0)).addScaledVector(r6, 0.6).addScaledVector(t6, 0.8),
        b.clone().add(new V3(0, -0.55, 0)).addScaledVector(r6, 0.7).addScaledVector(t6, 1.6),
        b.clone().add(new V3(0, -0.95, 0)).addScaledVector(r6, 1.1).addScaledVector(t6, 2.0),
      ], false, 'centripetal');
      const termMat = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.25, clearcoat: 1, iridescence: 0.5, emissive: c, emissiveIntensity: 0.12 });
      rec.add(new THREE.Mesh(new THREE.TubeGeometry(nTerm, 64, LOOP_R, 8, false), termMat(palette[0])));
      rec.add(new THREE.Mesh(new THREE.TubeGeometry(cTerm, 64, LOOP_R, 8, false), termMat(palette[N - 1])));
    }

    // ICL3 (TM5–TM6, intracellular) is rebuilt as TM6 swings, so the loop stays attached.
    const icl3 = loopMeshes[4];
    const qAct = new THREE.Quaternion();
    let lastPhi = 0;
    function setActivation(phi) {
      if (Math.abs(phi - lastPhi) < 0.0015) return;
      lastPhi = phi;
      const h = helices[5];
      qAct.setFromAxisAngle(h.tangent, phi);
      h.pivot.quaternion.copy(qAct).multiply(h.tilt);
      const a = endPoint(helices[4], true, new V3());
      const b = endPoint(helices[5], true, new V3());
      const g = new THREE.TubeGeometry(loopCurve(a, b, true, icl3.lift), 64, LOOP_R, 8, false);
      icl3.mesh.geometry.dispose();
      icl3.mesh.geometry = g;
    }

    /* ---------- Lipid bilayer ---------- */
    {
      const LEAF_Y = 1.85, INNER = 2.3, OUTER = 4.2, STEP = 0.3;
      const pts = [];
      for (let row = -20; row <= 20; row++) {
        for (let colI = -20; colI <= 20; colI++) {
          const x = (colI + (row % 2) * 0.5) * STEP;
          const z = row * STEP * 0.866;
          const r = Math.hypot(x, z);
          if (r < INNER || r > OUTER) continue;
          pts.push([x, z, r]);
        }
      }
      const geo = new THREE.IcosahedronGeometry(0.085, 1);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0, emissive: col('#1e2360'), emissiveIntensity: 0.3 });
      const lipids = new THREE.InstancedMesh(geo, mat, pts.length * 2);
      const dummy = new THREE.Object3D();
      const cA = col('#6f82d8'), cB = col('#c98bb4'), tmp = new THREE.Color();
      let n = 0;
      for (const y of [LEAF_Y, -LEAF_Y]) {
        for (const [x, z, r] of pts) {
          const fade = 1 - smooth(2.8, OUTER, r);
          dummy.position.set(x + (Math.random() - 0.5) * 0.08, y + (Math.random() - 0.5) * 0.06, z + (Math.random() - 0.5) * 0.08);
          dummy.scale.setScalar(Math.max(0.001, fade * (0.85 + Math.random() * 0.3)));
          dummy.updateMatrix();
          lipids.setMatrixAt(n, dummy.matrix);
          tmp.copy(cA).lerp(cB, clamp01((x + OUTER) / (2 * OUTER)) * 0.8 + Math.random() * 0.2);
          lipids.setColorAt(n, tmp);
          n++;
        }
      }
      lipids.instanceMatrix.needsUpdate = true;
      rec.add(lipids);
    }

    /* ---------- Ligand: a small catecholamine-like agonist (ball & stick) ---------- */
    const POCKET = new V3(0, 1.0, 0);
    const ligand = new THREE.Group();
    rec.add(ligand);
    const ligandMats = [];
    {
      const mk = (hex, glow) => {
        const m = new THREE.MeshPhysicalMaterial({
          color: hex, roughness: 0.2, clearcoat: 1, emissive: hex, emissiveIntensity: glow, transparent: true, opacity: 1,
        });
        ligandMats.push(m);
        return m;
      };
      const mats = { C: mk('#ffd08a', 0.55), O: mk('#ff6f91', 0.5), N: mk('#7fb2ff', 0.55), bond: mk('#fff1d6', 0.35) };
      const atoms = [];
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        atoms.push(['C', Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0]);
      }
      atoms.push(['O', -0.36, 0.62, 0]);   // 6  ring OH
      atoms.push(['O', -0.72, 0, 0]);      // 7  ring OH
      atoms.push(['C', 0.72, 0, 0]);       // 8  β-carbon
      atoms.push(['O', 0.82, -0.38, 0.05]); // 9  β-OH
      atoms.push(['C', 0.92, 0.35, 0]);    // 10 α-carbon
      atoms.push(['N', 1.32, 0.35, 0.06]); // 11 amine
      const bonds = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [2, 6], [3, 7], [0, 8], [8, 9], [8, 10], [10, 11]];
      const sphere = new THREE.SphereGeometry(1, 20, 14);
      const cyl = new THREE.CylinderGeometry(0.04, 0.04, 1, 10);
      const pos = atoms.map(([, x, y, z]) => new V3(x - 0.25, y, z));
      atoms.forEach(([el], k) => {
        const m = new THREE.Mesh(sphere, mats[el]);
        m.position.copy(pos[k]);
        m.scale.setScalar(el === 'C' ? 0.12 : 0.13);
        ligand.add(m);
      });
      const UP = new V3(0, 1, 0);
      bonds.forEach(([p, q]) => {
        const a = pos[p], b = pos[q];
        const m = new THREE.Mesh(cyl, mats.bond);
        m.position.copy(a).add(b).multiplyScalar(0.5);
        m.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize());
        m.scale.set(1, a.distanceTo(b), 1);
        ligand.add(m);
      });
      ligand.scale.setScalar(1.15);
    }
    const setLigandOpacity = (o) => { for (const m of ligandMats) m.opacity = o; ligand.visible = o > 0.01; };

    const approachPath = new THREE.CatmullRomCurve3([new V3(3.8, 4.6, 2.6), new V3(2.4, 3.3, 1.9), new V3(1.0, 2.1, 0.8), POCKET.clone()]);
    const releasePath = new THREE.CatmullRomCurve3([POCKET.clone(), new V3(-0.9, 2.4, 0.9), new V3(-2.6, 3.9, 2.0), new V3(-4.2, 5.2, 3.0)]);

    /* ---------- Glows, signal rings, particles ---------- */
    const haloBase = col('#5a4dff'), haloActive = col('#ff6fae');
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: haloBase.clone(), transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.scale.set(10, 10, 1);
    halo.position.set(0, 0.2, -1.5);
    root.add(halo);

    const pocketGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: GLOW, color: col('#ffb35c'), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    pocketGlow.scale.set(2.2, 2.2, 1);
    pocketGlow.position.copy(POCKET);
    rec.add(pocketGlow);

    const rings = [];
    for (let k = 0; k < 3; k++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.025, 8, 96),
        new THREE.MeshBasicMaterial({ color: col('#ff8fc0'), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -H / 2 - 0.7;
      rec.add(ring);
      rings.push(ring);
    }

    const particles = (() => {
      const count = 260;
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 24;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      const p = new THREE.Points(g, new THREE.PointsMaterial({ map: GLOW, size: 0.12, color: col('#c9d4ff'), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
      scene.add(p);
      return p;
    })();

    /* ---------- Timeline ---------- */
    const PERIOD = 11;
    const T_APPROACH = 3.2, T_BOUND = 7.4, T_RELEASE = 9.6;
    const phaseAt = (t) => (t < T_APPROACH ? 'approach' : t < T_BOUND ? 'bound' : t < T_RELEASE ? 'release' : 'rest');
    const CIRC = 2 * Math.PI * 16;
    let bindS = 0;
    let currentPhase = '';
    let lastUi = -1;

    function updateScene(t, dt) {
      const phase = phaseAt(t);
      let opacity = 0, bindTarget = 0;

      if (phase === 'approach') {
        const p = easeInOut(t / T_APPROACH);
        approachPath.getPoint(p, ligand.position);
        ligand.rotation.set(0.4 + (1 - p) * 3.2, 0.7 + (1 - p) * 2.4, (1 - p) * 1.4);
        opacity = Math.min(1, t / 0.7);
      } else if (phase === 'bound') {
        const k = t - T_APPROACH;
        ligand.position.copy(POCKET);
        ligand.position.y += Math.sin(k * 5) * 0.025;
        ligand.position.x += Math.sin(k * 3.3) * 0.02;
        ligand.rotation.set(0.4 + Math.sin(k * 2) * 0.05, 0.7 + Math.sin(k * 1.4) * 0.06, 0);
        opacity = 1;
        bindTarget = 1;
      } else if (phase === 'release') {
        const p = easeInOut((t - T_BOUND) / (T_RELEASE - T_BOUND));
        releasePath.getPoint(p, ligand.position);
        ligand.rotation.set(0.4 + p * 2.6, 0.7 - p * 2.0, p * 1.2);
        opacity = 1 - p;
      }
      setLigandOpacity(opacity);

      const rate = bindTarget > bindS ? 2.6 : 1.6;
      bindS += (bindTarget - bindS) * Math.min(1, dt * rate);

      setActivation(0.16 * bindS);
      helices.forEach((h, i) => {
        const boost = i === 5 ? 1.4 : 1;
        h.coilMat.emissiveIntensity = 0.14 + 0.4 * bindS * boost;
        h.rimMat.uniforms.uStrength.value = 1.1 + 0.9 * bindS * boost;
      });
      pocketGlow.material.opacity = 0.85 * bindS;
      pocketGlow.scale.setScalar(2 + Math.sin(t * 6) * 0.15 * bindS);
      halo.material.color.copy(haloBase).lerp(haloActive, bindS * 0.55);

      rings.forEach((ring, k) => {
        let o = 0, s = 0.7;
        if (bindS > 0.05) {
          const local = t - T_APPROACH - 0.4 - k * 0.85;
          if (local > 0) {
            const f = (local % 2.55) / 2.55;
            s = 0.7 + f * 2.4;
            o = (1 - f) * (1 - f) * 0.75 * bindS;
          }
        }
        ring.scale.setScalar(s);
        ring.material.opacity = o;
      });

      if (phase !== currentPhase) {
        currentPhase = phase;
        const [title, sub] = PHASES[phase];
        if (ui.title) ui.title.textContent = title;
        if (ui.phase) ui.phase.textContent = sub;
        if (callout) callout.dataset.phase = phase;
      }
      const tenth = Math.floor(t * 10);
      if (tenth !== lastUi) {
        lastUi = tenth;
        const rem = Math.max(0, Math.ceil(PERIOD - t));
        if (ui.time) ui.time.textContent = `-0:${String(rem).padStart(2, '0')}`;
        if (ui.ring) ui.ring.style.strokeDashoffset = String(CIRC * (1 - t / PERIOD));
      }
    }

    /* ---------- Framing ---------- */
    function resize() {
      const w = mount.clientWidth || 1, h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      const dist = aspect < 1 ? (14.5 / Math.max(aspect, 0.55)) * 0.8 : 17.5;
      camera.position.set(0, dist * 0.3, dist);
      // On wide screens nudge the receptor left so the chart and links on the right have clear space.
      root.position.x = aspect > 1.3 ? -0.75 : 0;
      camera.lookAt(lookTarget);
      camera.updateProjectionMatrix();
      if (!running) renderer.render(scene, camera);
    }

    /* ---------- Loop control ---------- */
    let t = reduceMotion ? 4.8 : 0;
    let last = 0;
    let playing = !reduceMotion;
    let running = false;
    let visible = true;
    const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

    const shouldRun = () => playing && visible && !document.hidden;

    function frame(now) {
      if (!shouldRun()) { running = false; return; }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      t = (t + dt) % PERIOD;

      rec.rotation.y += dt * 0.16;
      pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 3);
      pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 3);
      root.rotation.y = pointer.sx * 0.28;
      root.rotation.x = pointer.sy * 0.1;
      particles.rotation.y += dt * 0.01;
      particles.position.y = Math.sin(now / 4000) * 0.2;

      updateScene(t, dt);
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }

    function kick() {
      if (running || !shouldRun()) return;
      running = true;
      last = 0;
      requestAnimationFrame(frame);
    }

    function setPlaying(v) {
      playing = v;
      if (ui.btn) {
        ui.btn.dataset.state = v ? 'playing' : 'paused';
        ui.btn.setAttribute('aria-label', v ? 'Pause animation' : 'Play animation');
      }
      if (v) kick();
    }

    if (ui.btn) ui.btn.addEventListener('click', () => setPlaying(!playing));

    if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
      window.addEventListener('pointermove', (e) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; kick(); }).observe(mount);
    }
    document.addEventListener('visibilitychange', kick);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(mount);
    else window.addEventListener('resize', resize);

    resize();
    updateScene(t, 1);       // settle state (fully bound when motion is reduced)
    renderer.render(scene, camera);
    setPlaying(playing);
  }
})();
