(function(){

    'use strict';

    let player,
        mouse;

    const cartridge = {};

    /* Cartridge is using object contructor method for more extensibility */
    cartridge.root = document.getElementById('canvas');
    cartridge.context = cartridge.root.getContext('2d');
    cartridge.width = cartridge.root.getAttribute('width');
    cartridge.height = cartridge.root.getAttribute('height');
    cartridge.cellWidth = 12;
    cartridge.hudHeight = cartridge.height / 8;
    cartridge.gameFieldHeight = cartridge.height - cartridge.hudHeight;

    /* Creating a container for default color values within cartridge*/
    cartridge.canvasDefaults = {};
    cartridge.canvasDefaults.cartridgeBackgroundColor = '#ffe4a5';
    cartridge.canvasDefaults.cartridgeBorderColor = '#fff';
    cartridge.canvasDefaults.hudColor = '#000';
    cartridge.canvasDefaults.hudHeight = 60;

    cartridge.rerender = function(cartridgeBackground, cartridgeBorder){
        var cartridgeBackground = cartridgeBackground || this.canvasDefaults.cartridgeBackgroundColor,
            cartridgeBorder = cartridgeBorder || this.canvasDefaults.cartridgeBorderColor;
        this.renderGameField(0, 5, cartridgeBackground, cartridgeBorder, this.width, this.gameFieldHeight);
    }

    cartridge.renderGameField = function(x, y, cartridgeBackground, cartridgeBorder, width, height) {
        var width = width || this.cellWidth,
            height = height || this.cellWidth,
            cartridgeBackground = cartridgeBackground || this.canvasDefaults.hudColor,
            cartridgeBorder = cartridgeBorder || this.canvasDefaults.cartridgeBorderColor;

        /* render Heads Up Display */
        this.context.clearRect(0, 0, this.width, this.canvasDefaults.hudHeight);
        this.context.beginPath();
        this.context.rect(0, 0, this.width, this.canvasDefaults.hudHeight);
        this.context.fillStyle = this.canvasDefaults.hudColor;
        this.context.fill();
        this.context.closePath();

        /* render game field */
        this.context.fillStyle = cartridgeBackground;
        this.context.fillRect(x * cartridge.cellWidth, y * cartridge.cellWidth, width, height);
        this.context.strokeStyle = cartridgeBorder;
        this.context.strokeRect(x * cartridge.cellWidth, y * cartridge.cellWidth, width, height);
    };


    /* game is using object literal method for its singleton properties and access to common data */
    var game = {
        fps: 20,
        gameDefaults: {
            playerColor: '#228B22',
            playerOutline: '#fff',
            playerLength: 4,
            startingPos: { x: 5, y: 20 }
        },
        init: function() {
            player = new Snake( this.gameDefaults.playerLength, this.gameDefaults.playerColor, this.gameDefaults.playerOutline, this.gameDefaults.startingPos );
            mouse = new Mouse();
        },
        animate: function() {
            setTimeout( function() {
                requestAnimationFrame(game.animate);
                player.move();
                if (typeof mouse.renderMouse != 'undefined') {
                    mouse.renderMouse();
                }
            }, 1000 / game.fps);
        },
        over: function() {
            cartridge.rerender();
            this.init();
        }
    };

    /* Defining class through ES6 syntax for code readibility */
    class Snake {
        constructor(length, scaleColor, cartridgeBorderColor, startingPos) {
            this.length = length;
            this.scaleColor = scaleColor;
            this.cartridgeBorderColor = cartridgeBorderColor;
            this.snakeBody = [];
            this.direction = 'right';
            this.directionArray = [];
            this.nextXCoordinate;
            this.nextYCoordinate;
            this.startingPos = startingPos;
            this.create = function(){
                for (let a = this.length - 1; a >= 0; a--) {
                    this.snakeBody.push({x: startingPos.x + a, y: startingPos.y});
                }
            };
            this.create();
        };
        move() {
            if (this.directionArray.length) {
                this.direction = this.directionArray.shift();
            }

            this.nextXCoordinate = this.snakeBody[0].x;
            this.nextYCoordinate = this.snakeBody[0].y;
            let tail;

            switch(this.direction) {
                case 'right':
                    this.nextXCoordinate++;
                    break;
                case 'left':
                    this.nextXCoordinate--;
                    break;
                case 'up':
                    this.nextYCoordinate--;
                    break;
                case 'down':
                    this.nextYCoordinate++;
                    break;
            }
            if (this.hitWall() || this.strikeInto()) {
                game.over();
                return;
            }
            if ( this.eatingMouse() ) {
                game.score += 10;
                let update = true;
                tail = {x: this.nextXCoordinate, y: this.nextYCoordinate};
                mouse = new Mouse();
            } else {
                tail = this.snakeBody.pop();
                tail.x = this.nextXCoordinate;
                tail.y = this.nextYCoordinate;
            }

            this.snakeBody.unshift(tail);
            this.renderSnake();
        };
        renderSnake() {
            cartridge.rerender();

            for (const b of this.snakeBody) {
                cartridge.renderGameField(b.x, b.y, this.scaleColor, this.cartridgeBorderColor);
            }
        };
        hitWall() {
            if (this.nextXCoordinate <= -1 ||
                this.nextXCoordinate > cartridge.width / cartridge.cellWidth - 1 ||
                this.nextYCoordinate <= -1 ||
                this.nextYCoordinate < cartridge.hudHeight / cartridge.cellWidth  ||
                this.nextYCoordinate > cartridge.gameFieldHeight / cartridge.cellWidth + 5) {
                return true;
            }
            return false;
        };
        eatingMouse() {
            if (this.nextXCoordinate === mouse.x && this.nextYCoordinate === mouse.y) {
                return true;
            }
            return false;
        };
        strikeInto(x, y) {
            var x = x || this.nextXCoordinate,
                y = y || this.nextYCoordinate;
            for (let c = 0; c < this.snakeBody.length; c++) {
                if (this.snakeBody[c].x === x && this.snakeBody[c].y === y) {
                    return true;
                }
            }
            return false;
        }
    }

    function Mouse() {
        this.generateCoords = function() {
            this.x = Math.round(Math.random() * (cartridge.width-cartridge.cellWidth) / cartridge.cellWidth);
            this.y = Math.round(Math.random() * (cartridge.gameFieldHeight - cartridge.hudHeight) / cartridge.cellWidth) + 5;
            this.checkCollision();
        };
        this.checkCollision = function() {
            if (player.strikeInto(this.x, this.y)) {
                this.generateCoords();
            }
        };
        this.renderMouse = function(){
            cartridge.renderGameField(this.x, this.y, '#8e8175');
        };

        this.generateCoords();
        this.checkCollision();
        this.renderMouse();
    }

    /* Key blocker. Prevents arrow keys from scrolling the page whilst playing */
    function onKeyDown_blocker(event=window.event) {
        const activeElement = document.activeElement;
        if (!activeElement || activeElement == document.body || activeElement.tagName == "canvas") {
            if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
                if (event.preventDefault) event.preventDefault();
            }
        }
    }
    document.addEventListener('keydown', onKeyDown_blocker, false);

    /* Bind keys for player controls and game start */
    document.onkeydown = e => {
        const key = (e.keyCode ? e.keyCode : e.which);
        let gameStart = false;

        if (typeof player !== 'undefined'){
            let td;
            if (player.directionArray.length) {
                td = player.directionArray[player.directionArray.length - 1];
            } else {
                td = player.direction;
            }
            if (key == "37" && td != 'right') {
                player.directionArray.push('left');
            } else if (key == "38" && td != 'down') {
                player.directionArray.push('up');
            } else if (key == "39" && td != 'left') {
                player.directionArray.push('right');
            } else if (key == "40" && td != 'up') {
                player.directionArray.push('down');
            }
        } else if ( key == "13" ) {
            if (!gameStart) {
                gameStart = true;
                cartridge.rerender();
                game.init();
                game.animate();
            }
        } else if (key == undefined ) {
            console.log('waiting');
        }
    }

    /* Using .requestAnimationFrame is supposed to be a better practice than setInterval when handling canvas animation */
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];

    for (let z = 0; z < vendors.length && !window.requestAnimationFrame; ++z) {
        window.requestAnimationFrame = window[`${vendors[z]}RequestAnimationFrame`];
        window.cancelAnimationFrame = window[`${vendors[z]}CancelAnimationFrame`] ||
        window[`${vendors[z]}CancelRequestAnimationFrame`];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback, element) => {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(() => { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = id => {
            clearTimeout(id);
        };
    }

})();

