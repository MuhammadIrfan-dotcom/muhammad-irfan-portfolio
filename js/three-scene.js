(function () {
  if (typeof THREE === "undefined") return;
  var canvas = document.getElementById("scene");
  if (!canvas) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x05070c, 1);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  function makeStars(count, spread, size, opacity) {
    var pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: size,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        sizeAttenuation: true
      })
    );
  }

  var starsFar = makeStars(1000, 38, 0.034, 0.5);
  var starsNear = makeStars(520, 22, 0.05, 0.88);
  scene.add(starsFar);
  scene.add(starsNear);

  var meshes = [];
  function addShape(geometry, color, x, y, z, scale) {
    var mat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.35,
      roughness: 0.35,
      transparent: true,
      opacity: 0.55,
      emissive: color,
      emissiveIntensity: 0.18
    });
    var mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(scale);
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.01,
      ry: (Math.random() - 0.5) * 0.012,
      floatAmp: 0.15 + Math.random() * 0.2,
      floatSpeed: 0.4 + Math.random() * 0.5,
      baseY: y
    };
    scene.add(mesh);
    meshes.push(mesh);
  }

  addShape(new THREE.IcosahedronGeometry(1, 0), 0x3b82f6, -4.2, 1.4, -2, 0.55);
  addShape(new THREE.OctahedronGeometry(1, 0), 0x7dd3fc, 4.4, -0.8, -1.5, 0.45);
  addShape(new THREE.TetrahedronGeometry(1, 0), 0x60a5fa, 3.2, 2.2, -3, 0.4);
  addShape(new THREE.TorusGeometry(0.7, 0.22, 12, 32), 0x2563eb, -3.5, -1.6, -2.5, 0.5);
  addShape(new THREE.DodecahedronGeometry(1, 0), 0x93c5fd, 0.8, -2.4, -3.2, 0.35);

  var ambient = new THREE.AmbientLight(0x7aa2ff, 0.55);
  var point = new THREE.PointLight(0x60a5fa, 1.2, 40);
  point.position.set(4, 5, 6);
  var point2 = new THREE.PointLight(0x7dd3fc, 0.7, 30);
  point2.position.set(-5, -2, 4);
  scene.add(ambient);
  scene.add(point);
  scene.add(point2);

  var mouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  }
  resize();
  window.addEventListener("resize", resize);

  var t0 = performance.now();
  function tick(now) {
    var t = (now - t0) / 1000;
    starsFar.rotation.y += 0.00022;
    starsFar.rotation.x += 0.00007;
    starsNear.rotation.y += 0.0004;
    starsNear.rotation.x += 0.0001;

    meshes.forEach(function (m) {
      m.rotation.x += m.userData.rx;
      m.rotation.y += m.userData.ry;
      m.position.y = m.userData.baseY + Math.sin(t * m.userData.floatSpeed) * m.userData.floatAmp;
    });

    camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
