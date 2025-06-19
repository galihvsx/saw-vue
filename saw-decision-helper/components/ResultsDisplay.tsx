
import React from 'react';
import { SAWResultItem, Criterion } from '../types';

interface ResultsDisplayProps {
  results: SAWResultItem[];
  criteria: Criterion[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, criteria }) => {
  if (results.length === 0) {
    return null; // Or a message like "No results to display. Click Calculate."
  }

  const formatNumber = (num: number) => {
    if (Number.isInteger(num)) return num.toString();
    // Show more precision if small, less if large or very close to integer
    if (Math.abs(num) < 0.0001 && num !== 0) return num.toExponential(2);
    const fixed = num.toFixed(3);
    if (fixed.endsWith('000')) return num.toFixed(0);
    if (fixed.endsWith('00')) return num.toFixed(1);
    if (fixed.endsWith('0')) return num.toFixed(2);
    return fixed;
  };


  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-8">
      <h2 className="text-2xl font-semibold text-slate-800 border-b pb-3">Calculation Results</h2>

      {/* Normalized Matrix */}
      <div>
        <h3 className="text-xl font-medium text-slate-700 mb-4">Normalized Decision Matrix (R)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-300 border border-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="sticky left-0 bg-slate-50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6 z-10">Alternative</th>
                {criteria.map(c => (
                  <th key={c.id} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-slate-900">{c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {results.map(res => (
                <tr key={res.alternativeId}>
                  <td className="sticky left-0 bg-white whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6 z-10">{res.alternativeName}</td>
                  {criteria.map(crit => (
                    <td key={crit.id} className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 text-center">
                      {formatNumber(res.normalizedValues[crit.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preference Scores and Ranking */}
      <div>
        <h3 className="text-xl font-medium text-slate-700 mb-4">Preference Scores and Ranking (V)</h3>
         <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-300 border border-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Alternative</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Preference Score (V)</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {results.map(res => (
                <tr key={res.alternativeId} className={res.rank === 1 ? 'bg-green-50' : ''}>
                  <td className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 ${res.rank === 1 ? 'font-bold text-green-700' : 'font-medium text-slate-900'}`}>
                    {res.alternativeName}
                    {res.rank === 1 && <span className="ml-2 text-xs text-green-600">(Best)</span>}
                  </td>
                  <td className={`whitespace-nowrap px-3 py-4 text-sm ${res.rank === 1 ? 'font-bold text-green-700' : 'text-slate-500'}`}>
                    {formatNumber(res.preferenceScore)}
                  </td>
                  <td className={`whitespace-nowrap px-3 py-4 text-sm ${res.rank === 1 ? 'font-bold text-green-700' : 'text-slate-500'}`}>
                    {res.rank}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
