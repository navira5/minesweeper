import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import Board from '../components/board'
//import { render } from 'fela-dom';


class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    boardSize: 10,
    level: 'Easy',
    flagCount: 10,
    mines: 10,
    time: 0,
    minePosition: []
  };

  

  handleChange = level => {
    let boardSize;
    let mines;

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
    this.setState({ boardSize , mines });
  };

  render() {
    const boardSize = this.state.boardSize;
    const squareNum = boardSize * boardSize
    const mines = this.state.mines
    const randomMines = [...Array(mines)].map(item => {
      return Math.floor(Math.random() * squareNum);
    })
  
    const grid = [...Array(squareNum).keys()].map(i => {
      return <Square key={i}>
          {randomMines.includes(i) && <Mine />}
          {randomMines.includes(i) === false && ''}
         
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
