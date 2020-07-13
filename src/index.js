import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// Global Variables
const SCALE = 30;
const ROWS = 17; 
const COLS = 17;
const QueueSrc = require('./Queue.src')

// Directions
const UP = [-1, 0];
const DOWN = [1, 0];
const RIGHT = [0, 1];
const LEFT = [0, -1];


class Snake {
    constructor(color = "black") {
        this.color = color;

        // Body is an array of coordinates [row, col]
        // Head of the snake is the first element of the array
        // Tail of the snake is the last element of the array
        this.body = new QueueSrc.Queue();
        this.direction = RIGHT;

        this.initializeSnake();
    }

    initializeSnake() {
        this.body.enqueue([5, 5]); // Starting position [5,5]
    }

    // Update the body of the snake by removing the tail and adding it as the tail
    move() {

    }

    growSnake() {

    }
}


class Square extends React.Component {
    render() {
        const val = this.props.val;
        const squareStyle = {
            height: SCALE,
            width: SCALE,
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

        const rowStyle = {
            height: SCALE,
            width: COLS * SCALE,
        }

        for (let i = 0; i < ROWS; i++) {
            rows[i] = <div style={rowStyle} className='row'>{singleRow[i]}</div>
        }

        // Board CSS styling
        const boardStyle = {
            height: ROWS * SCALE,
            width: COLS * SCALE,
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
        };

        this.updateBoard();
    }

    // Generate a piece of food on a random position of the board
    generateFood() {
        
    }

    // Update the position of the snake and food in the board
    updateBoard() {
        const body = this.state.snake.body.getQueue(); // JS Array
        const board = this.state.board; // 2d Array
        
        body.forEach(pos => board[pos[0]][pos[1]] = 's');
    }

    render() {
        return (
            <div className='game'>
                <Board board={this.state.board}/>
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);