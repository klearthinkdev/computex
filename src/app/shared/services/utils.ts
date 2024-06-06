export const compareString = (a: string, b: string): number => {
  return a.localeCompare(b);
};

export const compareDate = (
  a: string | number | Date,
  b: string | number | Date
): number => {
  return new Date(a).valueOf() - new Date(b).valueOf();
};
