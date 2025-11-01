import React, { useState } from 'react';
import { SURVEY_QUESTIONS } from '../constants';
import type { User } from '../types';

interface SurveyPageProps {
  user: User;
  onSubmit: (userId: string, answers: number[]) => void;
}

const SurveyPage: React.FC<SurveyPageProps> = ({ user, onSubmit }) => {
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
      onSubmit(user.id, answers);
    }
  };

  const options = [
    { label: "Nunca", value: 1 },
    { label: "Raramente", value: 2 },
    { label: "Às vezes", value: 3 },
    { label: "Sempre", value: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900">Autoavaliação de Nivelamento</h1>
            <p className="mt-2 text-gray-600">
                Olá, <span className="font-semibold">{user.name}</span>! Para começar, responda honestamente às perguntas abaixo. Sua resposta ajudará a guiar seu plano de desenvolvimento.
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
                <div className="flex justify-end mt-8 sticky bottom-0 bg-white py-4 -mx-8 px-8 border-t">
                <button
                    type="submit"
                    disabled={!isComplete}
                    className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Enviar Minha Avaliação
                </button>
                </div>
            </form>
        </div>
       </div>
    </div>
  );
};

export default SurveyPage;
