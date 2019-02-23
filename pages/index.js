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
      index: null,
      hasMine: false,
      hasFlag: false,
      mineProximityCount: 0,
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
    const {cell, boardSize, mines} = this.state
    const squareNum = boardSize * boardSize
    console.log(randomMines)

    //bug: has repeat random nums
    const randomMines = [...Array(mines)].map((item, index) => {
      return Math.floor(Math.random() * squareNum);
    })
   
    const grid = [...Array(squareNum).keys()].map((i, index) => 
      {
        randomMines.includes(i) ? cell.hasMine = true : cell.hasMine = false;
   
      return <Square key={i} cell={cell} disabled={false}>
            {cell.hasMine && <Mine />}
            {!randomMines.includes(i) && `${i}`}
          
          </Square>;
    });

    
  
    return <Layout title={`Minesweeper (active)`} handleChange={this.handleChange} flagCount={this.state.flagCount} time={this.state.time}>
        <Desk boardSize={boardSize}>
          {grid}
          
        </Desk>
      </Layout>;
  }
}

{/* <Square key={i} disabled={i === 55 || i === 10}>
  {i === 21 && <Mine />}
  {i === 25 && <Flag />}
  {i === 77 ? '4' : ''}
</Square> */}


export default Index;
