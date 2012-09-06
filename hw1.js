/**
 * Snorlax Munch
 * Tanay Gavankar (tgavanka)
 * Jocelyn Kong (jocelynk)
 * Sid Soundararajan (ssoundar)
 */
function SnorlaxMunch() {
    /**
     * Global variables
     */
    var canvas = document.getElementById("myCanvas"),
        ctx = canvas.getContext('2d');

    var snorlaxMunchGame = this;

    var gameSettings = {
        pointsPerPokeballEaten: 10,
        damagePerPokeballHit: 25,
        maxHealth: 100,
        maxAwakeMeter: 100,
        awakeMeterRechargeDelta: 1,
        awakeMeterDrainDelta: -1,
        snorlaxMoveSpeed: 5, // must be positive
    };

    var keyControls = {
        "87": {
            type: "move",
            value: "up"
        }, // w
        "65": {
            type: "move",
            value: "left"
        }, // a
        "83": {
            type: "move",
            value: "down"
        }, // s
        "68": {
            type: "move",
            value: "right"
        }, // d
        "80": {
            type: "game",
            value: "pause"
        }, // p
        "82": {
            type: "game",
            value: "restart"
        }, //r
        "38": {
            type: "menu",
            value: "menuup"
        }, // Up Arrow
        "40": {
            type: "menu",
            value: "menudown"
        }, // Down Arrow
        "13": {
            type: "menu",
            value: "menuenter"
        }, // Enter
        "27": {
            type: "menu",
            value: "menuesc"
        }, // Esc
    };

    /**
     * Game state object
     */
    function AllState() {
        this.menuState = {
            choice: 0,
            picked: false,
            menuId: undefined,
        };

        this.ballState = {
            radius: 10, // Radius of pokeball
            // Arrays for pokeballs
            top: {
                "arr": [],
                "side": "top"
            },
            right: {
                "arr": [],
                "side": "right"
            },
            left: {
                "arr": [],
                "side": "left"
            },
            bottom: {
                "arr": [],
                "side": "bottom"
            },
        };

        this.gameState = {
            score: 0, // Number of pokeballs eaten
            paused: false, // Game paused
            ended: 0,
            level: 1, // Difficulty level
            stInt: undefined // Redraw timer interval, to be instantiated later.
        };

        this.snorlax = {
            x: canvas.width / 2, // x position of center of allState.snorlax
            y: canvas.height / 2, // y position of center of allState.snorlax
            dx: 0, // x motion of allState.snorlax
            dy: 0, // y motion of allState.snorlax
            rotation: 0, // Radians rotated
            zState: 0, // Where the Z for sleep appears (up/down/etc)
            mouthOpen: false, // Mouth is open for eating pokeballs
            awakeMeter: gameSettings.maxAwakeMeter, // Amount of awake energy for keeping mouth open
            awakeMeterDelta: gameSettings.awakeMeterRechargeDelta, // Amount awake energy changes per tick
            health: gameSettings.maxHealth, // Current HP
            radius: 50, // Radius of allState.snorlax sprite
            hit: false,
        };
    };

    var allState = new AllState();

    /**
     * Game reset helpers
     */
    function setDefaults() {
        // Restore the game state to defaults
        allState = new AllState();
    }

    function destroyGame() {
        // Avoid doubled intervals/event listeners
        clearInterval(allState.menuState.menuId);
        clearInterval(allState.gameState.stInt);
        clearInterval(allState.snorlax.sleepToggler);
        clearInterval(allState.snorlax.awakeMeterInterval);
        removeEventListeners();
    }

    function resetGame() {
        destroyGame();
        setDefaults();
        snorlaxMunchGame.introMenu();
    }

    /**
     * Event handlers
     */
    function onKeyDown(event) {
        handleKeyDown(keyControls[event.keyCode]);
    }

    function onKeyUp(event) {
        handleKeyUp(keyControls[event.keyCode]);
    }

    function onMouseMove(event) {
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        var x = allState.snorlax.x - x;
        var y = allState.snorlax.y - y;
        rotateSnorlax(Math.atan2(y, x) - Math.PI / 2); // Polar angle rotation, offset to have cursor on opposite side of mouth
    }

    function onMouseDown(event) {
        allState.snorlax.mouthOpen = true;
    }

    function onMouseUp(event) {
        allState.snorlax.mouthOpen = false;
    }

    /**
     * Event handler helpers
     */
    function handleKeyDown(input) {
        if (input === undefined) {
            return;
        }
        switch (input.type) {
        case "move":
            moveSnorlax(input.value);
            break;
        case "game":
            handleGameInput(input.value);
            break;
        case "menu":
            handleMenuInput(input.value);
            break;
        }

    }

    function handleKeyUp(input) {
        if (input === undefined || input.type !== "move") {
            return;
        }
        stopMoveSnorlax(input.value);
    }

    function handleGameInput(input) {
        switch (input) {
        case "pause":
            allState.gameState.paused = !allState.gameState.paused;
            break;
        case "restart":
            if (allState.gameState.ended > 0) {
                resetGame();
            }
            break;
        }
    }

    function handleMenuInput(input) {
        switch (input) {
        case "menuup":
            if (allState.menuState.choice > 0 && allState.menuState.picked === false) {
                allState.menuState.choice--;
            }
            break;
        case "menudown":
            if (allState.menuState.choice < 2 && allState.menuState.picked === false) {
                allState.menuState.choice++;
            }
            break;
        case "menuenter":
            if (allState.menuState.picked === true) {
                break;
            }
            clearInterval(allState.menuState.menuId);
            allState.menuState.picked = true;
            switch (allState.menuState.choice) {
            case 0:
                playGame();
                break;
            case 1:
                allState.menuState.menuId = setInterval(displayControls, 20);
                break;
            case 2:
                displayQuit();
                break;
            }
            break;
        case "menuesc":
            if (allState.menuState.picked === true && allState.menuState.choice === 1) {
                clearInterval(allState.menuState.menuId);
                allState.menuState.picked = false;
                allState.menuState.menuId = setInterval(drawMenu, 20);
            }
            break;
        }
    }

    /**
     * Snorlax helpers
     */
    function moveSnorlax(direction) {
        if (allState.gameState.paused) {
            return;
        }

        switch (direction) {
        case "up":
            allState.snorlax.dy = -1 * gameSettings.snorlaxMoveSpeed;
            break;
        case "down":
            allState.snorlax.dy = gameSettings.snorlaxMoveSpeed;
            break;
        case "left":
            allState.snorlax.dx = -1 * gameSettings.snorlaxMoveSpeed;
            break;
        case "right":
            allState.snorlax.dx = gameSettings.snorlaxMoveSpeed;
            break;
        }
    }

    function stopMoveSnorlax(direction) {
        if (allState.gameState.paused) {
            return;
        }

        switch (direction) {
        case "up":
            allState.snorlax.dy = 0;
            break;
        case "down":
            allState.snorlax.dy = 0;
            break;
        case "left":
            allState.snorlax.dx = 0;
            break;
        case "right":
            allState.snorlax.dx = 0;
            break;
        }
    }

    function rotateSnorlax(angle) {
        allState.snorlax.rotation = angle;
    }

    function updateSnorlaxPosition() {
        if (allState.snorlax.x + allState.snorlax.dx > allState.snorlax.radius &&
            allState.snorlax.x + allState.snorlax.dx < canvas.width - allState.snorlax.radius) {
            allState.snorlax.x += allState.snorlax.dx;
        }

        if (allState.snorlax.y + allState.snorlax.dy > allState.snorlax.radius &&
            allState.snorlax.y + allState.snorlax.dy < canvas.height - allState.snorlax.radius) {
            allState.snorlax.y += allState.snorlax.dy;
        }
    }

    function drawSnorlax() {
        ctx.save();
        updateSnorlaxPosition();
        ctx.translate(allState.snorlax.x, allState.snorlax.y);
        ctx.rotate(allState.snorlax.rotation);
        drawSnorlaxSprite();
        ctx.restore();
    }

    /**
     * Drawing functions
     */
    function drawSnorlaxSprite() {
        // Center coordinate for face (center at origin for drawing purposes).
        // Actual position is in allState.snorlax.x and allState.snorlax.y.
        var snorlaxX = 0;
        var snorlaxY = 0;
        var snorlaxR = allState.snorlax.radius;
        var mouthOpen = allState.snorlax.mouthOpen;
        var zState = allState.snorlax.zState;
        // Colors for face and stuff
        var faceColor = "rgb(178, 173, 131)";
        var eyeColor = "black";
        var earColor = "rgb(46,82,79)";
        var textColor = "black";
        var teethColor = "white";
        var mouthColor = ((mouthOpen === true) ? "rgb(251, 113, 83)" : "black");
        // Face for snorlax
        function circle(ctx, cx, cy, radius) {
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI, true);
        }

        if (!allState.snorlax.hit) ctx.fillStyle = faceColor;
        else ctx.fillStyle = "rgb(186, 7, 16)";

        ctx.beginPath();
        circle(ctx, snorlaxX, snorlaxY, snorlaxR);
        ctx.fill();

        // Eyes
        ctx.fillStyle = eyeColor;
        ctx.fillRect(snorlaxX - 30, snorlaxY - 20, 20, 5);
        ctx.fillRect(snorlaxX + 10, snorlaxY - 20, 20, 5);

        // Mouth
        ctx.fillStyle = mouthColor;
        if (mouthOpen) {
            // Coord of mouth
            ctx.fillRect(snorlaxX - 15, snorlaxY + 10, 30, 20);
        } else {
            ctx.fillRect(snorlaxX - 15, snorlaxY + 10, 30, 5);
        }

        // Ears
        ctx.fillStyle = earColor;
        ctx.beginPath();
        ctx.moveTo(snorlaxX - 43, snorlaxY - 25);
        ctx.lineTo(snorlaxX - 38, snorlaxY - 25 - 40);
        ctx.lineTo(snorlaxX, snorlaxY - snorlaxR);
        ctx.arc(snorlaxX, snorlaxY, 50, - Math.PI / 2, 3.665, true);
        ctx.fill();

        ctx.fillStyle = earColor;
        ctx.beginPath();
        ctx.moveTo(snorlaxX + 43, snorlaxY - 25);
        ctx.lineTo(snorlaxX + 38, snorlaxY - 25 - 40);
        ctx.lineTo(snorlaxX, snorlaxY - snorlaxR);
        ctx.arc(snorlaxX, snorlaxY, 50, - Math.PI / 2, - 0.52, false);
        ctx.fill();

        // Zzzzs
        ctx.fillStyle = textColor;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        if (!mouthOpen) {
            if (zState === 0) {
                ctx.fillText("Z", snorlaxX + 45, snorlaxY - 55);
            } else {
                ctx.fillText("Z", snorlaxX + 53, snorlaxY - 60);
            }
        }

        // Face surrounding.
        ctx.fillStyle = earColor;

        ctx.beginPath();
        ctx.moveTo(snorlaxX + 25, snorlaxY + 43);
        ctx.arc(snorlaxX, snorlaxY, 45, 0.8, - 1.05, true);
        ctx.lineTo(snorlaxX, snorlaxY - 30);
        ctx.lineTo(snorlaxX - 22, snorlaxY - 38);
        ctx.arc(snorlaxX, snorlaxY, 45, 4.19, 2.09, true);
        ctx.lineTo(snorlaxX - 16, snorlaxY + 47);
        ctx.arc(snorlaxX, snorlaxY, 50, 2.09, 1.05, false);
        ctx.fill();

        // Teeth
        ctx.fillStyle = teethColor;
        ctx.beginPath();
        ctx.moveTo(snorlaxX - 15, snorlaxY + 10);
        ctx.lineTo(snorlaxX - 12, snorlaxY + 14);
        ctx.lineTo(snorlaxX - 9, snorlaxY + 10);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(snorlaxX + 15, snorlaxY + 10);
        ctx.lineTo(snorlaxX + 12, snorlaxY + 14);
        ctx.lineTo(snorlaxX + 9, snorlaxY + 10);
        ctx.fill();
    }

    function drawHud() {
        var snorlaxHealth = (allState.snorlax.health <= 100) ? allState.snorlax.health : 100;
        var snorlaxSleep = (allState.snorlax.awakeMeter <= 100) ? allState.snorlax.awakeMeter : 100;
        var snorlaxLevel = allState.gameState.level;
        var snorlaxPoints = allState.gameState.score;
        var healthX = 100;
        var healthY = 700;
        var sleepX = 100;
        var sleepY = 750;
        ctx.fillStyle = "red";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.fillRect(healthX, healthY, snorlaxHealth * 8, 40);
        ctx.strokeRect(healthX, healthY, 800, 40);
        ctx.fillStyle = "teal";
        ctx.fillRect(sleepX, sleepY, snorlaxSleep * 8, 40);
        ctx.strokeRect(sleepX, sleepY, 800, 40);
        ctx.fillStyle = "black";
        ctx.font = "25px Arial";
        ctx.textAlign = "center";
        ctx.fillText("LEVEL", 50, 725);
        ctx.fillText(snorlaxLevel, 50, 770);
        ctx.fillText("POINTS", 950, 725);
        ctx.fillText(snorlaxPoints, 950, 770);
        ctx.fillText("HP", 500, 725);
        ctx.fillText("PP", 500, 775);
    }

    function gameStateLevel() {
        if (allState.ballState.top.arr.length == 0 && allState.ballState.bottom.arr.length == 0 && allState.ballState.right.arr.length == 0 && allState.ballState.left.arr.length == 0) {
            allState.gameState.level++;
            console.log(allState.gameState.level);
            return true;
        } else {
            return false;
        }
    }

    function drawGrass(x, y) {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 25, y);
        ctx.arc(x - 25 - 45, y, 45, 0, - 0.8, true);
        ctx.lineTo(x - 10, y - 15);
        ctx.lineTo(x, y - 40);
        ctx.lineTo(x + 10, y - 15);
        ctx.arc(x + 25 + 45, y, 45, Math.PI + 0.8, Math.PI, true);
        ctx.fill();
    }

    function drawFlower(x, y, color) {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(x, y, 5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + 10, y, 5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - 10, y, 5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y + 10, 5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y - 10, 5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 7, y - 7, 5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - 7, y - 7, 5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.arc(x + 7, y + 7, 5, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - 7, y + 7, 5, 0, 2 * Math.PI, true);
        ctx.fill();

        ctx.strokeStyle = "green";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(x, y + 15);
        ctx.lineTo(x, y + 25);
        ctx.lineTo(x + 2, y + 26);
        ctx.lineTo(x - 2, y + 26);
        ctx.closePath();
        ctx.stroke();
    }

    function drawBackground() {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrass(50, 50);
        drawGrass(556, 600);
        drawGrass(311, 411);
        drawGrass(637, 200);
        drawGrass(392, 650);
        drawGrass(150, 300);
        drawGrass(150, 620);
        drawGrass(400, 110);
        drawGrass(500, 320);
        drawGrass(800, 90);
        drawGrass(750, 430);
        drawGrass(850, 570);
        drawFlower(110, 120, "red");
        drawFlower(410, 150, "purple");
        drawFlower(240, 560, "gold");
        drawFlower(710, 320, "blue");
        drawFlower(850, 480, "pink");
    }

    var balls = function (state) {
        for (i in state.arr) {
            state.arr[i].Create();
            switch (state.side) {
            case 'top':
                state.arr[i].y += state.arr[i].dy;
                if (allState.gameState.level == 3 || allState.gameState.level == 4) {
                    state.arr[i].x += state.arr[i].dx;
                }
                break;
            case 'bottom':
                state.arr[i].y -= state.arr[i].dy;
                if (allState.gameState.level == 3 || allState.gameState.level == 4) {
                    state.arr[i].x -= state.arr[i].dx;
                }
                break;
            case 'right':
                state.arr[i].x -= state.arr[i].dx;
                if (allState.gameState.level == 3 || allState.gameState.level == 4) {
                    state.arr[i].y -= state.arr[i].dy;
                }
                break;
            case 'left':
                state.arr[i].x += state.arr[i].dx;
                if (allState.gameState.level == 3 || allState.gameState.level == 4) {
                    state.arr[i].y += state.arr[i].dy;
                }
                break;
            }
            // Boundary checking
            state.arr[i].Bounce();
            if (state.arr[i].Collide()) {
                if (i === 0) state.arr.splice(0, 1);
                else state.arr.splice(i, 1);
                setTimeout(function () {
                    allState.snorlax.hit = false;
                }, 1000);
            };
        }
    };

    function drawBalls(s1, s2, s3, s4, func) {
        func(s1);
        func(s2);
        func(s3);
        func(s4);
    }

    function initSleepToggler() {
        allState.snorlax.sleepToggler = setInterval(function () {
            allState.snorlax.zState = (allState.snorlax.zState + 1) % 2;
        }, 500);
    }

    function initAwakeMeter() {
        allState.snorlax.awakeMeterInterval = setInterval(function () {
            if (allState.snorlax.mouthOpen) {
                allState.snorlax.awakeMeterDelta = gameSettings.awakeMeterDrainDelta;
            } else {
                allState.snorlax.awakeMeterDelta = gameSettings.awakeMeterRechargeDelta;
            }

            allState.snorlax.awakeMeter += allState.snorlax.awakeMeterDelta;
            if (allState.snorlax.awakeMeter <= 0) {
                allState.snorlax.awakeMeter = 0;
                allState.snorlax.mouthOpen = false;
            } else if (allState.snorlax.awakeMeter >= 100) {
                allState.snorlax.awakeMeter = 100;
            }
        }, 10);
    }

    // Create balls of Specific Color, Size and speeds
    // dx and dy are speed
    // x and y are center of pokeball
    function Ball(x, y, radius, dx, dy, side, created) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.side = side;
        this.created = created
    }

    // Creates a Pokeball
    Ball.prototype.Create = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "red";
        this.ctx.lineWidth = "2"
        this.ctx.arc(this.x, this.y, this.radius, 0, 3 * Math.PI, true);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.lineWidth = "2"
        this.ctx.arc(this.x, this.y, this.radius, Math.PI, 0, true);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x - this.radius, this.y);
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x + this.radius, this.y);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.lineWidth = "2"
        this.ctx.arc(this.x, this.y, this.radius / 6.25, 0, Math.PI * 4, true);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    function GreatBall(x, y, radius, dx, dy, side, created) {
        Ball.call(this, x, y, radius, dx, dy, side, created);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    GreatBall.prototype = new Ball();
    GreatBall.prototype.constructor = GreatBall;

    GreatBall.prototype.Create = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "blue";
        this.ctx.lineWidth = "2"
        this.ctx.arc(this.x, this.y, this.radius, 0, 3 * Math.PI, true);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.lineWidth = "2"
        this.ctx.arc(this.x, this.y, this.radius, Math.PI, 0, true);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x - this.radius, this.y);
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.x + this.radius, this.y);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        this.ctx.lineWidth = "2"
        this.ctx.arc(this.x, this.y, this.radius / 6.25, 0, Math.PI * 4, true);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }


    function generateBalls() {
        var w = 0;
        var h = 0;
        var random_x = Math.floor(Math.random() * 5) + 1;
        var random_y = Math.floor(Math.random() * 5) + 1;
        if (allState.gameState.level == 1 || allState.gameState.level == 2) {
            random_x = 3;
            random_y = 3;
        }

        while (w < 800) {
            w += allState.ballState.radius + 150;

            switch (allState.gameState.level) {
            case 1:
                allState.ballState.top.arr.push(new Ball(w, - 11, 10, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, "top", false));
                break;
            case 2:
                allState.ballState.top.arr.push(new Ball(w, - 11, 10, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, "top", false));
                break;
            case 3:
                allState.ballState.top.arr.push(new Ball(w, - 11, 10, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, "top", false));
                break;
            case 4:
                allState.ballState.top.arr.push(new Ball(w, - 11, 10, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, "top", false));
                break;
            }

        }

        while (h < 600) {
            h += allState.ballState.radius + 150;
            switch (allState.gameState.level) {
            case 1:
                break;
            case 2:
                allState.ballState.right.arr.push(new GreatBall(canvas.width + 11, h, 10, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, "right", false));
                break;
            case 3:
                break;
            case 4:
                allState.ballState.right.arr.push(new GreatBall(canvas.width + 11, h, 10, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, "right", false));
                allState.ballState.left.arr.push(new GreatBall(-11, h + 100, 10, Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1, "left", false));
                break;
            }
        }
    }

    Ball.prototype.Bounce = function () {
        if (this.side == "top") {
            if (this.y >= (canvas.height)) {
                this.dy *= -1
                this.created = true;
            }

            if (this.x >= (canvas.width)) {
                this.dx *= -1
                this.created = true;
            }

            if (this.y <= this.radius && this.created) {
                this.dy *= -1;
            }

            if (this.x <= this.radius) {
                this.dx *= -1
            }
        } else if (this.side == "bottom") {
            if (this.y <= this.radius) {
                this.dy *= -1;
                this.created = true;
            }
            if (this.x >= (canvas.width)) {
                this.dx *= -1
                this.created = true;
            }
            if (this.y >= (canvas.height) && this.created) {
                this.dy *= -1;
            }
            if (this.x <= this.radius) {
                this.dx *= -1
            }
        } else if (this.side == "right") {
            if (this.x <= this.radius) {
                this.dx *= -1;
                this.created = true;
            }
            if (this.y >= canvas.height) {
                this.dy *= -1;
            }
            if (this.x >= (canvas.width) && this.created) {
                this.dx *= -1;
            }
            if (this.y <= this.radius) {
                this.dy *= -1
            }
        } else {
            if (this.x >= canvas.width) {
                this.dx *= -1;
                this.created = true;
            }
            if (this.y >= canvas.height) {
                this.dy *= -1;
            }
            if (this.x <= (this.radius) && this.created) {
                this.dx *= -1;
            }
            if (this.y <= this.radius) {
                this.dy *= -1
            }
        }
    }

    Ball.prototype.Collide = function () {
        var dis = Math.sqrt(Math.pow((this.x - allState.snorlax.x), 2) + Math.pow((this.y - allState.snorlax.y), 2));
        var rad = this.radius + allState.snorlax.radius;

        mouthP = [{
            "x": allState.snorlax.x - 15,
            "y": allState.snorlax.y + 10
        }, {
            "x": allState.snorlax.x - 15,
            "y": allState.snorlax.y + 30
        }, {
            "x": allState.snorlax.x + 15,
            "y": allState.snorlax.y + 30
        }, {
            "x": allState.snorlax.x + 15,
            "y": allState.snorlax.y + 10
        }, ];

        this.rotatePoint = function (pi) {
            return {
                "x": Math.cos(allState.snorlax.rotation) * (pi.x - allState.snorlax.x) - Math.sin(allState.snorlax.rotation) * (pi.y - allState.snorlax.y) + allState.snorlax.x,
                "y": Math.sin(allState.snorlax.rotation) * (pi.x - allState.snorlax.x) + Math.cos(allState.snorlax.rotation) * (pi.y - allState.snorlax.y) + allState.snorlax.y
            };
        };
        // Rotation of point (px, py) around point (ox, oy).
        // p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
        // p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy
        mouthPTrans = mouthP.map(this.rotatePoint);

        // Determinant of [(x0, y0, 1), 
        //                 (x1, y1, 1), 
        //                 (x2, y2, 1)]
        // = (.5)(x1*y2 - y1*x2 -x0*y2 + y0*x2 + x0*y1 - y0*x1)
        // Used by Ball.Collide
        function det(p0, p1, p2) {
            return (.5) * (p1.x * p2.y - p1.y * p2.x - p0.x * p2.y + p0.y * p2.x + p0.x * p1.y - p0.y * p1.x);
        }

        function getSign(i) {
            return i < 0 ? -1 : 1;
        }

        // p1, p2, p
        p = {
            "x": this.x,
            "y": this.y
        };
        detSigns = [
        getSign(det(mouthPTrans[0], mouthPTrans[1], p)),
        getSign(det(mouthPTrans[1], mouthPTrans[2], p)),
        getSign(det(mouthPTrans[2], mouthPTrans[3], p)),
        getSign(det(mouthPTrans[3], mouthPTrans[0], p)), ];

        if (allState.snorlax.mouthOpen) {
            if (detSigns[0] === detSigns[1] && detSigns[1] === detSigns[2] && detSigns[2] === detSigns[3]) {
                allState.gameState.score += gameSettings.pointsPerPokeballEaten;
                return true;
            }
        } else {
            if (dis <= rad) {
                allState.snorlax.health -= gameSettings.damagePerPokeballHit;
                if (allState.snorlax.health < 0) {
                    allState.snorlax.health = 0;
                }
                allState.snorlax.hit = true;
                return true;
            }
        }
    }

    function drawPaused() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, 1000, 800);
        ctx.fillStyle = "orange";
        ctx.fillText("Hit P to resume.", 500, 500);
    }

    function checkLose() {
        if (!allState.gameState.ended && allState.snorlax.health <= 0) {
            allState.gameState.ended = 1;
        }
    }

    function drawLose() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, 1000, 800);
        ctx.fillStyle = "orange";
        ctx.fillText("Game Over!", 500, 300);
        ctx.fillText("You've been caught!", 500, 350);
        ctx.fillText("Hit R to restart", 500, 450);
    }

    function checkWin() {
        if (allState.gameState.level == 4 && allState.ballState.top.arr.length == 0 && allState.ballState.bottom.arr.length == 0 && allState.ballState.right.arr.length == 0 && allState.ballState.left.arr.length == 0) {
            allState.gameState.ended = 2;
        }
    }

    function drawWin() {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, 1000, 800);
        ctx.fillStyle = "orange";
        ctx.fillText("You won, you've eaten all the Pokeballs!", 500, 300);
        ctx.fillText("SCORE", 500, 350);
        ctx.fillText(allState.gameState.score, 500, 400);
        ctx.fillText("Hit R to restart", 500, 500);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function redraw() {
        clearCanvas();
        drawBackground();
        switch (allState.gameState.ended) {
        case 0:
            if (!allState.gameState.paused) {
                drawHud();
                drawSnorlax();
                if (gameStateLevel()) {
                    generateBalls();
                }
                drawBalls(allState.ballState.top, allState.ballState.left, allState.ballState.right, allState.ballState.bottom, balls);
                checkLose();
                checkWin();
            } else {
                drawPaused();
            }
            break;
        case 1:
            // lose
            drawLose();
            break;
        case 2:
            // win
            drawWin();
            break;
        }
    }

    // Keep this and removeEventListeners() in sync.
    function addEventListeners() {
        canvas.addEventListener('keydown', onKeyDown, false);
        canvas.addEventListener('keyup', onKeyUp, false);
        canvas.addEventListener('mousemove', onMouseMove, false);
        canvas.addEventListener('mousedown', onMouseDown, false);
        canvas.addEventListener('mouseup', onMouseUp, false);
    }

    function removeEventListeners() {
        canvas.removeEventListener('keydown', onKeyDown);
        canvas.removeEventListener('keyup', onKeyUp);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mouseup', onMouseUp);
    }

    function playGame() {
        initSleepToggler();
        initAwakeMeter();
        generateBalls(); // Create an array to store the balls info

        redraw(); // Initial draw
        allState.gameState.stInt = setInterval(redraw, 20); // Redraw loop.

        // Give focus to capture key inputs.
        canvas.setAttribute('tabindex', '0');
        canvas.focus();
    }

    function displayControls() {
        clearCanvas();
        drawBackground();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 100px sans-serif";
        ctx.fillStyle = "indigo";
        ctx.fillText("Snorlax Munch", 500, 100);
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, 1000, 800);
        ctx.fillStyle = "white";
        ctx.fillText("Use WASD to Move, and the mouse to rotate.", 500, 300);
        ctx.fillText("Click to open Snorlax's Mouth.", 500, 350);
        ctx.fillText("P to pause the game", 500, 400);
        ctx.fillText("Eat as many pokeballs as you can.", 500, 450);
        ctx.fillText("But be careful, if you get hit anywhere but your mouth, you lose health.", 500, 500);
        ctx.fillText("Now go show that trainer who is the boss.", 500, 550);
        ctx.fillStyle = "orange";
        ctx.fillText("Hit Esc to go back to the Menu.", 500, 600);
    }

    function displayQuit() {
        clearCanvas();
        drawBackground();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 40px sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, 1000, 800);
        ctx.fillStyle = "white";
        ctx.fillText("Without your help, Snorlax was captured.", 500, 300);
        ctx.fillText("Hope you're happy.", 500, 500);
    }

    function drawMenu() {
        clearCanvas();
        drawBackground();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 100px sans-serif";
        ctx.fillStyle = "indigo";
        ctx.fillText("Snorlax Munch", 500, 100);
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText("Use UP/DOWN to Navigate and Enter to Pick.", 500, 220);
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "black";
        ctx.fillRect(390, 265, 220, 60);
        ctx.fillStyle = "lightgrey";
        ctx.fillText("Play!", 500, 300);

        ctx.fillStyle = "black";
        ctx.fillRect(390, 365, 220, 60);
        ctx.fillStyle = "lightgrey";
        ctx.fillText("Controls", 500, 400);

        ctx.fillStyle = "black";
        ctx.fillRect(390, 465, 220, 60);
        ctx.fillStyle = "lightgrey";
        ctx.fillText("Quit", 500, 500);

        ctx.strokeStyle = "orange";
        ctx.strokeRect(392, 268 + (100 * allState.menuState.choice), 215, 55);
    }

    this.introMenu = function () {
        addEventListeners();
        drawMenu();
        allState.menuState.menuId = setInterval(drawMenu, 20);
        canvas.setAttribute('tabindex', '0');
        canvas.focus();
    }
}

var snorlaxGame = new SnorlaxMunch();
snorlaxGame.introMenu();