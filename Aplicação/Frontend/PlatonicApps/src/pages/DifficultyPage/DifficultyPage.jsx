import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function DifficultyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { obraId, workTitle } = location.state || {};

  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!obraId) {
      setError("Nenhuma obra selecionada. Por favor, volte e selecione uma obra.");
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://127.0.0.1:8000/quiz/perguntas/by_obra/?obra_id=${obraId}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar as perguntas do quiz.');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setAllQuestions(data.perguntas);
        } else {
          throw new Error(data.message || 'Erro ao carregar perguntas.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [obraId]);

  const handleDifficultySelect = (difficulty) => {
    const filteredQuestions = allQuestions.filter(q => q.nivel.toLowerCase() === difficulty);
    
    if (filteredQuestions.length === 0) {
      alert(`Não há perguntas de nível ${difficulty} para esta obra.`);
      return;
    }

    navigate('/quiz', { state: { questions: filteredQuestions, workId: obraId, workTitle: workTitle } });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FDF6E3] flex justify-center items-center"><p className="text-2xl text-[#C48836]">Carregando perguntas...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#FDF6E3] flex justify-center items-center"><p className="text-2xl text-red-500">{error}</p></div>;
  }

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
