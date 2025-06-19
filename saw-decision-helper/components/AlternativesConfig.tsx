
import React, { useState } from 'react';
import { Alternative } from '../types';
import Button from './Button';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface AlternativesConfigProps {
  alternatives: Alternative[];
  setAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>;
  criteriaIds: string[]; // To initialize values for new alternatives
}

const AlternativesConfig: React.FC<AlternativesConfigProps> = ({ alternatives, setAlternatives, criteriaIds }) => {
  const [newAlternativeName, setNewAlternativeName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleAddAlternative = () => {
    setNameError('');
    if (!newAlternativeName.trim()) {
      setNameError('Alternative name cannot be empty.');
      return;
    }

    const initialValues: Record<string, number | undefined> = {};
    criteriaIds.forEach(critId => {
      initialValues[critId] = undefined; // Initialize with undefined, user needs to fill it
    });

    const newAlt: Alternative = {
      id: crypto.randomUUID(),
      name: newAlternativeName.trim(),
      values: initialValues,
    };
    setAlternatives([...alternatives, newAlt]);
    setNewAlternativeName('');
  };

  const handleRemoveAlternative = (id: string) => {
    setAlternatives(alternatives.filter(a => a.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-slate-800 border-b pb-3">Define Alternatives</h2>
      
      <div className="flex items-end gap-4">
        <div className="flex-grow">
          <label htmlFor="altName" className="block text-sm font-medium text-slate-700 mb-1">Alternative Name</label>
          <input
            id="altName"
            type="text"
            value={newAlternativeName}
            onChange={(e) => setNewAlternativeName(e.target.value)}
            placeholder="e.g., Option A"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
        </div>
        <Button onClick={handleAddAlternative} leftIcon={<PlusIcon className="w-5 h-5"/>}>
          Add Alternative
        </Button>
      </div>

      {alternatives.length > 0 && (
         <div className="mt-6 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-slate-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-0">Name</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right text-sm font-semibold text-slate-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {alternatives.map((alt) => (
                    <tr key={alt.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-0">{alt.name}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                         <Button onClick={() => handleRemoveAlternative(alt.id)} variant="ghost" size="sm" aria-label="Remove alternative">
                           <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700"/>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlternativesConfig;
