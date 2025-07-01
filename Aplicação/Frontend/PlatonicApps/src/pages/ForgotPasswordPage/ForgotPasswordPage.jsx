import React from 'react';
import LockIcon from '../../assets/img_lock.png';

function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#FDF6E3] flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-md bg-[#C48836] p-8 rounded-lg shadow-2xl">
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Recuperar Senha
        </h2>

        <p className="text-lg font-light text-yellow-100 mb-8 text-center">
          Crie uma nova senha para sua conta
        </p>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <img src={LockIcon} alt="Ícone de senha" className="w-10 h-7" />
          </div>
          <input 
            type="password" 
            placeholder="Nova Senha"
            className="w-full p-3 pl-14 rounded-full border-transparent bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <img src={LockIcon} alt="Ícone de confirmar senha" className="w-10 h-7" />
          </div>
          <input 
            type="password" 
            placeholder="Confirmar Nova Senha"
            className="w-full p-3 pl-14 rounded-full border-transparent bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>
        
        <button className="w-full bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-full hover:bg-yellow-100 transition-colors duration-300 shadow-md">
          Redefinir Senha
        </button>
        
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
