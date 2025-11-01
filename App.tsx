import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SurveyPage from './pages/SurveyPage';
import MentorDashboard from './pages/MentorDashboard';
import MenteeDashboard from './pages/MenteeDashboard';
import { MATURITY_LEVELS } from './constants';
import type { User, MenteeProfile } from './types';

// Define a more specific type for mentors with passwords
interface MentorWithPass extends User {
    pass: string;
}

// Mock Data - now as initial data
const INITIAL_MENTORS_DB: MentorWithPass[] = [
    { id: 'mentor1', name: 'Ana Silva', pass: '123', type: 'mentor' as const }
];

const INITIAL_MENTEES_DB: MenteeProfile[] = [
    { id: 'mentee1', name: 'Carlos Souza', registrationNumber: '12345', type: 'mentee' as const, mentorId: 'mentor1', developmentPlan: [
        { id: 'act1', title: 'Learn React Hooks', description: 'Deep dive into hooks.', steps: ['useState', 'useEffect', 'useContext'], dueDate: new Date(2024, 6, 15).toISOString(), status: 'in_progress' },
        { id: 'act2', title: 'Present project demo', description: 'Present to the team.', steps: ['Prepare slides', 'Rehearse', 'Present'], dueDate: new Date(2024, 6, 20).toISOString(), status: 'assigned' }
    ], surveyAnswers: [3, 2, 3, 2, 3, 1, 3, 2, 3, 2] },
    { id: 'mentee2', name: 'Beatriz Costa', registrationNumber: '67890', type: 'mentee' as const, mentorId: 'mentor1', developmentPlan: [], surveyAnswers: [4, 3, 4, 3, 4, 2, 4, 3, 4, 3] },
    { id: 'mentee3', name: 'Daniel Alves', registrationNumber: '54321', type: 'mentee' as const, mentorId: 'mentor1', developmentPlan: [], maturityLevel: MATURITY_LEVELS[2] }
];

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [mentees, setMentees] = useState<MenteeProfile[]>([]);
    const [mentors, setMentors] = useState<MentorWithPass[]>([]);

    // Load state from localStorage on initial render
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        
        const storedMentees = localStorage.getItem('mentees');
        if(storedMentees) {
            setMentees(JSON.parse(storedMentees));
        } else {
            setMentees(INITIAL_MENTEES_DB);
        }
        
        const storedMentors = localStorage.getItem('mentors');
        if(storedMentors) {
            setMentors(JSON.parse(storedMentors));
        } else {
            setMentors(INITIAL_MENTORS_DB);
        }
    }, []);

    // Persist currentUser to localStorage
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    // Persist mentees to localStorage
    useEffect(() => {
        localStorage.setItem('mentees', JSON.stringify(mentees));
    }, [mentees]);
    
    // Persist mentors to localStorage
    useEffect(() => {
        localStorage.setItem('mentors', JSON.stringify(mentors));
    }, [mentors]);

    const handleMentorLogin = (name: string, pass: string): boolean => {
        const mentor = mentors.find(m => m.name === name);

        if (mentor) {
            // Mentor exists, check password
            if (mentor.pass === pass) {
                setCurrentUser(mentor);
                return true;
            }
            return false; // Wrong password
        } else {
            // Mentor does not exist, create a new one (register)
            const newMentor: MentorWithPass = {
                id: `mentor-${Date.now()}`,
                name,
                pass,
                type: 'mentor' as const,
            };
            setMentors(prevMentors => [...prevMentors, newMentor]);
            setCurrentUser(newMentor);
            return true;
        }
    };
    
    const handleMenteeLogin = (regNum: string): boolean => {
        const mentee = mentees.find(m => m.registrationNumber === regNum);
        if (mentee) {
            setCurrentUser(mentee);
            return true;
        }
        return false;
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleSurveySubmit = (userId: string, answers: number[]) => {
        const updatedMentees = mentees.map(m => {
            if (m.id === userId) {
                return { ...m, surveyAnswers: answers };
            }
            return m;
        });
        setMentees(updatedMentees);
        
        const updatedCurrentUser = updatedMentees.find(m => m.id === userId);
        if (updatedCurrentUser) {
            setCurrentUser(updatedCurrentUser);
        }
    };
    
    const handleAddMentee = (name: string, registrationNumber: string) => {
        if (!currentUser || currentUser.type !== 'mentor') return;

        const newMentee: MenteeProfile = {
            id: `mentee-${Date.now()}`,
            name,
            registrationNumber,
            type: 'mentee' as const,
            mentorId: currentUser.id,
            developmentPlan: [],
        };
        setMentees(prevMentees => [...prevMentees, newMentee]);
    };

    const handleUpdateMentee = (updatedMentee: MenteeProfile) => {
        const updatedMentees = mentees.map(m =>
            m.id === updatedMentee.id ? updatedMentee : m
        );
        setMentees(updatedMentees);
    
        // Also update current user if they are the one being changed
        if (currentUser?.id === updatedMentee.id) {
            setCurrentUser(updatedMentee);
        }
    };

    if (!currentUser) {
        return <LoginPage onMentorLogin={handleMentorLogin} onMenteeLogin={handleMenteeLogin} />;
    }

    if (currentUser.type === 'mentor') {
        const mentorMentees = mentees.filter(m => m.mentorId === currentUser.id);
        const allRegistrationNumbers = mentees.map(m => m.registrationNumber);
        return <MentorDashboard 
            mentor={currentUser} 
            mentees={mentorMentees} 
            allRegistrationNumbers={allRegistrationNumbers}
            setMentees={setMentees} 
            onLogout={handleLogout}
            onAddMentee={handleAddMentee}
        />;
    }
    
    if (currentUser.type === 'mentee') {
        const menteeProfile = mentees.find(m => m.id === currentUser.id);

        if (!menteeProfile) {
            handleLogout();
            return <LoginPage onMentorLogin={handleMentorLogin} onMenteeLogin={handleMenteeLogin} />;
        }
        
        if (!menteeProfile.surveyAnswers) {
            return <SurveyPage user={currentUser} onSubmit={handleSurveySubmit} />
        }
        
        const allMenteesForCalendar = mentees.filter(m => m.mentorId === menteeProfile.mentorId);

        return <MenteeDashboard mentee={menteeProfile} allMentees={allMenteesForCalendar} onLogout={handleLogout} onUpdateMentee={handleUpdateMentee} />;
    }

    return <div>Error: Unknown user type.</div>;
};

export default App;