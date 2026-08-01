import { type MinesweeperGame } from './minesweeper-game';
import { type MinesweeperTile } from './minesweeper-tile';
import { arrayContains, arrayDifference, arrayIntersection, arraysAreEqual } from './utils';

export type MineDataRelation = 'equals' | 'minimum' | 'maximum';

export type MinesData = {
  value: number;
  relation: MineDataRelation;
};

export interface DataNode {
  tiles: MinesweeperTile[];
  mines: MinesData;
  history: DataNode[];
}

/** Returns relation for the difference between two data nodes, if such relation exists */
const getDifferenceRelation = (node1: DataNode, node2: DataNode): MineDataRelation | undefined => {
  const a = node1.mines;
  const b = node2.mines;

  // a = A
  if (a.relation === 'equals') {
    // b = B -> [a-b = A-B]
    if (b.relation === 'equals') return 'equals';
    // b <= B -> [a-b >= A-B]
    if (b.relation === 'maximum') return 'minimum';
    // b >= B -> [a-b <= A-B]
    if (b.relation === 'minimum') return 'maximum';

    // Unreachable
    return;
  }

  // a <= A
  if (a.relation === 'maximum') {
    // b = B -> [a-b <= A-B]
    if (b.relation === 'equals') return 'maximum';
    // b >= B -> [a-b <= A-B]
    if (b.relation === 'minimum') return 'maximum';
  }

  // a >= A
  if (a.relation === 'minimum') {
    // b = B -> [a-b >= A-B]
    if (b.relation === 'equals') return 'minimum';
    // b <= B -> [a-b >= A-B]
    if (b.relation === 'maximum') return 'minimum';
  }
};

export class Information {
  data: DataNode[] = [];
  meaningfulData: DataNode[] = [];
  game: MinesweeperGame;
  lastInferIndex = -1;

  get foundMeaningfulData() {
    return !!this.meaningfulData[0];
  }

  constructor(game: MinesweeperGame) {
    this.game = game;
  }

  static normalizeNode(tilesOrNode: MinesweeperTile[] | DataNode, mines?: number) {
    let newNode: DataNode;
    if (Array.isArray(tilesOrNode) && mines !== undefined) {
      newNode = {
        tiles: tilesOrNode,
        mines: { relation: 'equals', value: mines },
        history: [],
      };
      newNode.history = [newNode];
    } else if (!Array.isArray(tilesOrNode)) {
      newNode = tilesOrNode;
    } else {
      // Unreachable
      throw new Error();
    }

    return newNode;
  }

  static isValidNode(node: DataNode) {
    // Information about 0 tiles is useless
    if (node.tiles.length === 0) {
      return false;
    }

    // Minimum 0 mines (or less) is useless
    if (node.mines.relation === 'minimum' && node.mines.value <= 0) {
      return false;
    }

    // Maximum tiles.length mines useless
    if (node.mines.relation === 'maximum' && node.mines.value === node.tiles.length) {
      return false;
    }

    return true;
  }

  static isMeaningfulNode(node: DataNode) {
    return (
      node.mines.value === 0 ||
      ((node.mines.relation === 'equals' || node.mines.relation === 'minimum') &&
        node.mines.value === node.tiles.length)
    );
  }

  add(tiles: MinesweeperTile[], mines: number): void;
  add(node: DataNode): void;
  add(tilesOrNode: MinesweeperTile[] | DataNode, mines?: number): void {
    // Disable adding if we already found meaningful data or the data is invalid
    if (this.meaningfulData.length !== 0) return;
    const newNode = Information.normalizeNode(tilesOrNode, mines);
    if (!Information.isValidNode(newNode)) return;

    // Check if we already have information about these tiles
    const existingTilesInfo = this.data.filter((node) => arraysAreEqual(node.tiles, newNode.tiles));
    for (let i = 0; i < existingTilesInfo.length; i++) {
      const existingInfo = existingTilesInfo[i];

      // If there is already information about exactly how many mines there are,
      // there's no new information to be gotten
      if (existingInfo.mines.relation === 'equals') {
        return;
      }

      // If it's the same relation, we'll only continue if the new info is more accurate
      if (existingInfo.mines.relation === newNode.mines.relation) {
        if (
          (newNode.mines.relation === 'maximum' &&
            newNode.mines.value < existingInfo.mines.value) ||
          (newNode.mines.relation === 'minimum' && newNode.mines.value > existingInfo.mines.value)
        ) {
          const existingInfoIndex = this.data.indexOf(existingInfo);
          this.data.splice(existingInfoIndex, 1);
        } else {
          return;
        }
      }

      if (
        existingInfo.mines.relation !== newNode.mines.relation &&
        existingInfo.mines.value === newNode.mines.value
      ) {
        // There was already a node, that's not relation 'equals', and not relation of the new node
        // So the options are:
        // 1) existingNode.relation === 'minimum' && newNode.relation === 'maximum'
        // 2) existingNode.relation === 'minimum' && newNode.relation === 'maximum'
        // Either way, we can remove the old node, and change this one to 'equals'
        const existingInfoIndex = this.data.indexOf(existingInfo);
        this.data.splice(existingInfoIndex, 1);
        newNode.mines.relation = 'equals';
      }
    }

    // Add the new data node
    this.data.push(newNode);
    if (Information.isMeaningfulNode(newNode)) {
      this.meaningfulData.push(newNode);
    }
  }

