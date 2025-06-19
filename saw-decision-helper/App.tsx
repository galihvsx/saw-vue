
import React, { useState, useCallback } from 'react';
import { Criterion, Alternative, SAWResultItem } from './types';
import CriteriaConfig from './components/CriteriaConfig';
import AlternativesConfig from './components/AlternativesConfig';
import DecisionMatrixInput from './components/DecisionMatrixInput';
import ResultsDisplay from './components/ResultsDisplay';
import Button from './components/Button';
import { calculateSAW } from './services/sawCalculator';

const App: React.FC = () => {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [results, setResults] = useState<SAWResultItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateAlternativeValuesForNewCriterion = useCallback((criterionId: string) => {
    setAlternatives(prevAlts => 
      prevAlts.map(alt => ({
        ...alt,
        values: {
          ...alt.values,
          [criterionId]: undefined // Add placeholder for new criterion
        }
      }))
    );
  }, []);
  
  const removeCriterionValuesFromAlternatives = useCallback((criterionId: string) => {
    setAlternatives(prevAlts =>
      prevAlts.map(alt => {
        const newValues = { ...alt.values };
        delete newValues[criterionId];
        return { ...alt, values: newValues };
      })
    );
  }, []);


  const handleValueChange = useCallback((alternativeId: string, criterionId: string, value: number | undefined) => {
    setAlternatives(prevAlts =>
      prevAlts.map(alt =>
        alt.id === alternativeId
          ? { ...alt, values: { ...alt.values, [criterionId]: value } }
          : alt
      )
    );
    // Clear previous results and errors when matrix changes
    if (results) setResults(null);
    if (error) setError(null);
  }, [results, error]);

  const handleCalculate = () => {
    setError(null);
    setResults(null);
    const { results: sawResults, error: calcError } = calculateSAW(criteria, alternatives);
    if (calcError) {
      setError(calcError);
    } else {
      setResults(sawResults);
    }
  };

  const handleReset = () => {
    setCriteria([]);
    setAlternatives([]);
    setResults(null);
    setError(null);
  };
  
  const canCalculate = criteria.length > 0 && alternatives.length > 0 &&
    alternatives.every(alt => criteria.every(crit => alt.values[crit.id] !== undefined && !isNaN(alt.values[crit.id]!)));


  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-indigo-700 sm:text-5xl">
          Simple Additive Weighting (SAW) Solver
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
          Define your criteria and alternatives, input their values, and let the SAW method help you find the best option.
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <CriteriaConfig 
          criteria={criteria} 
          setCriteria={setCriteria} 
          updateAlternativeValuesForNewCriterion={updateAlternativeValuesForNewCriterion}
          removeCriterionValuesFromAlternatives={removeCriterionValuesFromAlternatives}
        />
        <AlternativesConfig 
          alternatives={alternatives} 
          setAlternatives={setAlternatives} 
          criteriaIds={criteria.map(c => c.id)}
        />
        <DecisionMatrixInput 
          criteria={criteria} 
          alternatives={alternatives} 
          onValueChange={handleValueChange} 
        />

        <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <Button 
              onClick={handleCalculate} 
              disabled={!canCalculate}
              size="lg"
              className={!canCalculate ? "opacity-50 cursor-not-allowed" : ""}
            >
              Calculate Results
            </Button>
            <Button onClick={handleReset} variant="secondary" size="lg">
              Reset All
            </Button>
          </div>
           {!canCalculate && (criteria.length > 0 || alternatives.length > 0) && (
            <p className="text-sm text-amber-600">
              Please ensure all criteria, alternatives, and matrix values are defined before calculating.
            </p>
          )}
        </div>
        
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-md" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {results && results.length > 0 && (
          <ResultsDisplay results={results} criteria={criteria} />
        )}
        {results && results.length === 0 && !error && (
           <div className="p-6 bg-white rounded-lg shadow-lg text-center">
             <p className="text-slate-600">Calculations performed, but no results were generated. This might happen if there are no alternatives or criteria after filtering/processing.</p>
           </div>
        )}
      </main>
      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} SAW Decision Helper. Built for complex decision-making.</p>
      </footer>
    </div>
  );
};

export default App;
