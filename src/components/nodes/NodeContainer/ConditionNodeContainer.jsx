import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { NodeContainer } from 'react-flowy/lib';
import ConditionHandles, { ARROW_DISTANCE } from '../../handles/ConditionHandles';

const ConditionNodeContainer = React.memo(({ children, node, isHandleDisabled, additionalEdgeProps }) => {
  return (
    <NodeContainer
      node={node}
      additionalEdgeProps={{ ...additionalEdgeProps, arrowHeadType: 'thinarrow', type: 'conditionEdge' }}
      isHandleDisabled={isHandleDisabled}
      arrowDistance={ARROW_DISTANCE}
      Handles={ConditionHandles}
      TopHandleIndicator={HandleIndicator}
      RightHandleIndicator={HandleIndicator}
      BottomHandleIndicator={HandleIndicator}
      LeftHandleIndicator={HandleIndicator}
    >
      {children}
    </NodeContainer>
  );
});

const HandleIndicator = ({ children }) => {
  return (
    <Tooltip title="Click and drag to connect">
      <div>{children}</div>
    </Tooltip>
  );
}

export default ConditionNodeContainer;
