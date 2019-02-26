
import { createComponent } from 'cf-style-container';

const GameStatus = createComponent(
  () => ({
    display: 'flex',
    flexDirection: 'column',
    width: '35%',
    marginLeft: '5%',
    border: 'black solid',
    borderWidth: '1px',
    textAlign: 'center',
    width: '50%',
    margin: '0 auto'
  }),
  'div'
);

export default (props) => (
  <GameStatus>
    <div>
      {props.status}
      <button onClick={props.reset}>Play Again?</button>
      </div>
  </GameStatus>
)

