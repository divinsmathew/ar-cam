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

    entity.addEventListener("model-loaded", () =>
    {
        console.log(entity)
        let overlay = document.getElementById('overlay')
        setTimeout(() =>
        {
            overlay.style.opacity = '0';
            overlay.style.zIndex = '5';
        }, 500)
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

const getSnap = async () => 
{


    // html2canvas(document.body).then(function(canvas) {
    //     //document.body.appendChild(canvas);

    //     var link = document.getElementById('link');
    //     link.setAttribute('download', 'MintyPaper.png');
    //     link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    //     link.click();
    // })


    let aScene = document
        .querySelector("a-scene")
        .components.screenshot.getCanvas("perspective");
    let frame = captureVideoFrame("video", "png");
    aScene = resizeCanvas(aScene, frame.width, frame.height);
    frame = frame.dataUri;
    mergeImages([frame, aScene]).then(b64 =>
    {
        let link = document.getElementById("link", "png");
        link.setAttribute("download", new Date().toLocaleString().replaceAll(':', '-').replaceAll('/', '-') + " AR.png");
        link.setAttribute("href", b64);
        link.click();
    });
}

function resizeCanvas(modelCanvas, videoWidth, videoHeight)
{
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d");

    // 3d <- video
    resizedCanvas.width = videoWidth;
    resizedCanvas.height = videoHeight;

    console.log('video: ', videoWidth, ',', videoHeight)
    console.log('model: ', modelCanvas.width, ',', modelCanvas.height)

    if (videoWidth > videoHeight) {
        // Landscape
        resizedContext.drawImage(modelCanvas, 0, 0, videoWidth, videoHeight);
    } else {
        // Portrait
        var scale = videoHeight / videoWidth;
        var scaledHeight = modelCanvas.width * scale;
        var scaledWidth = modelCanvas.height * scale;
        var marginLeft = ( modelCanvas.width - scaledWidth) / 2;

        resizedContext.drawImage(modelCanvas, 0, 0, videoHeight, videoWidth);


        console.log('scaled: ', scaledWidth, ',', scaledHeight)

    }

    return resizedCanvas.toDataURL();
}

function captureVideoFrame(video, format)
{
    video = document.querySelector(video);

    var canvas = document.createElement("CANVAS");

    canvas.width =  video.videoWidth;
    canvas.height =  video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    var dataUri = canvas.toDataURL('image/' + format);
    var data = dataUri.split(',')[1];
    var mimeType = dataUri.split(';')[0].slice(5)

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++)
        arr[i] = bytes.charCodeAt(i);

    var blob = new Blob([arr], { type: mimeType });
    return { blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height };
};

const defaultOptions = {
    format: 'image/png',
    quality: 0.92,
    width: undefined,
    height: undefined,
    Canvas: undefined,
    crossOrigin: undefined
};

const mergeImages = (sources = [], options = {}) => new Promise(resolve =>
{
    options = Object.assign({}, defaultOptions, options);

    // Setup browser/Node.js specific variables
    const canvas = options.Canvas ? new options.Canvas() : window.document.createElement('canvas');
    const Image = options.Image || window.Image;

    // Load sources
    const images = sources.map(source => new Promise((resolve, reject) =>
    {
        // Convert sources to objects
        if (source.constructor.name !== 'Object')
        {
            source = { src: source };
        }

        // Resolve source and img when loaded
        const img = new Image();
        img.crossOrigin = options.crossOrigin;
        img.onerror = () => reject(new Error('Couldn\'t load image'));
        img.onload = () => resolve(Object.assign({}, source, { img }));
        img.src = source.src;
    }));

    // Get canvas context
    const ctx = canvas.getContext('2d');

    // When sources have loaded
    resolve(Promise.all(images)
        .then(images =>
        {
            // Set canvas dimensions
            const getSize = dim => options[dim] || Math.max(...images.map(image => image.img[dim]));
            canvas.width = getSize('width');
            canvas.height = getSize('height');

            // Draw images to canvas
            images.forEach(image =>
            {
                ctx.globalAlpha = image.opacity ? image.opacity : 1;
                return ctx.drawImage(image.img, image.x || 0, image.y || 0);
            });

            if (options.Canvas && options.format === 'image/jpeg')
            {
                // Resolve data URI for node-canvas jpeg async
                return new Promise((resolve, reject) =>
                {
                    canvas.toDataURL(options.format, {
                        quality: options.quality,
                        progressive: false
                    }, (err, jpeg) =>
                    {
                        if (err)
                        {
                            reject(err);
                            return;
                        }
                        resolve(jpeg);
                    });
                });
            }

            // Resolve all other data URIs sync
            return canvas.toDataURL(options.format, options.quality);
        }));
});





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