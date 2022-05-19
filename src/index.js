import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button 
            className={props.className} 
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {

    /*renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                className={ (i === this.props.lastMoveIdx || this.props.winningLine.includes[i] ) ? 'square active' : 'square' }
                onClick={() => this.props.onClick(i) }    
            />
        );
    }*/

    renderBoard() {
        let rows = [];
        for (let i=0; i<9; i++) {
            let cols = [];
            for (let j=i; j<i+3; j++) {
                cols.push(<Square 
                    key={j}
                    value={this.props.squares[j]} 
                    className={ (j === this.props.lastMoveIdx  || this.props.winningLine.includes(j)) ? 'square active' : 'square' }
                    onClick={() => this.props.onClick(j) }    
                />);
            }
            if ( i % 3 === 0 ) {
                rows.push(<div key={i} className="board-row">{ cols }</div>)
            }
        }
        return (
            <>{ rows }</>
        )
    }
  
    render() {
        return (
            <>{ this.renderBoard() }</>
            /*
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
            */
        );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMove: []
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); //creates a copy of the array to edit /immutability
        let lastMove = current.lastMove;
        if (calculateWinner(squares) || squares[i]) return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        lastMove = { idx: i, col: (i % 3) + 1, row: Math.floor((i) / 3) + 1 };
        this.setState( {
            history: history.concat([{
                squares: squares,
                lastMove: lastMove
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        } )
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const gameIsWon = calculateWinner(current.squares);
        let status = (!gameIsWon && this.state.stepNumber === 9) ? 'No winners! The game is a draw.' : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        let winningLine = [];
        if (gameIsWon) {
            status = 'Winner: ' + gameIsWon.winner;
            winningLine =  gameIsWon.line;
            //console.log('LINE:', gameIsWon.line);
        }

        const moves = history.map( (step, move) => {
            const desc = move ?
                'Go to move #' + move + ': [' + step.lastMove['col'] + ', ' + step.lastMove['row'] + ']':
                'Go to game start, key: [col, row]';
            return (
                <li key={move}>
                    <button onClick={ () => this.jumpTo(move) }>{ desc }</button>
                </li>
            );
        } );

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares = { current.squares }
                        lastMoveIdx = { current.lastMove['idx'] }
                        winningLine = { winningLine }
                        onClick = { (i) => this.handleClick(i) }
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{ moves }</ol>
                </div>
            </div>
        );
    }
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i=0; i<lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
}