let moveMode = false;
let rotateMode = false;

let moveButton = undefined;
let rotateButton = undefined;


let entity = undefined;

window.onload = () =>
{
    var ttt = document.getElementById('ttt');
    moveButton = document.getElementById('move-button');
    rotateButton = document.getElementById('rotate-button');

    var activeRegion = ZingTouch.Region(document.body);
    var containerElement = document.getElementsByTagName('a-scene')[0];
    entity = document.querySelector("body > a-scene > a-marker > a-entity")

    var pinch = new ZingTouch.Distance();
    activeRegion.bind(containerElement, pinch, function (event)
    {
        let factor = event.detail.change / 500.0;
        let scale = entity.getAttribute('scale').x;
        if ((scale > 5 && factor > 0) || (scale < 0.05 && factor < 0)) return;
        scale += factor;
        entity.object3D.scale.set(scale, scale, scale)
        ttt.innerText = factor ;
    });

    // var swipe = new ZingTouch.Swipe({
    //     numInputs: 2,
    //     maxRestTime: 100,
    //     escapeVelocity: 0.25
    // });
    // activeRegion.bind(containerElement, swipe, function (event)
    // {
    //     let factor = event.detail.currentDirection;
    //     let position = entity.getAttribute('position');

    //     ttt.innerText = factor ;

    // });
}

function toggleMove()
{
    if (moveMode)
        moveButton.classList.remove('toggle-active')
    else
    {
        moveButton.classList.add('toggle-active');
        rotateButton.classList.remove('toggle-active')
        rotateMode = false;
    }

    moveMode = !moveMode;
}

function toggleRotate()
{
    if (rotateMode)
        rotateButton.classList.remove('toggle-active')
    else
    {
        rotateButton.classList.add('toggle-active');
        moveButton.classList.remove('toggle-active')
        moveMode = false;
    }

    rotateMode = !rotateMode;
}
// ttt.innerText = scale;


function X()
{
    let el = document.querySelector("body > a-scene > a-marker > a-entity")
    let rotation = el.getAttribute('rotation')
    rotation.x += 90;
    el.object3D.rotation.set(
        THREE.Math.degToRad(rotation.x),
        THREE.Math.degToRad(rotation.y),
        THREE.Math.degToRad(rotation.z)
    );
}
function Y()
{
    let el = document.querySelector("body > a-scene > a-marker > a-entity")
    let rotation = el.getAttribute('rotation')
    rotation.y += 90;
    el.object3D.rotation.set(
        THREE.Math.degToRad(rotation.x),
        THREE.Math.degToRad(rotation.y),
        THREE.Math.degToRad(rotation.z)
    );
}
function Z()
{
    let el = document.querySelector("body > a-scene > a-marker > a-entity")
    let rotation = el.getAttribute('rotation')
    rotation.z += 90;
    el.object3D.rotation.set(
        THREE.Math.degToRad(rotation.x),
        THREE.Math.degToRad(rotation.y),
        THREE.Math.degToRad(rotation.z)
    );
}