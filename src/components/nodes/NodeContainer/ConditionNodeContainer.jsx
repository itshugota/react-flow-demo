import React, { useMemo } from 'react';
import { NodeContainer } from 'react-flowy/lib';
import { ARROW_DISTANCE } from '../../handles/ConditionHandles';

const ConditionNodeContainer = React.memo(({ children, node, additionalEdgeProps, storeId }) => {
  const edgeProps = useMemo(() => ({ ...additionalEdgeProps, arrowHeadType: 'thinarrow', type: 'conditionEdge' }), [additionalEdgeProps]);

  return (
    <NodeContainer
      node={node}
      additionalEdgeProps={edgeProps}
      isHandleDisabled
      arrowDistance={ARROW_DISTANCE}
      storeId={storeId}
    >
      {children}
    </NodeContainer>
  );
});

// const ConditionNodeContainer = React.memo(({ children, node, isHandleDisabled, additionalEdgeProps, storeId }) => {
//   const edgeProps = useMemo(() => ({ ...additionalEdgeProps, arrowHeadType: 'thinarrow', type: 'conditionEdge' }), [additionalEdgeProps]);

//   return (
//     <NodeContainer
//       node={node}
//       additionalEdgeProps={edgeProps}
//       isHandleDisabled={isHandleDisabled}
//       arrowDistance={ARROW_DISTANCE}
//       Handles={ConditionHandles}
//       TopHandleIndicator={HandleIndicator}
//       RightHandleIndicator={HandleIndicator}
//       BottomHandleIndicator={HandleIndicator}
//       LeftHandleIndicator={HandleIndicator}
//       storeId={storeId}
//     >
//       {children}
//     </NodeContainer>
//   );
// });

export default ConditionNodeContainer;
