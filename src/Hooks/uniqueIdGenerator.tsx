let counter = 0;
export const uniqueIdGenerator = (prefix = 'id') => {
  const uniquePart = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  counter++;
  return `${prefix}_${uniquePart}_${counter}`;
};