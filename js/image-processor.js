const defaultOptions = {
    format: 'image/png',
    quality: 0.95,
    width: undefined,
    height: undefined,
    Canvas: undefined,
    crossOrigin: undefined
};

const getSnap = () => 
{
    makeOverlay('snap', 'show');
    snapOverlay.classList.add('snap-overlay-anim');

    setTimeout(async () =>
    {
        snapOverlay.classList.remove('snap-overlay-anim');

        let aScene = document
            .querySelector("a-scene")
            .components.screenshot.getCanvas("perspective");
        let frame = await captureVideoFrame("video", "png");
        aScene = await resizeCanvas(aScene, frame.width, frame.height);
        frame = frame.dataUri;

        let b64 = await mergeImages([frame, aScene]);
        document.getElementById('preview-img').src = b64;

        makeOverlay('snap', 'hide');
        makeOverlay('preview', 'show');
    }, 200);
};

const mergeImages = (sources = [], options = {}) => new Promise(resolve =>
{
    options = Object.assign({}, defaultOptions, options);

    const canvas = options.Canvas ? new options.Canvas() : window.document.createElement('canvas');
    const Image = options.Image || window.Image;

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

    const ctx = canvas.getContext('2d');

    resolve(Promise.all(images)
        .then(images =>
        {
            const getSize = dim => options[dim] || Math.max(...images.map(image => image.img[dim]));
            canvas.width = getSize('width');
            canvas.height = getSize('height');

            images.forEach((image, index) =>
            {
                if (index === 1) ctx.filter = "brightness(160%) contrast(85%)";
                ctx.imageSmoothingEnabled = true;
                ctx.translate(0.5, 0.5);
                ctx.globalAlpha = image.opacity ? image.opacity : 1;
                return ctx.drawImage(image.img, image.x || 0, image.y || 0);
            });

            if (options.Canvas && options.format === 'image/jpeg')
            {
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

            return canvas.toDataURL(options.format, options.quality);
        }));
});

const captureVideoFrame = (video, format) => new Promise(resolve =>
{
    video = document.querySelector(video);
    var canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    var dataUri = canvas.toDataURL('image/' + format);
    var data = dataUri.split(',')[1];
    var mimeType = dataUri.split(';')[0].slice(5);

    var bytes = window.atob(data);
    var buf = new ArrayBuffer(bytes.length);
    var arr = new Uint8Array(buf);

    for (var i = 0; i < bytes.length; i++)
        arr[i] = bytes.charCodeAt(i);

    var blob = new Blob([arr], { type: mimeType });
    resolve({ blob: blob, dataUri: dataUri, format: format, width: canvas.width, height: canvas.height });
});

const resizeCanvas = (modelCanvas, videoWidth, videoHeight) => new Promise(resolve =>
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

    resolve(resizedCanvas.toDataURL());
});