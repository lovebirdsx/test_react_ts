export function fuzzyContains(target: string, query: string): boolean {
  if (!target) {
    return false;
  }

  if (!query) {
    return true;
  }

  if (target.length < query.length) {
    return false; // impossible for query to be contained in target
  }

  const queryLen = query.length;
  const targetLower = target.toLowerCase();

  let index = 0;
  let lastIndexOf = -1;
  while (index < queryLen) {
    const indexOf = targetLower.indexOf(query[index], lastIndexOf + 1);
    if (indexOf < 0) {
      return false;
    }

    lastIndexOf = indexOf;

    index++;
  }

  return true;
}
