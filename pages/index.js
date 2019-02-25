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
      matrix :[],
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
    this.make2DArray(squares);
    const squaresWithMine = squares.filter(s => s.hasMine);
    this.proximity(squaresWithMine, level, boardSize, minesCount, squares);
  };

  generareSquares = (boardSize, minesCount) => {
    //make array with objects (info about each square will go in here)
    const squares = [...Array(boardSize * boardSize)].map((s, i) => {
      return {
        squarePos: i,
        hasMine: false,
        hasFlag: false,
        proximityCount: 0,
        isOpen: false
      };
    });
    //given the num of mines, generate a random index position and change hasMine property to true
    [...Array(minesCount)].forEach(m => {
      
      //grab square obj using random index position from squares array
      let randomSquare = squares[Math.floor(Math.random() * squares.length)];
      
      //to avoid duplicates, keep looping while square has mine. If it does, then generate and re-assign a new random position
      while (randomSquare.hasMine) {
        randomSquare = squares[Math.floor(Math.random() * squares.length)];
      }
      //otherwise assign that square a mine
      randomSquare.hasMine = true;
    });

    //return squares with mines placed in random positions
    return squares;
  };

  make2DArray = squares => {
    const twoDArr = [];
    let row = [];
    let currX = 0
    let currY = 0

    for (let i = 0; i < squares.length; i++) {
      let curr = squares[i]
      let currStrPos = curr.squarePos.toString();

      if (currStrPos[1] === '0' || currStrPos[0] === '0') {
        currX = Number(currStrPos[0]);
      }
      //set x, y position in matrix
      curr['x'] = Number(currX)
      curr['y'] = Number(currY)
      currY++

      if (row.length === 9) {
        currY = 0
      }

      if (row.length === 10) {
        twoDArr.push(row);
        row = [];
        row.push(curr);
      } else {
        row.push(curr);
      }
    }
    twoDArr.push([
      squares[90],
      squares[91],
      squares[92],
      squares[93],
      squares[94],
      squares[95],
      squares[96],
      squares[97],
      squares[98],
      squares[99]
    ]);
    this.setState({ matrix: twoDArr})
  }

  minesInProximity = (square, level) => {
    
    const impactedSquares = this.retrieveSquaresAroundTarget(square, level)
    square.isOpen = true;

    //array of squares with 0 prox and now open
    const squaresArround = this.state.squares.filter((item) => {
      if (impactedSquares.includes(item.squarePos)) {
        if (item.proximityCount === 0 && !item.isOpen && !item.hasMine) {
          
          item.isOpen = true;
          return item
        } else if (!item.hasMine && item.proximityCount > 0) {
          item.isOpen = true;
        }
      }
    })

    //recursively check for any squares with 0 proximity squares touching original clicked square
    squaresArround.forEach(s => {
      this.minesInProximity(s, 'Easy');
    })
 
    //make sure game board re-renders
    const updateSquares = this.state.squares;
    this.setState( {squares: updateSquares})
  
  };


  handleClick = (square, e) => {
    console.log('eeeeeiiiiiiiiii', e);

    if (square.hasMine) {
      alert('Game Over!!!!')
    } else if (square.proximityCount > 0) {
      square.isOpen = true;
      const newSquares = [...this.state.squares];

      //swap objects to reflect updated isOpen property
      newSquares.splice(square.squarePos, 1, square);
      this.setState({ squares: newSquares });
    } else {
      
      this.minesInProximity(square, 'Easy');
    }
  };

  handleRightClick = (e, cell) => {
    e.preventDefault()
    console.log('rrrrr', cell);
    cell.hasFlag = true;
    this.setState(prevState => ({squares: prevState.squares}))
    //console.log('uuuuuu', );
  }

  retrieveSquaresAroundTarget = (square, level) => {
    let curr = square.squarePos;
    let currStr = curr.toString();
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
    return impactedSquares;
  }

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
    //arr = array of mine positions
    for (let i = 0; i < arr.length; i++) {
      
      let curr = arr[i].squarePos;
      let currStr = curr.toString();

      //try pushing array into new array and then collapsing
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
    //console.log('all squars', squares);
    console.log(this.state.matrix, 'matrix')

    const grid = squares.map((s, i) => {
      return <Square onContextMenu={e => this.handleRightClick(e, s)} key={i} cell={s} disabled={false} onClick={e => this.handleClick(s, e)}>
          {s.hasFlag && <Flag />}
          {s.isOpen && !s.proximityCount && 'F'}
          {s.isOpen && !!s.proximityCount && s.proximityCount}
          {/*s.hasMine && <Mine />*/}
          {/*s.isOpen && !s.proximityCount && 'F'*/}
          {/*!s.isOpen && !!s.proximityCount && !s.hasMine && `${s.proximityCount}`*/}
          {/* {!s.hasMine && !s.isOpen && `${s.proximityCount}`} */}
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

{
  /* <Square key={i} disabled={i === 55 || i === 10}>
  {i === 21 && <Mine />}
  {i === 25 && <Flag />}
  {i === 77 ? '4' : ''}
</Square> */
}

export default Index;
//handleRightClick={this.handleRightClick}