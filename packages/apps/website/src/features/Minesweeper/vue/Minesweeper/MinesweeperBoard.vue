<template>
  <div class="minesweeper-board">
    <div v-if="showIndexes" class="flex flex-row ml-[28px]">
      <div v-for="(_, colIndex) in game.board[0]" :key="colIndex" class="w-[28px] text-center">
        {{ colIndex }}
      </div>
    </div>
    <div v-for="(row, rowIndex) in game.board" :key="rowIndex" class="flex flex-row justify-center">
      <div v-if="showIndexes" class="w-[28px] text-center">{{ rowIndex }}</div>
      <Tile v-for="(tile, colIndex) in row" :key="colIndex" :tile="tile" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, ref } from 'vue';
import Tile from './MinesweeperTile.vue';
import { MinesweeperGame } from './game/minesweeper-game';
import { ShowIndexesKey } from './keys';

export default defineComponent({
  name: 'MinesweeperGame',
  components: { Tile },
  props: {
    game: {
      type: Object as PropType<MinesweeperGame>,
      required: true,
    },
  },
  setup() {
    const showIndexes = inject(ShowIndexesKey, ref(false));
    return { showIndexes };
  },
});
</script>
