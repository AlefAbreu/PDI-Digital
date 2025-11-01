import React, { useState } from 'react';

interface LoginPageProps {
  onMentorLogin: (name: string, pass: string) => boolean;
  onMenteeLogin: (regNum: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onMentorLogin, onMenteeLogin }) => {
    const [mentorName, setMentorName] = useState('');
    const [mentorPass, setMentorPass] = useState('');
    const [menteeRegNum, setMenteeRegNum] = useState('');
    const [error, setError] = useState('');

    const handleMentorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!onMentorLogin(mentorName, mentorPass)) {
            setError('Credenciais de mentor inválidas.');
        }
    };
    
    const handleMenteeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!onMenteeLogin(menteeRegNum)) {
            setError('Número de registro de orientado inválido.');
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-2xl shadow-lg text-center">
        <header>
            <h1 className="text-4xl font-bold text-gray-800">Plataforma de Mentoria</h1>
            <p className="mt-2 text-gray-600">Plano de Desenvolvimento Individual</p>
        </header>

        {error && <p className="text-red-500 font-semibold bg-red-100 p-3 rounded-lg">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Mentee Login */}
            <div className="p-6 border rounded-lg">
                <h2 className="text-2xl font-bold text-indigo-700 mb-4">Acesso do Orientado</h2>
                <form onSubmit={handleMenteeSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="menteeRegNum" className="sr-only">Número de Registro</label>
                        <input 
                            id="menteeRegNum"
                            type="text"
                            value={menteeRegNum}
                            onChange={(e) => setMenteeRegNum(e.target.value)}
                            placeholder="Seu Número de Registro"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                     <button
                        type="submit"
                        className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                    >
                        Entrar
                    </button>
                </form>
            </div>

            {/* Mentor Login */}
            <div className="p-6 border rounded-lg">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">Acesso do Mentor</h2>
                <form onSubmit={handleMentorSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="mentorName" className="sr-only">Nome</label>
                        <input 
                            id="mentorName"
                            type="text"
                            value={mentorName}
                            onChange={(e) => setMentorName(e.target.value)}
                            placeholder="Nome"
                            autoComplete="username"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="mentorPass" className="sr-only">Senha</label>
                        <input 
                            id="mentorPass"
                            type="password"
                            value={mentorPass}
                            onChange={(e) => setMentorPass(e.target.value)}
                            placeholder="Senha"
                            autoComplete="current-password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                     <button
                        type="submit"
                        className="w-full px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;