
import { createComponent } from 'cf-style-container';

const GameStatus = createComponent(
  () => ({
    border: '3px red solid',
    display: 'flex',
    borderRadius: '15px',
    flexDirection: 'column',
    textAlign: 'center',
    width: '50%',
    margin: '20px auto',
    padding: '10px'
  }),
  'div'
);

export default props => {
  const playBtn = { borderRadius: '5px', background: 'rgb(211,211,211)', fontSize: '14px' };
  return <GameStatus>
      <div>
        {props.status}
        <div>
          <button style={playBtn} onClick={props.reset}>
            Play Again?
          </button>
        </div>
      </div>
    </GameStatus>;
}


