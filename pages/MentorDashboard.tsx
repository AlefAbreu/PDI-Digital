import React, { useState } from 'react';
import type { User, MenteeProfile, DevelopmentActivity, AIGeneratedSuggestion, MaturityLevelInfo } from '../types';
import { MATURITY_LEVELS, SURVEY_QUESTIONS, MATURITY_TIPS } from '../constants';
import { generateActivitySuggestions } from '../services/geminiService';
import MentorAssessmentForm from '../components/MentorAssessmentForm';
import ComparisonModal from '../components/ComparisonModal';
import Spinner from '../components/Spinner';
import AddMenteeModal from '../components/AddMenteeModal';
import MaturityConfirmationModal from '../components/MaturityConfirmationModal';

interface MentorDashboardProps {
  mentor: User;
  mentees: MenteeProfile[];
  allRegistrationNumbers: string[];
  setMentees: React.Dispatch<React.SetStateAction<MenteeProfile[]>>;
  onLogout: () => void;
  onAddMentee: (name: string, registrationNumber: string) => void;
}

const MentorDashboard: React.FC<MentorDashboardProps> = ({ mentor, mentees, allRegistrationNumbers, setMentees, onLogout, onAddMentee }) => {
    const [selectedMentee, setSelectedMentee] = useState<MenteeProfile | null>(null);
    const [isAssessing, setIsAssessing] = useState(false);
    const [isComparing, setIsComparing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Partial<DevelopmentActivity> | null>(null);
    const [isAddingMentee, setIsAddingMentee] = useState(false);
    const [assessmentResult, setAssessmentResult] = useState<{ answers: number[]; calculatedLevel: MaturityLevelInfo; } | null>(null);


    const handleSelectMentee = (mentee: MenteeProfile) => {
        setSelectedMentee(mentee);
        setEditingActivity(null); // Close activity form when switching mentees
    };
    
    const handleAssessmentSubmit = (answers: number[]) => {
        if (!selectedMentee) return;

        const totalScore = answers.reduce((sum, a) => sum + a, 0);
        const maxScore = SURVEY_QUESTIONS.length * 4;
        const percentage = (totalScore / maxScore) * 100;
        
        let level = 1;
        if (percentage > 85) level = 5;
        else if (percentage > 70) level = 4;
        else if (percentage > 50) level = 3;
        else if (percentage > 30) level = 2;
        
        const maturityLevel = MATURITY_LEVELS.find(l => l.level === level) as MaturityLevelInfo;

        setIsAssessing(false);
        setAssessmentResult({ answers, calculatedLevel: maturityLevel });
    };

    const handleConfirmMaturity = (finalLevel: MaturityLevelInfo) => {
        if (!selectedMentee || !assessmentResult) return;

        const updateMentee = (m: MenteeProfile) => m.id === selectedMentee.id 
            ? { ...m, mentorSurveyAnswers: assessmentResult.answers, maturityLevel: finalLevel } 
            : m;
        
        setMentees(prev => prev.map(updateMentee));
        setSelectedMentee(prev => prev ? updateMentee(prev) : null);
        setAssessmentResult(null);
    };

    const handleGenerateAISuggestions = async () => {
        if (!selectedMentee?.maturityLevel) return;
        setIsGenerating(true);
        try {
            const suggestions = await generateActivitySuggestions(selectedMentee.maturityLevel);
            if (suggestions.length > 0) {
                const newActivities: DevelopmentActivity[] = suggestions.map((s, i) => ({
                    id: `ai-${Date.now()}-${i}`,
                    ...s,
                    dueDate: '',
                    status: 'draft',
                    isAI: true,
                }));

                const updateMentee = (m: MenteeProfile) => m.id === selectedMentee.id ? { ...m, developmentPlan: [...m.developmentPlan, ...newActivities] } : m;

                setMentees(prev => prev.map(updateMentee));
                setSelectedMentee(prev => prev ? updateMentee(prev) : null);
            }
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editingActivity) return;
        setEditingActivity({ ...editingActivity, [e.target.name]: e.target.value });
    };

    const handleSaveActivity = () => {
        if (!editingActivity || !selectedMentee) return;
    
        const plan = selectedMentee.developmentPlan || [];
        let updatedPlan: DevelopmentActivity[];
    
        const processedSteps =
            typeof (editingActivity.steps as any) === 'string'
                ? (editingActivity.steps as any).split('\n').filter((s: string) => s)
                : editingActivity.steps || [];
    
        if (editingActivity.id) { // Existing activity
            updatedPlan = plan.map(a =>
                a.id === editingActivity.id
                    ? { ...a, ...editingActivity, steps: processedSteps } as DevelopmentActivity
                    : a
            );
        } else { // New activity
            const newActivity: DevelopmentActivity = {
                id: `manual-${Date.now()}`,
                title: editingActivity.title || '',
                description: editingActivity.description || '',
                steps: processedSteps,
                dueDate: editingActivity.dueDate || '',
                status: 'draft',
            };
            updatedPlan = [...plan, newActivity];
        }
    
        const updateMentee = (m: MenteeProfile) =>
            m.id === selectedMentee.id ? { ...m, developmentPlan: updatedPlan } : m;
        setMentees(prev => prev.map(updateMentee));
        setSelectedMentee(prev => (prev ? updateMentee(prev) : null));
        setEditingActivity(null);
    };

    const handleDeleteActivity = (activityId: string) => {
         if (!selectedMentee) return;
         const updatedPlan = selectedMentee.developmentPlan.filter(a => a.id !== activityId);
         const updateMentee = (m: MenteeProfile) => m.id === selectedMentee.id ? { ...m, developmentPlan: updatedPlan } : m;
         setMentees(prev => prev.map(updateMentee));
         setSelectedMentee(prev => prev ? updateMentee(prev) : null);
    }
    
    const handleSaveMentee = (name: string, registrationNumber: string) => {
        onAddMentee(name, registrationNumber);
        setIsAddingMentee(false);
    };
    
    const tips = selectedMentee?.maturityLevel ? MATURITY_TIPS[selectedMentee.maturityLevel.level] : null;

    const renderDevelopmentPlan = () => {
        if(!selectedMentee) return null;

        const plan = selectedMentee.developmentPlan || [];

        return (
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Plano de Desenvolvimento Individual (PDI)</h3>
                <div className="space-y-4">
                    {plan.map(activity => (
                        <div key={activity.id} className="p-4 border rounded-lg bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-800">{activity.title} {activity.isAI && <span className="text-xs bg-purple-200 text-purple-800 font-medium ml-2 px-2 py-0.5 rounded-full">AI</span>}</h4>
                                    <p className="text-sm text-gray-500 mt-1 font-semibold">Prazo: {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : 'N/D'}</p>
                                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                                        {activity.steps.map((step, index) => <li key={index}>{step}</li>)}
                                    </ul>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                                    {'draft': 'bg-gray-100 text-gray-800', 'assigned': 'bg-blue-100 text-blue-800', 'in_progress': 'bg-yellow-100 text-yellow-800', 'completed': 'bg-green-100 text-green-800'}[activity.status]
                                }`}>
                                    {activity.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setEditingActivity(activity)} className="text-sm px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Editar</button>
                                {activity.status === 'draft' && <button onClick={() => handleDeleteActivity(activity.id)} className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Excluir</button>}
                            </div>
                        </div>
                    ))}
                </div>

                {editingActivity ? (
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold mb-2">{editingActivity.id ? 'Editar Atividade' : 'Nova Atividade'}</h4>
                        <div className="space-y-3">
                            <input name="title" value={editingActivity.title || ''} onChange={handleActivityChange} placeholder="Título" className="w-full p-2 border rounded"/>
                            <textarea name="description" value={editingActivity.description || ''} onChange={handleActivityChange} placeholder="Descrição" className="w-full p-2 border rounded"/>
                            <textarea name="steps" value={(Array.isArray(editingActivity.steps) ? editingActivity.steps.join('\n') : editingActivity.steps as any) || ''} onChange={handleActivityChange} placeholder="Passos (um por linha)" className="w-full p-2 border rounded"/>
                            <input name="dueDate" type="date" value={editingActivity.dueDate ? editingActivity.dueDate.split('T')[0] : ''} onChange={handleActivityChange} className="w-full p-2 border rounded"/>
                             <select name="status" value={editingActivity.status || 'draft'} onChange={handleActivityChange} className="w-full p-2 border rounded">
                                <option value="draft">Rascunho</option>
                                <option value="assigned">Atribuída</option>
                                <option value="in_progress">Em Progresso</option>
                                <option value="completed">Concluída</option>
                             </select>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={handleSaveActivity} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Salvar</button>
                            <button onClick={() => setEditingActivity(null)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setEditingActivity({})} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Adicionar Atividade Manualmente</button>
                )}
            </div>
        )
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {isAssessing && selectedMentee && <MentorAssessmentForm mentee={selectedMentee} onSubmit={handleAssessmentSubmit} onClose={() => setIsAssessing(false)} />}
            {assessmentResult && <MaturityConfirmationModal calculatedLevel={assessmentResult.calculatedLevel} onConfirm={handleConfirmMaturity} onClose={() => setAssessmentResult(null)}/>}
            {isComparing && selectedMentee && <ComparisonModal mentee={selectedMentee} onClose={() => setIsComparing(false)} />}
            {isAddingMentee && (
                <AddMenteeModal
                    onClose={() => setIsAddingMentee(false)}
                    onSave={handleSaveMentee}
                    existingRegNumbers={allRegistrationNumbers}
                />
            )}

            <aside className="w-1/4 bg-white border-r overflow-y-auto flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Painel do Mentor</h2>
                    <p className="text-sm text-gray-600">Bem-vindo(a), {mentor.name}!</p>
                </div>
                <nav className="p-2 flex-grow">
                     <div className="flex justify-between items-center px-2 mb-1">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Orientados</h3>
                        <button 
                            onClick={() => setIsAddingMentee(true)}
                            className="px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
                            title="Cadastrar Novo Orientado"
                        >
                            + Novo
                        </button>
                    </div>
                    <ul>
                        {mentees.map(mentee => (
                            <li key={mentee.id}>
                                <button onClick={() => handleSelectMentee(mentee)} className={`w-full text-left px-3 py-2 my-1 rounded-md text-sm font-medium ${selectedMentee?.id === mentee.id ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}>
                                    {mentee.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                 <div className="p-4 border-t bg-white">
                    <button onClick={onLogout} className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Sair</button>
                </div>
            </aside>

            <main className="w-3/4 p-8 overflow-y-auto">
                {selectedMentee ? (
                    <div>
                        <div className="flex flex-wrap justify-between items-center gap-4">
                            <h2 className="text-3xl font-bold text-gray-900">{selectedMentee.name}</h2>
                             <div className="flex gap-2">
                                {selectedMentee.surveyAnswers && <button onClick={() => setIsComparing(true)} className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">Comparar Avaliações</button>}
                                <button onClick={() => setIsAssessing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    {selectedMentee.mentorSurveyAnswers ? "Reavaliar Nível" : "Avaliar Nível"}
                                </button>
                             </div>
                        </div>
                        
                        {selectedMentee.maturityLevel ? (
                            <div className="mt-4 p-6 bg-green-50 rounded-lg border border-green-200">
                                <h3 className="text-xl font-semibold text-green-800 mb-2">Nível de Maturidade: {selectedMentee.maturityLevel.name}</h3>
                                <p className="text-gray-700">{selectedMentee.maturityLevel.description}</p>
                            </div>
                        ) : (
                             <div className="mt-4 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-yellow-800">Este orientado ainda não foi avaliado. Complete a avaliação para definir o nível de maturidade e criar um plano de desenvolvimento.</p>
                            </div>
                        )}
                        
                        {tips && (
                            <div className="mt-4 p-6 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="text-xl font-semibold text-blue-800 mb-2">{tips.title}</h3>
                                <ul className="list-disc list-inside space-y-1 text-blue-900">
                                    {tips.points.map((tip, index) => <li key={index}>{tip}</li>)}
                                </ul>
                            </div>
                        )}

                        <div className="mt-6 border-t pt-6">
                            <button 
                                onClick={handleGenerateAISuggestions} 
                                disabled={!selectedMentee.maturityLevel || isGenerating}
                                className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isGenerating ? <><Spinner /> Gerando...</> : 'Gerar Sugestões de Atividades com IA'}
                            </button>
                        </div>

                        {renderDevelopmentPlan()}

                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-xl">Selecione um orientado para ver os detalhes.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MentorDashboard;