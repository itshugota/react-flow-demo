import React from 'react';
import { Node, NodeContainerWithStandardHandles } from 'react-flowy/lib';
import Tooltip from '@material-ui/core/Tooltip';

export interface NodeContainerProps {
  node: Node;
}

const NodeContainer: React.FC<NodeContainerProps> = React.memo(({ children, node }) => {
  return (
    <NodeContainerWithStandardHandles
      node={node}
      TopHandleIndicator={HandleIndicator}
      RightHandleIndicator={HandleIndicator}
      BottomHandleIndicator={HandleIndicator}
      LeftHandleIndicator={HandleIndicator}
    >
      {children}
    </NodeContainerWithStandardHandles>
  );
});

const HandleIndicator: React.FC = ({ children }) => {
  return (
    <Tooltip title="Click and drag to connect">
      <div>{children}</div>
    </Tooltip>
  );
}

export default NodeContainer;