  infer(node: DataNode, otherNode: DataNode) {
    if (node === otherNode) return;

    // Empty intersection = no data to infer
    const intersection = arrayIntersection(node.tiles, otherNode.tiles);
    if (intersection.length === 0) {
      return;
    }

    const differenceNew = arrayDifference(otherNode.tiles, node.tiles);
    const differenceOld = arrayDifference(node.tiles, otherNode.tiles);

    const relationDifferenceNew = getDifferenceRelation(otherNode, node);
    const relationDifferenceOld = getDifferenceRelation(node, otherNode);

    if (
      differenceNew.length !== 0 &&
      relationDifferenceNew &&
      arrayContains(otherNode.tiles, node.tiles)
    ) {
      // Inferred data from differenceNew
      const inferredDataNode: DataNode = {
        tiles: differenceNew,
        mines: {
          relation: relationDifferenceNew,
          value: otherNode.mines.value - node.mines.value,
        },
        history: node.history.concat(otherNode.history),
      };
      this.add(inferredDataNode);
    } else if (
      differenceOld.length !== 0 &&
      relationDifferenceOld &&
      arrayContains(node.tiles, otherNode.tiles)
    ) {
      // Inferred data from differenceOld
      const inferredDataNode: DataNode = {
        tiles: differenceOld,
        mines: {
          relation: relationDifferenceOld,
          value: node.mines.value - otherNode.mines.value,
        },
        history: otherNode.history.concat(node.history),
      };

      this.add(inferredDataNode);
    } else if (node.mines.relation !== 'minimum' && otherNode.mines.relation !== 'minimum') {
      // We only care about this if the arrays don't contain each other
      // Inferring data from intersection
      const inferredDataNode: DataNode = {
        tiles: intersection,
        mines: {
          relation: 'maximum',
          value: Math.min(node.mines.value, otherNode.mines.value),
        },
        history: node.history.concat(otherNode.history),
      };
      this.add(inferredDataNode);
    }
  }

  /**
   * Infers data based on available data and what was already inferred. Returns false if no new
   * information can be inferred. True otherwise
   */
  inferData(): boolean {
    // For each node, starting at lastInferIndex+1, infer against all other nodes
    const originalDataCount = this.data.length;
    const start = this.lastInferIndex + 1;

    this.data.slice(start).forEach((node, index) => {
      this.data.slice(0, start + index).forEach((otherNode) => {
        this.infer(node, otherNode);
      });
    });

    this.lastInferIndex = originalDataCount;

    return originalDataCount !== this.data.length;
  }

  inferMinesLeft(node: DataNode) {
    const allHiddenTiles = this.game.getAllTiles('hidden');
    const { minesLeft } = this.game;
    const hiddenDifference = arrayDifference(allHiddenTiles, node.tiles);

    // We know there are no mines in the difference
    if (
      (node.mines.relation === 'minimum' || node.mines.relation === 'equals') &&
      node.mines.value === minesLeft
    ) {
      const newData: DataNode = {
        mines: {
          relation: 'equals',
          value: 0,
        },
        tiles: hiddenDifference,
        history: node.history,
      };

      this.add(newData);
    }

    // We know there are only mines in the difference
    if (
      (node.mines.relation === 'maximum' || node.mines.relation === 'equals') &&
      hiddenDifference.length === minesLeft - node.mines.value
    ) {
      const newData: DataNode = {
        mines: {
          relation: 'equals',
          value: hiddenDifference.length,
        },
        tiles: hiddenDifference,
        history: node.history,
      };

      this.add(newData);
    }
  }

  inferSum(node: DataNode, otherNode: DataNode) {
    if (node === otherNode) return;

    // Summing intersecting nodes is pointless
    if (arrayIntersection(node.tiles, otherNode.tiles).length !== 0) return;

    const newNode: DataNode = {
      tiles: node.tiles.concat(otherNode.tiles),
      mines: {
        relation: 'equals',
        value: node.mines.value + otherNode.mines.value,
      },
      history: node.history.concat(otherNode.history),
    };

    this.add(newNode);
    this.inferMinesLeft(newNode);

    return this.foundMeaningfulData;
  }
  /** Infers data for minesLeft. Returns false if no new information can be inferred. True otherwise */
  inferMinesLeftData() {
    // For each node, starting at lastInferIndex+1, infer against all other nodes
    const originalDataCount = this.data.length;
    const start = this.lastInferIndex + 1;

    this.data
      .slice(start)
      .some((node, index) =>
        this.data.slice(0, start + index).some((otherNode) => this.inferSum(node, otherNode)),
      );

    this.lastInferIndex = originalDataCount;

    return originalDataCount !== this.data.length;
  }

  /** Try to infer anything we can from the minesLeft data we have */
  checkMinesLeft() {
    // TODO: Calculate if I can check minesleft rather than check for >6
    if (this.game.minesLeft > 6) return;

    this.lastInferIndex = -1;
    let canInferMoreData = true;

    // TODO: We should do this another way
    // Instead of inferring all possible combinations (which is quite inefficient...)
    // Start at one node, and calculate the maximum combination for it
    // If a single maximum combination still didn't yield meaningful info, move to the next one
    // Do this until we've been through all nodes
    // Should be much faster, especially if we have to go 3+ levels deep
    // We can finish with 15 data nodes instead of 2000+ to reach the conclusion
    this.data = this.data.filter((node) => node.mines.relation === 'equals');
    while (!this.foundMeaningfulData && canInferMoreData) {
      canInferMoreData = this.inferMinesLeftData();
    }
  }
}
