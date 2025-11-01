import React, { useState } from 'react';
import { MATURITY_LEVELS } from '../constants';
import type { MaturityLevelInfo } from '../types';

interface MaturityConfirmationModalProps {
  calculatedLevel: MaturityLevelInfo;
  onConfirm: (finalLevel: MaturityLevelInfo) => void;
  onClose: () => void;
}

const MaturityConfirmationModal: React.FC<MaturityConfirmationModalProps> = ({ calculatedLevel, onConfirm, onClose }) => {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(calculatedLevel.level);

  const handleConfirm = () => {
    const finalLevel = MATURITY_LEVELS.find(l => l.level === selectedLevelId);
    if (finalLevel) {
      onConfirm(finalLevel);
    }
  };

  const selectedLevelInfo = MATURITY_LEVELS.find(l => l.level === selectedLevelId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Confirmar Nível de Maturidade</h2>
        </div>
        
        <div className="p-8 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700">Nível Sugerido (com base na pontuação):</h3>
            <p className="text-xl font-bold text-blue-600">{calculatedLevel.name}</p>
          </div>

          <div>
            <label htmlFor="maturityLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Ajustar nível manualmente, se necessário:
            </label>
            <select
              id="maturityLevel"
              value={selectedLevelId}
              onChange={(e) => setSelectedLevelId(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MATURITY_LEVELS.map(level => (
                <option key={level.level} value={level.level}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {selectedLevelInfo && (
             <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-semibold text-gray-800">{selectedLevelInfo.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedLevelInfo.description}</p>
             </div>
          )}

        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Confirmar e Salvar Nível
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaturityConfirmationModal;