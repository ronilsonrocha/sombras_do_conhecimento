import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importando todas as suas páginas
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage/SignUpPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage/ForgotPasswordPage.jsx';
import ClientPage from './pages/ClientPage/ClientPage.jsx';
import DifficultyPage from './pages/DifficultyPage/DifficultyPage.jsx';
import QuizPage from './pages/QuizPage/QuizPage.jsx';
import AdminPage from './pages/AdminPage/AdminPage.jsx'; // Nova importação

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial e rota de login */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Outras rotas da aplicação */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/difficulty" element={<DifficultyPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* Nova rota */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
