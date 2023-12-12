const canvas = document.getElementById('background');
const ctx = canvas.getContext("2d");
// var heightRatio = 1.5;
// const maxCanvasHeight = window.innerHeight * 0.2; // Adjust the multiplier as needed
// canvas.height = Math.min(canvas.width * heightRatio, maxCanvasHeight);

const gravity = 0.2;
let fallingBoxes = [];
let landedBoxes = []
let current;
let accumulatedHeight = 0;
let scrollingSpeed = 1;
class Box{
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;
        this.width = 175;
        this.height = 50;
        //this.isFalling = false;
    }
    
    draw(){
        ctx.fillStyle = "black";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }


    update(){
        this.draw();
        this.position.x += this.velocity.x;
        if (this.position.x <= 0) {
            // Bounce off the left wall
            this.position.x = 0;
            this.velocity.x = Math.abs(this.velocity.x); // Make velocity positive
        } else if (this.position.x + this.width >= canvas.width) {
            // Bounce off the right wall
            this.position.x = canvas.width - this.width;
            this.velocity.x = -Math.abs(this.velocity.x); // Make velocity negative
        }

    }
    /* 
    draws a falling box calculates the velocity + gravity so that it can fall.
    once it reaches bottom of the canvas it stops moving
    */
    fall(){
        this.draw();
        this.position.y += this.velocity.y;

        //if the player drops the first box then the box lands as normal at the bottom of the canvas
        if(landedBoxes.length == 0 && !this.checkCollision()){
            if (this.position.y + this.height >= canvas.height){
                this.velocity.y = 0;
                this.land();
            }
        }
        //if there is 1 box that has landed then the next boxes must stack or game over
        if (this.checkCollision()) {
            this.velocity.y = 0;
            this.land();
        }
        else if (this.position.y + this.height >= canvas.height && !this.checkCollision()) {
            this.velocity.y = 0;
            gameOver()
        } 
        else {
            this.velocity.y += gravity;
        }
    }

    checkCollision() {
        // Check for collisions with landed boxes
        for (const landedBox of landedBoxes) {
            if (
                this.position.x < landedBox.x + landedBox.width &&
                this.position.x + this.width > landedBox.x &&
                this.position.y < landedBox.y + landedBox.height &&
                this.position.y + this.height > landedBox.y
            ) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }
    //push the landed box to the landedBoxes array
    land() {
        landedBoxes.unshift({ x: this.position.x, y: this.position.y, width: this.width, height: this.height });
        // accumulatedHeight += this.height; // Update the accumulated height
        // canvas.style.top = `-${accumulatedHeight}px`;
    }
}
const keys = { 
    space: {
        pressed: false,
        canFall: false
    }
}
const movingBox = new Box({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x:10,
        y:0
    }
})

movingBox.draw();
function updateCanvasSize() {
    canvas.height = Math.min(canvas.width * heightRatio, maxCanvasHeight);
}

let gameOver = () =>{
    console.log("game over")
}
function animate() {
    window.requestAnimationFrame(animate);
    //updateCanvasSize();
    //movingBox.updateSize();
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    movingBox.update()
    for (const fallingBox of fallingBoxes) {
        //fallingBox.updateSize()
        fallingBox.fall();
    }

    if (keys.space.pressed && keys.space.canFall) {
        fallingBoxes.unshift(new Box({
            position: {
                x: movingBox.position.x,
                y: 0
            },
            velocity: {
                x: 0,
                y: 2
            }
        }));
        keys.space.canFall = false;
    }
    accumulatedHeight += scrollingSpeed;
    canvas.style.top = `-${accumulatedHeight}px`;
}
// window.addEventListener("resize", () => {
//     updateCanvasSize();
//     movingBox.updateSize();
//     // Update falling boxes if needed
// });

window.addEventListener('keydown', (event) =>{
    switch (event.code){
        case 'Space':
            keys.space.pressed = true
            //initialPositionX = movingBox.position.x
            keys.space.canFall = true
            event.preventDefault()
            break
    }
})
window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        keys.space.pressed = false;
    }
});

//animate();

// window.addEventListener('keyup', (event) => {
//     switch (event.code) {
//         case 'Space':
//             keys.space.pressed = false;
//             event.preventDefault(); // Prevent default spacebar behavior (e.g., scrolling)
//             break;
//     }
// });