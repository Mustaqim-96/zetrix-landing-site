/* ============================================================
   Hero globe — dark-grey earth, grey dotted continents with
   coastline outlines, and red node spikes. Drag to rotate.
   Modelled on ds.zetrix.com, adapted to the Zetrix palette.
   Classic (non-module) script so it also works over file://.
   Requires: vendor/three.min.js, vendor/OrbitControls.js,
   js/globe-data.js (pre-baked point data — no runtime images).
   ============================================================ */
(function () {
  var container = document.getElementById("hero-globe");
  if (!container || typeof THREE === "undefined" || !window.__GLOBE_DATA__) return;

  var DEG = Math.PI / 180;
  var R = 100;
  var SEP = 30000; // coastline polyline separator
  var explosion = window.ZetrixGlobeExplosion || null;
  var networkRecipe = window.ZetrixGlobeNetwork || null;
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var networkReady = !!(
    explosion &&
    typeof explosion.seed === "function" &&
    typeof explosion.networkTarget === "function" &&
    typeof explosion.stateAt === "function" &&
    typeof explosion.validState === "function" &&
    typeof explosion.validTarget === "function" &&
    typeof explosion.mobileScale === "function"
  );

  function bytes(b64) {
    var bin = atob(b64), n = bin.length, u = new Uint8Array(n);
    for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    return u;
  }
  var D = window.__GLOBE_DATA__;
  var contLL = new Int16Array(bytes(D.contLatLng).buffer);
  var contMix = bytes(D.contMix);
  var coastLL = new Int16Array(bytes(D.coastLL).buffer);

  /* Zetrix node locations (validator hubs — Asia-centric, like ds.zetrix) */
  var NODES = [
    [3.14, 101.69],   // Kuala Lumpur
    [1.55, 110.34],   // Kuching (Rajang)
    [1.32, 103.70],   // Singapore (Jurong)
    [26.65, 106.63],  // Guiyang
    [39.90, 116.40],  // Beijing
    [31.23, 121.47],  // Shanghai
    [22.32, 114.17],  // Hong Kong
    [22.54, 114.06],  // Shenzhen
    [35.70, 139.80],  // Tokyo (Sumida)
    [37.57, 126.98],  // Seoul
    [-6.20, 106.85],  // Jakarta
    [13.75, 100.50],  // Bangkok
    [10.82, 106.63],  // Ho Chi Minh City
    [14.60, 120.98],  // Manila
    [19.08, 72.88],   // Mumbai
    [25.20, 55.27],   // Dubai
    [51.50, -0.13],   // London
    [40.71, -74.00],  // New York
    [-23.55, -46.63], // Sao Paulo
    [-33.87, 151.21]  // Sydney
  ];

  function toVec(lat, lng, rad) {
    var phi = (90 - lat) * DEG, theta = (lng + 180) * DEG;
    return new THREE.Vector3(
      -rad * Math.sin(phi) * Math.cos(theta),
       rad * Math.cos(phi),
       rad * Math.sin(phi) * Math.sin(theta)
    );
  }
  function dotTexture() {
    var s = 64, c = document.createElement("canvas");
    c.width = c.height = s;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.5, "rgba(255,255,255,0.8)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    var t = new THREE.CanvasTexture(c); t.anisotropy = 2; return t;
  }

  function buildNetworkAttributes(positionAttribute, pairSegments) {
    var count = positionAttribute.count;
    var targets = new Float32Array(count * 3);
    var layers = new Float32Array(count);
    var weights = new Float32Array(count);
    var delays = new Float32Array(count);
    var stride = pairSegments ? 2 : 1;
    var output = {};
    for (var i = 0; i < count; i += stride) {
      explosion.networkTarget(
        i,
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i),
        output
      );
      if (!explosion.validTarget(output)) throw new Error("Invalid globe particle target");
      var end = Math.min(count, i + stride);
      for (var j = i; j < end; j++) {
        targets[j * 3] = output.x;
        targets[j * 3 + 1] = output.y;
        targets[j * 3 + 2] = output.z;
        layers[j] = output.layer;
        weights[j] = output.weight;
        delays[j] = output.delay;
      }
    }
    return { targets: targets, layers: layers, weights: weights, delays: delays };
  }

  function safeBuildNetworkAttributes(positionAttribute, pairSegments) {
    if (!networkReady) return null;
    try {
      return buildNetworkAttributes(positionAttribute, pairSegments);
    } catch (error) {
      networkReady = false;
      return null;
    }
  }

  /* ---- scene / camera / renderer ---- */
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 1, 5000);
  camera.position.set(0, 0, 445);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  /* ---- drag controls (rotate only) ---- */
  var controls = null;
  if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.45;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.maxPolarAngle = Math.PI * 0.72;
    // OrbitControls sets touch-action:none on the canvas, which traps vertical
    // page scroll on touch devices — a finger drag on the globe rotates instead
    // of scrolling the page. Re-allow vertical panning: vertical swipes scroll
    // the page, horizontal drags still rotate the globe.
    renderer.domElement.style.touchAction = 'pan-y';
  }

  var globe = new THREE.Group();
  globe.rotation.z = -0.14;
  globe.rotation.y = 2.6;   // face the Asia node cluster initially
  scene.add(globe);

  /* dark grey base sphere (occludes back-side geometry) */
  var baseMaterial = new THREE.MeshBasicMaterial({ color: 0x18181b, transparent: true });
  var baseSphere = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.99, 64, 64),
    baseMaterial
  );
  globe.add(baseSphere);

  /* subtle cool rim (atmosphere) — hidden; the globe uses a CSS backlight glow */
  var atmosphereMaterial = new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide,
      uniforms: {
        uColor: { value: new THREE.Color(0x3b465e) },
        uOpacity: { value: 1 }
      },
      vertexShader:
        "varying vec3 vNormal;void main(){vNormal=normalize(normalMatrix*normal);" +
        "gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
      fragmentShader:
        "varying vec3 vNormal;uniform vec3 uColor;uniform float uOpacity;void main(){" +
        "float d=0.60-dot(vNormal,vec3(0.0,0.0,1.0));" +
        "float i=pow(max(0.0,d),2.0)*0.58;" +
        "gl_FragColor=vec4(uColor,i*uOpacity);}"
    });
  var atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.09, 64, 64),
    atmosphereMaterial
  );
  globe.add(atmosphere);

  var sprite = dotTexture();

  /* continent dots (cool grey) */
  var cPos = [], cCol = [];
  var gA = new THREE.Color(0x767b86), gB = new THREE.Color(0xc4c9d3), tmp = new THREE.Color();
  for (var i = 0; i < contMix.length; i++) {
    var p = toVec(contLL[i * 2] / 100, contLL[i * 2 + 1] / 100, R);
    cPos.push(p.x, p.y, p.z);
    tmp.copy(gA).lerp(gB, contMix[i] / 120);
    cCol.push(tmp.r, tmp.g, tmp.b);
  }
  var cGeo = new THREE.BufferGeometry();
  cGeo.setAttribute("position", new THREE.Float32BufferAttribute(cPos, 3));
  cGeo.setAttribute("color", new THREE.Float32BufferAttribute(cCol, 3));
  var pointFallback = new THREE.PointsMaterial({
    size: 1.6, map: sprite, vertexColors: true, transparent: true,
    alphaTest: 0.25, sizeAttenuation: true, depthWrite: false
  });
  var pointUniforms = null;
  var pointBurstMaterial = null;
  var pointNetwork = safeBuildNetworkAttributes(cGeo.attributes.position, false);
  if (pointNetwork) {
    cGeo.setAttribute("aNetworkTarget", new THREE.BufferAttribute(pointNetwork.targets, 3));
    cGeo.setAttribute("aNetworkLayer", new THREE.BufferAttribute(pointNetwork.layers, 1));
    cGeo.setAttribute("aNetworkWeight", new THREE.BufferAttribute(pointNetwork.weights, 1));
    cGeo.setAttribute("aNetworkDelay", new THREE.BufferAttribute(pointNetwork.delays, 1));
    pointUniforms = {
      uBurst: { value: 0 },
      uAssembly: { value: 0 },
      uParticleOpacity: { value: 0 },
      uCoreEnergy: { value: 0 },
      uLightTheme: { value: 0 },
      uMobileScale: { value: 1 },
      uSize: { value: 1.6 },
      uPointScale: { value: 300 },
      uSprite: { value: sprite }
    };
    pointBurstMaterial = new THREE.ShaderMaterial({
      uniforms: pointUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader:
        "attribute vec3 color;attribute vec3 aNetworkTarget;attribute float aNetworkLayer;attribute float aNetworkWeight;attribute float aNetworkDelay;" +
        "uniform float uBurst;uniform float uAssembly;uniform float uLightTheme;uniform float uMobileScale;uniform float uSize;uniform float uPointScale;" +
        "varying vec3 vColor;varying float vLayer;varying float vWeight;varying float vCloud;" +
        "void main(){float burstLocal=clamp((uBurst-aNetworkDelay)/(1.0-aNetworkDelay),0.0,1.0);" +
        "float returnDelay=0.22-aNetworkDelay;" +
        "float assemblyLocal=clamp((uAssembly-returnDelay)/(1.0-returnDelay),0.0,1.0);" +
        "vec3 origin=normalize(aNetworkTarget)*(3.0+3.0*aNetworkWeight);" +
        "vec3 responsiveTarget=mix(position,aNetworkTarget,uMobileScale);" +
        "vec3 burstPosition=mix(origin,responsiveTarget,burstLocal);" +
        "vec3 moved=mix(burstPosition,position,assemblyLocal);" +
        "vec4 mv=modelViewMatrix*vec4(moved,1.0);gl_Position=projectionMatrix*mv;" +
        "vCloud=burstLocal*(1.0-assemblyLocal);" +
        "gl_PointSize=uSize*(uPointScale/-mv.z)*(1.0+vCloud*((1.0-aNetworkLayer)*0.28+uLightTheme*1.25));" +
        "vColor=color;vLayer=aNetworkLayer;vWeight=aNetworkWeight;}",
      fragmentShader:
        "uniform sampler2D uSprite;uniform float uParticleOpacity;uniform float uCoreEnergy;uniform float uLightTheme;uniform float uMobileScale;" +
        "varying vec3 vColor;varying float vLayer;varying float vWeight;varying float vCloud;" +
        "void main(){vec4 dot=texture2D(uSprite,gl_PointCoord);" +
        "if(dot.a<0.25)discard;float fieldFade=mix(1.0,mix(0.5,1.0,vWeight),vCloud*vLayer);" +
        "float energy=1.0+uCoreEnergy*(1.0-vLayer)*0.6;" +
        "float mobileField=mix(0.72,1.0,uMobileScale);" +
        /* Don't dim the dot field on phones in light theme, so the globe reads
           the same colour on mobile/tablet as it does on the web. */
        "mobileField=mix(mobileField,1.0,uLightTheme);" +
        "vec3 particleColor=vColor;" + /* keep exploding particles the grey dot colour (no red) */
        "float lightEnergy=1.0;" +
        "gl_FragColor=vec4(particleColor*energy*lightEnergy,dot.a*uParticleOpacity*fieldFade*mix(1.0,mobileField,vLayer*vCloud)*(1.0+uLightTheme*vCloud*1.4));}"
    });
  }
  var continentPoints = new THREE.Points(cGeo, pointFallback);
  globe.add(continentPoints);

  /* coastline outlines (grey line segments) */
  var linePos = [];
  var run = [];
  function flushRun() {
    for (var k = 0; k < run.length - 1; k++) {
      linePos.push(run[k].x, run[k].y, run[k].z, run[k + 1].x, run[k + 1].y, run[k + 1].z);
    }
    run = [];
  }
  for (var j = 0; j < coastLL.length; j += 2) {
    var la = coastLL[j], lo = coastLL[j + 1];
    if (la === SEP) { flushRun(); continue; }
    run.push(toVec(la / 100, lo / 100, R * 1.004));
  }
  flushRun();
  var lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
  var lineFallback = new THREE.LineBasicMaterial({
    color: 0x767c88, transparent: true, opacity: 0.65
  });
  var coastlineLines = new THREE.LineSegments(lGeo, lineFallback);
  globe.add(coastlineLines);

  /* red node spikes — thin gradient needles + bright tip dot (ds.zetrix style) */
  var spikeGroup = new THREE.Group();
  globe.add(spikeGroup);

  // shared thin needle geometry (unit height, gradient dim->bright along axis)
  var spikeGeo = new THREE.CylinderGeometry(0.16, 0.34, 1, 8, 1, true);
  var spikeColorAttr;
  (function () {
    var pos = spikeGeo.attributes.position, colDark = [], colLight = [];
    // dark theme: vivid red base -> near-black tip (tip vanishes on the dark bg = red glow)
    var dBase = new THREE.Color(0xff5865), dTip = new THREE.Color(0x180305);
    // light theme: same vivid red base -> white tip (fades into the white bg, mirroring dark)
    var lBase = new THREE.Color(0xff5865), lTip = new THREE.Color(0xffffff);
    var cc = new THREE.Color();
    for (var i = 0; i < pos.count; i++) {
      var f = pos.getY(i) + 0.5;               // -0.5(base, on globe)..0.5(tip) -> 0..1
      cc.copy(dBase).lerp(dTip, f); colDark.push(cc.r, cc.g, cc.b);
      cc.copy(lBase).lerp(lTip, f); colLight.push(cc.r, cc.g, cc.b);
    }
    spikeGeo.userData.colDark = new Float32Array(colDark);
    spikeGeo.userData.colLight = new Float32Array(colLight);
    spikeColorAttr = new THREE.Float32BufferAttribute(spikeGeo.userData.colDark.slice(), 3);
    spikeGeo.setAttribute("color", spikeColorAttr);
  })();
  var spikeMat = new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false
  });

  var tipPos = [];
  var nodeRecords = [];
  var UP = new THREE.Vector3(0, 1, 0);
  for (var s2 = 0; s2 < NODES.length; s2++) {
    var lat = NODES[s2][0], lng = NODES[s2][1];
    var len = 13 + ((s2 * 37) % 7);
    var dir = toVec(lat, lng, 1).normalize();
    var anchor = dir.clone().multiplyScalar(R);
    var cyl = new THREE.Mesh(spikeGeo, spikeMat);
    cyl.scale.set(1, len, 1);
    cyl.quaternion.setFromUnitVectors(UP, dir);
    cyl.position.copy(anchor).addScaledVector(dir, len / 2);
    spikeGroup.add(cyl);
    nodeRecords.push({
      mesh: cyl,
      normal: dir,
      anchor: anchor,
      finalLength: len
    });
    var base = dir.clone().multiplyScalar(R + 1);   // dot sits on the globe surface
    tipPos.push(base.x, base.y, base.z);
  }
  var tGeo = new THREE.BufferGeometry();
  tGeo.setAttribute("position", new THREE.Float32BufferAttribute(tipPos, 3));
  var tipMat = new THREE.PointsMaterial({
    size: 4.5, map: sprite, color: 0xff8a92, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  });
  var tips = new THREE.Points(tGeo, tipMat);
  spikeGroup.add(tips);

  /* Compatibility sentinel: network helper stays loaded, but no rig is rendered. */
  var networkRig = new THREE.Group();
  networkRig.visible = false;

  var appliedLightTheme = null;
  function applyThemeMaterials() {
    var lightTheme = document.documentElement.getAttribute("data-theme") === "light";
    if (lightTheme === appliedLightTheme) return;
    appliedLightTheme = lightTheme;
    baseMaterial.color.setHex(lightTheme ? 0xf1f3f5 : 0x18181b);
    atmosphereMaterial.uniforms.uColor.value.setHex(lightTheme ? 0xcbd3df : 0x3b465e);
    atmosphere.visible = false; // glow is handled by the CSS backlight behind the globe
    lineFallback.color.setHex(lightTheme ? 0x52525b : 0x767c88);
    if (pointUniforms) pointUniforms.uLightTheme.value = lightTheme ? 1 : 0;
    // node spikes stay red in both themes — swap the baked gradient + tip dot per theme.
    // additive blending only reads as vivid on the dark bg; on white it washes out, so
    // light mode uses normal blending and fades the red into white instead of black.
    spikeColorAttr.array.set(lightTheme ? spikeGeo.userData.colLight : spikeGeo.userData.colDark);
    spikeColorAttr.needsUpdate = true;
    spikeMat.blending = lightTheme ? THREE.NormalBlending : THREE.AdditiveBlending;
    spikeMat.needsUpdate = true;
    tipMat.color.setHex(lightTheme ? 0xc5242e : 0xff8a92);
    tipMat.blending = lightTheme ? THREE.NormalBlending : THREE.AdditiveBlending;
    tipMat.needsUpdate = true;
  }

  /* ---- resize + render ---- */
  function resize() {
    var w = container.clientWidth || container.offsetWidth;
    var h = container.clientHeight || container.offsetHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    if (pointUniforms) pointUniforms.uPointScale.value = h * renderer.getPixelRatio() * 0.5;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(container);

  var t0 = (window.performance && performance.now) ? performance.now() : 0;
  var entranceHasRun = false;
  var entranceActive = false;
  var entranceStartedAt = 0;
  var entranceState = {};
  var introWaitTimer = 0;
  var entrancePhase = "";
  var originalShaderError = renderer.debug && renderer.debug.onShaderError;

  if (renderer.debug && typeof renderer.debug.onShaderError === "function") {
    renderer.debug.onShaderError = function () {
      if (originalShaderError) originalShaderError.apply(renderer.debug, arguments);
      if (!entranceActive) return;
      entranceHasRun = true;
      settleEntrance();
    };
  }

  function clearIntroWait() {
    if (!introWaitTimer) return;
    window.clearTimeout(introWaitTimer);
    introWaitTimer = 0;
  }

  var appliedNodeGrowth = -1;
  function applyNodeGrowth(progress) {
    if (progress === appliedNodeGrowth) return;
    appliedNodeGrowth = progress;
    for (var index = 0; index < nodeRecords.length; index++) {
      var record = nodeRecords[index];
      var currentLength = record.finalLength * progress;
      record.mesh.scale.set(1, currentLength, 1);
      record.mesh.position.copy(record.anchor)
        .addScaledVector(record.normal, currentLength / 2);
    }
  }

  function settleEntrance() {
    clearIntroWait();
    entranceActive = false;
    continentPoints.material = pointFallback;
    coastlineLines.material = lineFallback;
    globe.scale.setScalar(1);
    baseMaterial.opacity = 1;
    baseMaterial.depthWrite = true;
    atmosphereMaterial.uniforms.uOpacity.value = 1;
    atmosphereMaterial.depthWrite = true;
    spikeGroup.scale.setScalar(1);
    applyNodeGrowth(1);
    spikeMat.opacity = 1;
    tipMat.opacity = 1;
    pointFallback.opacity = 1;
    lineFallback.opacity = 0.65;
    lineFallback.depthWrite = true;
    if (pointUniforms) {
      pointUniforms.uBurst.value = 1;
      pointUniforms.uAssembly.value = 1;
      pointUniforms.uParticleOpacity.value = 1;
      pointUniforms.uCoreEnergy.value = 0;
    }
    networkRig.visible = false;
    if (entrancePhase !== "settled") {
      entrancePhase = "settled";
      container.dataset.globeEntrancePhase = entrancePhase;
    }
    if (controls) {
      controls.enabled = true;
      controls.autoRotate = !reduce;
    }
  }

  function applyEntranceState(state) {
    pointUniforms.uBurst.value = state.burst;
    pointUniforms.uAssembly.value = state.assembly;
    pointUniforms.uParticleOpacity.value = state.particleOpacity;
    pointUniforms.uCoreEnergy.value = state.coreEnergy;
    // In light theme use the full (desktop) dot arrangement on every viewport.
    // The tighter mobile arrangement left more of the near-white base sphere
    // showing, so the globe's ocean read white on phones instead of the same
    // grey as the web. Dark theme keeps its per-width arrangement.
    var responsiveScale =
      document.documentElement.getAttribute("data-theme") === "light"
        ? 1
        : explosion.mobileScale(window.innerWidth || container.clientWidth || 1024);
    if (!Number.isFinite(responsiveScale) || responsiveScale < 0 || responsiveScale > 1) {
      throw new Error("Invalid globe mobile scale");
    }
    pointUniforms.uMobileScale.value = responsiveScale;
    baseMaterial.opacity = state.baseOpacity;
    baseMaterial.depthWrite = state.baseOpacity > 0;
    atmosphereMaterial.uniforms.uOpacity.value = state.baseOpacity;
    atmosphereMaterial.depthWrite = state.baseOpacity > 0;
    lineFallback.opacity = state.lineOpacity * 0.65;
    lineFallback.depthWrite = state.lineOpacity > 0;
    spikeMat.opacity = state.nodeOpacity;
    tipMat.opacity = state.nodeOpacity;
    applyNodeGrowth(state.nodeGrowth);
    networkRig.visible = false;
    if (entrancePhase !== state.phase) {
      entrancePhase = state.phase;
      container.dataset.globeEntrancePhase = entrancePhase;
    }
  }

  function burstShadersReady() {
    try {
      renderer.compile(scene, camera);
      var programs = renderer.info.programs || [];
      for (var i = 0; i < programs.length; i++) {
        var diagnostics = programs[i].diagnostics;
        if (diagnostics && diagnostics.runnable === false) return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  function startEntrance() {
    if (entranceHasRun) return;
    entranceHasRun = true;
    clearIntroWait();
    if (document.hidden) {
      settleEntrance();
      return;
    }
    entranceActive = true;
    entranceStartedAt = (window.performance && performance.now) ? performance.now() : t0;
  }

  function primeEntrance() {
    if (document.hidden || reduce || !networkReady || !explosion || !pointUniforms) {
      entranceHasRun = true;
      settleEntrance();
      return false;
    }
    try {
      continentPoints.material = pointBurstMaterial;
      if (explosion.stateAt(0, entranceState) !== entranceState ||
          !explosion.validState(entranceState)) {
        throw new Error("Invalid globe entrance state");
      }
      applyEntranceState(entranceState);
      if (!burstShadersReady()) throw new Error("Globe entrance shader failed");
    } catch (error) {
      entranceHasRun = true;
      settleEntrance();
      return false;
    }
    if (controls) {
      controls.enabled = false;
      controls.autoRotate = false;
    }
    return true;
  }

  function abandonEntrance() {
    if (!entranceActive && entranceHasRun) return;
    entranceHasRun = true;
    settleEntrance();
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) abandonEntrance();
  });

  if (primeEntrance()) {
    if (document.documentElement.dataset.heroRevealComplete === "true") {
      requestAnimationFrame(startEntrance);
    } else {
      window.addEventListener("zetrix:hero-reveal-complete", startEntrance, { once: true });
    }
    introWaitTimer = window.setTimeout(function () {
      if (entranceHasRun) return;
      entranceHasRun = true;
      settleEntrance();
    }, 6000);
  }

  // Pause the WebGL render loop when the globe scrolls out of view. A globe
  // that keeps rendering at 60fps behind the rest of the page is a major
  // scroll-jank source on every device; only render while it's on screen
  // (or mid-entrance). A small rootMargin resumes it just before it reappears.
  var globeOnScreen = true;
  if (typeof IntersectionObserver === "function") {
    var visObserver = new IntersectionObserver(function (entries) {
      globeOnScreen = entries[entries.length - 1].isIntersecting;
    }, { rootMargin: "150px" });
    visObserver.observe(container);
  }

  (function animate() {
    requestAnimationFrame(animate);
    // Keep theme materials (e.g. the light-mode ocean colour) in sync every
    // frame — cheap and guarded — even while the render is paused off-screen,
    // so the globe never gets stuck on the wrong theme colour.
    applyThemeMaterials();
    if (!globeOnScreen && !entranceActive) return; // off-screen: skip render work
    var now = (window.performance && performance.now) ? performance.now() : t0;
    if (entranceActive) {
      try {
        if (explosion.stateAt(now - entranceStartedAt, entranceState) !== entranceState ||
            !explosion.validState(entranceState)) {
          throw new Error("Invalid globe entrance state");
        }
        if (entranceState.settled) settleEntrance();
        else applyEntranceState(entranceState);
      } catch (error) {
        entranceHasRun = true;
        settleEntrance();
      }
    } else {
      tipMat.size = 4.2 + Math.sin(now * 0.004) * 1.2;   // gentle pulse
    }
    if (controls) controls.update();
    renderer.render(scene, camera);
  })();
})();
