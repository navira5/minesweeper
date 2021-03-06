export const calcTime = time => {
  return new Date(time * 1000).toISOString().substr(11, 8);
};
/*  SET THE BOARD AND PLACE MINES IN RANDOM POSITIONS */
export const generateSquares = mineCount => {
  //make array with objects (info about each square will go in here)
  const squares = [...Array(100)].map((s, i) => {
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


/*  USED FOR FLOOD FILL TO OPEN SQUARES WITH NO MINES IN ITS VICINITY */
export const openSquares = (squares, impactedSquares) => {
  const floodTheseSquares = squares.filter(item => {
    //hash map to reduce O(n) vs quick to implementation like below but quadratic
    if (impactedSquares.includes(item.squarePos)) {
      if (item.proximityCount === 0 && !item.isOpen && !item.hasMine) {
        item.isOpen = true;
        return item;
      } else if (!item.hasMine && item.proximityCount > 0) {
        item.isOpen = true;
      }
    }
  });
  return floodTheseSquares;
};

/*  OBJ ={SQR INDEX: NUMBER OF MINES TOUCHING THIS SQR INDEX} */
export const mineProximtyCountLookup = (arr, squares) => {
  return arr.reduce((acc, item) => {
    if (item >= 0 && item < squares.length) {
      acc[item] ? acc[item]++ : (acc[item] = 1);
    }
    return acc;
  }, {});
};

/*  GRAB ALL SQUARES TOUCHING THE MIDDLE SQUARE AND RETURN AS ARRAY */
export const squaresAroundTarget = arr => {
  let impactedSquares = [];
  const minor = 11;
  const middle = 10;
  const major = 9;
  for (let i = 0; i < arr.length; i++) {
    let curr = arr[i].squarePos;
    let currStr = curr.toString();
    // first column
    if (currStr[1] === "0" || currStr[0] === "0") {
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
      currStr[1] === "9" ||
      (currStr[0] === "9" && currStr.length === 1)
    ) {
      //last column
      impactedSquares.push(
        curr - minor,
        curr - middle,
        curr - 1,
        curr + major,
        curr + middle
      );
    } else if (currStr[1] === "9" && currStr.length === 2) {
      //last row
      impactedSquares.push(
        curr - minor,
        curr - middle,
        curr - major,
        curr - 1,
        curr + 1
      );
    } else {
      //it's not touching an edge
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
  return impactedSquares;
};
