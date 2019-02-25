import React from 'react';

const GameStatus = ({status, reset}) => {
  return (
    <div>
      {status}
      <button onClick={reset}>Play Again?</button>
    </div>
  );
};

export default GameStatus;