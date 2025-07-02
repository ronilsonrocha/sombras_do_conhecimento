import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function DifficultyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { obraId, workTitle } = location.state || {};

  const handleDifficultySelect = (difficulty) => {
    if (!obraId) {
      alert("Erro: Nenhuma obra foi selecionada. Por favor, volte à tela anterior.");
      return;
    }
    
    navigate('/quiz', { 
      state: { 
        obraId: obraId, 
        workTitle: workTitle,
        difficulty: difficulty 
      } 
    });
  };

  return (
    <main className="min-h-screen bg-[#FDF6E3] flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-lg bg-[#C48836] px-12 py-24 rounded-lg shadow-2xl flex flex-col items-center">
        
        <div className="w-full bg-[#FDF6E3] text-[#C48836] font-bold py-4 px-4 rounded-lg text-center shadow-md mb-12">
          <h2 className="text-3xl">
            Escolha a Dificuldade
          </h2>
        </div>

        <div className="w-2/3 flex flex-col space-y-6">
          <button onClick={() => handleDifficultySelect('facil')} className="w-full bg-[#663300] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
            Fácil
          </button>

          <button onClick={() => handleDifficultySelect('medio')} className="w-full bg-[#663300] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
            Médio
          </button>

          <button onClick={() => handleDifficultySelect('dificil')} className="w-full bg-[#663300] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
            Difícil
          </button>
        </div>
        
      </div>
    </main>
  );
}

export default DifficultyPage;
