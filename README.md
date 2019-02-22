# Minesweeper

## Installation

It assumes you have the latest node and yarn installed.

```
yarn install
yarn dev
open http://localhost:3000
```

## Rules

The rules are pretty simple (try to play with the [demo](https://sweeper.now.sh/)):

* User Stories:

  ```Board Set Up```
  * Should be able to select easy, medium, hard levels; default is easy
  * Should place random mines on board based on selection of easy, medium, hard
  * Should display number of mines in header
  * Should display initial time in header
  * Should display reset button which clears the board and resets to easy level
  * Should display How To Play button which gives rules and click instructions
  

```User Action```
  * First click starts the time
  * Player can left click to reveal/open square.
  * Player can right click to flag square as mine.
  * The number tells how many mines are in the immediate neighborhood.
  * The goal is to reveal or flag all squares without revealing a mine
  * When number of flags match number of mines from header, then user wins
  * When user wins, get message user wins and reset game
  * When user loses, get message user loses and reset game
  
  



