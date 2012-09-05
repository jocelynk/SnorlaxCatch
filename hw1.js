/**
 * Global variables
 */
var canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext('2d');

var gameSettings = {
    pointsPerPokeballEaten: 10,
    damagePerPokeballHit: 25,
    maxHealth: 100,
    maxAwakeMeter: 100,
    awakeMeterRechargeDelta: 1,
    awakeMeterDrainDelta: -1,
    snorlaxMoveSpeed: 5, // must be positive
}
    
/**
 * Global objects
 */
var ballState = {
    radius: 10, // Radius of pokeball
    // Arrays for pokeballs
    top: [],
    right: [],
    left: [],
    bottom: [],
}
    
var gameState = {
    score: 0, // Number of pokeballs eaten
    paused: false, // Game paused
    level: 1, // Difficulty level
    stInt: undefined // Redraw timer interval, to be instantiated later.
}

var snorlax = {
    x: canvas.width / 2, // x position of center of snorlax
    y: canvas.height / 2, // y position of center of snorlax
    dx: 0, // x motion of snorlax
    dy: 0, // y motion of snorlax
    rotation: 0, // Radians rotated
    zState: 0, // Where the Z for sleep appears (up/down/etc)
    mouthOpen: false, // Mouth is open for eating pokeballs
    awakeMeter: gameSettings.maxAwakeMeter, // Amount of awake energy for keeping mouth open
    awakeMeterDelta: gameSettings.awakeMeterRechargeDelta, // Amount awake energy changes per tick
    health: gameSettings.maxHealth, // Current HP
    radius: 50, // Radius of snorlax sprite
    hit: false
}

var keyControls = {
    "87": {type: "move", value: "up"}, // w
    "65": {type: "move", value: "left"}, // a
    "83": {type: "move", value: "down"}, // s
    "68": {type: "move", value: "right"}, // d
    "80": {type: "game", value: "pause"}, // p
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
    var x = snorlax.x - x;
    var y = snorlax.y - y;
    rotateSnorlax(Math.atan2(y, x) - Math.PI/2); // Polar angle rotation, offset to have cursor on opposite side of mouth
}

function onMouseDown(event) {
    snorlax.mouthOpen = true;
}

function onMouseUp(event) {
    snorlax.mouthOpen = false;
}

/**
 * Event handler helpers
 */
function handleKeyDown(input) {
    if(input === undefined) {
        return;
    }
    switch(input.type) {
        case "move":
            moveSnorlax(input.value);
            break;
        case "game":
            handleGameInput(input.value);
            break;
    }

}

function handleKeyUp(input) {
    if(input === undefined || input.type !== "move") {
        return;
    }
    stopMoveSnorlax(input.value);
}

function handleGameInput(input) {
    switch(input) {
        case "pause":
            gameState.paused = !gameState.paused;
            break;
    }
}

/**
 * Snorlax helpers
 */
function moveSnorlax(direction) {
    if(gameState.paused) {
        return;
    }
    
    switch(direction) {
        case "up":
            snorlax.dy = -1 * gameSettings.snorlaxMoveSpeed;
            break;
        case "down":
            snorlax.dy = gameSettings.snorlaxMoveSpeed;
            break;
        case "left":
            snorlax.dx = -1 * gameSettings.snorlaxMoveSpeed;
            break;
        case "right":
            snorlax.dx = gameSettings.snorlaxMoveSpeed;
            break;
    }
}

function stopMoveSnorlax(direction) {
    if(gameState.paused) {
        return;
    }
    
    switch(direction) {
        case "up":
            snorlax.dy = 0;
            break;
        case "down":
            snorlax.dy = 0;
            break;
        case "left":
            snorlax.dx = 0;
            break;
        case "right":
            snorlax.dx = 0;
            break;
    }
}

function rotateSnorlax(angle) {
    snorlax.rotation = angle;    
}

function updateSnorlaxPosition() {
    snorlax.x += snorlax.dx;
    snorlax.y += snorlax.dy;
}

