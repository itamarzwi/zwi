<template>
  <div id="minesweeper-wrapper" dir="ltr" class="flex flex-row justify-between">
    <!-- Options -->
    <div class="flex flex-col space-y-2">
      <div>
        <input id="showIndexesCheckbox" v-model="showIndexes" class="ms-checkbox" type="checkbox" />
        <label class="inline-block" for="showIndexesCheckbox"> Show indexes </label>
      </div>

      <div>
        <input
          id="autoPlayerShouldGuessCheckbox"
          v-model="autoPlaySafe"
          class="ms-checkbox"
          type="checkbox"
        />
        <label class="inline-block" for="autoPlayerShouldGuessCheckbox">
          Only play safe moves
        </label>
      </div>
      <div v-if="!autoPlaySafe">
        <input
          id="restartOnFailureCheckbox"
          v-model="restartOnFailure"
          class="ms-checkbox"
          type="checkbox"
        />
        <label class="inline-block" for="restartOnFailureCheckbox"> Restart on failure </label>
      </div>
      <div style="margin-bottom: 1rem">
        <label class="block text-sm font-bold mb-2" for="playerSpeed"> Player speed </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          v-model="playerSpeed"
          type="number"
          max="10"
          min="1"
        />
      </div>

      <button
        class="bg-blue-600 hover:bg-blue-800 font-semibold rounded-lg p-4 text-white"
        @click="autoPlay"
      >
        Auto play
      </button>
    </div>

    <!-- Minesweeper -->
    <div class="select-none" @contextmenu="$event.preventDefault()">
      <span>{{ game.isGameWon ? 'You win! 🥳🥳🥳' : '' }}</span>
      <!-- Top border -->
      <div class="ms-top-border flex flex-row">
        <div class="ms-border-corner ms-border-top-left" />
        <div class="ms-border-horizontal flex-1" />
        <div class="ms-border-corner ms-border-top-right" />
      </div>

      <!-- scoreboard -->
      <div class="bg-black flex flex-row justify-center items-center">
        <div class="ms-border-vertical" />

        <div class="ms-score">
          <div :class="getDigitClass(game.minesLeft, 0)" />
          <div :class="getDigitClass(game.minesLeft, 1)" />
          <div :class="getDigitClass(game.minesLeft, 2)" />
        </div>

        <div class="flex-1 flex justify-center" @click="newGame">
          <button :class="smileyClass" />
        </div>

        <div class="ms-score">
          <div :class="getDigitClass(time, 0)" />
          <div :class="getDigitClass(time, 1)" />
          <div :class="getDigitClass(time, 2)" />
        </div>

        <div class="ms-border-vertical" />
      </div>

      <!-- Middle border -->
      <div class="flex flex-row">
        <div class="ms-border-corner ms-border-middle-left" />
        <div class="flex-1 ms-border-horizontal" />
        <div class="ms-border-corner ms-border-middle-right" />
      </div>

      <div class="flex flex-row">
        <div class="ms-border-vertical" />

        <div class="bg-black">
          <MinesweeperBoard :game="game!" />
        </div>

        <div class="ms-border-vertical" />
      </div>

      <!-- Bottom border -->
      <div class="flex flex-row">
        <div class="ms-border-corner ms-border-bottom-left" />
        <div class="flex-1 ms-border-horizontal" />
        <div class="ms-border-corner ms-border-bottom-right" />
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
/* eslint-disable no-await-in-loop */
import { computed, defineComponent, provide, Ref, ref, watch } from 'vue';
import useStopwatch from './use-stopwatch';
import MinesweeperBoard from './MinesweeperBoard.vue';
import { MinesweeperGame } from './game/minesweeper-game';
import { AutoPlayer } from './game/auto-player';
import { ShowIndexesKey } from './keys';
import { sleep } from './game/utils';

const HEIGHT = 16;
const WIDTH = 30;
const MINE_COUNT = 99;

