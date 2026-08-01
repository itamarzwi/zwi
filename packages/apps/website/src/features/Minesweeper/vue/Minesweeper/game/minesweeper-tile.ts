import { clamp } from '@vueuse/core';

import type { MinesweeperGame } from './minesweeper-game';

// Final = Revealed tile, and all adjacent tiles are also revealed / flagged
export type TileStatus = 'hidden' | 'flagged' | 'revealed';

export class MinesweeperTile {
  row: number;
  col: number;
  value: number = 0;
  isMine: boolean = false;
  isPeaking: boolean = false;
  game: MinesweeperGame;
  isLosingTile: boolean = false;
  status: TileStatus = 'hidden';
  flagCount: number = 0;
  isFinal: boolean = false;

  public get isRevealed() {
    return this.status === 'revealed';
  }

  public get isFlagged() {
    return this.status === 'flagged';
  }

  public get BOARD_WIDTH() {
    return this.game.WIDTH;
  }

  public get BOARD_HEIGHT() {
    return this.game.HEIGHT;
  }

  constructor(row: number, col: number, game: MinesweeperGame) {
    this.row = row;
    this.col = col;
    this.game = game;
  }

  public getAdjacent(...statuses: TileStatus[]) {
    const adjacent: MinesweeperTile[] = [];

    // Don't exit matrix coundaries
    const rowStart = clamp(this.row - 1, 0, this.row);
    const rowEnd = clamp(this.row + 1, this.row, this.BOARD_HEIGHT - 1);

    // Don't exit matrix coundaries
    const colStart = clamp(this.col - 1, 0, this.col);
    const colEnd = clamp(this.col + 1, this.col, this.BOARD_WIDTH - 1);

    // Go over all adjacent tiles
    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        const tile = this.game.board[row][col];

        // Don't count self as a tile
        if (
          tile !== this &&
          (statuses.length === 0 || statuses.includes(tile.status))
        ) {
          adjacent.push(tile);
        }
      }
    }

    return adjacent;
  }

  public forAdjacent(fn: Parameters<MinesweeperTile[]['forEach']>[0]) {
    return this.getAdjacent().forEach(fn);
  }

  public calculateValue() {
    if (this.isMine) return;

    let value = 0;
    this.forAdjacent(adjacentTile => {
      if (adjacentTile.isMine) {
        value++;
      }
    });

    this.value = value;
  }

  public updateIsFinal() {
    this.isFinal =
      this.status !== 'hidden' && this.getAdjacent('hidden').length === 0;
  }

  public reveal() {
    this.status = 'revealed';
    this.updateIsFinal();
    this.forAdjacent(tile => tile.updateIsFinal());

    if (this.game.isGameLost) return;

    if (this.isMine) {
      this.isLosingTile = true;
      this.game.gameOver();
    } else {
      this.game.upRevealCount();
    }
  }

  private revealAdjacent(handled: MinesweeperTile[]) {
    this.forAdjacent(tile => {
      // Only click if we haven't been over it already
      if (!handled.includes(tile)) {
        handled.push(tile);

        if (tile.isFlagged) return;

        if (!tile.isRevealed) {
          tile.reveal();

          if (tile.value === 0 && !tile.isMine) {
            tile.revealAdjacent(handled);
          }
        }
      }
    });
  }

  public click() {
    if (this.game.isSandbox) {
      this.status = this.isRevealed ? 'hidden' : 'revealed';
      return;
    }

    if (this.game.isGameLost) return;

    if (!this.game.initiated) {
      this.game.initBoard(this.row, this.col);
    }

    // Clicking on a flag does nothing
    if (this.isFlagged) return;

    if (this.isPeaking) this.unpeak();

    // Reveal self, and mark that we've handled ourself
    const wasRevealed = this.isRevealed;
    const handled = [this];
    if (!this.isRevealed) {
      this.reveal();
    }

    // If we're not a mine and value is 0, reveal adjacent
    // If we're clicking a fully flagged number, reveal adjacent
    if (
      (this.value === 0 && !this.isMine) ||
      (wasRevealed && this.flagCount === this.value)
    ) {
      this.revealAdjacent(handled);

      // After we've revealed all tiles this turn, lets see who is finalized
      // handled.forEach(tile => tile.updateFinalStatus());
    }
  }

  public flag(flagOnly = false) {
    if (this.game.isSandbox) {
      this.status = this.isFlagged ? 'hidden' : 'flagged';
      this.isMine = !this.isMine;
      this.forAdjacent(tile => tile.calculateValue());
      return;
    }

    if (this.game.isGameLost) return;

    // For game over, just flag it, nothing else
    if (flagOnly) {
      this.status = 'flagged';
      return;
    }

    if (this.isFlagged) {
      this.status = 'hidden';
      this.forAdjacent(tile => tile.flagCount--);
      this.game.minesLeft++;
    } else {
      this.status = 'flagged';
      this.updateIsFinal();
      this.forAdjacent(tile => tile.flagCount++);
      this.forAdjacent(tile => tile.updateIsFinal());
      this.game.minesLeft--;
    }
  }

  public peak() {
    if (this.isFlagged || this.isFinal) return;

    this.isPeaking = true;

    // If we are revealed, peaking means to also peak the unrevealed adjacent
    if (this.isRevealed) {
      const unrevealedAdjacent = this.getAdjacent('hidden');
      unrevealedAdjacent.forEach(tile => tile.peak());
      return unrevealedAdjacent;
    }
  }

  public unpeak() {
    if (this.isFlagged || this.isFinal) return;

    this.isPeaking = false;

    if (this.isRevealed) {
      // If we are revealed, unpeaking means to unpeak the unrevealed adjacent
      const unrevealedAdjacent = this.getAdjacent('hidden');
      unrevealedAdjacent.forEach(tile => tile.unpeak());
      return unrevealedAdjacent;
    }
  }
}
