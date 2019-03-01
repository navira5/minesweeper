import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
import GameStatus from '../components/header/gamestatus';
import {
  calcTime,
  generareSquares,
  squaresAroundTarget,
  mineProximtyCountLookup,
  openSquares
} from '../components/helpers';
//import { timingSafeEqual } from 'crypto';
import { render } from 'fela-dom';

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
      timer: 0,
      showPlayAgain: false,
      wonOrLost: '',
      width: 0
    };
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.updateDimensions);
  };

  componentDidMount = () => {
    this.setState({ width: window.innerWidth });
    this.handleChange(this.state.level);
    window.addEventListener('resize', this.updateDimensions);
  };

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
    this.updateSquaresWithProximityCount(squaresWithMine, squares);
  };

  updateSquaresWithProximityCount = (squaresWithMine, squares) => {
    let impactedSquares = squaresAroundTarget(squaresWithMine);

    impactedSquares = mineProximtyCountLookup(impactedSquares, squares);

    let updatedWithProximityCount = squares.map((s, i) => {
      s.proximityCount = impactedSquares[i] ? impactedSquares[i] : 0;
      return s;
    });

    this.setState({ squares: updatedWithProximityCount });
  };

  floodFill = square => {
    const impactedSquares = squaresAroundTarget([square]);
    square.isOpen = true;

    //array of squares with 0 prox and now open
    const squaresArround = openSquares(this.state.squares, impactedSquares);

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

  stopTimer = () => {
    this.setState({ timeOn: false }, () => {
      clearInterval(this.state.timer);
    });
  };

  resetTimer = () => {
    this.setState({ time: 0, timeOn: false });
  };

  handleClick = (square, e) => {
    e.preventDefault();

    const { squares, timeOn } = this.state;
    if (!timeOn) this.startTimer();

    square.cursor = true;

    //lose game
    if (square.hasMine) {
      this.stopTimer();

      //open all cells with mines
      squares.forEach(square => {
        square.hasMine ? (square.isOpen = true) : null;
      });

      this.setState({ wonOrLost: 'You Lost', showPlayAgain: true });

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
      if (square.hasMine) {
        this.setState({ mineCount: this.state.mineCount - 1 });
        if (this.state.mineCount === 1) {
          this.stopTimer();
          this.setState({ wonOrLost: 'You Won', showPlayAgain: true });
        }
      }
    }
  };

  handleButtonPress = (e, s) => {
    this.btimer = setTimeout(() => {
      this.handleRightClick(e, s);
    }, 1000);
  };

  handleButtonRelease = () => {
    clearTimeout(this.btimer)
  };

  render() {
    const { boardSize, squares, showPlayAgain, width } = this.state;

    console.log(width, 'window');
    const isTouchScreen = width <= 768;

    const displayTime = calcTime(this.state.time);

    const wrapperGrid = {
      margin: 'auto',
      padding: '0%',
      paddingLeft: '0'
    };

    const grid = squares.map((s, i) => {
      const disableStatus = s.isOpen || s.hasFlag ? true : false;

      return (
        <Square
        
          //handles long click functionality
          onTouchStart={e => this.handleButtonPress(e, s)}
          onTouchEnd={e => this.handleButtonRelease(e, s)}
          onMouseDown={e => this.handleButtonPress(e, s)}
          onMouseUp={e => this.handleButtonRelease(e, s)}
          onMouseLeave={e => this.handleButtonRelease(e, s)}
          isTouchScreen={isTouchScreen}

          num={s.proximityCount}
          onContextMenu={e =>
            isTouchScreen ? this.handleLongPress() : this.handleRightClick(e, s)
          }
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
            `${
              s.proximityCount //need double bang to avoid showing the proximity count when it's 0
            }`}
        </Square>
      );
    });

    return (
      <Layout
        title={`Minesweeper`}
        handleChange={this.handleChange}
        mineCount={this.state.mineCount}
        time={displayTime}
      >
        {showPlayAgain ? (
          <GameStatus status={this.state.wonOrLost} reset={this.resetGame} />
        ) : null}

        <Desk boardSize={boardSize} style={wrapperGrid}>
          {grid}
        </Desk>
      </Layout>
    );
  }
}

export default Index;
