import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import InputIcon from '@material-ui/icons/Input';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import HelpIcon from '@material-ui/icons/Help';
import ForumIcon from '@material-ui/icons/Forum';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { makeStyles } from '@material-ui/core/styles';

import CircleIcon from '../icons/Circle';
import DoubleCircleIcon from '../icons/DoubleCircle';
import FilterAltIcon from '../icons/FilterAlt';
import DraggableBlock from './DraggableBlock';
import StartNodeShell from '../nodes/StartNode/StartNodeShell';
import IntentNodeShell from '../nodes/IntentNode/IntentNodeShell/IntentNodeShell';
import ConditionNodeShell from '../nodes/ConditionNode/ConditionNodeShell/ConditionNodeShell';
import ActionNodeShell from '../nodes/ActionNode/ActionNodeShell/ActionNodeShell';
import GlobalTerminateNodeShell from '../nodes/TerminateNode/TerminateNodeShell';
import SubWorkflowNodeShell from '../nodes/BaseWorkflowNode/BaseWorkflowNodeShell/BaseWorkflowNodeShell'

const SIDEBAR_WIDTH = 280;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: SIDEBAR_WIDTH,
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: SIDEBAR_WIDTH,
    border: 'none',
    boxShadow: theme.shadows[6],
    padding: theme.spacing(2),
  },
  mainBlockTitle: {
    fontSize: 20,
    color: 'var(--black)',
    marginTop: theme.spacing(3.5),
    fontWeight: 500,
  },
  otherBlockTitle: {
    fontSize: 20,
    color: 'var(--black)',
    marginTop: 0,
    fontWeight: 500,
  },
  draggableMainBlocks: {
    marginTop: theme.spacing(3),
  },
  draggableOtherBlocks: {
    marginTop: theme.spacing(3),
    flexGrow: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userGuideButton: {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    transition: 'color 0.3s ease-in',
    '& .MuiSvgIcon-root': {
      color: theme.palette.grey[700],
      marginRight: theme.spacing(0.75),
      transition: 'color 0.3s ease-in',
    },
    '&:hover': {
      color: theme.palette.primary.dark,
      '& .MuiSvgIcon-root': {
        color: theme.palette.grey[800],
      },
    },
  },
  exitButton: {
    '& .MuiSvgIcon-root': {
      marginRight: theme.spacing(0.75),
    },
  },
}));

const draggableMainBlocks = [
  {
    name: 'Start',
    description: 'The entry point of the workflow',
    nodeType: 'startNode',
    Icon: CircleIcon,
    DragShell: StartNodeShell,
  },
  {
    name: 'Intent',
    description: 'An intent or action of a user',
    nodeType: 'intentNode',
    Icon: InputIcon,
    DragShell: IntentNodeShell,
  },
  {
    name: 'Condition',
    description: 'A condition of the parameter(s) in an intent',
    nodeType: 'conditionNode',
    Icon: FilterAltIcon,
    DragShell: ConditionNodeShell,
  },
  {
    name: 'Action',
    description: 'An action of the bot',
    nodeType: 'actionNode',
    Icon: FlashOnIcon,
    DragShell: ActionNodeShell,
  },
  {
    name: 'Global Terminate',
    description: 'The point where all the workflows terminate',
    nodeType: 'terminateNode',
    Icon: DoubleCircleIcon,
    DragShell: GlobalTerminateNodeShell,
  }
];

const draggableOtherBlocks = [
  {
    name: 'Sub Workflow',
    description: 'A sub workflow (or a child workflow)',
    nodeType: 'subWorkflowNode',
    Icon: ForumIcon,
    DragShell: SubWorkflowNodeShell,
  }
];

const Sidebar = ({ handleClose, storeId }) => {
  const classes = useStyles();

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        anchor="left"
        classes={{ paper: classes.drawerPaper }}
      >
        <img
          src="/static/img/workflow-logo.png"
          width="193"
          height="auto"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
          alt="Workflow Logo"
        />
        <Typography
          className={classes.mainBlockTitle}
          variant="h5"
          align="left"
        >
          Main blocks
        </Typography>
        <section className={classes.draggableMainBlocks}>
          {draggableMainBlocks.map(
            ({ name, description, nodeType, Icon, DragShell }) => (
              <DraggableBlock
                key={name}
                Icon={Icon}
                DragShell={DragShell}
                name={name}
                description={description}
                nodeType={nodeType}
                storeId={storeId}
              />
            )
          )}
        </section>
        <Typography
          className={classes.otherBlockTitle}
          variant="h5"
          align="left"
        >
          Others
        </Typography>
        <section className={classes.draggableOtherBlocks}>
          {draggableOtherBlocks.map(
            ({ name, description, nodeType, Icon, DragShell }) => (
              <DraggableBlock
                key={name}
                Icon={Icon}
                DragShell={DragShell}
                name={name}
                description={description}
                nodeType={nodeType}
                storeId={storeId}
              />
            )
          )}
        </section>
        <footer className={classes.footer}>
          <button className={classes.userGuideButton} type="button">
            <HelpIcon />
            User Guide
          </button>
          <Button className={classes.exitButton} onClick={handleClose}>
            <ExitToAppIcon />
            Exit
          </Button>
        </footer>
      </Drawer>
    </>
  );
};

export default React.memo(Sidebar);
