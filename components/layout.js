import Link from 'next/link';
import Head from 'next/head';
import { StyleProvider } from 'cf-style-nextjs';
import { createComponent } from 'cf-style-container';
import { ok } from 'assert';


const Center = createComponent(({ theme }) => ({
  margin: '0px auto',
  margin: theme.space[4]
}));

export default ({ children, title = 'Minesweeper', handleChange, mineCount, time }) => {
  
  
  
  return <StyleProvider>
      <Center>
        <h1>{title}</h1>
        <div>Mines Left: {mineCount}</div>
        <div>Timer: {time} </div>

        <div>
          {' '}
          Level:
          <select onChange={e => handleChange(e.target.value)}>
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


