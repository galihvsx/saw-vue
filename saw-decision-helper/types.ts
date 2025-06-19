
export enum CriterionType {
  BENEFIT = 'benefit',
  COST = 'cost',
}

export interface Criterion {
  id: string;
  name: string;
  weight: number;
  type: CriterionType;
}

export interface Alternative {
  id: string;
  name: string;
  // Stores raw input values for each criterion
  // Undefined means not yet set by the user
  values: Record<string, number | undefined>; 
}

export interface SAWResultItem {
  alternativeId: string;
  alternativeName: string;
  originalValues: Record<string, number>; // Original values (guaranteed to be numbers post-validation)
  normalizedValues: Record<string, number>; // criterionId -> normalizedValue
  preferenceScore: number;
  rank: number;
}
