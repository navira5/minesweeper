import { createComponent } from 'cf-style-container';

const Desk = createComponent(({ boardSize }) => ({
  width: 40 * boardSize + 2,
  height: 40 * boardSize + 2,
  border: `1px solid black`,
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  margin: '0 auto',
  marginRight: '50px',
 
}));

export default Desk;