function drawSnorlax(snorlax) {
    ctx.save();
    updateSnorlaxPosition();
    ctx.translate(snorlax.x, snorlax.y);
    ctx.rotate(snorlax.rotation);
    drawSnorlaxSprite();
    ctx.restore();
}

/**
 * Drawing functions
 */
//snorlax X  and Y - center of the circle
function drawSnorlaxSprite(){
    //Center coordinate for face (center at origin for drawing purposes).
    //Actual position is in snorlax.x and snorlax.y.
    var snorlaxX = 0;
    var snorlaxY = 0;
    var snorlaxR = snorlax.radius;
    var mouthOpen = snorlax.mouthOpen;
    var zState = snorlax.zState;
    // Colors for face and stuff
    var faceColor = "rgb(178, 173, 131)";
    var eyeColor = "black";
    var earColor = "rgb(46,82,79)";
    var textColor = "black";
    var teethColor = "white";
    var mouthColor = ((mouthOpen === true) ? "rgb(251, 113, 83)":"black");
    //face for snorlax
    function circle(ctx, cx, cy, radius) {
        ctx.arc(cx, cy, radius, 0, 2*Math.PI, true);
    }
    
    if(!snorlax.hit)
        ctx.fillStyle = faceColor;    
    else
        ctx.fillStyle = "rgb(186, 7, 16)";
    
    ctx.beginPath();
    circle(ctx, snorlaxX, snorlaxY, snorlaxR);
    ctx.fill();
 
    //eyes
    ctx.fillStyle = eyeColor;
    ctx.fillRect(snorlaxX - 30, snorlaxY - 20, 20, 5);
    ctx.fillRect(snorlaxX + 10, snorlaxY - 20, 20, 5);
 
    //mouth
    ctx.fillStyle = mouthColor;
    if(mouthOpen)
    {
    //coord of mouth
        ctx.fillRect(snorlaxX - 15, snorlaxY + 10, 30, 20);
    }
    else
    {
        ctx.fillRect(snorlaxX - 15, snorlaxY + 10, 30, 5);
    }
    //ears
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.moveTo(snorlaxX - 43, snorlaxY - 25);
    ctx.lineTo(snorlaxX - 38, snorlaxY - 25 - 40);
    ctx.lineTo(snorlaxX,      snorlaxY - snorlaxR);
    ctx.arc(snorlaxX, snorlaxY, 50, -Math.PI/2, 3.665, true);
    ctx.fill();
 
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.moveTo(snorlaxX + 43, snorlaxY - 25);
    ctx.lineTo(snorlaxX + 38, snorlaxY - 25 - 40);
    ctx.lineTo(snorlaxX,      snorlaxY - snorlaxR);
    ctx.arc(snorlaxX, snorlaxY, 50, -Math.PI/2, -0.52, false);
    ctx.fill();
 
    //zzzzs
    ctx.fillStyle = textColor;
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    if(!mouthOpen)
    {
        if(zState === 0)
        {
        ctx.fillText("Z", snorlaxX + 45, snorlaxY - 55);
        }
        else
        {
        ctx.fillText("Z", snorlaxX + 53, snorlaxY - 60);
        }
    }
 
    //Face surrounding.
    ctx.fillStyle = earColor;
            
    ctx.beginPath();
    ctx.moveTo(snorlaxX + 25, snorlaxY + 43);
    ctx.arc(snorlaxX , snorlaxY , 45, 0.8, -1.05, true);
    ctx.lineTo(snorlaxX, snorlaxY - 30);
    ctx.lineTo(snorlaxX - 22, snorlaxY - 38);
    ctx.arc(snorlaxX , snorlaxY , 45, 4.19, 2.09, true);
    ctx.lineTo(snorlaxX - 16, snorlaxY + 47);
    ctx.arc(snorlaxX , snorlaxY , 50, 2.09, 1.05, false);
    ctx.fill();
 
    //Teeth
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
    var snorlaxHealth = (snorlax.health <= 100) ? snorlax.health : 100;
    var snorlaxSleep = (snorlax.awakeMeter <= 100) ? snorlax.awakeMeter : 100;
    var snorlaxLevel = gameState.level;
    var snorlaxPoints = gameState.score;
    var healthX = 100;
    var healthY = 700;
    var sleepX = 100;
    var sleepY = 750;
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillRect(healthX, healthY, snorlaxHealth * 8, 40);
    ctx.strokeRect(healthX, healthY, 800, 40);
    ctx.fillStyle = "lightblue";
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
    //later check if snorlax is alive
    //console.log(ballState.top.length);
    if (ballState.top.length == 0 && ballState.bottom.length == 0 && ballState.right.length == 0 && ballState.left.length == 0) {
        gameState.level++;
        console.log(gameState.level);
        return true;
    } else {
        return false;
    }
}
    
