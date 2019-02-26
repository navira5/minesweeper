import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import { getSquaresAround } from '../components/helpers';
import { timingSafeEqual } from 'crypto';
import GameStatus from '../components/header/gamestatus';
//import { render } from 'fela-dom';

type IndexState = {
  squares: any[],
  boardSize: number,
  level: string,
  mineCount: number,
  time: number,
  timeOn: boolean,
  minePos: any[],
  timer: number,
  showPlayAgain: boolean,
  wonOrLost: string
};

class Index extends React.Component<{}, IndexState> {
  constructor(props) {
    super(props);

    this.state = {
      squares: [],
      boardSize: 10,
      level: 'Easy',
      mineCount: 10,
      time: 0,
      timeOn: false,
      minePos: [],
      timer: 0,
      showPlayAgain: false,
      wonOrLost: ''
    };
  }

  componentDidMount() {
    this.handleChange(this.state.level);
  }

  togglePlayAgain = () => {
    this.setState({ showPlayAgain: !this.state.showPlayAgain })
  }

  handleChange = level => {
    let boardSize;
    let mineCount;

    if (level === 'Easy') {
      boardSize = 10;
      mineCount = 10;
    } else if (level === 'Medium') {
      boardSize = 13;
      mineCount = 40;
    } else if (level === 'Hard') {
      boardSize = 16;
      mineCount = 99;
    }
    const squares = this.generareSquares(boardSize, mineCount);
    const squaresWithMine = squares.filter(s => s.hasMine);
    this.setState({ minePos: squaresWithMine, squares })
    this.proximity(squaresWithMine, level, boardSize, mineCount, squares);
  };

  generareSquares = (boardSize, mineCount) => {
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
    [...Array(mineCount)].forEach(m => {

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
    this.setState({ squares: updateSquares })

  };

  resetGame = () => {
    this.setState(
      {
        squares: [],
        boardSize: 10,
        level: 'Easy',
        mineCount: 10,
        minePos: [],
        showPlayAgain: false,
        wonOrLost: '',
        time: 0,
        timer: null,
        timeOn: false
      },
      () => {
        this.handleChange('Easy');
        this.resetTimer();
        this.setState(prevState => ({ squares: prevState.squares }));
      }
    );
  }

  startTimer = () => {
    this.setState({
      timeOn: true,
    });
    let timer = setInterval(this.addTime, 1000);
    console.log('yyyyyyyyyy', timer);
    this.setState({ timer: timer as number })
  }

  addTime = () => {
    this.setState({ time: this.state.time + 1 })
  }

  stopTimer() {
    //clearInterval(this.timer);
    //this.setState({ timeOn: false }) 
    //clearInterval(this.state.timer);   
    this.setState({ timeOn: false }, () => {

      clearInterval(this.state.timer)
    })

  }

  resetTimer = () => {
    this.setState({ time: 0, timeOn: false });
  }


  handleClick = (square, e) => {
    if (!this.state.timeOn) {
      this.startTimer();
    }
    square.cursor = true;
    if (square.hasMine) {
      this.stopTimer();
      this.state.squares.forEach(square => {
        square.hasMine ? square.isOpen = true : null
      })

      this.setState({ wonOrLost: 'You Lost. Oops', showPlayAgain: true }, () => {

        this.setState(prevState => ({
          squares: prevState.squares,
          showPlayAgain: prevState.showPlayAgain,
        }));
      });
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
    e.preventDefault();
    if (!this.state.timeOn) {
      this.startTimer();
    }
    if (cell.hasFlag === true) {
      cell.hasFlag = false;
      this.setState(prevState => ({ squares: prevState.squares }));
    }
    if (!cell.isOpen) {
      cell.hasFlag = true;
      const isFlagOnMine = cell.hasMine === true;
      if (isFlagOnMine) {

        this.setState({ mineCount: this.state.mineCount - 1 })
        if (this.state.mineCount === 1) {
          this.stopTimer();
          this.setState({ wonOrLost: 'You Won! Yay', showPlayAgain: true }, () => {
            this.setState(prevState => ({
              squares: prevState.squares,
              showPlayAgain: prevState.showPlayAgain,

            }));
          });


        }
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

  proximity = (arr, level, boardSize, mineCount, squares) => {
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

    //need to find elegant solution to calc edges on medium and hard
    // const mediumTop = [];
    // const mediumBottom = [];
    // const mediumLeft = [];
    // const mediumRight = [];
    // let mediumBaseLeft = 0;


    // if (level === 'Medium') {

    //     for(var i = 0; i < squares.length; i++) {
    //       while(i <= 9) {
    //         mediumTop.push(squares[i]);
    //       }
    //       while(i <= 99 && i >= 90) {
    //         mediumBottom.push(squares[i]);
    //       }
    //     }
    //     for(var i = 0; i < mediumTop.length; i++) {
    //       mediumBaseLeft+= 13;
    //       mediumLeft.push(mediumBaseLeft); 
    //     }
    //   }

    // console.log(mediumTop, mediumBottom, mediumLeft, 'medium')
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
    this.setState({ boardSize, mineCount, squares: newSquares });

  };

  render() {
    const { boardSize, squares } = this.state;


    const showPlayAgain = this.state.showPlayAgain ? <GameStatus status={this.state.wonOrLost} reset={this.resetGame} /> : null;

    const grid = squares.map((s, i) => {
      const disableStatus = s.isOpen || s.hasFlag ? true : false

      return <Square num={s.proximityCount} onContextMenu={e => this.handleRightClick(e, s)} key={i} cell={s} disabled={disableStatus} onClick={e => this.handleClick(s, e)}>
        {/* {`${s.squarePos}`} */}

        {s.hasFlag && <Flag />}
        {s.hasMine && s.isOpen && <Mine />}
        {s.isOpen && !s.proximityCount && !s.hasMine && ''}
        {s.isOpen && !!s.proximityCount && !s.hasMine && `${s.proximityCount}`}
      </Square>;
    });

    const calcTime = time => {
      return new Date(time * 1000).toISOString().substr(11, 8);
    }

    const displayTime = calcTime(this.state.time);

    return (
      <Layout
        title={`Minesweeper (active)`}
        handleChange={this.handleChange}
        mineCount={this.state.mineCount}
        time={displayTime}
      >
        {showPlayAgain}

        <Desk boardSize={boardSize}>{grid}</Desk>
      </Layout>
    );
  }
}



export default Index;