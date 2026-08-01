<template>
  <div
    :class="tileClass"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mouseout="onMouseOut"
    @mouseenter="onMouseEnter"
    @contextmenu="$event.preventDefault()"
  ></div>
</template>

<script lang="ts">
/* eslint-disable no-bitwise */
import { computed, defineComponent, PropType } from 'vue';
import { MinesweeperTile } from './game/minesweeper-tile';

// e.buttons & LMB - Left mouse is active in the event
// e.buttons & RMB - Right mouse is active in the event
const LMB = 0x1;

// e.button === LMC - Left mouse click (up or down) was involved in the event
// e.button === RMC - Right mouse click (up or down) was involved in the event
const LMC = 0;
const RMC = 2;

export default defineComponent({
  name: 'MinesweeperTile',
  components: {},
  props: {
    tile: {
      required: true,
      type: Object as PropType<MinesweeperTile>,
    },
  },
  emits: ['click', 'flag'],
  setup(props) {
    const textClass = computed(() => {
      if (props.tile.value === 1) return 'text-blue-700';
      if (props.tile.value === 2) return 'text-green-700';
      if (props.tile.value === 3) return 'text-red-700';
      if (props.tile.value === 4) return 'text-blue-700';
      if (props.tile.value === 5) return 'text-red-900';
      if (props.tile.value === 6) return 'text-blue-900';
      if (props.tile.value === 7) return 'text-gray-800';

      return 'text-black';
    });

    const idfk = () => {
      if (props.tile.isFlagged) {
        if (props.tile.game.isGameLost && !props.tile.isMine) {
          return 'ms-tile-flag-wrong';
        }

        return 'ms-tile-flag';
      }

      if (!props.tile.isRevealed) {
        if (props.tile.isPeaking) return 'ms-tile-peaking';
        return 'ms-tile-hidden';
      }

      if (props.tile.isMine) {
        if (props.tile.isLosingTile) {
          return 'ms-tile-mine-red';
        }

        return 'ms-tile-mine';
      }

      if (props.tile.value === 0) return 'ms-tile-0';
      if (props.tile.value === 1) return 'ms-tile-1';
      if (props.tile.value === 2) return 'ms-tile-2';
      if (props.tile.value === 3) return 'ms-tile-3';
      if (props.tile.value === 4) return 'ms-tile-4';
      if (props.tile.value === 5) return 'ms-tile-5';
      if (props.tile.value === 6) return 'ms-tile-6';
      if (props.tile.value === 7) return 'ms-tile-7';

      return 'ms-tile-8';
    };

    const tileClass = computed(() => `ms-tile ${idfk()}`);

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === LMC) {
        props.tile.peak();
      } else if (e.button === RMC) {
        if (!props.tile.isRevealed) {
          props.tile.flag();
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button === LMC) {
        if (props.tile.isPeaking) {
          props.tile.unpeak();
        }

        if (!props.tile.isFlagged) {
          props.tile.click();
        }
      }
    };

    const onMouseEnter = (e: MouseEvent) => {
      if (e.buttons & LMB) {
        if (!props.tile.isPeaking) {
          props.tile.peak();
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.buttons & LMB) {
        if (props.tile.isPeaking) {
          props.tile.unpeak();
        }
      }
    };

    return {
      tileClass,
      textClass,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseOut,
    };
  },
});
</script>
