import React from 'react';
import Layout from '../components/layout';

// game components
import Desk from '../components/desk';
import Square from '../components/square';
import Mine from '../components/mine';
import Flag from '../components/flag';
//import { render } from 'fela-dom';


class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    boardSize: 10,
    level: 'Easy',
    flagCount: 10,
    time: 0
  }

handleChange = level => {

  let boardSize = 0;
 
  if (level === 'Easy') {
    boardSize = 10;
 
  } else if (level === 'Medium') {
    boardSize = 13;

  } else if (level === 'Hard') {
    boardSize = 16;
    
  }
  this.setState({ boardSize });
}



render() {

  const boardSize = this.state.boardSize;

  const grid = [...Array(boardSize * boardSize).keys()];
  
  return <Layout 
            title={`Minesweeper (active)`} 
            handleChange={this.handleChange} 
            flagCount={this.state.flagCount}
            time={this.state.time}>
          <Desk boardSize={boardSize}>
            {grid.map(i => (
              <Square key={i} disabled={i === 55 || i === 10}>
                {i === 21 && <Mine />}
                {i === 25 && <Flag />}
                {i === 77 ? '4' : ''}
              </Square>
            ))}
          </Desk>
        </Layout>;
}
}



export default Index;
