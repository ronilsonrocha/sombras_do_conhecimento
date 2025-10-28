import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import MainIcon from '../../assets/img_logo.png';
import EmailIcon from '../../assets/img_email.png';
import LockIcon from '../../assets/img_lock.png';


function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.tipo_usuario === 'aluno') {
          navigate('/client');
        } else if (data.user.tipo_usuario === 'professor') {
          navigate('/admin');
        } else {
          setError('Tipo de usuário desconhecido.');
        }
      } else {
        setError(data.message || 'Ocorreu um erro ao tentar fazer login.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      
      <section className="w-full md:w-1/2 bg-[#FDF6E3] flex flex-col justify-center items-center p-8 md:p-12 order-2 md:order-1">
        <div className="text-center">
          <img 
            src={MainIcon} 
            alt="Logo Platonic Apps" 
            className="mx-auto mb-6 w-48 h-48"
          />
          <h1 className="text-5xl font-bold text-[#C48836]">
            Platonic apps
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            a filosofia começa aqui
          </p>
        </div>
      </section>

      <section className="w-full md:w-1/2 bg-[#C48836] flex flex-col justify-center items-center p-8 md:p-12 order-1 md:order-2">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Login
          </h2>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img src={EmailIcon} alt="Ícone de email" className="w-9 h-7" />
            </div>
            <input 
              type="email" 
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 pl-12 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img src={LockIcon} alt="Ícone de senha" className="w-9 h-7" />
            </div>
            <input 
              type="password" 
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className="w-full p-3 pl-12 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="text-left mb-6">
            <Link to="/forgot-password" className="text-sm text-white hover:underline">
              Redefinir senha
            </Link>
          </div>
          
          {error && <p className="text-red-200 text-center mb-4">{error}</p>}
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-md hover:bg-yellow-100 transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <div className="text-center mt-6">
            <Link to="/signup" className="text-white hover:underline">
              Fazer cadastro
            </Link>
          </div>

        </form>
      </section>

    </main>
  );
}

export default LoginPage;
