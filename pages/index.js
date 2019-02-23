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

// class Index extends React.Component {
//   constructor() {
//     super();
//   }

//   state = {
//     gameActive: false,
//     level: 'Easy',
//     cellsOpen: 0,
//     boardSize: 10,
//     flags: 10,
//     mines: 10,
//     time: 0,
//   };

//   render() {
//     return (
//       <div className="minesweeper">
//         <h1 className="title">Minesweeper</h1>
//         <Head time={this.state.time} flags={this.state.flags}/>
//       </div>
//     );
//   }
// }


class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    cell: {
      neighbors: {},
      hasMine: false,
      hasFlag: false,
      proximityCount: 0,
      isOpen: false
    },
    boardSize: 10,
    squaresOnBoard: 100,
    level: 'Easy',
    flagCount: 10,
    mines: 10,
    time: 0,
    randomeMines: []
  };

  handleChange = level => {
    let boardSize;
    let mines;
    let squaresOnBoard = boardSize * boardSize;

    if (level === 'Easy') {
      boardSize = 10;
      mines = 10;
    } else if (level === 'Medium') {
      boardSize = 13;
      mines = 40;
    } else if (level === 'Hard') {
      boardSize = 16;
      mines = 99;
    }
    this.setState({ boardSize, mines, squaresOnBoard });
  };

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
    // console.log(randomMines, 'random');
    // console.log(impactedSquares, 'impacted squares');
    // console.log(impactedLookUp, 'impacted lookup');
    
    const grid = [...Array(squareNum).keys()].map((i, index) => {
      
      randomMines.includes(i) ? cell.hasMine = true : cell.hasMine = false;
      impactedLookUp[i] ? cell.proximityCount = impactedLookUp[i] : cell.proximityCount = 0;
      
     
      return <Square key={i} cell={cell} disabled={false}>
          {cell.hasMine && <Mine />}
         
          {!cell.hasMine && `${i}`}
        </Square>;
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

{/* <Square key={i} disabled={i === 55 || i === 10}>
  {i === 21 && <Mine />}
  {i === 25 && <Flag />}
  {i === 77 ? '4' : ''}
</Square> */}


export default Index;
