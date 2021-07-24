let moveMode = false;
let rotateMode = false;

let moveButton = undefined;
let rotateButton = undefined;

let entity = undefined;

// var log;


window.onload = () =>
{
    // log = document.getElementById('log');
    moveButton = document.getElementById('move-button');
    rotateButton = document.getElementById('rotate-button');

    var activeRegion = ZingTouch.Region(document.body, false, false);
    var containerElement = document.getElementsByTagName('a-scene')[0];
    entity = document.getElementById("theModel")

    entity.addEventListener("model-loaded", (e) =>
    {
        console.log(entity)
        let overlay = document.getElementById('overlay')
        setTimeout(() =>
        {
            overlay.style.opacity = '0';
            setTimeout(function () { overlay.parentNode.removeChild(overlay); }, 2000);
        }, 2000)
    })

    var pinch = new ZingTouch.Distance();
    activeRegion.bind(containerElement, pinch, function (event)
    {
        if (rotateMode || moveMode) return;

        let factor = event.detail.change / 500.0;
        let scale = entity.getAttribute('scale').x;
        if ((scale > 5 && factor > 0) || (scale < 0.05 && factor < 0)) return;
        scale += factor;
        entity.object3D.scale.set(scale, scale, scale)
        // log.innerText = factor;
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
                case 'up': position.y += 0.025; break;
                case 'left': position.x -= 0.025; break;
                case 'down': position.y -= 0.025; break;
                case 'right': position.x += 0.025; break;
            }

            entity.object3D.position.set(position.x, position.y, position.z);
        }
        else if (rotateMode)
        {
            let rotation = entity.getAttribute('rotation');
            let direction = calculateDirection(event.detail.data[0].currentDirection);

            if (!direction) return;

            switch (direction)
            {
                case 'up': rotation.x -= 1.5; break;
                case 'down': rotation.x += 1.5; break;
                case 'left': rotation.y -= 1.5; break;
                case 'right': rotation.y += 1.5; break;
            }

            entity.object3D.rotation.set(
                THREE.Math.degToRad(rotation.x),
                THREE.Math.degToRad(rotation.y),
                THREE.Math.degToRad(rotation.z)
            );
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




// function X()
// {
//     let rotation = entity.getAttribute('rotation')
//     rotation.x += 90;
//     entity.object3D.rotation.set(
//         THREE.Math.degToRad(rotation.x),
//         THREE.Math.degToRad(rotation.y),
//         THREE.Math.degToRad(rotation.z)
//     );

//     P()
// }
// function Y()
// {
//     let rotation = entity.getAttribute('rotation')
//     rotation.y += 90;
//     entity.object3D.rotation.set(
//         THREE.Math.degToRad(rotation.x),
//         THREE.Math.degToRad(rotation.y),
//         THREE.Math.degToRad(rotation.z)
//     );

//     P()
// }
// function Z()
// {
//     let rotation = entity.getAttribute('rotation')
//     rotation.z += 90;
//     entity.object3D.rotation.set(
//         THREE.Math.degToRad(rotation.x),
//         THREE.Math.degToRad(rotation.y),
//         THREE.Math.degToRad(rotation.z)
//     );

//     P()
// }
// function P()
// {
//     let rotation = entity.getAttribute('rotation')
//     log.innerText = parseInt(rotation.x) + ', ' + parseInt(rotation.y) + ', ' + parseInt(rotation.z);
// }