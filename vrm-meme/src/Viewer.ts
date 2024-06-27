import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class Viewer {

    private _canvas: HTMLCanvasElement;
    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene;
    private _camera: THREE.PerspectiveCamera;
    private _controls: OrbitControls;
    private _light: THREE.DirectionalLight;

    constructor(parentElement: HTMLElement) {
        //レンダラーの設定
        this._renderer = new THREE.WebGLRenderer();
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(parentElement.clientWidth, parentElement.clientHeight);
        this._renderer.setClearColor(0x202020, 1.0);
        parentElement.appendChild(this._renderer.domElement);
        this._canvas = this._renderer.domElement;

        this._scene = new THREE.Scene()

        // カメラ
        this._camera = new THREE.PerspectiveCamera(
            45, this._canvas.clientWidth / this._canvas.clientHeight, 0.1, 1000)
        this._camera.position.set(0, 1.3, -3)
        this._camera.rotation.set(0, Math.PI, 0)

        // カメラコントローラー
        this._controls = new OrbitControls(this._camera, this._canvas);
        this._controls.target.y = 1.0;
        this._controls.update();

        // ライト
        const light = new THREE.DirectionalLight(0xfee6c1, 2.0)
        light.position.set(-1, 1, -1).normalize()
        this._light = light
        this._scene.add(light)

        // 軸・グリット表示
        const axesHelper = new THREE.AxesHelper(5);
        this._scene.add(axesHelper);
        const gridHelper = new THREE.GridHelper(10, 10);
        this._scene.add(gridHelper);
    }

    public get scene(): THREE.Scene {
        return this._scene;
    }

    public update() {
        this._renderer.render(this._scene, this._camera);
    }

    public onResize() {
        const parentElement = this._canvas.parentElement;
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(parentElement.clientWidth, parentElement.clientHeight);

        this._camera.aspect = parentElement.clientWidth / parentElement.clientHeight;
        this._camera.updateProjectionMatrix();
    }

    // ライトの変更
    public onChangeLight(color: THREE.Color, intensity: string, x: string, y: string, z: string) {
        this._light.color = color
        this._light.intensity = Number(intensity)
        this._light.position.set(Number(x), Number(y), Number(z))
    }
}