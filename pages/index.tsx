import React from "react";
import Layout from "../components/layout";
// game components
import Desk from "../components/desk";
import Square from "../components/square";
import Mine from "../components/mine";
import Flag from "../components/flag";
import GameStatus from "../components/header/gamestatus";
import {
  calcTime,
  generateSquares,
  squaresAroundTarget,
  mineProximtyCountLookup,
  openSquares
} from "../components/helpers";
//import { timingSafeEqual } from 'crypto';
import { render } from "fela-dom";

type IndexState = {
  squares: any[],
  boardSize: number,
  level: string,
  mineCount: number,
  time: number,
  timeOn: boolean,
  minePos: any[],
  timer: any,
  showPlayAgain: boolean,
  wonOrLost: string,
  windowWidth: number
};

class Index extends React.Component<{}, IndexState> {
  constructor(props) {
    super(props);
    this.state = {
      squares: [],
      boardSize: 10,
      level: "Easy",
      mineCount: 10,
      time: 0,
      timeOn: false,
      minePos: [],
      timer: 0,
      showPlayAgain: false,
      wonOrLost: "",
      windowWidth: 0
    };
  }

  /*  DYNAMICALLY KEEP TRACK OF WINDOW WIDTH FOR RESPONSIVENESS */

  updateDimensions = () => {
    this.setState({ windowWidth: window.innerWidth });
  };
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
  };

  componentDidMount = () => {
    this.setState({ windowWidth: window.innerWidth });
    this.handleChange(this.state.level);
    window.addEventListener("resize", this.updateDimensions);
  };

/*  HANDLE GAME LOGIC */

  handleChange = level => {
    let mineCount;
    if (level === "Easy") {
      mineCount = 10;
    } else if (level === "Medium") {
      mineCount = 20;
    } else if (level === "Hard") {
      mineCount = 40;
    }
    const squares = generateSquares(mineCount);
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
    //O(1) b/c array will always have length of 1
    const impactedSquares = squaresAroundTarget([square]);
    square.isOpen = true;

    //array of squares with 0 prox and now open; O(n^2) b/c of .includes is nested in .filter method
    const squaresWithNoMinesTouchingIt = openSquares(this.state.squares, impactedSquares);

    //recursively check for any squares with 0 proximity squares touching; O(n) linear
    squaresWithNoMinesTouchingIt.forEach(s => {
      this.floodFill(s);
    });

    this.setState(prevState => ({ squares: prevState.squares }));
  };

/*  RESET BOARD WHEN GAME ENDS */

  togglePlayAgain = () => {
    this.setState({ showPlayAgain: !this.state.showPlayAgain });
  };

  resetGame = () => {
    this.setState(
      {
        squares: [],
        boardSize: 10,
        level: "Easy",
        mineCount: 10,
        minePos: [],
        showPlayAgain: false,
        wonOrLost: "",
        time: 0,
        timer: 0,
        timeOn: false
      },
      () => {
        this.handleChange("Easy");
        this.resetTimer();
        this.setState(prevState => ({ squares: prevState.squares }));
      }
    );
  };

  /*  TIMER */

  startTimer = () => {
    let timer = setInterval(this.addTime, 1000);
    this.setState({ timer, timeOn: true });
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

/*  CLICK EVENTS: LEFT/REGULAR CLICK, RIGHT CLICK, AND LONG BUTTON PRESS */

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
      this.setState({ wonOrLost: "You Lost", showPlayAgain: true });
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
    if (!square.isOpen && !square.hasFlag) {
      square.hasFlag = true;
      if (square.hasMine) {
        this.setState({ mineCount: this.state.mineCount - 1 });
        if (this.state.mineCount === 1) {
          this.stopTimer();
          this.setState({ wonOrLost: "You Won", showPlayAgain: true });
        }
      }
    }
  };

/*  LONG HOLD OF BUTTON PLACES FLAG TO ENABLE TOUCHSCREEN FUNCTIONALITY */
  handleButtonPress = (e, s) => {
    this.longPressTimer = setTimeout(() => {
      this.handleRightClick(e, s);
    }, 1000);
  };

  handleButtonRelease = (e, s) => {
    clearTimeout(this.longPressTimer);
  };

  render() {
    const { boardSize, squares, showPlayAgain, windowWidth, mineCount, wonOrLost } = this.state;
  
    // look into user agent to determine screen type for future
    const isTouchScreen = windowWidth <= 768;

    const displayTime = calcTime(this.state.time);

    const wrapperGrid = {
      margin: "auto",
      padding: "0%",
      paddingLeft: "0"
    };
    const grid = squares.map((s, i) => {
      return (
        <Square

          /* TRIGGERS LONG PRESS FUNCTIONAILTY  */
          onTouchStart={e => this.handleButtonPress(e, s)}
          onTouchEnd={e => this.handleButtonRelease(e, s)}
          onMouseDown={e => this.handleButtonPress(e, s)}
          onMouseUp={e => this.handleButtonRelease(e, s)}
          onMouseLeave={e => this.handleButtonRelease(e, s)}
       
          num={s.proximityCount}
          
          onContextMenu={e => !isTouchScreen ? this.handleRightClick(e, s) : null}
          key={i}
          cell={s}
          disabled={s.isOpen || s.hasFlag ? true : false}
          onClick={e => this.handleClick(s, e)}
        >
          {s.hasFlag && <Flag />}
          {s.hasMine && s.isOpen && <Mine />}
          {s.isOpen && !s.proximityCount && !s.hasMine && ""}
          {s.isOpen &&

            // need double bang so that empty squares don't get filled with zeros
            !!s.proximityCount &&
            !s.hasMine && `${s.proximityCount}`}

        </Square>
      );
    });

    return (<Layout
        title={`Minesweeper`}
        handleChange={this.handleChange}
        mineCount={mineCount}
        time={displayTime}
      >
        {showPlayAgain ? (<GameStatus status={wonOrLost} reset={this.resetGame} />) : null}

        <Desk boardSize={boardSize} style={wrapperGrid}>
          {grid}
        </Desk>
      </Layout>
    );
  }
}
export default Index;
