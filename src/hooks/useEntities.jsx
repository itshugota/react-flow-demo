import { useState, useEffect } from 'react';

import premadeEntities from '../data/entities.json';

const useEntities = () => {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const stringifiedStoredEntities = localStorage.getItem('entities');

    if (stringifiedStoredEntities) {
      return setEntities(JSON.parse(stringifiedStoredEntities));
    }

    setEntities(premadeEntities);
  }, []);

  const saveEntities = (entities) => {
    localStorage.setItem('entities', JSON.stringify(entities));

    setEntities(entities);
  };

  return { entities, saveEntities };
};

export default useEntities;
