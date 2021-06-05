import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { NodeContainer } from 'react-flowy/lib';
import ConditionHandles from '../../handles/ConditionHandles';

const ConditionNodeContainer = React.memo(({ children, node, isHandleDisabled, additionalEdgeProps }) => {
  return (
    <NodeContainer
      node={node}
      additionalEdgeProps={additionalEdgeProps}
      isHandleDisabled={isHandleDisabled}
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
