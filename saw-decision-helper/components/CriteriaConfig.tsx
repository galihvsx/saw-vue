
import React, { useState } from 'react';
import { Criterion, CriterionType } from '../types';
import Button from './Button';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface CriteriaConfigProps {
  criteria: Criterion[];
  setCriteria: React.Dispatch<React.SetStateAction<Criterion[]>>;
  updateAlternativeValuesForNewCriterion: (criterionId: string) => void;
  removeCriterionValuesFromAlternatives: (criterionId: string) => void;
}

const CriteriaConfig: React.FC<CriteriaConfigProps> = ({ criteria, setCriteria, updateAlternativeValuesForNewCriterion, removeCriterionValuesFromAlternatives }) => {
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionWeight, setNewCriterionWeight] = useState('');
  const [newCriterionType, setNewCriterionType] = useState<CriterionType>(CriterionType.BENEFIT);
  const [nameError, setNameError] = useState('');
  const [weightError, setWeightError] = useState('');

  const handleAddCriterion = () => {
    setNameError('');
    setWeightError('');
    let valid = true;
    if (!newCriterionName.trim()) {
      setNameError('Criterion name cannot be empty.');
      valid = false;
    }
    const weight = parseFloat(newCriterionWeight);
    if (isNaN(weight) || weight <= 0 || weight > 1) {
      setWeightError('Weight must be a number between 0 (exclusive) and 1 (inclusive).');
      valid = false;
    }

    if (!valid) return;

    const newId = crypto.randomUUID();
    const newCrit: Criterion = {
      id: newId,
      name: newCriterionName.trim(),
      weight: weight,
      type: newCriterionType,
    };
    setCriteria([...criteria, newCrit]);
    updateAlternativeValuesForNewCriterion(newId); // Ensure alternatives get a value placeholder
    setNewCriterionName('');
    setNewCriterionWeight('');
    setNewCriterionType(CriterionType.BENEFIT);
  };

  const handleRemoveCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    removeCriterionValuesFromAlternatives(id);
  };
  
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 border-b pb-3">Define Criteria</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="critName" className="block text-sm font-medium text-slate-700 mb-1">Criterion Name</label>
          <input
            id="critName"
            type="text"
            value={newCriterionName}
            onChange={(e) => setNewCriterionName(e.target.value)}
            placeholder="e.g., Price"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>
        <div>
          <label htmlFor="critWeight" className="block text-sm font-medium text-slate-700 mb-1">Weight (0-1)</label>
          <input
            id="critWeight"
            type="number"
            step="0.01"
            value={newCriterionWeight}
            onChange={(e) => setNewCriterionWeight(e.target.value)}
            placeholder="e.g., 0.25"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {weightError && <p className="text-red-500 text-xs mt-1">{weightError}</p>}
        </div>
        <div>
          <label htmlFor="critType" className="block text-sm font-medium text-slate-700 mb-1">Type</label>
          <select
            id="critType"
            value={newCriterionType}
            onChange={(e) => setNewCriterionType(e.target.value as CriterionType)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={CriterionType.BENEFIT}>Benefit (Higher is better)</option>
            <option value={CriterionType.COST}>Cost (Lower is better)</option>
          </select>
        </div>
        <Button onClick={handleAddCriterion} leftIcon={<PlusIcon className="w-5 h-5"/>} className="w-full md:w-auto">
          Add Criterion
        </Button>
      </div>

      {criteria.length > 0 && (
        <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-slate-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-0">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Weight</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Type</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right text-sm font-semibold text-slate-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {criteria.map((c) => (
                    <tr key={c.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-0">{c.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{c.weight.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 capitalize">{c.type}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Button onClick={() => handleRemoveCriterion(c.id)} variant="ghost" size="sm" aria-label="Remove criterion">
                           <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700"/>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
               {Math.abs(totalWeight - 1) > 0.001 && (
                <p className="text-sm text-amber-600 mt-2">
                  Note: The sum of weights is currently {totalWeight.toFixed(2)}. It's often recommended for weights to sum to 1.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriteriaConfig;
