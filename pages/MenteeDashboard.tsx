import React, { useState } from 'react';
import type { Mentee, DevelopmentActivity, MenteeProfile } from '../types';
import { MATURITY_TIPS } from '../constants';
import CalendarView from '../components/CalendarView';

interface MenteeDashboardProps {
  mentee: MenteeProfile;
  allMentees: MenteeProfile[];
  onLogout: () => void;
  onUpdateMentee: (updatedMentee: MenteeProfile) => void;
}

const MenteeDashboard: React.FC<MenteeDashboardProps> = ({ mentee, allMentees, onLogout, onUpdateMentee }) => {
    const [view, setView] = useState<'plan' | 'calendar'>('plan');
    
    const allActivities = allMentees.flatMap(m => m.developmentPlan || []).filter(a => a.status !== 'draft');
    
    const handleStatusChange = (activityId: string, newStatus: DevelopmentActivity['status']) => {
        const updatedPlan = (mentee.developmentPlan || []).map(act =>
            act.id === activityId ? { ...act, status: newStatus } : act
        );
        const updatedMentee = { ...mentee, developmentPlan: updatedPlan };
        onUpdateMentee(updatedMentee);
    };

    const renderActivitySteps = (steps: string[]) => {
        return (
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                {steps.map((step, index) => <li key={index}>{step}</li>)}
            </ul>
        );
    }
    
    const tips = mentee.maturityLevel ? MATURITY_TIPS[mentee.maturityLevel.level] : null;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-wrap justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Meu Painel</h1>
                        <p className="text-gray-600">Bem-vindo(a), {mentee.name}!</p>
                    </div>
                    <button onClick={onLogout} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Sair</button>
                </header>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                            <h2 className="text-xl font-semibold text-blue-800 mb-2">Seu Nível de Desenvolvimento</h2>
                            {mentee.maturityLevel ? (
                                <>
                                    <p className="font-bold text-2xl text-blue-900">{mentee.maturityLevel.name}</p>
                                    <p className="mt-1 text-gray-700">{mentee.maturityLevel.description}</p>
                                </>
                            ) : (
                                <p className="text-gray-600">Seu mentor ainda não avaliou seu nível. Aguarde o feedback para ver seu plano de desenvolvimento.</p>
                            )}
                        </div>
                         {tips && (
                            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                                <h2 className="text-xl font-semibold text-green-800 mb-2">{tips.title}</h2>
                                <ul className="list-disc list-inside space-y-1 text-green-900">
                                    {tips.points.map((tip, index) => <li key={index}>{tip}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="border-b border-gray-200 mb-4">
                        <nav className="-mb-px flex space-x-6">
                            <button onClick={() => setView('plan')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${view === 'plan' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Meu Plano (PDI)
                            </button>
                            <button onClick={() => setView('calendar')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${view === 'calendar' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                Calendário Geral
                            </button>
                        </nav>
                    </div>

                    {view === 'plan' && (
                        <div>
                            {mentee.developmentPlan && mentee.developmentPlan.filter(a => a.status !== 'draft').length > 0 ? (
                                <div className="space-y-4">
                                    {mentee.developmentPlan.filter(a => a.status !== 'draft').map((activity: DevelopmentActivity) => (
                                        <div key={activity.id} className="p-4 border rounded-lg bg-white shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800">{activity.title} {activity.isAI && <span className="text-xs bg-purple-200 text-purple-800 font-medium ml-2 px-2 py-0.5 rounded-full">AI</span>}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 font-semibold">Prazo: {new Date(activity.dueDate).toLocaleDateString()}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                                    {renderActivitySteps(activity.steps)}
                                                    {activity.pdfAttachment && (
                                                        <a href={activity.pdfAttachment.url} download={activity.pdfAttachment.name} className="mt-2 inline-block text-blue-600 hover:underline text-sm font-semibold">
                                                            Baixar Anexo: {activity.pdfAttachment.name}
                                                        </a>
                                                    )}
                                                </div>
                                                <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize
                                                    ${activity.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                                    ${activity.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${activity.status === 'assigned' ? 'bg-gray-100 text-gray-800' : ''}
                                                `}>
                                                    {activity.status === 'assigned' && 'Pendente'}
                                                    {activity.status === 'in_progress' && 'Em Progresso'}
                                                    {activity.status === 'completed' && 'Concluído'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                {(activity.status === 'assigned' || activity.status === 'in_progress') && <button onClick={() => handleStatusChange(activity.id, 'completed')} className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Marcar como Concluído</button>}
                                                {activity.status === 'assigned' && <button onClick={() => handleStatusChange(activity.id, 'in_progress')} className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Iniciar</button>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">Seu plano de desenvolvimento aparecerá aqui assim que for definido pelo seu mentor.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {view === 'calendar' && <CalendarView activities={allActivities} />}
                </div>
            </div>
        </div>
    );
};

export default MenteeDashboard;