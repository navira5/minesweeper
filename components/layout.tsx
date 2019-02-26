import Link from 'next/link';
import Head from 'next/head';
import { StyleProvider } from 'cf-style-nextjs';
import { createComponent } from 'cf-style-container';
import { ok } from 'assert';


const Center = createComponent(({ theme }) => ({
  margin: '0px auto',
  margin: theme.space[4],
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  width: '50%',
  // margin: '0 auto',
  padding: '10px'

}));

export default ({ children, title = 'Minesweeper', handleChange, mineCount, time }) => {
  

  const wrapper = {
    width: '50%',
    height: '100px',
    margin: 'auto',
    padding: '10px',
    fontSize: '16px'
  };
  const left = {
    width: '50%',
    float: 'left',
    marginRight: '20px'
  }
  const right = {
    float: 'left',
    marginLeft: '50%',
  }

  const level = {
    marginBottom: '20px',
  }
  
  return <StyleProvider>
      <Center>
        <h1>{title}</h1>
        <div style={wrapper}>
          <div style={left}>Mines Left: {mineCount} </div>
          <div stlye={right}>Timer: {time}</div>
        </div>
        <div>
          {' '}
          Level:
          <select style={level} onChange={e => handleChange(e.target.value)}>
            <option value="Easy">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        {children}
      </Center>
    </StyleProvider>;
}


