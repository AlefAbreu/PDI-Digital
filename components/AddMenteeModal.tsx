import React, { useState } from 'react';

interface AddMenteeModalProps {
  onClose: () => void;
  onSave: (name: string, registrationNumber: string) => void;
  existingRegNumbers: string[];
}

const AddMenteeModal: React.FC<AddMenteeModalProps> = ({ onClose, onSave, existingRegNumbers }) => {
  const [name, setName] = useState('');
  const [regNum, setRegNum] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !regNum.trim()) {
      setError('Nome e número de registro são obrigatórios.');
      return;
    }
    
    if (existingRegNumbers.includes(regNum.trim())) {
        setError('Este número de registro já está em uso.');
        return;
    }

    setIsSaving(true);
    onSave(name.trim(), regNum.trim());
    // The parent component will close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Cadastrar Novo Orientado</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold" disabled={isSaving}>&times;</button>
          </div>
        </div>
        
        <form onSubmit={handleSave}>
            <div className="p-8 space-y-4">
                {error && <p className="text-red-500 font-semibold bg-red-100 p-3 rounded-lg text-sm">{error}</p>}
                <div>
                    <label htmlFor="menteeName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Orientado</label>
                    <input
                        id="menteeName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: João da Silva"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="menteeRegNum" className="block text-sm font-medium text-gray-700 mb-1">Número de Registro</label>
                    <input
                        id="menteeRegNum"
                        type="text"
                        value={regNum}
                        onChange={(e) => setRegNum(e.target.value)}
                        placeholder="Use para o login do orientado"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                 <button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving}
                    className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-300"
                  >
                    Cancelar
                  </button>
                 <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenteeModal;
