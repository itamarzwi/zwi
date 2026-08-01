import shuffleArray from 'shuffle-array';

import { MinesweeperTile, type TileStatus } from './minesweeper-tile';

export type Callback = () => void | Promise<void>;

export class MinesweeperGame {
  public readonly HEIGHT: number;
  public readonly WIDTH: number;
  public readonly MINE_COUNT: number;

  public isSandbox;
  private revealedCount: number = 0;
  public minesLeft: number;
  public board: MinesweeperTile[][];
  private allTiles: MinesweeperTile[];
  private mines: MinesweeperTile[];
  public initiated: boolean = false;
  public isGameLost: boolean = false;
  public isGameWon: boolean = false;
  private gameInitEventListeners: Callback[] = [];
  private gameLostEventListeners: Callback[] = [];
  private gameWinEventListeners: Callback[] = [];

  public get isGameOver() {
    return this.isGameLost || this.isGameWon;
  }

  constructor(width: number, height: number, mineCount: number, isSandbox = false) {
    if (!Number.isInteger(width) || width <= 0) {
      throw new Error('Width parameter must be a positive integer');
    }

    if (!Number.isInteger(height) || height <= 0) {
      throw new Error('Height parameter must be a positive integer');
    }

    if (!Number.isInteger(mineCount) || mineCount <= 0) {
      throw new Error('Mine count parameter must be a positive integer');
    }

    this.WIDTH = width;
    this.HEIGHT = height;
    this.MINE_COUNT = mineCount;
    this.minesLeft = mineCount;

    // this.WIDTH = 5;
    // this.HEIGHT = 10;
    // this.MINE_COUNT = 12;
    // this.minesLeft = 12;

    if (isSandbox) {
      this.minesLeft = 0;
      this.MINE_COUNT = 0;
    }

    this.board = this.getBoard();
    this.allTiles = this.board.flat();
    this.isSandbox = isSandbox;
    this.mines = [];
  }

  private getBoard() {
    const board: MinesweeperTile[][] = [];

    for (let row = 0; row < this.HEIGHT; row++) {
      board[row] = [];
      for (let col = 0; col < this.WIDTH; col++) {
        const tile = new MinesweeperTile(row, col, this);
        board[row][col] = tile;
      }
    }

    return board;
  }

  initBoard(row: number, col: number) {
    const firstTile = this.board[row][col];
    const mines: MinesweeperTile[] = [];
    const potentialMines = this.board.flat().filter((tile) => tile !== firstTile);

    shuffleArray(potentialMines);
    const minePoints = potentialMines.slice(0, this.MINE_COUNT);
    // const minePoints = [
    //   this.board[0][2],
    //   this.board[0][3],

    //   this.board[2][0],
    //   this.board[2][2],
    //   this.board[2][4],

    //   this.board[3][2],

    //   this.board[4][1],

    //   this.board[5][0],

    //   this.board[8][0],
    //   this.board[8][2],
    //   this.board[8][4],
    //   this.board[9][2],
    // ];

    minePoints.forEach((tile) => {
      tile.isMine = true;
      mines.push(tile);
    });

    potentialMines.forEach((tile) => tile.calculateValue());
    firstTile.calculateValue();

    this.mines = mines;
    this.initiated = true;

    this.gameInitEventListeners.forEach((cb) => cb());
  }

  gameOver() {
    this.isGameLost = true;
    this.mines.forEach((mine) => mine.isFlagged || mine.reveal());

    this.gameLostEventListeners.forEach((cb) => cb());
  }

  public getActiveTiles(...statuses: TileStatus[]) {
    const activeTiles = this.allTiles.filter((tile) => !tile.isFinal);

    if (statuses.length === 0) {
      return activeTiles;
    }

    return activeTiles.filter((tile) => statuses.includes(tile.status));
  }

  public getAllTiles(...statuses: TileStatus[]) {
    if (statuses.length === 0) {
      return this.allTiles;
    }

    return this.allTiles.filter((tile) => statuses.includes(tile.status));
  }

  public onGameLose(cb: Callback) {
    if (this.isGameLost) {
      cb();
    } else {
      this.gameLostEventListeners.push(cb);
    }
  }

  public onGameWin(cb: Callback) {
    if (this.isGameWon) {
      cb();
    } else {
      this.gameWinEventListeners.push(cb);
    }
  }

  public onGameInit(cb: Callback) {
    if (this.initiated) {
      cb();
    } else {
      this.gameInitEventListeners.push(cb);
    }
  }

  public async waitForEnd(timeout?: number) {
    return await new Promise<void>((resolve, reject) => {
      this.onGameLose(() => resolve());
      this.onGameWin(() => resolve());

      if (timeout) {
        setTimeout(() => {
          reject();
        }, timeout);
      }
    });
  }

  public upRevealCount() {
    this.revealedCount++;
    if (this.revealedCount === this.allTiles.length - this.mines.length) {
      this.isGameWon = true;
      this.minesLeft = 0;
      this.getAllTiles('hidden').forEach((tile) => tile.flag(true));
      this.gameWinEventListeners.forEach((cb) => cb());
    }
  }

  public getCorners() {
    return [
      this.board[0][0],
      this.board[0][this.WIDTH - 1],
      this.board[this.HEIGHT - 1][0],
      this.board[this.HEIGHT - 1][this.WIDTH - 1],
    ];
  }
}
