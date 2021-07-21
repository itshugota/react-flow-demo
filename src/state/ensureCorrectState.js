import { isNode, subscribeToFinalElementChanges, useReactFlowyStore } from 'react-flowy/lib';

subscribeToFinalElementChanges(elements => {
  let shouldUpdate = false;

  const updatedElements = elements.map(element => {
    if (!isNode(element)) return;

    if (!element.type !== 'conditionNode') return;

    if (element.data.conditions.length < 2) return;

    if (element.data.conditionMode) return;

    shouldUpdate = true;

    return { ...element, data: { ...element.data, conditionMode: 'AND' } };
  });

  if (!shouldUpdate) return;

  useReactFlowyStore.getState().upsertNode(updatedElements);
});
