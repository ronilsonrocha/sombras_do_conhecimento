import React from 'react';
import { Link } from 'react-router-dom';

function DifficultyPage() {
  return (
    <main className="min-h-screen bg-[#FDF6E3] flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-lg bg-[#C48836] px-12 py-24 rounded-lg shadow-2xl flex flex-col items-center">
        
        <div className="w-full bg-[#FDF6E3] text-[#C48836] font-bold py-4 px-4 rounded-lg text-center shadow-md mb-12">
          <h2 className="text-3xl">
            Escolha a Dificuldade
          </h2>
        </div>

        <div className="w-2/3 flex flex-col space-y-6">
          <Link to="/quiz" className="w-full">
            <button className="w-full bg-[#663300] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
              Fácil
            </button>
          </Link>

          <Link to="/quiz" className="w-full">
            <button className="w-full bg-[#663300] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
              Médio
            </button>
          </Link>

          <Link to="/quiz" className="w-full">
            <button className="w-full bg-[#663300] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
              Difícil
            </button>
          </Link>
        </div>
        
      </div>
    </main>
  );
}

export default DifficultyPage;
