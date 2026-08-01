import { Information } from './information';
import { type MinesweeperGame } from './minesweeper-game';
import { type MinesweeperTile } from './minesweeper-tile';
import { sleep } from './utils';

type FlagMove = {
  action: 'flag';
  tile: MinesweeperTile;
};
type ClickMove = {
  action: 'click';
  tile: MinesweeperTile;
};

type Move = FlagMove | ClickMove;

export class AutoPlayer {
  private game: MinesweeperGame;
  public shouldGuess: boolean;
  public moveQueue: Move[] = [];
  public delay: number = 0;

  constructor(game: MinesweeperGame, shouldGuess = false) {
    this.game = game;
    this.shouldGuess = shouldGuess;
  }

  /** Flag all remaining adjacent tiles a tile that needs it */
  private getSimpleFlagMoves(): FlagMove[] {
    const tileToFlagAdjacent = this.game.getActiveTiles('revealed').find((tile) => {
      const hiddenAdjacent = tile.getAdjacent('hidden').length;
      const flagAdjacent = tile.getAdjacent('flagged').length;
      return tile.value - flagAdjacent === hiddenAdjacent;
    });

    if (tileToFlagAdjacent) {
      const tilesToFlag = tileToFlagAdjacent.getAdjacent('hidden');

      return tilesToFlag.map((tile) => ({
        action: 'flag',
        tile,
      }));
    }

    return [];
  }

  /** Click a tile that is all flagged up */
  private getSimpleClickMoves(): ClickMove[] {
    const tileToClick = this.game.getActiveTiles('revealed').find((tile) => {
      const flagAdjacent = tile.getAdjacent('flagged').length;
      return tile.value === flagAdjacent;
    });

    if (tileToClick) {
      return [
        {
          action: 'click',
          tile: tileToClick,
        },
      ];
    }

    return [];
  }

  private getSmartMoves(): Move[] {
    const revealed = this.game.getActiveTiles('revealed');
    const handled: MinesweeperTile[] = [];

    const info = new Information(this.game);
    revealed.some((srcTile) => {
      if (handled.includes(srcTile)) return;

      const srcHiddenTiles = srcTile.getAdjacent('hidden');
      const srcPotentialMines = srcTile.value - srcTile.getAdjacent('flagged').length;
      info.add(srcHiddenTiles, srcPotentialMines);
      handled.push(srcTile);

      if (info.meaningfulData[0]) {
        return true;
      }
      return false;
    });

    // If no meaningful data found, start inferring data
    let canInferMoreData = true;
    while (!info.foundMeaningfulData && canInferMoreData) {
      canInferMoreData = info.inferData();
    }

    if (!info.foundMeaningfulData) {
      info.checkMinesLeft();
    }

    // If meaningful data found, we can make a 100% certain move
    if (info.foundMeaningfulData) {
      const data = info.meaningfulData[0];
      if (data.mines.value === 0) {
        return data.tiles.map((tile) => ({
          action: 'click',
          tile,
        }));
      }

      return data.tiles.map((tile) => ({
        action: 'flag',
        tile,
      }));
    }

    return [];
  }

  getGuessMove(): Move {
    // First, we see if there are double-hidden corners:
    const move: Partial<ClickMove> = {
      action: 'click',
    };

    this.game.getCorners().some((tile) => {
      if (tile.status === 'hidden') {
        move.tile = tile;
        return true;
      }

      return false;
    });

    // Pick a random tile
    if (!move.tile) {
      // TODO: Smart guess
      // After corners - do walls
      // Calculate % that a tile will be a mine maybe?
      // If there's a closed area and an open area, guess the open area
      // Always guess new info, so on [x-x-x] guess rightmost or leftmost
      const allTiles = this.game.getAllTiles('hidden');
      const randomTile = allTiles[Math.floor(Math.random() * allTiles.length)];

      move.tile = randomTile;
    }

    return move as Move;
  }

  /**
   * Fills the move queue
   *
   * @returns True if the queue is not empty, false otherwise
   */
  fillMoveQueue(): boolean {
    if (this.game.isGameLost || this.game.isGameWon) return false;
    if (this.moveQueue.length > 0) return true;

    this.moveQueue = this.getSimpleFlagMoves();
    if (this.moveQueue.length === 0) {
      this.moveQueue = this.getSimpleClickMoves();
    }
    if (this.moveQueue.length === 0) {
      this.moveQueue = this.getSmartMoves();
    }

    if (this.moveQueue.length === 0 && this.shouldGuess) {
      this.moveQueue = [this.getGuessMove()];
    }

    return this.moveQueue.length !== 0;
  }

  playNextMove() {
    if (this.game.isGameLost || this.game.isGameWon || this.moveQueue.length === 0) {
      return;
    }

    const nextMove = this.moveQueue.shift()!;

    if (nextMove.action === 'flag') {
      nextMove.tile.flag();
    } else {
      nextMove.tile.click();
    }
  }

  hasNextMove() {
    return this.moveQueue.length > 0;
  }

  async autoPlay(delay = 0) {
    if (delay) {
      this.delay = delay;
    }

    while (!this.game.isGameOver && (this.hasNextMove() || this.fillMoveQueue())) {
      if (this.delay) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(this.delay);
      }

      this.playNextMove();
    }
  }
}
