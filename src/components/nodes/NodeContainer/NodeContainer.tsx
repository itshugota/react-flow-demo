import React from 'react';
import { Node, NodeContainer } from 'react-flowy/lib';
import Tooltip from '@material-ui/core/Tooltip';

export interface NodeContainerProps {
  node: Node;
  isHandleDisabled?: boolean;
}

const ExtendedNodeContainer: React.FC<NodeContainerProps> = React.memo(({ children, node, isHandleDisabled }) => {
  return (
    <NodeContainer
      node={node}
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

const HandleIndicator: React.FC = ({ children }) => {
  return (
    <Tooltip title="Click and drag to connect">
      <div>{children}</div>
    </Tooltip>
  );
}

export default ExtendedNodeContainer;
