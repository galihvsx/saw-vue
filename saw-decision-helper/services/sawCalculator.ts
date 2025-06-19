
import { Criterion, Alternative, CriterionType, SAWResultItem } from '../types';

export const calculateSAW = (
  criteria: Criterion[],
  alternatives: Alternative[]
): { results: SAWResultItem[], error?: string } => {
  // Validation
  if (criteria.length === 0) return { results: [], error: "No criteria defined." };
  if (alternatives.length === 0) return { results: [], error: "No alternatives defined." };

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  if (Math.abs(totalWeight - 1.0) > 0.001) { // Allow for small floating point inaccuracies
    console.warn(`Sum of weights is ${totalWeight}, not 1.0. Results will be calculated, but this is unusual.`);
    // No error, just a warning, SAW still works
  }

  for (const alt of alternatives) {
    for (const crit of criteria) {
      if (alt.values[crit.id] === undefined || isNaN(alt.values[crit.id]!)) {
        return { results: [], error: `Missing or invalid value for alternative "${alt.name}" on criterion "${crit.name}". Please fill all matrix values.` };
      }
    }
  }
  
  // Cast values to number as they are validated
  const alternativesWithParsedValues = alternatives.map(alt => ({
    ...alt,
    values: Object.fromEntries(
      Object.entries(alt.values).map(([critId, val]) => [critId, Number(val)])
    ) as Record<string, number>
  }));


  // 1. Normalization
  const normalizedAlternatives: Array<Omit<SAWResultItem, 'preferenceScore' | 'rank'>> = [];

  for (const crit of criteria) {
    const criterionValues = alternativesWithParsedValues.map(alt => alt.values[crit.id]);
    
    let minVal: number | undefined;
    let maxVal: number | undefined;

    if (crit.type === CriterionType.COST) {
      minVal = Math.min(...criterionValues);
    } else { // BENEFIT
      maxVal = Math.max(...criterionValues);
    }

    alternativesWithParsedValues.forEach((alt, index) => {
      if (!normalizedAlternatives[index]) {
        normalizedAlternatives[index] = {
          alternativeId: alt.id,
          alternativeName: alt.name,
          originalValues: { ...alt.values },
          normalizedValues: {},
        };
      }
      
      const currentValue = alt.values[crit.id];
      let normalizedValue: number;

      if (crit.type === CriterionType.COST) {
        if (currentValue === 0) { // Avoid division by zero if cost is 0
          // If minVal is also 0, this might be 1, otherwise it could be Infinity.
          // A cost of 0 is typically best. If minVal is also 0, normalized is 1.
          // If cost is 0 and minVal is not 0, this is an infinitely good score for this criterion.
          // For simplicity, if value is 0 and minVal is 0, score is 1. If value is 0 and minVal > 0, score is effectively infinite (or max practical value)
          // For SAW this usually means it's the best. Most examples don't have 0 costs for cost criteria.
          // Let's assume non-zero values for cost criteria when minVal is used in numerator.
          // If currentValue = 0 for a cost criterion, it should be the best.
          // If minVal = 0, then 0/0 is problematic. If minVal > 0, minVal/0 is Inf.
          // Let's assume cost criteria values are > 0. If current value is 0, it means it is extremely good.
          // Normalized value for cost: min / current. If current is 0, this is problematic unless min is also 0.
          // If minVal is 0, and current is 0 -> 1. If minVal is 0, and current > 0 -> 0.
          if (minVal === 0) {
            normalizedValue = (currentValue === 0) ? 1 : 0; // if current value is also 0 it gets 1, otherwise 0
          } else { // minVal > 0
            normalizedValue = (currentValue === 0) ? Infinity : minVal! / currentValue; // If current value is 0, it's infinitely good. Handle Infinity later if needed.
             if (currentValue === 0) normalizedValue = Number.MAX_SAFE_INTEGER; // A large number to signify "best"
             else normalizedValue = minVal! / currentValue;
          }

        } else {
          normalizedValue = minVal! / currentValue;
        }
      } else { // BENEFIT
        if (maxVal === 0) { // All values for this benefit criterion are 0
          normalizedValue = 0; // Or 1, depending on interpretation. Let's use 0 to avoid issues.
        } else {
          normalizedValue = currentValue / maxVal!;
        }
      }
      normalizedAlternatives[index].normalizedValues[crit.id] = normalizedValue;
    });
  }
  
  // 2. Calculate Preference Scores
  const resultsWithScores: Array<Omit<SAWResultItem, 'rank'>> = normalizedAlternatives.map(altNorm => {
    let preferenceScore = 0;
    for (const crit of criteria) {
      preferenceScore += altNorm.normalizedValues[crit.id] * crit.weight;
    }
    return { ...altNorm, preferenceScore };
  });

  // 3. Rank
  const sortedResults = [...resultsWithScores].sort((a, b) => b.preferenceScore - a.preferenceScore);

  const finalResults: SAWResultItem[] = sortedResults.map((res, index) => ({
    ...res,
    rank: index + 1,
  }));

  return { results: finalResults };
};
