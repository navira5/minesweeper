import React, { Component } from 'react';
import Square from './square';
import Mine from './mine'
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: this.props.boardSize * this.props.boardSize,
      mines: this.props.mines
    }

  }


  render() {
    // const minePlacement = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100))
    // const showMine = minePlacement.map((item, i) => {

    //   return 
    // })
   return <div></div>
  }
}

export default Board;