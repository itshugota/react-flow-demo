import { isNode, subscribeToFinalElementChanges, useReactFlowyStoreById } from 'react-flowy/lib';

export const ensureCorrectState = storeId => {
  subscribeToFinalElementChanges(storeId)(elements => {
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

    const useReactFlowyStore = useReactFlowyStoreById(storeId);

    useReactFlowyStore.getState().upsertNode(updatedElements);
  });
}
