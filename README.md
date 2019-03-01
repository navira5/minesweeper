# Minesweeper

## Installation

It assumes you have the latest node and yarn installed.

```
yarn install
yarn dev
open http://localhost:3000
```

## Rules
* Flag Placement: Right click OR click (touch for touchscreen devices) and hold for one second 
* Open Square: Left/regular click

## Demo

https://minesweeper-navira.herokuapp.com

## User Stories to create game

  ```Board Set Up```
  * Should be able to select easy, medium, hard levels; default is easy - DONE
  * Should place random mines on board based on selection of easy, medium, hard - DONE
  * Should display number of mines in header - DONE
  * Should display initial time in header - DONE
  * Should display reset button which clears the board and resets to easy level - DONE
  * Should handle easy, medium and hard levels -- DONE
  

```User Action```
  * First click starts the time -- DONE
  * Player can left click to reveal/open square. --DONE
  * Player can right click to flag square as mine. -- DONE
  * The number tells how many mines are in the immediate neighborhood -- DONE 
  * The goal is to reveal or flag all squares without revealing a mine -- DONE
  * When number of flags match number of mines from header, then user wins -- DONE
  * When user wins, get message user wins and reset game -- DONE
  * When user loses, show all bombs -- DONE
  * When user loses, get message user loses and reset game -- DONE 
  
  



