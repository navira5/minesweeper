import React from 'react';

const Head = ({time, flags}) => {
  return (
    <div>
      Flags: {flags}
      <div>
        Time: {time}
      </div>

    </div>
  );
};

export default Head;