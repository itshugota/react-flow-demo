import React from 'react';
import { NodeContainer } from 'react-flowy/lib';

const ExtendedNodeContainer = React.memo(({ children, node, isHandleDisabled, additionalEdgeProps, storeId }) => {
  return (
    <NodeContainer
      node={node}
      additionalEdgeProps={{ ...additionalEdgeProps, arrowHeadType: 'thinarrow', type: 'edgeWithStartIndicator' }}
      isHandleDisabled={isHandleDisabled}
      TopHandleIndicator={HandleIndicator}
      RightHandleIndicator={HandleIndicator}
      BottomHandleIndicator={HandleIndicator}
      LeftHandleIndicator={HandleIndicator}
      storeId={storeId}
    >
      {children}
    </NodeContainer>
  );
});

const HandleIndicator = ({ children }) => {
  return (
    <div>{children}</div>
  );
}

export default ExtendedNodeContainer;
