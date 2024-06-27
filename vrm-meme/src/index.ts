import { Avatar } from './Avatar';
import { Viewer } from './Viewer';
import { VRM, VRMSchema } from '@pixiv/three-vrm';
import * as THREE from 'three'

window.addEventListener('DOMContentLoaded', async () => {

    const viewerElement = document.getElementById('viewer');
    const viewer = new Viewer(viewerElement);
    const avatar = new Avatar(viewer.scene);
    let currentVrm: VRM = null;

    //デフォルトモデル読み込み
    currentVrm = await avatar.loadVRM('./three-vrm-girl.vrm');
    console.log({currentVrm})

    // ローカルのVRMの読み込み
    const inputVRM = document.getElementById('inputVRM');
    inputVRM.addEventListener('change', async (event) => {
        const target = event.target as HTMLInputElement;

        const files = target.files;
        if (!files) return;

        const file = files[0];
        if (!file) return;

        const blob = new Blob([file], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        currentVrm = await avatar.loadVRM(url);
        console.log({currentVrm})
    });

    window.addEventListener('resize', () => {
        viewer.onResize();
    });

    //フレーム更新
    const update = () => {
        requestAnimationFrame(update);
        viewer.update();
    }
    update();

    const socket = new WebSocket('ws://127.0.0.1:3000/web-socket')

    // 首の上下の動き(x軸回転)
    const sliderPitch = <HTMLInputElement>document.getElementById('sliderPitch')
    // 首の左右の動き(y軸回転)
    const sliderYaw = <HTMLInputElement>document.getElementById('sliderYaw')
    // 首の傾き(z軸回転)
    const sliderRoll = <HTMLInputElement>document.getElementById('sliderRoll')

    // 光源の向き(x)
    const sliderX = <HTMLInputElement>document.getElementById('sliderX')
    // 光源の向き(y)
    const sliderY = <HTMLInputElement>document.getElementById('sliderY')
    // 光源の向き(z)
    const sliderZ = <HTMLInputElement>document.getElementById('sliderZ')
    // 光源の強さ
    const sliderIntensity = <HTMLInputElement>document.getElementById('sliderIntensity')
    // 光源の色
    const sliderColor = <HTMLInputElement>document.getElementById('sliderColor')

    // Websocketから生体情報を受信
    socket.addEventListener('message', function(event) {
        const data = JSON.parse(event.data);
        avatar.onNeckRotateChange(data.pitch, data.yaw, data.roll)
    })

    // 各パラメーターの手動設定を検知
    sliderPitch.addEventListener('change', function(event) {
        avatar.onNeckRotateChange(sliderPitch.value, sliderYaw.value,sliderRoll.value)
    })

    sliderYaw.addEventListener('change', function(event) {
        avatar.onNeckRotateChange(sliderPitch.value, sliderYaw.value,sliderRoll.value)
    })
    
    sliderRoll.addEventListener('change', function(event) {
        avatar.onNeckRotateChange(sliderPitch.value, sliderYaw.value,sliderRoll.value)
    })

    sliderX.addEventListener('change', function(event) {
        viewer.onChangeLight(new THREE.Color(sliderColor.value), sliderIntensity.value ,sliderX.value ,sliderY.value, sliderZ.value)
    })

    sliderY.addEventListener('change', function(event) {
        viewer.onChangeLight(new THREE.Color(sliderColor.value), sliderIntensity.value ,sliderX.value ,sliderY.value, sliderZ.value)
    })

    sliderZ.addEventListener('change', function(event) {
        viewer.onChangeLight(new THREE.Color(sliderColor.value), sliderIntensity.value ,sliderX.value ,sliderY.value, sliderZ.value)
    })

    sliderIntensity.addEventListener('change', function(event) {
        viewer.onChangeLight(new THREE.Color(sliderColor.value), sliderIntensity.value ,sliderX.value ,sliderY.value, sliderZ.value)
    })

    sliderColor.addEventListener('change', function(event) {
        viewer.onChangeLight(new THREE.Color(sliderColor.value), sliderIntensity.value ,sliderX.value ,sliderY.value, sliderZ.value)
    })

});