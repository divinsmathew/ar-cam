let moveMode = false;
let rotateMode = false;

let moveButton = undefined;
let rotateButton = undefined;


let entity = undefined;

var ttt;

window.onload = () =>
{
    ttt = document.getElementById('ttt');
    moveButton = document.getElementById('move-button');
    rotateButton = document.getElementById('rotate-button');

    var activeRegion = ZingTouch.Region(document.body, false, false);
    var containerElement = document.getElementsByTagName('a-scene')[0];
    entity = document.querySelector("body > a-scene > a-marker > a-entity")

    var pinch = new ZingTouch.Distance();
    activeRegion.bind(containerElement, pinch, function (event)
    {
        if (rotateMode || moveMode) return;

        let factor = event.detail.change / 500.0;
        let scale = entity.getAttribute('scale').x;
        if ((scale > 5 && factor > 0) || (scale < 0.05 && factor < 0)) return;
        scale += factor;
        entity.object3D.scale.set(scale, scale, scale)
        ttt.innerText = factor;
    });

    let swipe = new ZingTouch.Pan({
        numInputs: 1,
        threshold: 5
    })
    activeRegion.bind(containerElement, swipe, function (event)
    {
        if (moveMode)
        {
            let position = entity.getAttribute('position');
            let direction = calculateDirection(event.detail.data[0].currentDirection);

            if (!direction) return;

            switch (direction)
            {
                case 'up': position.z -= 0.025; break;
                case 'left': position.x -= 0.025; break;
                case 'down': position.z += 0.025; break;
                case 'right': position.x += 0.025; break;
            }

            entity.object3D.position.set(position.x, position.y, position.z);
        }
        else if (rotateMode)
        {
            let rotation = entity.getAttribute('rotation');
            let direction = calculateDirection(event.detail.data[0].currentDirection);

            if (!direction) return;

            // 180 0 0 up
            // 0 0 0 down
            // 0 270 90 left
            // 180 270 90 right

            switch (direction)
            {
                // case 'up': rotation.x -= 1.5; rotation.y = 0; ; rotation.z = 0; break;
                // case 'down': rotation.x += 1.5; rotation.y = 0; ; rotation.z = 0; break;
                // case 'left': rotation.x -= 1.5; rotation.y = 270; ; rotation.z = 90; break;
                // case 'right': rotation.x += 1.5; rotation.y = 270; ; rotation.z = 90; break;

                case 'up': rotation.z -= 1.5; break;
                case 'down': rotation.z += 1.5; break;

                case 'left': rotation.x -= 1.5; break;
                case 'right': rotation.x += 1.5; break;
            }
            entity.object3D.rotation.set(
                THREE.Math.degToRad(rotation.x),
                THREE.Math.degToRad(rotation.y),
                THREE.Math.degToRad(rotation.z)
            );

            P()
        }
    });
}

function calculateDirection(angle)
{
    /*
              90  
               |
               |
    180 --------------- 360
               |
               |
              270

    */

    if (angle <= 135 && angle > 45)
        return 'up'
    else if (angle <= 225 && angle > 135)
        return 'left'
    else if (angle <= 315 && angle > 225)
        return 'down'
    else
        return 'right'

    // if (angle === 90)
    //     return 'up'
    // else if (angle === 180)
    //     return 'left'
    // else if (angle === 270)
    //     return 'down'
    // else if (angle === 360)
    //     return 'right'
    // else
    //     return null
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

    P()
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

    P()
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

    P()
}
function P()
{
    let el = document.querySelector("body > a-scene > a-marker > a-entity")
    let rotation = el.getAttribute('rotation')

    ttt.innerText = parseInt(rotation.x) + ', ' + parseInt(rotation.y) + ', ' + parseInt(rotation.z);
}