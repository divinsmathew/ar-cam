function makeOverlay(type, operation)
{
    function hideOverlay(overlay)
    {
        overlay.style.opacity = '0';
        setTimeout(() =>
        {
            overlay.style.zIndex = '5';
            overlay.style.display = 'none';
        }, 800);
    }
    function showOverlay(overlay, zIndex, display = 'flex', opacity = '1', delay = 0)
    {
        overlay.style.zIndex = zIndex;
        overlay.style.display = display;
        if (delay === 0)
            overlay.style.opacity = opacity;
        else
            setTimeout(() => { overlay.style.opacity = opacity; }, delay);
    }

    switch (type)
    {
        case 'preview':
            if (operation === 'show')
                showOverlay(previewOverlay, '60');
            else if (operation === 'hide')
                hideOverlay(previewOverlay);
            break;
        case 'snap':
            if (operation === 'show')
                showOverlay(snapOverlay, '70', 'flex', '0.5', 200);
            else if (operation === 'hide')
                hideOverlay(snapOverlay);
            break;

        case 'loading':
            if (operation === 'show')
                showOverlay(loadingOverlay, '80');
            else if (operation === 'hide')
                hideOverlay(loadingOverlay);
            break;

        case 'fullscreen':
            if (operation === 'show')
                showOverlay(fullscreenOverlay, '90');
            else if (operation === 'hide')
                hideOverlay(fullscreenOverlay);
            break;

        case 'rotate':
            if (operation === 'show')
                showOverlay(rotateOverlay, '100');
            else if (operation === 'hide')
                hideOverlay(rotateOverlay);
            break;
    }
}

function handleOrientation(e)
{
    if (!e) e = window.matchMedia('screen and (orientation:portrait)');

    makeOverlay('rotate', e.matches ? 'show' : 'hide');

    // if (screen.orientation.angle == 90 || screen.orientation.angle == 270)
    //     makeOverlay('rotate', 'hide')
    // else
    //     makeOverlay('rotate', 'show')
}

function handleFullScreen()
{
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    if (isInFullScreen)
        makeOverlay('fullscreen', 'hide');
    else
        makeOverlay('fullscreen', 'hide');
}

function requestFullScreen()
{
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;
    if (!isInFullScreen)
    {
        if (docElm.requestFullscreen)
            docElm.requestFullscreen();
        else if (docElm.mozRequestFullScreen)
            docElm.mozRequestFullScreen();
        else if (docElm.webkitRequestFullScreen)
            docElm.webkitRequestFullScreen();
        else if (docElm.msRequestFullscreen)
            docElm.msRequestFullscreen();
    }
    else
    {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
    }
}