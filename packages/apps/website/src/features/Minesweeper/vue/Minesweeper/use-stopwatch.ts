import { ref } from 'vue';

const useStopwatch = () => {
  let timer: number | undefined;
  const time = ref(0);

  const stop = () => {
    clearInterval(timer);
  };

  const start = () => {
    if (timer) {
      stop();
      time.value = 0;
    }

    timer = setInterval(() => time.value++, 1000);
  };

  return { start, stop, time };
};

export default useStopwatch;
