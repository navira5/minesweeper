import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import {

  calcTime,
  generareSquares,
  minePositions,
  mineProximtyCountLookup,
  setProximityCount,
  openSquares
} from '../components/helpers';
import { timingSafeEqual } from 'crypto';
import GameStatus from '../components/header/gamestatus';
//import { render } from 'fela-dom';

class Index extends React.Component {
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
      timer: null,
      showPlayAgain: false,
      wonOrLost: ''
    };
  }

  componentDidMount() {
    this.handleChange(this.state.level);
  }

  togglePlayAgain = () => {
    this.setState({ showPlayAgain: !this.state.showPlayAgain });
  };

  handleChange = level => {
    let mineCount;

    if (level === 'Easy') {
      mineCount = 10;
    } else if (level === 'Medium') {
      mineCount = 20;
    } else if (level === 'Hard') {
      mineCount = 40;
    }
    const squares = generareSquares(mineCount);
    const squaresWithMine = squares.filter(s => s.hasMine);
    this.setState({ minePos: squaresWithMine, squares, mineCount });
    this.proximity(squaresWithMine, squares);
  };

  proximity = (arr, squares) => {
    let impactedSquares = minePositions(arr);

    impactedSquares = mineProximtyCountLookup(impactedSquares, squares);

    let updatedWithProximityCount = squares.map((s, i) => {
      s.proximityCount = impactedSquares[i] ? impactedSquares[i] : 0;
      return s;
    });

    this.setState({ squares: updatedWithProximityCount });
  };

  floodFill = (square) => {
    const impactedSquares = minePositions([square]);
    square.isOpen = true;

    //array of squares with 0 prox and now open
    const squaresArround = openSquares(this.state.squares, impactedSquares)
 
    //recursively check for any squares with 0 proximity squares touching 
    squaresArround.forEach(s => {
      this.floodFill(s);
    });

    this.setState(prevState => ({ squares: prevState.squares }));
   
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
        timeOn: false,
        start: 0
      },
      () => {
        this.handleChange('Easy');
        this.resetTimer();
        this.setState(prevState => ({ squares: prevState.squares }));
      }
    );
  };

  startTimer = () => {
    this.setState({
      timeOn: true
    });
    let timer = setInterval(this.addTime, 1000);
    this.setState({ timer: timer });
  };

  addTime = () => {
    this.setState({ time: this.state.time + 1 });
  };

  stopTimer() {
    this.setState({ timeOn: false }, () => {
      clearInterval(this.state.timer);
    });
  }

  resetTimer = () => {
    this.setState({ time: 0, timeOn: false });
  };

  handleClick = (square, e) => {
    
    e.preventDefault();

    const {squares, timeOn} = this.state;

    if (!timeOn) this.startTimer();
    
    square.cursor = true;

    //lose game
    if (square.hasMine) {
      this.stopTimer();

      //open all cells with mines
      squares.forEach(square => {
        square.hasMine ? (square.isOpen = true) : null;
      });

      this.setState({ wonOrLost: 'You Lost. Oops', showPlayAgain: true })
  
      //cell touches a mine
    } else if (square.proximityCount > 0) {
      square.isOpen = true;
      this.setState(prevState => ({ squares: prevState.squares }));

      //cell doesn't touch any mines
    } else {
      this.floodFill(square);
    }
  };

  handleRightClick = (e, square) => {
    e.preventDefault();
    if (!this.state.timeOn) this.startTimer();

    if (!square.isOpen) {
      square.hasFlag = true;
      const isFlagOnMine = square.hasMine === true;
      if (isFlagOnMine) {
        this.setState({ mineCount: this.state.mineCount - 1 });
        if (this.state.mineCount === 1) {
          this.stopTimer();
          this.setState({ wonOrLost: 'You Won! Yay', showPlayAgain: true })
        }
      }
    }
  };


  render() {
    const { boardSize, squares, showPlayAgain } = this.state;

    const playAgain = showPlayAgain ? (<GameStatus status={this.state.wonOrLost} reset={this.resetGame} />) : null;

    const grid = squares.map((s, i) => {
      const disableStatus = s.isOpen || s.hasFlag ? true : false;

      return (
        <Square
          num={s.proximityCount}
          onContextMenu={e => this.handleRightClick(e, s)}
          key={i}
          cell={s}
          disabled={disableStatus}
          onClick={e => this.handleClick(s, e)}
        >
         
          {s.hasFlag && <Flag />}
          {s.hasMine && s.isOpen && <Mine />}
          {s.isOpen && !s.proximityCount && !s.hasMine && ''}
          {s.isOpen &&
            !!s.proximityCount &&
            !s.hasMine &&
            `${s.proximityCount}`}
        </Square>
      );
    });

    const displayTime = calcTime(this.state.time);

    return (
      <Layout
        title={`Minesweeper`}
        handleChange={this.handleChange}
        mineCount={this.state.mineCount}
        time={displayTime}>

        {playAgain}

        <Desk boardSize={boardSize}>
          {grid}</Desk>
      </Layout>
    );
  }
}



export default Index;