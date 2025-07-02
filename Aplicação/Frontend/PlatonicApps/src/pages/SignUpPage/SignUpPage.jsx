import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LockIcon from '../../assets/img_lock.png';
import profileIcon from '../../assets/img_profile.png';
import EmailIcon from '../../assets/img_email.png';

function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '', 
    email: '',
    senha: '',
    confirmarSenha: '',
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

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome, 
          email: formData.email,
          senha: formData.senha,
          tipo_usuario: 'aluno',
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        navigate('/login');
      } else {
        setError(data.message || 'Ocorreu um erro ao tentar cadastrar.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDF6E3] flex flex-col justify-center items-center p-4">
      
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#C48836] p-8 rounded-lg shadow-2xl">
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Cadastro
        </h2>

        <p className="text-lg font-light text-yellow-100 mb-8 text-center">
          Preencha seus dados para começar
        </p>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <img src={profileIcon} alt="Ícone de nome" className="w-10 h-8" />
          </div>
          <input 
            type="text" 
            name="nome"
            placeholder="Nome" 
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full p-3 pl-14 rounded-full border-transparent bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <img src={EmailIcon} alt="Ícone de email" className="w-10 h-7" />
          </div>
          <input 
            type="email" 
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 pl-14 rounded-full border-transparent bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <img src={LockIcon} alt="Ícone de senha" className="w-10 h-7" />
          </div>
          <input 
            type="password" 
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            required
            className="w-full p-3 pl-14 rounded-full border-transparent bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <img src={LockIcon} alt="Ícone de confirmar senha" className="w-10 h-7" />
          </div>
          <input 
            type="password" 
            name="confirmarSenha"
            placeholder="Confirmar Senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            required
            className="w-full p-3 pl-14 rounded-full border-transparent bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        {error && <p className="text-red-200 text-center mb-4">{error}</p>}
        
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-full hover:bg-yellow-100 transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-wait"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        
      </form>
    </main>
  );
}

export default SignUpPage;
