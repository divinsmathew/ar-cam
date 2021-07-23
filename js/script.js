window.onload = () =>
{
    var activeRegion = ZingTouch.Region(document.body);
    var containerElement = document.getElementsByTagName('a-scene')[0];
    var ttt = document.getElementById('ttt');
    let el = document.querySelector("body > a-scene > a-marker > a-entity")

    var myTapGesture = new ZingTouch.Distance();
    var gest = new ZingTouch.Gesture();
    activeRegion.bind(containerElement, myTapGesture, function (event)
    {
        let factor = event.detail.change / 1.0;
        
        let scale = el.getAttribute('rotation')
        if(scale >5 || scale <-5) return;
        scale += factor;

        el.object3D.scale.set(scale,scale,scale);

        ttt.innerText = scale;

    });
    activeRegion.bind(containerElement, gest, function (event)
    {

        ttt.innerText = event;

    });
}


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