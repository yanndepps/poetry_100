import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import t from "../../assets/day.png";
import * as dat from "dat.gui";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.fragment = options.fragment;
    this.vertex = options.vertex;
    this.container = options.dom;
    this.width = container.offsetWidth;
    this.height = container.offsetHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.rendering = true;

    this.container.appendChild(this.renderer.domElement);
    // ortho cam
    const frustumSize = 1;
    // const aspect = 1;
    this.camera = new THREE.OrthographicCamera(
      frustumSize / -2,
      frustumSize / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    );
    // persp cam
    // this.camera = new THREE.PerspectiveCamera(
    //   70,
    //   window.innerWidth / window.innerHeight,
    //   0.001,
    //   1000
    // );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    this.paused = false;
    //
    this.setupResize();
    this.addObjects();
    this.resize();
    this.render();
    this.settings();
  }

  settings() {
    this.settings = {
      progress: 0,
    };
    // this.gui = new dat.GUI();
    // this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;

    const dist = this.camera.position.z;
    const height = 2;
    let koef = 1;

    this.testMesh.scale.set(this.camera.aspect, 1, 1);
    this.camera.fov =
      2 * (180 / Math.PI) * Math.atan(height / (2 * dist * koef));
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let tt = new THREE.TextureLoader().load(t);
    tt.magFilter = THREE.NearestFilter;
    tt.minFilter = THREE.NearestFilter;

    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        progress: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        texture1: { type: "t", value: tt },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: this.vertex,
      fragmentShader: this.fragment,
      depthTest: false,
      depthWrite: false,
    });

    this.geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
    this.testMesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.testMesh);
  }

  render() {
    if (this.paused) return;
    this.material.uniforms.progress.value = this.settings.progress;
    // this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}
