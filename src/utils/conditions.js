import { getParentsOfNode } from './nodes';

export const getAvailableParameters = ({ node, slots, intents, actions }) => {
  const parentNodes = getParentsOfNode(node);

  return parentNodes
    .map(parentNode => {
      if (parentNode.type === 'intentNode') {
        const foundIntent = intents.find(
          intent => intent.id === parentNode.data.intent,
        );

        if (!foundIntent) return;

        const availableParameterNames = foundIntent.parameters.map(
          ({ name }) => name,
        );

        const availableSlots = slots.filter(slot =>
          availableParameterNames.includes(slot.name),
        );

        return availableSlots;
      }

      return null;
    })
    .filter(Boolean)
    .flat();
};
