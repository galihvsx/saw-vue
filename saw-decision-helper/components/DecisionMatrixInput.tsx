
import React from 'react';
import { Alternative, Criterion } from '../types';

interface DecisionMatrixInputProps {
  criteria: Criterion[];
  alternatives: Alternative[];
  onValueChange: (alternativeId: string, criterionId: string, value: number | undefined) => void;
}

const DecisionMatrixInput: React.FC<DecisionMatrixInputProps> = ({ criteria, alternatives, onValueChange }) => {
  if (criteria.length === 0 || alternatives.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-800 border-b pb-3 mb-4">Decision Matrix</h2>
        <p className="text-slate-600">Please define at least one criterion and one alternative to build the decision matrix.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-slate-800 border-b pb-3 mb-6">Decision Matrix</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-300 border border-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="sticky left-0 bg-slate-50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6 z-10">Alternative</th>
              {criteria.map(c => (
                <th key={c.id} scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-slate-900">
                  {c.name} <span className="text-xs font-normal text-slate-500">({c.type}, w={c.weight.toFixed(2)})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {alternatives.map(alt => (
              <tr key={alt.id}>
                <td className="sticky left-0 bg-white whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6 z-10">{alt.name}</td>
                {criteria.map(crit => (
                  <td key={crit.id} className="whitespace-nowrap px-3 py-2">
                    <input
                      type="number"
                      step="any"
                      value={alt.values[crit.id] === undefined ? '' : alt.values[crit.id]}
                      onChange={(e) => {
                        const val = e.target.value;
                        onValueChange(alt.id, crit.id, val === '' ? undefined : parseFloat(val));
                      }}
                      placeholder="Value"
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
                      aria-label={`Value for ${alt.name}, ${crit.name}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DecisionMatrixInput;
