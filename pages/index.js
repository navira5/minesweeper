import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import Board from '../components/board';
import Head from '../components/head';
import { render } from 'fela-dom';

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
    sqaures: [],
    boardSize: 10,
    //squaresOnBoard: 100,
    level: 'Easy',
    flagCount: 10,
    minesCount: 10,
    time: 0,
    randomeMines: []
  };

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
    console.log('dsdadsa', squares)
    this.setState({ boardSize, minesCount, squares });
  };

  generareSquares = (boardSize, minesCount) => {
    const squares = [...Array(boardSize * boardSize)].map((s, i) => {
      return {
        squarePos: i,
        hasMine: false,
        hasFlag: false,
        proximityCount: 0,
        isOpen: false        
      }
    });

    [...Array(minesCount)].forEach(m => {
      /*let randomMine = squares[Math.floor(Math.random() * squares.length)];
      while (randomMine.hasMine) {
        randomMine = squares[Math.floor(Math.random() * squares.length)];
      }
      randomMine.hasMine = true*/
      const randomMine = squares[Math.floor(Math.random() * squares.length)];

      if (!randomMine.hasMine) {
        randomMine.hasMine = true;
      } else {
        const randomMine = squares[Math.floor(Math.random() * squares.length)];
        randomMine.hasMine = true;
      }
    });

    return squares;
  }

  handleClick = (index) => {
    console.log('iiiiiiiiii', index)
    //const cell = this.state.cell
    //const showSquare = this.state.showSquare;
    //showSquare.push(index);
    //console.log(arr, 'array')
    //this.setState({ cell })
    
  }

  render() {
    const { cell, boardSize, mines, level } = this.state;
    const squareNum = boardSize * boardSize;

    //bug: has repeat random nums; this is also messing up square count bc of double counting
    const randomMines = [...Array(mines)].map((item, index) => {
      return Math.floor(Math.random() * squareNum);
    });

    const  impactedSquares = []

    const proximity = (arr, level) => {
      let minor, major, middle;

      if(level === 'Easy') {
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
      for(let i = 0; i < arr.length; i++) {
        let curr = arr[i];
        let currStr = arr[i].toString();

        //first column
        if(currStr[1] === '0' || currStr[0] === '0') {
          impactedSquares.push(curr + 1, curr + middle, curr + minor, curr - middle, curr - major);
        }
        //first row
        else if(currStr.length === 1) {
          impactedSquares.push(curr - 1, curr + 1, curr + major, curr + minor, curr + middle);
        }
        //last column
        else if (currStr[1] === '9' || (currStr[0] === '9' && currStr.length === 1)) {
          impactedSquares.push(curr - minor, curr - middle, curr - 1, curr + major, curr + middle);
        }
        //last row
        else if (currStr[1] === '9' && currStr.length === 2) {
          impactedSquares.push(curr - minor, curr - middle, curr - major, curr - 1, curr + 1);
        }
        //it's not touching the edges
        else {
          impactedSquares.push(curr - minor, curr - middle, curr - major, curr - 1, curr + 1, curr + major, curr + middle, curr + minor)
        }
      }
    }

    proximity(randomMines, level)

    const impactedLookUp = impactedSquares.reduce((acc, item) => {
       if(item >= 0 && item < squareNum) {
         acc[item] ? acc[item]++ : acc[item] = 1
       }
      return acc;
    }, {})
  
  
    const grid = [...Array(squareNum).keys()].map((i, index) => {
      
      randomMines.includes(i) ? cell.hasMine = true : cell.hasMine = false;
      impactedLookUp[i] ? cell.proximityCount = impactedLookUp[i] : cell.proximityCount = 0;
      
      //console.log(i, 'cell num', cell.isOpen, 'open status')
      return <Square key={i} cell={cell} disabled={false} onClick={() => this.handleClick(i)}>
          {cell.hasMine && <Mine />}
          {!cell.hasMine && `${cell.proximityCount}`}
        </Square>;
    });

    return (
      <Layout
        title={`Minesweeper (active)`}
        handleChange={this.handleChange}
        flagCount={this.state.flagCount}
        time={this.state.time}>
        <Desk boardSize={boardSize}>
          {grid}
        </Desk>
      </Layout>
    );
  }
}

{/* <Square key={i} disabled={i === 55 || i === 10}>
  {i === 21 && <Mine />}
  {i === 25 && <Flag />}
  {i === 77 ? '4' : ''}
</Square> */}


export default Index;
