const canv = document.getElementById("my-canvas");
const ctx = canv.getContext("2d");
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const GAME_WIDTH = 200;
const GAME_HEIGHT = 400;
const GAME_OFFSET_TOP = 50;
const GAME_OFFSET_LEFT = 30;
let score = 0;
let level = 1;
let winOrLose = "Playing";

        //canv = document.getElementById("my-canvas");
        //ctx = canv.getContext("2d");
        canv.width = CANVAS_WIDTH;
        canv.height = CANVAS_HEIGHT;
        // draw the border of canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

        // draw the border of game
        ctx.strokeStyle = "black";
        ctx.strokeRect(GAME_OFFSET_LEFT-2,GAME_OFFSET_TOP-2,GAME_WIDTH+3,GAME_HEIGHT+3);

        // draw info of game
        ctx.fillStyle = 'black';
        ctx.font = '21px Arial';
        ctx.fillText("SCORE",300,50);

        // Draw score rectangle
        ctx.strokeRect(300, 57, 161, 24);

        ctx.fillText(score.toString(), 310, 77);
    
    // Draw level label text
    ctx.fillText("LEVEL", 300, 107);

    // Draw level rectangle
    ctx.strokeRect(300, 121, 161, 24);

    // Draw level
    ctx.fillText(level.toString(), 310, 140);

    // Draw next label text
    ctx.fillText("WIN / LOSE", 300, 171);

    // Draw playing condition
    ctx.fillText(winOrLose, 310, 211);

    // Draw playing condition rectangle
    ctx.strokeRect(300, 182, 161, 95);
    
    // Draw controls label text
    ctx.fillText("CONTROLS", 300, 304);

    // Draw controls rectangle
    ctx.strokeRect(300, 316, 161, 144);

    // Draw controls text
    ctx.font = '19px Arial';
    ctx.fillText("A : Move Left", 310, 338);
    ctx.fillText("D : Move Right", 310, 373);
    ctx.fillText("S : Move Down", 310, 408);
    ctx.fillText("E : Rotate Right", 310, 443);


const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = "white"; // color of an empty square

// draw a square
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(GAME_OFFSET_LEFT + x*SQ, GAME_OFFSET_TOP + y*SQ,SQ-1,SQ-1);

    //ctx.strokeStyle = "BLACK";
    //ctx.strokeRect(GAME_OFFSET_LEFT + x*SQ, GAME_OFFSET_TOP + y*SQ,SQ,SQ);
}

// create the board

let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();
// the pieces and their colors

const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

// generate random pieces

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

// The Object Piece

function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    // we need to control the pieces
    this.x = 3;
    this.y = 0;
}

// fill function

Piece.prototype.fill = function(color){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we draw only occupied squares
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color);
            }
        }
    }
}

// draw a piece to the board

Piece.prototype.draw = function(){
    this.fill(this.color);
}

// undraw a piece


Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}

// Can move Down the piece

Piece.prototype.CanmoveDown = function(){
    while(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    
    
}
// move Down the piece

Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
    
}

// move Right the piece
Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move Left the piece
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}



Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
            // we skip the vacant squares
            if( !this.activeTetromino[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 2){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;
        }
    }
    // remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();
    
    // update the score
    //scoreElement.innerHTML = score;
    // Draw score
    //ctx.fillStyle = 'black';
    //ctx.font = '21px Arial';
    ctx.fillStyle = 'white';
        ctx.fillRect(310, 59, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 77);
    
}

// collision fucntion

Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
            // if the square is empty, we skip it
            if(!piece[r][c]){
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            // conditions
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if(newY < 0){
                continue;
            }
            // check if there is a locked piece alrady in place
            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}

// CONTROL the piece

document.addEventListener("keydown",CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.CanmoveDown();
    }
}

// drop the piece every 1sec

let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 500){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();