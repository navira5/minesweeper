import { createComponent } from "cf-style-container";
const Square = createComponent(
  ({ disabled, num }) => ({
    width: 40,
    height: 40,
    padding: 10,
    cursor: disabled ? "initial" : "pointer",
    backgroundColor: disabled ? "rgb(211,211,211)" : "rgb(245,245,245)",
    border: `1px solid rgb(64,64,64)`,
    lineHeight: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: num === 1 ? "blue" : num === 2 ? "green" : "red",
    boxShadow: "inset 0px 0px 10px rgb(169,169,169)"
  }),
  "div",
  [
    "onClick",
    "onContextMenu",
    "onTouchStart",
    "onTouchEnd",
    "onMouseDown",
    "onMouseUp",
    "onMouseLeave"
  ]
);
export default Square;
