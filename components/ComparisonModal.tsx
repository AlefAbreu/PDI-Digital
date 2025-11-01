import React from 'react';
import type { MenteeProfile } from '../types';
import { SURVEY_QUESTIONS } from '../constants';

interface ComparisonModalProps {
  mentee: MenteeProfile;
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ mentee, onClose }) => {
    const menteeAnswers = mentee.surveyAnswers || [];
    const mentorAnswers = mentee.mentorSurveyAnswers || [];

    const menteeScore = menteeAnswers.reduce((a, b) => a + b, 0);
    const mentorScore = mentorAnswers.reduce((a, b) => a + b, 0);
    const maxScore = SURVEY_QUESTIONS.length * 4;

    const getLabelForValue = (value: number) => {
        switch (value) {
            case 1: return "Nunca";
            case 2: return "Raramente";
            case 3: return "Às vezes";
            case 4: return "Sempre";
            default: return "N/A";
        }
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Comparativo de Avaliações: {mentee.name}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            </div>
        </div>
        
        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">Autoavaliação (Orientado)</h3>
                  {menteeAnswers.length > 0 ? (
                      <ul className="space-y-3">
                        {SURVEY_QUESTIONS.map((q, index) => (
                             <li key={q.id} className="p-3 bg-white rounded shadow-sm">
                                <p className="text-sm text-gray-600">{q.text}</p>
                                <p className="font-bold text-blue-700 mt-1">{getLabelForValue(menteeAnswers[index])}</p>
                            </li>
                        ))}
                      </ul>
                  ) : <p className="text-center text-gray-500">O orientado ainda não respondeu.</p>}
              </div>
               <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">Avaliação (Mentor)</h3>
                   {mentorAnswers.length > 0 ? (
                      <ul className="space-y-3">
                        {SURVEY_QUESTIONS.map((q, index) => (
                             <li key={q.id} className="p-3 bg-white rounded shadow-sm">
                                <p className="text-sm text-gray-600">{q.text}</p>
                                <p className="font-bold text-green-700 mt-1">{getLabelForValue(mentorAnswers[index])}</p>
                            </li>
                        ))}
                      </ul>
                   ) : <p className="text-center text-gray-500">Você ainda não avaliou.</p>}
              </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-between items-center">
             <div className="text-sm font-semibold">
                {mentorAnswers.length > 0 && menteeAnswers.length > 0 && (
                    <div className="flex gap-6">
                        <span className="text-blue-800">Pontuação Orientado: {menteeScore} / {maxScore}</span>
                        <span className="text-green-800">Pontuação Mentor: {mentorScore} / {maxScore}</span>
                    </div>
                )}
             </div>
             <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Fechar
              </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;