import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import WarningIcon from '@material-ui/icons/Warning';
import { WorkflowStatus } from '../../store/status.store';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: -252,
    width: 240,
    background: theme.palette.primary.light,
    borderRadius: 4,
    minHeight: 32,
    padding: theme.spacing(0.75, 1.5),
    display: 'flex',
    alignItems: 'center',
    boxShadow: theme.shadows[4],
    pointerEvents: 'none',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: -14,
    width: 0,
    height: 0,
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: `6px solid ${theme.palette.primary.light}`,
    pointerEvents: 'none',
  },
  errorIcon: {
    color: '#fa103e',
  },
  warningIcon: {
    color: '#f2994a',
  },
  message: {
    color: theme.palette.common.white,
    fontSize: 12,
    fontWeight: 400,
    marginLeft: theme.spacing(0.5),
    textAlign: 'left',
  },
}));

interface ProblemPopoverProps {
  status: WorkflowStatus;
  message: string;
}

const ProblemPopover: React.FC<ProblemPopoverProps> = ({ status, message }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        {status === WorkflowStatus.INVALID && <CancelIcon className={classes.errorIcon} fontSize="small" />}
        {status === WorkflowStatus.WARNING && <WarningIcon className={classes.warningIcon} fontSize="small" />}
        <span className={classes.message}>{message}</span>
      </div>
      <span className={classes.arrow} />
    </>
  )
};

export default React.memo(ProblemPopover);
