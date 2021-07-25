function makeOverlay(type, operation)
{
    function hideOverlay(overlay)
    {
        overlay.style.opacity = '0';
        overlay.style.zIndex = '5';
        setTimeout(() => { overlay.style.display = 'none'; }, 800);
    }
    function showOverlay(overlay, zIndex)
    {
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        overlay.style.zIndex = zIndex;
    }

    switch (type)
    {
        case 'loading':
            if (operation === 'show')
                showOverlay(loadingOverlay, '80')
            else if (operation === 'hide')
                hideOverlay(loadingOverlay)

            break;

        case 'fullscreen':
            if (operation === 'show')
                showOverlay(fullscreenOverlay, '90')
            else if (operation === 'hide')
                hideOverlay(fullscreenOverlay)
            break;

        case 'rotate':
            if (operation === 'show')
                showOverlay(rotateOverlay, '100')
            else if (operation === 'hide')
                hideOverlay(rotateOverlay)
            break;
    }
}

function handleOrientation()
{
    if (screen.orientation.angle == 90 || this.screen.orientation.angle == 270)
        makeOverlay('rotate', 'hide')
    else
        makeOverlay('rotate', 'show')
}

function handleFullScreen()
{
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    if (isInFullScreen)
        makeOverlay('fullscreen', 'hide')
    else
        makeOverlay('fullscreen', 'show')
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
        {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen)
        {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen)
        {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen)
        {
            docElm.msRequestFullscreen();
        }
    } else
    {
        if (document.exitFullscreen)
        {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen)
        {
            document.msExitFullscreen();
        }
    }
}