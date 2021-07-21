import { useState, useEffect } from 'react';

import premadeActions from '../data/actions.json';

const useActions = () => {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const stringifiedStoredActions = localStorage.getItem('actions');

    if (stringifiedStoredActions) {
      return setActions(JSON.parse(stringifiedStoredActions));
    }

    setActions(premadeActions);
  }, []);

  const saveActions = (actions) => {
    localStorage.setItem('actions', JSON.stringify(actions));

    setActions(actions);
  };

  return { actions, saveActions };
};

export default useActions;
