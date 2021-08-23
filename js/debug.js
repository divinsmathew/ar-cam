
function X()
{
    let rotation = entity.getAttribute('rotation');
    rotation.x += 90;
    entity.object3D.rotation.set(
        THREE.Math.degToRad(rotation.x),
        THREE.Math.degToRad(rotation.y),
        THREE.Math.degToRad(rotation.z)
    );

    P();
}
function Y()
{
    let rotation = entity.getAttribute('rotation');
    rotation.y += 90;
    entity.object3D.rotation.set(
        THREE.Math.degToRad(rotation.x),
        THREE.Math.degToRad(rotation.y),
        THREE.Math.degToRad(rotation.z)
    );

    P();
}
function Z()
{
    let rotation = entity.getAttribute('rotation');
    rotation.z += 90;
    entity.object3D.rotation.set(
        THREE.Math.degToRad(rotation.x),
        THREE.Math.degToRad(rotation.y),
        THREE.Math.degToRad(rotation.z)
    );

    P();
}
function P()
{
    let rotation = entity.getAttribute('rotation');
    log.innerText = parseInt(rotation.x) + ', ' + parseInt(rotation.y) + ', ' + parseInt(rotation.z);
}