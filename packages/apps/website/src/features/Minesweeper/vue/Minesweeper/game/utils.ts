export const arraysAreEqual = <T>(a: T[], b: T[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

export const arrayContains = <T>(a: T[], b: T[]) =>
  b.every(value => a.includes(value));

export const arrayIntersection = <T>(a: T[], b: T[]) =>
  a.filter(value => b.includes(value));

export const arrayDifference = <T>(a: T[], b: T[]) =>
  a.filter(value => !b.includes(value));

export const sleep = (ms: number) =>
  new Promise<void>(resolve => {
    setTimeout(() => resolve(), ms);
  });
