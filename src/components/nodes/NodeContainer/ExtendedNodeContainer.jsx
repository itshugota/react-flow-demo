import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { NodeContainer } from 'react-flowy/lib';

const ExtendedNodeContainer = React.memo(({ children, node, isHandleDisabled, additionalEdgeProps }) => {
  return (
    <NodeContainer
      node={node}
      additionalEdgeProps={{ ...additionalEdgeProps, arrowHeadType: 'thinarrow', type: 'edgeWithStartIndicator' }}
      isHandleDisabled={isHandleDisabled}
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

export default ExtendedNodeContainer;
