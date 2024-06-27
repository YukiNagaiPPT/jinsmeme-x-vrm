import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { VRM, VRMSchema } from '@pixiv/three-vrm';

export class Avatar {

    private _scene: THREE.Scene;
    private _vrm: VRM;
    
    // 首の上下の動き(x軸回転)
    private sliderPitch = <HTMLInputElement>document.getElementById('sliderPitch')
    // 首の左右の動き(y軸回転)
    private sliderYaw = <HTMLInputElement>document.getElementById('sliderYaw')
    // 首の傾き(z軸回転)
    private sliderRoll = <HTMLInputElement>document.getElementById('sliderRoll')
    // x軸回転の値
    private pitchValue = <HTMLInputElement>document.getElementById('pitchValue')
    // y軸回転の値
    private yawValue = <HTMLInputElement>document.getElementById('yawValue')
    // z軸回転の値
    private rollValue = <HTMLInputElement>document.getElementById('rollValue')

    constructor(scene: THREE.Scene) {
        this._scene = scene;
        this._vrm = null;
    }

    // VRMの読み込み
    public async loadVRM(url: string) {
        if (this._vrm) {
            this._scene.remove(this._vrm.scene);
            this._vrm.dispose();
        }

        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(url);
        const vrm = await VRM.from(gltf);
        this._scene.add(vrm.scene);
        this._vrm = vrm;

        return vrm;
    }

    // VRMの首の向きの変更
    public onNeckRotateChange(pitch:string, yaw:string, roll:string) {
        this.sliderPitch.value = pitch
        this.sliderYaw.value = yaw
        this.sliderRoll.value = roll

        this.pitchValue.innerHTML = pitch.toString()
        this.yawValue.innerHTML = yaw.toString()
        this.rollValue.innerHTML = roll.toString()
        
        this._vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck).rotation.x = -1 * (Number(pitch) / 360 * 2 * Math.PI)
        this._vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck).rotation.y = -1 * (Number(yaw) / 360 * 2 * Math.PI)
        this._vrm.humanoid.getBoneNode(VRMSchema.HumanoidBoneName.Neck).rotation.z = -1 * (Number(roll) / 360 * 2 * Math.PI)

        console.log(`Pitch:${pitch}, Yaw:${yaw}, Roll:${roll}`)
    }
}