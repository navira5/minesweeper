import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import Board from '../components/board';
import Head from '../components/head';
//import { render } from 'fela-dom';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cell: {
        squarePos: 0,
        hasMine: false,
        hasFlag: false,
        proximityCount: 0,
        isOpen: false
      },
      squares: [],
      boardSize: 10,
      //squaresOnBoard: 100,
      level: 'Easy',
      flagCount: 10,
      minesCount: 10,
      time: 0,
      randomeMines: []
    };
  }

  componentDidMount() {
    console.log('did mmmm');
    this.handleChange(this.state.level);
  }

  handleChange = level => {
    let boardSize;
    let minesCount;

    if (level === 'Easy') {
      boardSize = 10;
      minesCount = 10;
    } else if (level === 'Medium') {
      boardSize = 13;
      minesCount = 40;
    } else if (level === 'Hard') {
      boardSize = 16;
      minesCount = 99;
    }
    const squares = this.generareSquares(boardSize, minesCount);
    const squaresWithMine = squares.filter(s => s.hasMine);
    this.proximity(squaresWithMine, level, boardSize, minesCount, squares);
    //console.log('dsdadsa', squares.filter(a => a.hasMine))
    //this.setState({ boardSize, minesCount, squares });
  };

  generareSquares = (boardSize, minesCount) => {
    const squares = [...Array(boardSize * boardSize)].map((s, i) => {
      return {
        squarePos: i,
        hasMine: false,
        hasFlag: false,
        proximityCount: 0,
        isOpen: false
      };
    });

    [...Array(minesCount)].forEach(m => {
      let randomMine = squares[Math.floor(Math.random() * squares.length)];
      while (randomMine.hasMine) {
        randomMine = squares[Math.floor(Math.random() * squares.length)];
      }
      randomMine.hasMine = true;
    });

    return squares;
  };

  minesInProximity = cell => {
    const { squares } = this.state;
    let minesNearby = 0;
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        if (cell.y + row >= 0 && cell.x + col >= 0) {
          if (
            cell.y + row < squares.length &&
            cell.x + col < squares[0].length
          ) {
            if (
              squares[cell.y + row][cell.x + col].hasMine &&
              !(row === 0 && col === 0)
            ) {
              minesNearby++;
            }
          }
        }
      }
    }
    return minesNearby;
  };

  handleClick = square => {
    console.log('iiiiiiiiii', square);
    if (square.hasMine) {
      alert('Game Over!!!!');
    } else if (square.proximityCount > 0) {
      square.isOpen = true;
      const newSquares = [...this.state.squares];
      newSquares.splice(square.squarePos, 1, square);
      this.setState({ squares: newSquares });
    } else {
      console.log('cvxcvcvxcvxvx', this.minesInProximity(square));
    }
    //const cell = this.state.cell
    //const showSquare = this.state.showSquare;
    //showSquare.push(index);
    //console.log(arr, 'array')
    //this.setState({ cell })
  };

  proximity = (arr, level, boardSize, minesCount, squares) => {
    let minor,
      major,
      middle,
      impactedSquares = [];

    if (level === 'Easy') {
      minor = 11;
      middle = 10;
      major = 9;
    } else if (level === 'Medium') {
      minor = 14;
      middle = 13;
      major = 12;
    } else {
      minor = 17;
      middle = 16;
      major = 15;
    }

    //incorrect currStr verification when set to medium or hard
    for (let i = 0; i < arr.length; i++) {
      let curr = arr[i].squarePos;
      let currStr = curr.toString();

      //first column
      if (currStr[1] === '0' || currStr[0] === '0') {
        impactedSquares.push(
          curr + 1,
          curr + middle,
          curr + minor,
          curr - middle,
          curr - major
        );
      } else if (currStr.length === 1) {
        //first row
        impactedSquares.push(
          curr - 1,
          curr + 1,
          curr + major,
          curr + minor,
          curr + middle
        );
      } else if (
        currStr[1] === '9' ||
        (currStr[0] === '9' && currStr.length === 1)
      ) {
        //last column
        impactedSquares.push(
          curr - minor,
          curr - middle,
          curr - 1,
          curr + major,
          curr + middle
        );
      } else if (currStr[1] === '9' && currStr.length === 2) {
        //last row
        impactedSquares.push(
          curr - minor,
          curr - middle,
          curr - major,
          curr - 1,
          curr + 1
        );
      } else {
        //it's not touching the edges
        impactedSquares.push(
          curr - minor,
          curr - middle,
          curr - major,
          curr - 1,
          curr + 1,
          curr + major,
          curr + middle,
          curr + minor
        );
      }
    }
    impactedSquares = impactedSquares.reduce((acc, item) => {
      if (item >= 0 && item < squares.length) {
        acc[item] ? acc[item]++ : (acc[item] = 1);
      }
      return acc;
    }, {});
    const newSquares = squares.map((s, i) => {
      s.proximityCount = impactedSquares[i] ? impactedSquares[i] : 0;
      return s;
    });
    this.setState({ boardSize, minesCount, squares: newSquares });
    //console.log('impacted squares', impactedSquares);
    //return impactedSquares;
  };

  render() {
    const { boardSize, squares } = this.state;
    console.log('all squars', squares);

    const grid = squares.map((s, i) => {
      return (
        <Square
          key={i}
          cell={s}
          disabled={false}
          onClick={() => this.handleClick(s)}
        >
          {s.hasMine && <Mine />}
          {!s.hasMine && `${s.proximityCount}`}
        </Square>
      );
    });

    return (
      <Layout
        title={`Minesweeper (active)`}
        handleChange={this.handleChange}
        flagCount={this.state.flagCount}
        time={this.state.time}
      >
        <Desk boardSize={boardSize}>{grid}</Desk>
      </Layout>
    );
  }
}

{
  /* <Square key={i} disabled={i === 55 || i === 10}>
  {i === 21 && <Mine />}
  {i === 25 && <Flag />}
  {i === 77 ? '4' : ''}
</Square> */
}

export default Index;
