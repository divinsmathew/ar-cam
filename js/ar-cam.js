let moveMode = false;
let rotateMode = false;

let moveButton = undefined;
let rotateButton = undefined;

let loadingOverlay = undefined;
let fullscreenOverlay = undefined;
let rotateOverlay = undefined;
let snapOverlay = undefined;
let previewOverlay = undefined;

let positionLog = undefined;
let rotationLog = undefined;
let zoomLog = undefined;

let entity = undefined;

const rotationSensitivity = 1.5;
const positionSensitivity = 0.03;
const scaleSensitivity = 0.01;

// var log;

window.onload = () =>
{
    // log = document.getElementById('log');
    positionLog = document.getElementById('positionLog');
    rotationLog = document.getElementById('rotationLog');
    zoomLog = document.getElementById('zoomLog');
    entity = document.getElementById("theModel");
    moveButton = document.getElementById('move-button');
    rotateButton = document.getElementById('rotate-button');

    loadingOverlay = document.getElementById('loading-overlay');
    fullscreenOverlay = document.getElementById('fullscreen-overlay');
    rotateOverlay = document.getElementById('rotate-overlay');
    snapOverlay = document.getElementById('snap-overlay');
    previewOverlay = document.getElementById('preview-overlay');

    makeOverlay('snap', 'hide');
    makeOverlay('preview', 'hide');
    handleOrientation();
    handleFullScreen();

    document.getElementById("save-capture-button").addEventListener('click', () =>
    {
        let link = document.createElement("a");
        let fileName = new Date().toLocaleString().replaceAll(':', '-').replaceAll('/', '-') + " AR.png";
        link.download = fileName;
        link.setAttribute("download", fileName);
        link.setAttribute("href", document.getElementById('preview-img').src);
        link.click();

        makeOverlay('preview', 'hide');
    });
    document.getElementById("retake-button").addEventListener('click', () =>
    {
        makeOverlay('preview', 'hide');
    });

    entity.addEventListener("model-loaded", () => { makeOverlay('loading', 'hide'); });
    window.matchMedia('screen and (orientation:portrait)')
        .addEventListener("change", e => handleOrientation(e));
    //window.addEventListener("orientationchange", handleOrientation)
    window.addEventListener("fullscreenchange", handleFullScreen, false);
    window.addEventListener('resize', () =>
    {
        let newHeight = window.innerHeight + 'px';
        loadingOverlay.style.height = newHeight;
        fullscreenOverlay.style.height = newHeight;
        rotateOverlay.style.height = newHeight;
        snapOverlay.style.height = newHeight;
        previewOverlay.style.height = newHeight;
        document.getElementsByClassName('controls')[0].style.height = newHeight;
    });

    let activeRegion = ZingTouch.Region(document.body, false, false);
    let containerElement = document.getElementsByTagName('a-scene')[0];
    let pinch = new ZingTouch.Distance();
    activeRegion.bind(containerElement, pinch, function (event)
    {
        //if (rotateMode || moveMode) return;

        let factor = event.detail.change * scaleSensitivity;
        let scale = entity.getAttribute('scale').x;
        //if ((scale > 5 && factor > 0) || (scale < 0.05 && factor < 0)) return;
        scale += factor;
        entity.object3D.scale.set(scale, scale, scale);

        zoomLog.innerText = "Scale: " + scale.toFixed(3);
        // log.innerText = factor;
    });
    let swipe = new ZingTouch.Pan({
        numInputs: 1,
        threshold: 5
    });
    activeRegion.bind(containerElement, swipe, function (event)
    {
        if (moveMode)
        {
            let position = entity.getAttribute('position');
            let direction = calculateDirection(event.detail.data[0].currentDirection);

            if (!direction) return;

            switch (direction)
            {
                case 'up': position.y += positionSensitivity; break;
                case 'left': position.x -= positionSensitivity; break;
                case 'down': position.y -= positionSensitivity; break;
                case 'right': position.x += positionSensitivity; break;
            }

            entity.object3D.position.set(position.x, position.y, position.z);
            positionLog.innerText = "Position: " + position.x.toFixed(3) + ', ' + position.y.toFixed(3) + ', ' + position.z.toFixed(3);
        }
        else if (rotateMode)
        {
            let rotation = entity.getAttribute('rotation');
            let direction = calculateDirection(event.detail.data[0].currentDirection);

            if (!direction) return;

            switch (direction)
            {
                case 'up': rotation.x -= rotationSensitivity; break;
                case 'down': rotation.x += rotationSensitivity; break;
                case 'left': rotation.y -= rotationSensitivity; break;
                case 'right': rotation.y += rotationSensitivity; break;
            }

            entity.object3D.rotation.set(
                THREE.Math.degToRad(rotation.x),
                THREE.Math.degToRad(rotation.y),
                THREE.Math.degToRad(rotation.z)
            );

            rotationLog.innerText = "Rotation: " + rotation.x.toFixed(3) + ', ' + rotation.y.toFixed(3) + ', ' + rotation.z.toFixed(3);
        }
    });
};
