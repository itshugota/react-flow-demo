import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { EdgeProps, StandardEdge, useReactFlowyStore, getSourceAndTargetNodes, connectRectangles, getRectangleFromNode } from 'react-flowy/lib';

export default React.memo(
  (edgeProps: EdgeProps) => {
    const setSelectedElementById = useReactFlowyStore(state => state.setSelectedElementById);
    const deleteElementById = useReactFlowyStore(state => state.deleteElementById);
    const upsertEdge = useReactFlowyStore(state => state.upsertEdge);
    const [mouseX, setMouseX] = useState<number | null>(null);
    const [mouseY, setMouseY] = useState<number | null>(null);

    const handleContextMenu = (event: React.MouseEvent) => {
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

      const sourceRectangle = getRectangleFromNode(sourceNode!);
      const targetRectangle = getRectangleFromNode(targetNode!);
      
      const resetEdgeWaypoints = connectRectangles(sourceRectangle, targetRectangle);

      upsertEdge({ ...edgeProps, waypoints: resetEdgeWaypoints });
    };

    const handleDelete = () => {
      handleClose();

      deleteElementById(edgeProps.id);
    };

    return (
      <>
        <g onContextMenu={handleContextMenu}>
          <StandardEdge {...edgeProps} />
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