export default defineComponent({
  name: 'Minesweeper',
  components: { MinesweeperBoard },
  setup() {
    const isSandbox = window.location.pathname.includes('sandbox');

    const showIndexes = ref(false);
    const autoPlaySafe = ref(false);
    const restartOnFailure = ref(true);
    const playerSpeed = ref(10);
    const autoPlayerDelay = computed(() => Math.max(0, Math.round(100 / playerSpeed.value)));

    provide(ShowIndexesKey, showIndexes);
    const { time, start, stop } = useStopwatch();
    const game = ref(
      new MinesweeperGame(WIDTH, HEIGHT, MINE_COUNT, isSandbox),
    ) as Ref<MinesweeperGame>;
    const player = ref(new AutoPlayer(game.value, !autoPlaySafe.value)) as Ref<AutoPlayer>;

    game.value.onGameInit(start);
    game.value.onGameLose(stop);
    game.value.onGameWin(stop);

    const newGame = () => {
      game.value = new MinesweeperGame(WIDTH, HEIGHT, MINE_COUNT, isSandbox);
      player.value = new AutoPlayer(game.value, !autoPlaySafe.value);

      game.value.onGameInit(start);
      game.value.onGameLose(stop);
      game.value.onGameWin(stop);
    };

    watch(autoPlaySafe, () => {
      player.value.shouldGuess = !autoPlaySafe.value;
    });

    watch(autoPlayerDelay, () => {
      player.value.delay = autoPlayerDelay.value;
    });

    const autoPlay = async () => {
      if (game.value.isGameLost) {
        newGame();
      }

      player.value.autoPlay(autoPlayerDelay.value);

      while (restartOnFailure.value && !game.value.isGameWon) {
        await game.value.waitForEnd();
        if (!autoPlaySafe.value && restartOnFailure.value && game.value.isGameLost) {
          await sleep(200);
          newGame();
          player.value.autoPlay(autoPlayerDelay.value);
        }
      }
    };

    newGame();

    const getDigitClass = (value: number, index: number) =>
      `ms-digit ms-digit-${value.toString().padStart(3, '0')[index]}`;

    const smileyClass = computed(() => {
      if (game.value.isGameWon) return 'ms-face ms-face-won';
      if (game.value.isGameLost) return 'ms-face ms-face-lost';

      return 'ms-face ms-face-neutral';
    });

    const assets = [
      'border_hor_2x.png',
      'border_middle_left_2x.png',
      'border_middle_right_2x.png',
      'border_vert_2x.png',
      'corner_bottom_left_2x.png',
      'corner_bottom_right_2x.png',
      'corner_up_left_2x.png',
      'corner_up_right_2x.png',
      'd0.svg',
      'd1.svg',
      'd2.svg',
      'd3.svg',
      'd4.svg',
      'd5.svg',
      'd6.svg',
      'd7.svg',
      'd8.svg',
      'd9.svg',
      'face_active.svg',
      'face_lost.svg',
      'face_neutral.svg',
      'face_pressed.svg',
      'face_won.svg',
      'flag_wrong.svg',
      'flag.svg',
      'hidden.svg',
      'logo.png',
      'mine_red.svg',
      'mine.svg',
      'nums_background.svg',
      'pressed.svg',
      'type0.svg',
      'type1.svg',
      'type2.svg',
      'type3.svg',
      'type4.svg',
      'type5.svg',
      'type6.svg',
      'type7.svg',
      'type8.svg',
    ];

    return {
      assets,
      game,
      time,
      newGame,
      autoPlay,
      showIndexes,
      autoPlaySafe,
      playerSpeed,
      restartOnFailure,
      getDigitClass,
      smileyClass,
    };
  },
});
</script>

<style>
.ms-border-vertical {
  @apply self-stretch;
}

.ms-checkbox {
  @apply w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 cursor-pointer mr-1;
}

#minesweeper-wrapper::after {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  z-index: -1;
  content: url('/assets/border_hor_2x.png') url('/assets/border_middle_left_2x.png')
    url('/assets/border_middle_right_2x.png') url('/assets/border_vert_2x.png')
    url('/assets/corner_bottom_left_2x.png') url('/assets/corner_bottom_right_2x.png')
    url('/assets/corner_up_left_2x.png') url('/assets/corner_up_right_2x.png') url('/assets/d0.svg')
    url('/assets/d1.svg') url('/assets/d2.svg') url('/assets/d3.svg') url('/assets/d4.svg')
    url('/assets/d5.svg') url('/assets/d6.svg') url('/assets/d7.svg') url('/assets/d8.svg')
    url('/assets/d9.svg') url('/assets/face_active.svg') url('/assets/face_lost.svg')
    url('/assets/face_neutral.svg') url('/assets/face_pressed.svg') url('/assets/face_won.svg')
    url('/assets/flag_wrong.svg') url('/assets/flag.svg') url('/assets/hidden.svg')
    url('/assets/logo.png') url('/assets/mine_red.svg') url('/assets/mine.svg')
    url('/assets/nums_background.svg') url('/assets/pressed.svg') url('/assets/type0.svg')
    url('/assets/type1.svg') url('/assets/type2.svg') url('/assets/type3.svg')
    url('/assets/type4.svg') url('/assets/type5.svg') url('/assets/type6.svg')
    url('/assets/type7.svg') url('/assets/type8.svg');
}

