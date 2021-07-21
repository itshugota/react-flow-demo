interface Entity {
  id: string;
  parameter: string;
  values: any[];
}

interface UseEntitiesObject {
  entities: Entity[];
  saveEntities: (entities: Entity[]) => void;
}

export default function useEntities(): UseEntitiesObject;
