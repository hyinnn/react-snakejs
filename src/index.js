import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Board extends React.Component {
    render() {
        return (
            <div>
                <div className='board'>
                </div>
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        // Game dimensions
        this.M = 20;
        this.N = 20;
    }

    render() {
        return (
            <div>
                <Board />
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('root')
);