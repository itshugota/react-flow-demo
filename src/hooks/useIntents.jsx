import { useState, useEffect } from 'react';

import premadeIntents from '../data/intents.json';

const useIntents = () => {
  const [intents, setIntents] = useState([]);

  useEffect(() => {
    const stringifiedStoredIntents = localStorage.getItem('intents');

    if (stringifiedStoredIntents) {
      return setIntents(JSON.parse(stringifiedStoredIntents));
    }

    setIntents(premadeIntents);
  }, []);

  const saveIntents = (intents) => {
    localStorage.setItem('intents', JSON.stringify(intents));

    setIntents(intents);
  };

  return { intents, saveIntents };
};

export default useIntents;
