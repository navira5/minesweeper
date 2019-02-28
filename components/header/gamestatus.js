
import { createComponent } from 'cf-style-container';

const GameStatus = createComponent(
  () => ({
    border: '3px red solid',
    display: 'center',
    borderRadius: '5px',
    flexDirection: 'row',
    textAlign: 'center',
    width: '150px',
    margin: '20px auto',
    padding: '10px'
  }),
  'div'
);

export default props => {
  const playBtn = { 
    margin: '0 auto', 
    width: '80%', 
    borderRadius: '5px', 
    background: 'rgb(211,211,211)', 
    fontSize: '14px' 
  };

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


