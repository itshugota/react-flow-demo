import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useReactFlowyStore, getSourceAndTargetNodes, connectShapes, getRectangleFromNode } from 'react-flowy/lib';

const EdgeWithContextMenu = React.memo(
  ({ edgeProps, EdgeComponent }) => {
    const setSelectedElementById = useReactFlowyStore(state => state.setSelectedElementById);
    const deleteElementById = useReactFlowyStore(state => state.deleteElementById);
    const upsertEdge = useReactFlowyStore(state => state.upsertEdge);
    const [mouseX, setMouseX] = useState(null);
    const [mouseY, setMouseY] = useState(null);

    const handleContextMenu = event => {
      event.preventDefault();

      setSelectedElementById(edgeProps.id);

      setMouseX(event.clientX);
      setMouseY(event.clientY);
    };

    const handleClose = () => {
      setMouseX(null);
      setMouseY(null);
    };

    const handleResetWaypoints = () => {
      handleClose();

      const { sourceNode, targetNode } = getSourceAndTargetNodes(edgeProps);

      const sourceRectangle = getRectangleFromNode(sourceNode);
      const targetRectangle = getRectangleFromNode(targetNode);

      const resetEdgeWaypoints = connectShapes(sourceRectangle, targetRectangle, 'rectangle', 'rectangle');
      console.log('edgeProps', edgeProps);
      upsertEdge({ ...edgeProps, waypoints: resetEdgeWaypoints });
    };

    const handleDelete = () => {
      handleClose();

      deleteElementById(edgeProps.id);
    };

    return (
      <>
        <g onContextMenu={handleContextMenu}>
          <EdgeComponent {...edgeProps} />
        </g>
        <Menu
          open={!!mouseX && !!mouseY}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            !!mouseX && !!mouseY
              ? { top: mouseY, left: mouseX }
              : undefined
          }
        >
          <MenuItem onClick={handleResetWaypoints}>Reset waypoints</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </>
    );
  }
);

export default EdgeWithContextMenu;
