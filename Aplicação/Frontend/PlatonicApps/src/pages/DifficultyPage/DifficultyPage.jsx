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
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        // ENDPOINT ATUALIZADO para usar a versão SQL que busca todas as perguntas
        const response = await fetch(`http://127.0.0.1:8000/quiz/perguntas/sql_all/`);
        
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            throw new Error(`Erro no servidor: Status ${response.status}`);
          }
          throw new Error(errorData.message || `Falha ao buscar as perguntas do quiz (Status: ${response.status})`);
        }

        const data = await response.json();
        if (data.status === 'success') {
          // Agora guardamos todas as perguntas de todas as obras
          setAllQuestions(data.perguntas || []);
        } else {
          throw new Error(data.message || 'Erro ao carregar perguntas.');
        }
      } catch (err) {
        setError(err.message);
        console.error("Erro detalhado:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []); // A dependência de obraId foi removida, pois o endpoint busca tudo

  const handleDifficultySelect = (difficulty) => {
    // AVISO: A lógica agora filtra a partir de TODAS as perguntas, não apenas da obra selecionada.
    const filteredQuestions = allQuestions.filter(q => q.nivel.toLowerCase() === difficulty);
    
    if (filteredQuestions.length === 0) {
      alert(`Não há perguntas de nível ${difficulty} em nenhuma obra.`);
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
