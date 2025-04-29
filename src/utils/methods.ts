export const returnKeyValueString = (
  obj: Record<string, any>,
  key: string
): string => {
  return `${key}: ${obj[key]}`;
};
