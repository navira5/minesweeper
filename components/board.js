import React, { Component } from 'react';
import Square from './square';
import Mine from './mine'


class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      minesArr: this.props.randomMines
    }

  }


  render() {
    
    const squareNum = this.props.squareNum
    const mines = this.props.mines
    const randomMines = [...Array(mines)].map(item => {
      return Math.floor(Math.random() * squareNum);
    })

    const grid = [...Array(squareNum).keys()].map(i => {
      return <Square key={i}>
        {randomMines.includes(i) && <Mine />}
        {!randomMines.includes(i) && ''}

      </Square>;
    });
    // const minePlacement = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
    // const showMine = minePlacement.map((item, i) => {

    //   return 
    // })
   return <div>{grid}</div>
  }
}

export default Board;