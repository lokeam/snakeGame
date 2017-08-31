(function() {

    'use strict';

        const
            title = 'Speed Snake',
            subtitle = 'a partially finished canvas game coded in < 180min',
            startPrompt = 'press enter to start',
            titleColor = '#42f468',
            secondaryColor = '#fff';

        let canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            x = ctx.canvas.width / 2,
            y = ctx.canvas.height / 5,
            title_image = new Image();

        title_image.src = './img/snakeLaptop.png';
        canvas.style.cssText = 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
                                'image-rendering: -moz-crisp-edges;' + // FireFox
                                'image-rendering: -o-crisp-edges;' +  // Opera
                                'image-rendering: -webkit-crisp-edges;' + // Chrome
                                'image-rendering: crisp-edges;' + // Chrome
                                'image-rendering: -webkit-optimize-contrast;' + // Safari
                                'image-rendering: pixelated; ' + // Future browsers
                                '-ms-interpolation-mode: nearest-neighbor;'; // IE


    function drawText(textColor, fontSpecs, text, x, y) {

        ctx.beginPath();
        ctx.fillStyle = textColor;
        ctx.font = fontSpecs;
        ctx.fillText(text, x, y);
        ctx.closePath();
    }
    /* Ensure custom font is usable by drawing text after fonts are fully downloaded */
    function textHandler() {

        /* Pixelize the main image and scale up */
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        let percent = 0.8,
            scaledWidth = ctx.canvas.width * percent,
            scaledHeight = ctx.canvas.height * percent;

        ctx.beginPath();
        ctx.drawImage(title_image, 260,100, scaledWidth, scaledHeight);
        ctx.closePath();

        drawText(titleColor, '40px Gamegirl', title, 100, 80);
        drawText(titleColor, '12px Gamegirl', subtitle, 20, 115);
        drawText(secondaryColor, '15px Gamegirl', startPrompt, 150, 320);

    }

    document.onkeydown = e => {
        const key = (e.keyCode ? e.keyCode : e.which);
        if ( key == "13" ) {
            ctx.clearRect(0, 0, 640, 480);

        } else if (key == undefined ) {
            console.log('waiting');
        }
    }

    window.onload = function start() {
        setTimeout(textHandler,200);
    }

})();