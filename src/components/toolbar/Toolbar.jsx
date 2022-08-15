import React, { useRef, useEffect, useState, useCallback } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { transformSelector, useReactFlowyStoreById, initializeUndoRedo, useUndoRedoStore, minZoomSelector, maxZoomSelector } from 'react-flowy/lib';
import StatusIndicator from './StatusIndicator/StatusIndicator';
import ExportAsPNG from './ExportAsPNG/ExportAsPNG';

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
    borderRight: '1px solid rgba(0, 0, 0, 60%)',
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
    width: 60,
  },
}));

function getFullscreenElement() {
  return document.fullscreenElement // Standard property
    || document.webkitFullscreenElement // Safari/Opera support
    || document.mozFullscreenElement // Firefox support
}

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const toggleFullscreen = fullscreen => {
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
    const pressF11Listener = event => {
      if (event.key !== 'F11') return;

      event.preventDefault();

      if (isFullscreen) return toggleFullscreen(false);

      toggleFullscreen(true);
    };

    document.addEventListener('keydown', pressF11Listener);

    return () => document.removeEventListener('keydown', pressF11Listener);
  }, [isFullscreen]);

  return { isFullscreen, toggleFullscreen };
};

const getZoomInputValueFromScale = scale => {
  return `${Math.round(scale * 100)}%`;
};

const getScaleFromZoomInputValue = zoomInputValue => {
  return (+zoomInputValue.replace('%', '') / 100);
}

let zoomInputTimeout;

const Toolbar = ({ storeId }) => {
  const classes = useStyles();
  const useReactFlowyStore = useReactFlowyStoreById(storeId);
  const minZoom = useReactFlowyStore(minZoomSelector);
  const maxZoom = useReactFlowyStore(maxZoomSelector);
  const transform = useReactFlowyStore(transformSelector);
  const zoomTo = useReactFlowyStore(state => state.zoomTo);
  const undoFn = useRef();
  const redoFn = useRef();
  const undoRedoInstanceRef = useRef();
  const isUndoable = useUndoRedoStore(state => state.isUndoable);
  const isRedoable = useUndoRedoStore(state => state.isRedoable);
  const [zoomInputValue, setZoomInputValue] = useState(getZoomInputValueFromScale(transform[2]));
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  useEffect(() => {
    const { undo, redo, undoRedoInstance } = initializeUndoRedo(storeId);

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

  const handleZoomInputChange = event => {
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
      <IconButton className={clsx(classes.iconButton, classes.mR)} onClick={handleUndo} disabled={!isUndoable}>
        <UndoIcon />
      </IconButton>
      <IconButton className={clsx(classes.iconButton, classes.mR)} onClick={handleRedo} disabled={!isRedoable}>
        <RedoIcon />
      </IconButton>
      <IconButton className={classes.iconButton} onClick={handleZoomOut} disabled={transform[2] === minZoom}>
        <ZoomOutIcon />
      </IconButton>
      <input className={classes.zoomInput} value={zoomInputValue} onChange={handleZoomInputChange} />
      <IconButton className={clsx(classes.iconButton, classes.mR)} onClick={handleZoomIn} disabled={transform[2] === maxZoom}>
        <ZoomInIcon />
      </IconButton>
      <ExportAsPNG />
      {isFullscreen ?
        <IconButton className={classes.iconButton} onClick={handleExitFullscreen}>
          <FullscreenExitIcon />
        </IconButton> :
        <IconButton className={classes.iconButton} onClick={handleEnterFullscreen}>
          <FullscreenIcon />
        </IconButton>
      }
      <div className={clsx(classes.separator, classes.mLSmall, classes.mRSmall)} />
      <StatusIndicator />
    </Paper>
  );
}

export default React.memo(Toolbar);
