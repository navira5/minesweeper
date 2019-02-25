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
    this.state = this.getInitialState()
    this.state = {
      squares: [],
      boardSize: 10,
      level: 'Easy',
      mineCount: 10,
      time: 0,
      minePos: [],
     
    };
  }

  componentDidMount() {
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
    this.setState({ minePos: squaresWithMine, squares})
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
        isOpen: false,
        cursor: false
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

  resetGame = () => {
    this.setState({
      squares: [], 
      boardSize: 10, 
      level: 'Easy', 
      mineCount: 10, 
      time: 0, 
      minePos: []
    }, () => {
        this.handleChange('Easy');
        this.setState(prevState => ({ squares: prevState.squares }));
    }) 
  }



  handleClick = (square, e) => {
    console.log(this.state.squares, 'old squares')
    square.cursor = true;
    if (square.hasMine) {
      this.resetGame();
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
    
    if(!cell.isOpen) {
      cell.hasFlag = true;
      const isFlagOnMine = cell.hasMine === true;
      if (isFlagOnMine) {
        this.setState({ mineCount: this.state.mineCount - 1 })
      }
      this.setState(prevState => ({ squares: prevState.squares }))
    }
    

    
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

  };

  render() {
    console.log(this.state.squares)
    const { boardSize, squares } = this.state;

    const grid = squares.map((s, i) => {
      const disableStatus = s.isOpen ? true : false
      return <Square onContextMenu={e => this.handleRightClick(e, s)} key={i} cell={s} disabled={disableStatus} onClick={e => this.handleClick(s, e)}>
          {s.hasFlag && <Flag />}
          {s.hasMine && <Mine />}
          {s.isOpen && !s.proximityCount && 'F'}
          {s.isOpen && !!s.proximityCount && s.proximityCount}
        </Square>;
    });

    return (
      <Layout
        title={`Minesweeper (active)`}

        handleChange={this.handleChange}
        mineCount={this.state.mineCount}
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