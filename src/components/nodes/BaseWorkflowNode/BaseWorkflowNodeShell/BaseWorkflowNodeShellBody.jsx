import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Autocomplete from '../../../ui/Autocomplete/Autocomplete';

const useStyles = makeStyles(theme => ({
  main: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}));

const BaseWorkflowNodeShellBody = ({ node }) => {
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <Autocomplete
        options={[]}
        getOptionKey={option => option.id}
        getOptionLabel={option => option.displayName}
        value={node.data.workflow}
        placeholder="Workflow"
      />
    </main>
  );
};

export default React.memo(BaseWorkflowNodeShellBody);
