import { Path } from '../types/Path';

export function componentsToPath(elements: (string | number)[][]): Path {
  return elements.join(',').replace(/,?([A-z]),?/g, '$1');
}
