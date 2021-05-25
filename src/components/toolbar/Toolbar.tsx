import React, { useRef, useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { transformSelector, useReactFlowyStore, initializeUndoRedo, useUndoRedoStore, minZoomSelector, maxZoomSelector } from 'react-flowy/lib';
import ValidIndicator from '../icons/ValidIndicator';
import StatusIndicator from './StatusIndicator';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    top: 24,
    right: 24,
    zIndex: 100,
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    width: 32,
    height: 32,
  },
  mR: {
    marginRight: theme.spacing(2),
  },
  mLSmall: {
    marginLeft: theme.spacing(1.5),
  },
  mRSmall: {
    marginRight: theme.spacing(1.5),
  },
  separator: {
    display: 'inline-block',
    width: 0,
    height: 24,
    borderRight: '1px solid rgba(0, 0, 0, 60%)'
  },
  zoomInput: {
    textAlign: 'center',
    margin: theme.spacing(0, 0.5),
    color: 'var(--black)',
    border: 'none',
    background: '#f1f3f4',
    borderRadius: 2,
    padding: theme.spacing(1, 1.5),
    outline: 'none',
    fontSize: 14,
    fontWeight: 500,
    width: 35
  }
}));

function getFullscreenElement() {
  return document.fullscreenElement // Standard property
    || (document as any).webkitFullscreenElement // Safari/Opera support
    || (document as any).document?.mozFullscreenElement // Firefox support
}

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const toggleFullscreen = (fullscreen: Boolean) => {
    if (fullscreen) {
      document.documentElement.requestFullscreen();
      return;
    }

    document.exitFullscreen();
  };

  useEffect(() => {
    const fullscreenChangeListener = () => {
      if (getFullscreenElement()) return setIsFullscreen(true);

      setIsFullscreen(false);
    };

    document.addEventListener('fullscreenchange', fullscreenChangeListener);

    return () => document.removeEventListener('fullscreenchange', fullscreenChangeListener);
  }, []);

  useEffect(() => {
    const pressF11Listener = (e: KeyboardEvent) => {
      if (e.key !== 'F11') return;

      e.preventDefault();

      if (isFullscreen) return toggleFullscreen(false);

      toggleFullscreen(true);
    };

    document.addEventListener('keydown', pressF11Listener);

    return () => document.removeEventListener('keydown', pressF11Listener);
  }, [isFullscreen]);

  return { isFullscreen, toggleFullscreen };
};

const getZoomInputValueFromScale = (scale: number) => {
  return `${Math.round(scale * 100)}%`;
};

const getScaleFromZoomInputValue = (zoomInputValue: string) => {
  return (+zoomInputValue.replace('%', '') / 100);
}

let zoomInputTimeout: number;

const Toolbar = () => {
  const classes = useStyles();
  const minZoom = useReactFlowyStore(minZoomSelector);
  const maxZoom = useReactFlowyStore(maxZoomSelector);
  const transform = useReactFlowyStore(transformSelector);
  const zoomTo = useReactFlowyStore(state => state.zoomTo);
  const undoFn = useRef<Function>();
  const redoFn = useRef<Function>();
  const undoRedoInstanceRef = useRef<any>();
  const isUndoable = useUndoRedoStore(state => state.isUndoable);
  const isRedoable = useUndoRedoStore(state => state.isRedoable);
  const [zoomInputValue, setZoomInputValue] = useState(getZoomInputValueFromScale(transform[2]));
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  useEffect(() => {
    const { undo, redo, undoRedoInstance } = initializeUndoRedo();
    
    undoFn.current = undo;
    redoFn.current = redo;
    undoRedoInstanceRef.current = undoRedoInstance;
  }, []);

  useEffect(() => {
    setZoomInputValue(getZoomInputValueFromScale(transform[2]));
  }, [transform[2]]);

  useEffect(() => {
    if (zoomInputTimeout) clearTimeout(zoomInputTimeout);

    zoomInputTimeout = setTimeout(() => {
      if (zoomInputValue === getZoomInputValueFromScale(transform[2])) return;

      let scale = getScaleFromZoomInputValue(zoomInputValue);
  
      if (scale < minZoom) {
        scale = minZoom;
      } else if (scale > maxZoom) {
        scale = maxZoom;
      }
  
      zoomTo(scale);
  
      setZoomInputValue(getZoomInputValueFromScale(scale));
    }, 500);
  }, [zoomInputValue]);

  const handleUndo = useCallback(() => {
    if (typeof undoFn.current !== 'function') return;
    
    undoFn.current();
  }, []);

  const handleRedo = useCallback(() => {
    if (typeof redoFn.current !== 'function') return;

    redoFn.current();
  }, []);

  const handleZoomIn = () => {
    const zoom = Math.min(maxZoom, transform[2] + 0.04);

    if (transform[2] < maxZoom) zoomTo(zoom);
  };

  const handleZoomOut = () => {
    const zoom = Math.max(minZoom, transform[2] - 0.04);

    if (transform[2] > minZoom) zoomTo(zoom);
  };

  const handleZoomInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.value.includes('%') && event.target.value[event.target.value.length - 1] !== '%') return;

    if (isNaN(+event.target.value.replace('%', ''))) return;

    setZoomInputValue(event.target.value);
  };

  const handleEnterFullscreen = () => {
    toggleFullscreen(true)
  };

  const handleExitFullscreen = () => {
    toggleFullscreen(false);
  };

  return (
    <Paper className={classes.root} elevation={4}>
      <Tooltip title="Undo">
        <IconButton className={clsx(classes.iconButton, classes.mR)} onClick={handleUndo} disabled={!isUndoable}>
          <UndoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton className={clsx(classes.iconButton, classes.mR)} onClick={handleRedo} disabled={!isRedoable}>
          <RedoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom out">
        <IconButton className={classes.iconButton} onClick={handleZoomOut} disabled={transform[2] === minZoom}>
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <input className={classes.zoomInput} value={zoomInputValue} onChange={handleZoomInputChange} />
      <Tooltip title="Zoom in">
        <IconButton className={clsx(classes.iconButton, classes.mR)} onClick={handleZoomIn} disabled={transform[2] === maxZoom}>
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      {isFullscreen ?
        <Tooltip title="Exit fullscreen">
          <IconButton className={classes.iconButton} onClick={handleExitFullscreen}>
            <FullscreenExitIcon />
          </IconButton>
        </Tooltip> :
        <Tooltip title="Enter fullscreen">
          <IconButton className={classes.iconButton} onClick={handleEnterFullscreen}>
            <FullscreenIcon />
          </IconButton>
        </Tooltip>
      }
      <div className={clsx(classes.separator, classes.mLSmall, classes.mRSmall)} />
      <StatusIndicator />
    </Paper>
  );
}

export default Toolbar;