/* assets */
.ms-tile-hidden {
  background-image: url(/assets/hidden.svg);
}

.ms-tile-mine {
  background-image: url(/assets/mine.svg);
}

.ms-tile-mine-red {
  background-image: url(/assets/mine_red.svg);
}

.ms-tile-flag {
  background-image: url(/assets/flag.svg);
}

.ms-tile-flag-wrong {
  background-image: url(/assets/flag_wrong.svg);
}

.ms-tile-peaking {
  background-image: url(/assets/pressed.svg);
}

.ms-face-neutral {
  background-image: url(/assets/face_neutral.svg);
}

.ms-face-won {
  background-image: url(/assets/face_won.svg);
}

.ms-face-lost {
  background-image: url(/assets/face_lost.svg);
}

.ms-face-neutral:active,
:active > .ms-face-neutral,
.ms-face-won:active,
:active > .ms-face-won,
.ms-face-lost:active,
:active > .ms-face-lost {
  background-image: url(/assets/face_pressed.svg);
}

.ms-border-top-left {
  background-image: url(/assets/corner_up_left_2x.png);
}

.ms-border-top-right {
  background-image: url(/assets/corner_up_right_2x.png);
}

.ms-border-bottom-right {
  background-image: url(/assets/corner_bottom_right_2x.png);
}

.ms-border-bottom-left {
  background-image: url(/assets/corner_bottom_left_2x.png);
}

.ms-border-middle-left {
  background-image: url(/assets/border_middle_left_2x.png);
}

.ms-border-middle-right {
  background-image: url(/assets/border_middle_right_2x.png);
}

.ms-border-horizontal {
  background-image: url(/assets/border_hor_2x.png);
}

.ms-border-vertical {
  width: 24px;
  background-image: url(/assets/border_vert_2x.png);
}

.ms-tile-0 {
  background-image: url(/assets/type0.svg);
}
.ms-tile-1 {
  background-image: url(/assets/type1.svg);
}
.ms-tile-2 {
  background-image: url(/assets/type2.svg);
}
.ms-tile-3 {
  background-image: url(/assets/type3.svg);
}
.ms-tile-4 {
  background-image: url(/assets/type4.svg);
}
.ms-tile-5 {
  background-image: url(/assets/type5.svg);
}
.ms-tile-6 {
  background-image: url(/assets/type6.svg);
}
.ms-tile-7 {
  background-image: url(/assets/type7.svg);
}
.ms-tile-8 {
  background-image: url(/assets/type8.svg);
}

.ms-digit-0 {
  background-image: url(/assets/d0.svg);
}
.ms-digit-1 {
  background-image: url(/assets/d1.svg);
}
.ms-digit-2 {
  background-image: url(/assets/d2.svg);
}
.ms-digit-3 {
  background-image: url(/assets/d3.svg);
}
.ms-digit-4 {
  background-image: url(/assets/d4.svg);
}
.ms-digit-5 {
  background-image: url(/assets/d5.svg);
}
.ms-digit-6 {
  background-image: url(/assets/d6.svg);
}
.ms-digit-7 {
  background-image: url(/assets/d7.svg);
}
.ms-digit-8 {
  background-image: url(/assets/d8.svg);
}
.ms-digit-9 {
  background-image: url(/assets/d9.svg);
}

/* Other */

.ms-tile {
  @apply h-[28px] w-[28px] cursor-default;
  background-size: 100%;
}

.ms-digit {
  height: 34px;
  width: 18px;
  background-size: 100%;
}

.ms-face {
  width: 42px;
  height: 42px;
  background-size: 100%;
}

.ms-border-corner {
  width: 24px;
  height: 22px;
}

.ms-container {
  @apply select-none;
}

.ms-inner {
  @apply bg-black;
}

.ms-score {
  @apply flex flex-row px-1 space-x-1;
}
</style>
