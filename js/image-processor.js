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

    resizedCanvas.width = videoWidth;
    resizedCanvas.height = videoHeight;

    if (videoWidth > videoHeight)
    {
        // Landscape
        resizedContext.drawImage(modelCanvas, 0, 0, videoWidth, videoHeight);
    } else
    {
        // Portrait
        // var scale = videoHeight / videoWidth;
        // var scaledHeight = modelCanvas.height * scale;
        // var scaledWidth = modelCanvas.width * scale;
        // var marginLeft = (modelCanvas.width - scaledWidth) / 2;
        // resizedContext.drawImage(modelCanvas, marginLeft, 0, scaledWidth, scaledHeight);

        resizedContext.drawImage(modelCanvas, 0, 0, videoHeight, videoWidth);
    }

    return resizedCanvas.toDataURL();
}

function captureVideoFrame(video, format)
{
    video = document.querySelector(video);

    var canvas = document.createElement("CANVAS");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
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