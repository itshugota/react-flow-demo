import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import GrabIcon from '../icons/GrabIcon';
import { useSnapshot, eventPointToCanvasCoordinates, getCanvas, getReactFlowyElement, isPointInRect, reactFlowyState, Node, upsertNode } from 'react-flowy/lib';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginBottom: theme.spacing(3),
    cursor: 'grabbing',
    userSelect: 'none',
  },
  iconGroup: {
    display: 'flex',
    alignItems: 'center',
    height: 'fit-content',
  },
  blockTypeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#e9e9ef',
    width: 36,
    height: 36,
    color: 'rgba(0, 0, 0, 0.6)',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: 2,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 0
  },
  name: {
    color: 'var(--black)',
    fontSize: 16,
    lineHeight: '18.75px'
  },
  description: {
    marginTop: theme.spacing(0.5),
    color: '#828282',
    fontSize: 14,
    lineHeight: '16px',
  }
}));

export interface DraggableBlockProps {
  Icon: React.FC;
  DragShell: React.FC;
  name: string;
  description: string;
  nodeType: string;
}

const DraggableBlock: React.FC<DraggableBlockProps> = ({ Icon, DragShell, name, description, nodeType }) => {
  const snap = useSnapshot(reactFlowyState);
  const classes = useStyles();
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);

  useEffect(() => {
    if (!isGrabbing) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'grabbing';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [isGrabbing]);

  const handleMouseMove = (e: MouseEvent) => {
    setDragX(e.clientX);
    setDragY(e.clientY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    setIsGrabbing(false);

    const reactFlowyElement = getReactFlowyElement();
    const reactFlowyElementBoundingRect = reactFlowyElement!.getBoundingClientRect();
    const cursorPosition = { x: e.clientX, y: e.clientY };
    
    if (!isPointInRect(cursorPosition, reactFlowyElementBoundingRect)) return;
    
    const canvas = getCanvas(reactFlowyState.transform);

    const cursorCoordinates = eventPointToCanvasCoordinates(e)(canvas);

    const newNode: Node = {
      id: `x${cursorPosition.x}y${cursorPosition.y}`,
      type: nodeType,
      position: cursorCoordinates,
      __rf: {
        position: cursorCoordinates,
      },
    };

    upsertNode(newNode);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsGrabbing(true);
    setDragX(e.clientX);
    setDragY(e.clientY);
  };

  return (
    <div className={classes.root} onMouseDown={handleMouseDown}>
      <span className={classes.iconGroup}>
        <GrabIcon />
        <span className={classes.blockTypeIcon}>
          <Icon />
        </span>
      </span>
      <div className={classes.textContainer}>
        <Typography className={classes.name} variant="h6" align="left">{name}</Typography>
        <Typography className={classes.description} variant="body2" align="left">{description}</Typography>
      </div>
      {isGrabbing &&
        <div style={{
          position: 'fixed',
          top: dragY,
          left: dragX,
          opacity: 0.7,
          transform: `scale(${snap.transform[2]})`,
          transformOrigin: 'top left'
        }}>
          <DragShell />
        </div>
      }
    </div>
  )
}

export default React.memo(DraggableBlock);
