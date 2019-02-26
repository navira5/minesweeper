import { createComponent } from 'cf-style-container';

const Desk = createComponent(({ boardSize }) => ({
  width: 40 * boardSize + 2.25,
  height: 40 * boardSize + 2.25,
  border: `1px solid black`,
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  width: '50%',
  margin: '0 auto'

  
}));

export default Desk;
