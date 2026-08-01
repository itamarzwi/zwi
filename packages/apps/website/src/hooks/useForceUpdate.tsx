import { useReducer } from 'react';

export const useForceUpdate = () => {
  const reducer = useReducer((x) => x + 1, 0);

  return reducer[1];
};
