import React from 'react';
import { Link } from 'react-router-dom';

import MainIcon from '../../assets/img_logo.png';
import EmailIcon from '../../assets/img_email.png';
import LockIcon from '../../assets/img_lock.png';


function LoginPage() {
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
        <div className="w-full max-w-sm">
          
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Login
          </h2>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img src={EmailIcon} alt="Ícone de email" className="w-9 h-7" />
            </div>
            <input 
              type="email" 
              placeholder="Email"
              className="w-full p-3 pl-12 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img src={LockIcon} alt="Ícone de senha" className="w-9 h-7" />
            </div>
            <input 
              type="password" 
              placeholder="Senha"
              className="w-full p-3 pl-12 rounded-md border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="text-left mb-6">
            <Link to="/forgot-password" className="text-sm text-white hover:underline">
              Redefinir senha
            </Link>
          </div>
          
          <Link to="/client" className="block w-full">
            <button className="w-full bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-md hover:bg-yellow-100 transition-colors duration-300 shadow-md">
              Entrar
            </button>
          </Link>
          
          <div className="text-center mt-6">
            <Link to="/signup" className="text-white hover:underline">
              Fazer cadastro
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

export default LoginPage;
