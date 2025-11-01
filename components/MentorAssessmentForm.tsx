import React, { useState } from 'react';
import type { MenteeProfile } from '../types';
import { SURVEY_QUESTIONS } from '../constants';

interface MentorAssessmentFormProps {
  mentee: MenteeProfile;
  onSubmit: (answers: number[]) => void;
  onClose: () => void;
}

const MentorAssessmentForm: React.FC<MentorAssessmentFormProps> = ({ mentee, onSubmit, onClose }) => {
  const [answers, setAnswers] = useState<number[]>(Array(SURVEY_QUESTIONS.length).fill(0));

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const isComplete = answers.every(answer => answer > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onSubmit(answers);
    }
  };

  const options = [
    { label: "Nunca", value: 1 },
    { label: "Raramente", value: 2 },
    { label: "Às vezes", value: 3 },
    { label: "Sempre", value: 4 },
  ];

  return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900">Avaliação de Nivelamento</h1>
          <p className="mt-2 text-gray-600">
            Avaliando: <span className="font-semibold">{mentee.name}</span>. Responda às perguntas abaixo com base na sua percepção sobre o orientado.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {SURVEY_QUESTIONS.map((q, index) => (
              <div key={q.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-lg text-gray-800">{index + 1}. {q.text}</p>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {options.map(option => (
                    <label key={option.value} className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${answers[index] === option.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white hover:bg-blue-50 border'}`}>
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option.value}
                        checked={answers[index] === option.value}
                        onChange={() => handleAnswerChange(index, option.value)}
                        className="sr-only"
                      />
                      <span className="font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-4 mt-8 sticky bottom-0 bg-white py-4 -mx-8 px-8 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-lg font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isComplete}
                className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Enviar Avaliação
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorAssessmentForm;
