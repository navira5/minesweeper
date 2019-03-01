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
  margin: '0 auto',
  color: 'rgb(32, 32, 32)'

}));

export default ({ children, title = 'Minesweeper', isMobile, handleChange, mineCount, time }) => {
  
  //const showMobileButton = !isMobile ? <button onClick={toggleClickType}>Open or Flag</button> : null;
  //console.log(isMobile, 'window width')
  const wrapper = {
    width: '100%',
    height: '50px',
    margin: 'auto',
    padding: '0%',
    fontSize: '16px'
  };
  
  const level = { 
    width: '150px', 
    border: `1px solid black`, 
    float: 'center', 
    margin: 'auto', 
    margin: '20px 0 20px 0', 
    padding: '0' 
  };


  
  return <StyleProvider>
          <Center>
              <form>
                <div className="form-group">
                  <h3>{title}</h3>
                    <div style={wrapper}>
                      <div>Mines:{mineCount} </div> 
                      <div>{time}</div> 
                    </div>
            
                  {' '}

                  <select style={level} onChange={e => handleChange(e.target.value)}>
          
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
          
                {children}
                </div>
              </form>
           
          </Center>
        </StyleProvider>
 
  
}