function drawGrass(x, y) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x-25, y);
    ctx.arc(x-25-45, y , 45, 0, -0.8, true);
    ctx.lineTo(x-10, y-15);
    ctx.lineTo(x, y-40);
    ctx.lineTo(x+10, y-15);
    ctx.arc(x+25+45, y , 45, Math.PI+0.8, Math.PI, true);
    ctx.fill();
}

function drawFlower(x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(x, y, 5, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x+10, y, 5, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x-10, y, 5, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y+10, 5, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y-10, 5, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x+7, y-7, 5, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x-7, y-7, 5, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.arc(x+7, y+7, 5, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x-7, y+7, 5, 0, 2*Math.PI, true);
    ctx.fill();

    ctx.strokeStyle = "green";
    ctx.lineWidth=6;
    ctx.beginPath();
    ctx.moveTo(x, y+15);
    ctx.lineTo(x,y+25);
    ctx.lineTo(x+2, y+26);
    ctx.lineTo(x-2, y+26);
    ctx.closePath();
    ctx.stroke();
}


function drawBackground() {
    ctx.fillStyle= "lightgreen";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    drawGrass(50,50);
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

//splice after hit wall, add new ball
//put in separate function, if gets to end of canvas, splice ball from array, randomly add new ones
function drawBalls(){
    for (i in ballState.top) {
        ballState.top[i].Create();
        ballState.top[i].y += ballState.top[i].dy;
        if(gameState.level != 1) {
            ballState.top[i].x += ballState.top[i].dx;
        }
        // Boundary checking
        ballState.top[i].Bounce();
        if(ballState.top[i].Collide()) {
            if(i === 0)
                ballState.top.splice(0,1);
            else 
                ballState.top.splice(i,1);
            console.log(ballState.top.length);
                setTimeout(function() {snorlax.hit = false;}, 1000);
        };

    }
    for (i in ballState.right) {
        ballState.right[i].Create();
        ballState.right[i].x -= ballState.right[i].dx;
        if(gameState.level != 1) {
            ballState.right[i].y += ballState.right[i].dy;
        }
        //Boundary checking
        ballState.right[i].Bounce();
        if(ballState.right[i].Collide()) {
            if(i === 0)
                ballState.right.splice(0,1);
            else 
                ballState.right.splice(i,1);
                setTimeout(function() {snorlax.hit = false;}, 1000);
        };

    }
    for (i in ballState.left) {
        ballState.left[i].Create();
        ballState.left[i].x += ballState.left[i].dx;
        if(gameState.level != 1) {
            ballState.left[i].y += ballState.left[i].dy;
        }
        // Boundary checking
        ballState.left[i].Bounce();
       if(ballState.left[i].Collide()) {
            if(i === 0)
                ballState.left.splice(0,1);
            else 
                ballState.left.splice(i,1);
                setTimeout(function() {snorlax.hit = false;}, 1000);
        };

    }
    for (i in ballState.bottom) {
        ballState.bottom[i].Create();
        ballState.bottom[i].y -= ballState.bottom[i].dy;
        if(gameState.level != 1) {
            ballState.bottom[i].x += ballState.bottom[i].dx;
        }
        //Boundary checking
        ballState.bottom[i].Bounce();
        if(ballState.bottom[i].Collide()) {
            if(i === 0)
                ballState.bottom.splice(0,1);
            else 
                ballState.bottom.splice(i,1);
                setTimeout(function() {snorlax.hit = false;}, 1000);
        };
    }
}

function initSleepToggler() {
    setInterval(function() {
        snorlax.zState = (snorlax.zState + 1) % 2;
    }, 500);
}

function initAwakeMeter() {
    snorlax.awakeMeterInterval = setInterval(function() {
        if(snorlax.mouthOpen) {
            snorlax.awakeMeterDelta = gameSettings.awakeMeterDrainDelta;
        }
        else {
            snorlax.awakeMeterDelta = gameSettings.awakeMeterRechargeDelta;
        }

        snorlax.awakeMeter += snorlax.awakeMeterDelta;
        if(snorlax.awakeMeter <= 0) {
            snorlax.awakeMeter = 0;
            snorlax.mouthOpen = false;
        }
        else if(snorlax.awakeMeter >= 100) {
            snorlax.awakeMeter = 100;
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

//creates a Pokeball
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
    this.ctx.fillStyle="white";
    this.ctx.lineWidth="2"
    this.ctx.arc(this.x,this.y,this.radius/6.25,0,Math.PI*4,true);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
}


function generateBalls() {
    var w = 0;
    var h = 0;
    var random_x = Math.floor(Math.random() * 5) + 1;
    var random_y = Math.floor(Math.random() * 5) + 1;
    if(gameState.level == 1) {
         random_x = 3;
         random_y = 3;
    }
    
    while(w<800) {
        w += ballState.radius + 150;
        ballState.top.push(new Ball(w, -11, 10, random_x, random_y, "top", false));
        ballState.bottom.push(new Ball(w + 100, canvas.height + 11, 10, random_x, random_y, "bottom", false));
    }

    while(h<600) {
        h += ballState.radius + 150;
        ballState.right.push(new Ball(canvas.width+11,h,10,3,3,"right",false));
        ballState.left.push(new Ball(-11,h+100,10,3,3,"left",false));
    }
    
    //ballState.top.push(new Ball(canvas.width/2,-11,10,3,3));
    //ballState.right.push(new Ball(canvas.width+11,canvas.height/2,10,3,3));
    //ballState.left.push(new Ball(-11,canvas.height/2,10,3,3));
    //ballState.bottom.push(new Ball(canvas.width/2,canvas.height+11,10,3,3));
}

Ball.prototype.Bounce = function () {
    if(this.side == "top") {
        if(this.y >= (canvas.height)) {
            this.dy *= -1
            this.created = true;
        }
        
        if(this.x >= (canvas.width)) {
            this.dx *= -1
            this.created = true;
        }

        if(this.y <= this.radius && this.created) { 
            this.dy *= -1;
        }
        
        if(this.x <= this.radius) {
            this.dx *= -1
        }
    } else if(this.side == "bottom") {
        if(this.y <= this.radius) {
            this.dy *= -1;
            this.created = true;
        }
        if(this.x >= (canvas.width)) {
            this.dx *= -1
            this.created = true;
        }
        if(this.y >= (canvas.height) && this.created) {
            this.dy *= -1;
        }
        if(this.x <= this.radius) {
            this.dx *= -1
        }
    } else if(this.side == "right") {
        if(this.x <= this.radius) {
            this.dx *= -1;
            this.created = true;
        }
        if(this.y >= canvas.height) {
            this.dy *= -1;
        }
        if(this.x >= (canvas.width) && this.created) {
            this.dx *= -1;
        }
        if(this.y <= this.radius) {
            this.dy *= -1
        }
    } else {
        if(this.x >= canvas.width) {
            this.dx *= -1;
            this.created = true;
        }
        if(this.y >= canvas.height) {
            this.dy *= -1;
        }
        if(this.x <= (this.radius) && this.created) {
            this.dx *= -1;
        }
        if(this.y <= this.radius) {
            this.dy *= -1
        }
    }
}



Ball.prototype.Collide = function () {
    // TODO(jocelyn): Make sure the mouth detection happens before and overrides the body detection.
    var dis = Math.sqrt(Math.pow((this.x - snorlax.x), 2) + Math.pow((this.y - snorlax.y), 2));
    var rad = this.radius + snorlax.radius;
    
    mouthP = [
        {"x": snorlax.x - 15, "y": snorlax.y + 10},
        {"x": snorlax.x - 15, "y": snorlax.y + 30},
        {"x": snorlax.x + 15, "y": snorlax.y + 30},
        {"x": snorlax.x + 15, "y": snorlax.y + 10},
    ];
    
    this.rotatePoint = function(pi) {
        return {"x": Math.cos(snorlax.rotation) * (pi.x - snorlax.x) - Math.sin(snorlax.rotation) * (pi.y - snorlax.y) + snorlax.x, 
                "y": Math.sin(snorlax.rotation) * (pi.x - snorlax.x) + Math.cos(snorlax.rotation) * (pi.y - snorlax.y) + snorlax.y};
    };
    // Rotation of point (px, py) around point (ox, oy).
    //p'x = cos(theta) * (px-ox) - sin(theta) * (py-oy) + ox
    //p'y = sin(theta) * (px-ox) + cos(theta) * (py-oy) + oy
    mouthPTrans = mouthP.map(this.rotatePoint);
    
    // Determinant of [(x0, y0, 1), 
    //                   (x1, y1, 1), 
    //                   (x2, y2, 1)]
    // = (.5)(x1*y2 - y1*x2 -x0*y2 + y0*x2 + x0*y1 - y0*x1)
    // Used by Ball.Collide
    function det(p0, p1, p2) {
        return (.5) * (p1.x * p2.y - p1.y * p2.x - p0.x * p2.y + p0.y * p2.x + p0.x * p1.y - p0.y * p1.x);
    }
    
    function getSign(i) {
        return i < 0 ? -1 : 1;
    }
    
    // p1, p2, p
    p = {"x": this.x, "y": this.y};
    detSigns = [
        getSign(det(mouthPTrans[0], mouthPTrans[1], p)),
        getSign(det(mouthPTrans[1], mouthPTrans[2], p)),
        getSign(det(mouthPTrans[2], mouthPTrans[3], p)),
        getSign(det(mouthPTrans[3], mouthPTrans[0], p)),
    ];
    
    if(snorlax.mouthOpen) {
        if(detSigns[0] === detSigns[1] && detSigns[1] === detSigns[2] && detSigns[2] === detSigns[3]) {
            gameState.score += gameSettings.pointsPerPokeballEaten;
            return true;
        }
    } else {
        if(dis <= rad) {
            snorlax.health -= gameSettings.damagePerPokeballHit;
            if(snorlax.health < 0) {
                snorlax.health = 0;
            }
            snorlax.hit = true;
            return true;
        }
    }
}

//TODO(tanay): Make this better
function checkLose() {
    if(snorlax.health <= 0) {
        gameState.paused = true;
        clearCanvas();
        ctx.fillStyle = "black";
        ctx.font = "25px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over, you've been caught!", 450, 450);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function redraw() {
    if(!gameState.paused) {
        clearCanvas();
        drawBackground();
        drawHud();
        drawSnorlax(snorlax);
        if(gameStateLevel()) {
            console.log("balls generated");
            generateBalls();
        }
        drawBalls();
        checkLose();
    }
}

function addEventListeners() {
    canvas.addEventListener('keydown', onKeyDown, false);
    canvas.addEventListener('keyup', onKeyUp, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
}

function main() {
    addEventListeners();
    initSleepToggler();
    initAwakeMeter();
    generateBalls(); // Create an array to store the balls info
    
    redraw(); // Initial draw
    gameState.stInt = setInterval(redraw, 20);  // Redraw loop.
    
    // Give focus to capture key inputs.
    canvas.setAttribute('tabindex', '0');
    canvas.focus();
}

// Call main method
main();
