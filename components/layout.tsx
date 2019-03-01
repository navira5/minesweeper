import { StyleProvider } from "cf-style-nextjs";
import { createComponent } from "cf-style-container";

const Center = createComponent(() => ({
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  color: "rgb(32, 32, 32)"
}));

export default ({children, title = "Minesweeper", handleChange, mineCount, time}) => {
 
  const wrapper = {
    width: "100%",
    height: "50px",
    margin: "auto",
    padding: "0%",
    fontSize: "16px"
  };
  
  const level = {
    width: "150px",
    border: `1px solid black`,
    margin: "20px 0 20px 0",
    padding: "0"
  };

  return (
    <StyleProvider>
      <Center>
        <form>
          <div className="form-group">
            <h3>{title}</h3>
            <div style={wrapper}>
              <div>Mines:{mineCount} </div>
              <div>{time}</div>
            </div>{" "}
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
  );
};
