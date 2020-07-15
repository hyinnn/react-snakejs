import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import appleImg from './apple.png'


// Global Variables
const SCALE = 30;
const ROWS = 16; 
const COLS = 16;
const QueueSrc = require('./Queue.src')
const FOOD = 'F';
const SNAKE = 'S';
let INTERVAL = 250;

// Directions
const UP = [-1, 0];
const DOWN = [1, 0];
const RIGHT = [0, 1];
const LEFT = [0, -1];


class Snake {
    constructor(color = "black") {
        this.color = color;

        // Body is an array of coordinates [row, col]
        // Tail of the snake is the first element of the array
        // Head of the snake is the last element of the array
        this.body = new QueueSrc.Queue();
        this.direction = [0, 0];

        this.initializeSnake();
    }

    initializeSnake() {
        this.body.enqueue([5, 5]); // Starting position [5,5]
    }

    changeDirection(e) {
        if (e.keyCode === 37 && this.direction !== RIGHT) {
            this.direction = LEFT;
        }
        else if (e.keyCode === 38 && this.direction !== DOWN) {
            this.direction = UP;
        }
        else if (e.keyCode === 39 && this.direction !== LEFT) {
            this.direction = RIGHT;
        }
        else if (e.keyCode === 40 && this.direction !== UP) {
            this.direction = DOWN;
        }
    }


    // Update the body of the snake by removing the tail and adding it to head
    nextMove(board) {
        const head = this.body.peekLast();
        const tail = this.body.peekFirst();
        const next = [head[0] + this.direction[0], head[1] + this.direction[1]];

        return [tail, next];
    }


    hasEatenFood(next, board) {
        return board[next[0]][next[1]] === FOOD;
    }
}


class Square extends React.Component {
    render() {
        let val = this.props.val;

        // If the square is a food
        if (val === FOOD) {
            const imgStyle = {
                height: SCALE - 1, // Minus one so the img doesn't cover the border lines
                width: SCALE - 1,
            }
            val = <img style={imgStyle} src={appleImg} />;
        }

        // Else the square is a snake or a blank
        const backColor = val === SNAKE ? 'black' : 'white';
        const squareStyle = {
            height: SCALE,
            width: SCALE,
            'background-color': backColor,
        };

        return (
            <div style={squareStyle} className='square'>{val}</div>
        );
    }
}

class Board extends React.Component {
    render() {
        // Build the HTML board
        const board = this.props.board;
        let rows = Array(ROWS).fill(null);
        let singleRow = Array(ROWS).fill().map(() => Array(COLS + 1).fill(null));

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                singleRow[i][j] = <Square val={board[i][j]} />
            }
        }

        // CSS styling for a row in the board
        const rowStyle = {
            height: SCALE,
            width: COLS * SCALE,
        }

        for (let i = 0; i < ROWS; i++) {
            rows[i] = <div style={rowStyle} className='row'>{singleRow[i]}</div>
        }

        // CSS styling for the board
        const boardStyle = {
            height: ROWS * SCALE + 1,
            width: COLS * SCALE + 1,
        };

        return (
            <div className='boardContainer'>
                <div style={boardStyle} className='board'>
                    {rows}
                </div>
            </div>
        );
    }
}


class Game extends React.Component {
    // Keep track of game logic and the state of the board
    // Leave the rendering to board and square class
    constructor(props) {
        super(props);
        this.state = {
            snake: new Snake(),
            board: Array(ROWS).fill().map(() => Array(COLS).fill(null)),
            gameIsOver: false,
        };

        // Draw the initial snake on the board
        const head = this.state.snake.body.peekFirst();
        this.state.board[head[0]][head[1]] = SNAKE;

        // Generate food
        this.generateFood();
    }

    // Generate a piece of food on a random position on the board
    generateFood() {
        const board = this.state.board;
        let r = Math.floor(Math.random() * ROWS);
        let c = Math.floor(Math.random() * COLS);

        while (board[r][c] != null) {
            r = Math.floor(Math.random() * ROWS);
            c = Math.floor(Math.random() * COLS);
        }

        board[r][c] = FOOD;
    }

    hasEatenFood(next, board) {
        return board[next[0]][next[1]] === FOOD;
    }

    // Update the position of the snake and food in the board
    updateBoard() {
        const snake = this.state.snake;
        const body = snake.body.getQueue(); // JS Array
        const board = this.state.board; // 2d Array
        
        // Move the snake and update its position on the board
        var [tail, next] = snake.nextMove();
        snake.body.enqueue(next);

        // Check if next move is over
        if (this.isGameOver(next, board)) {
            this.setState({
                gameIsOver: true,
            });
            return;
        }

        // Grow the snake if it ate food
        if (!this.hasEatenFood(next, board)) {
            snake.body.dequeue();
        }
        else {
            this.generateFood();
        }

        // Update the snake on the board
        board[tail[0]][tail[1]] = null;
        board[next[0]][next[1]] = SNAKE;
    }

    changeSnakeDirection(e) {
        this.state.snake.changeDirection(e);
    }

    // Check game is over if snake collided with itself or the walls
    isGameOver(head, board) {
        const snake = this.state.snake;
        const body = snake.body.getQueue();

        if (head[0] < 0 || head[0] >= ROWS) {
            return true;
        }
        if (head[1] < 0 || head[1] >= COLS) {
            return true;
        }

        for (let i = snake.body.getOffset() + 1; i < body.length - 1; i++) {
            if (body[i][0] === head[0] && body[i][1] === head[1]) {
                return true;
            }
        }

        return false;
    }

    toggleSpeed(e) {
        if (INTERVAL === 250) {
            INTERVAL = 50;
        }
        else {
            INTERVAL = 250;
        }
    }

    render() {
        if (this.state.gameIsOver) {
            return (
                <div id='gameid' className='game' tabIndex='0' onKeyDown={(e) => this.changeSnakeDirection(e)}>
                    <div className='gameover'>Sorry, game over! Refresh page to play again</div>
                </div>
            );
        }

        this.updateBoard();
        return (
            <div id='gameid' className='game' tabIndex='0' 
                        onKeyDown={(e) => this.changeSnakeDirection(e)}>
                <Board board={this.state.board}/>
            </div>
        );
    }
}

function renderGame() {
  ReactDOM.render(<Game />, document.getElementById('root'));
  document.getElementById("gameid").focus();
}

//renderGame();
setInterval(renderGame, INTERVAL); 





