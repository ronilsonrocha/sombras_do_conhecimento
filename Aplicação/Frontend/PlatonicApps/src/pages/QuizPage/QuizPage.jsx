import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

function QuizPage() {
  const location = useLocation();
  const { obraId, workTitle, difficulty } = location.state || {};

  const [userName, setUserName] = useState('');
  const [userComments, setUserComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userData = JSON.parse(localStorage.getItem('user'));
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (userData?.nome) {
      setUserName(userData.nome);
    }

    const fetchInitialData = async () => {
      setLoading(true);
      setError('');
      
      if (!obraId || !difficulty) {
        setError("Informações da obra ou dificuldade não encontradas.");
        setLoading(false);
        return;
      }

      try {
        const questionsResponse = await fetch(`http://127.0.0.1:8000/quiz/perguntas/by_nivel_obra/?nivel=${difficulty}&id_obra=${obraId}`,{
          method: 'GET',
        });
        if (!questionsResponse.ok) {
            const errorBody = await questionsResponse.text();
            throw new Error(`Falha ao buscar perguntas (Status: ${questionsResponse.status}). Resposta: ${errorBody}`);
        }
        const questionsData = await questionsResponse.json();
        if (questionsData.status === 'success' && questionsData.perguntas.length > 0) {
          setQuestions(questionsData.perguntas);
        } else {
          throw new Error('Nenhuma pergunta encontrada para esta obra e dificuldade.');
        }

        if (userData?.id) {
          const commentsResponse = await fetch(`http://127.0.0.1:8000/feedback/avaliacoes/user_feedbacks/?usuario_id=${userData.id}`);
          if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            if (commentsData.status === 'success') {
              setUserComments(commentsData.feedbacks || []);
            }
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [obraId, difficulty, userData?.id]);

  const handleAnswerClick = async (alternative) => {
    if (isAnswered) return;

    // ALTERADO: Usando 'alternative.letra' em vez de 'alternative.letra_alternativa'
    const answerLetter = alternative.letra; 
    setSelectedAnswer(answerLetter);

    try {
      const response = await fetch('http://127.0.0.1:8000/progress/pergunta-usuarios/register_response/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: userData.id,
          pergunta_id: currentQuestion.id_pergunta, // Use 'id_pergunta' conforme seu backend
          resposta: answerLetter,
        }),
      });
      if (!response.ok) throw new Error('Erro ao registrar resposta.');
      
      const result = await response.json();
      if (result.status === 'success') {
        setIsCorrect(result.result.is_correct);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      alert("Quiz finalizado!");
    }
  };

  const getButtonClass = (alternative) => {
    if (!isAnswered) return "bg-[#FDF6E3] hover:bg-yellow-100";
    
    // ALTERADO: Usando 'alternative.letra' em vez de 'alternative.letra_alternativa'
    const isCorrectAnswer = alternative.letra === currentQuestion.letra_correta; 
    if (isCorrectAnswer) return "bg-green-500 text-white";

    // ALTERADO: Usando 'alternative.letra' em vez de 'alternative.letra_alternativa'
    const isSelectedAnswer = alternative.letra === selectedAnswer; 
    if (isSelectedAnswer) return "bg-red-500 text-white";
    
    return "bg-[#FDF6E3] opacity-60";
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userData?.id) return;
    try {
      const response = await fetch('http://127.0.0.1:8000/feedback/avaliacoes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentarios: newComment, usuario_id: userData.id }),
      });
      if (!response.ok) throw new Error('Falha ao enviar comentário.');
      const createdComment = await response.json();
      setUserComments(prevComments => [...prevComments, createdComment]);
      setNewComment('');
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#FDF6E3] flex justify-center items-center"><p className="text-2xl text-[#C48836]">Carregando Quiz...</p></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[#FDF6E3] flex justify-center items-center"><p className="text-2xl text-red-500 text-center">{error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <header className="w-full h-[15vh] bg-[#C48836] flex items-center justify-between p-6 shadow-lg">
        <div className="bg-[#FDF6E3] p-3 rounded-2xl shadow max-w-xs">
          <p className="text-xl text-[#C48836]">Bem-vindo(a),</p>
          <p className="text-xl text-[#C48836] font-bold truncate">{userName}</p>
        </div>
        <div><h1 className="text-5xl font-bold text-white">Tela Quiz</h1></div>
        <div className="w-44">
           <Link to="/client">
            <button className="bg-[#663300] text-white font-bold py-3 px-10 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">Voltar</button>
          </Link>
        </div>
      </header>

      <main className="flex p-8 space-x-8 h-[85vh]">
        <div className="w-[55%] bg-[#FDF6E3] rounded-[30px] p-8 shadow-lg flex flex-col justify-between border-4 border-[#C48836]">
          {currentQuestion ? (
            <>
              <div>
                <div className="text-right text-lg font-bold text-[#C48836] mb-4">
                  {currentQuestionIndex + 1} / {questions.length}
                </div>
                <div className="w-full bg-[#FDF6E3] text-[#C48836] font-bold py-20 px-6 rounded-lg text-center shadow-inner text-2xl border-4 border-[#C48836] flex items-center justify-center">
                  {currentQuestion.texto_enunciado}
                </div>
              </div>
              <div className="my-6 grid grid-cols-2 gap-4">
                {currentQuestion.alternativas?.map((alt) => (
                  <button
                    key={alt.id} // ALTERADO: Usando 'alt.id' em vez de 'alt.id_alternativa'
                    onClick={() => handleAnswerClick(alt)}
                    disabled={isAnswered}
                    className={`p-4 rounded-lg text-lg font-semibold shadow-md transition-colors duration-300 border-2 border-[#C48836] ${getButtonClass(alt)}`}
                  >
                    {alt.texto} {/* ALTERADO: Usando 'alt.texto' em vez de 'alt.texto_alternativa' */}
                  </button>
                ))}
              </div>
              <div className="mt-auto text-center">
                <button 
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className="bg-[#C48836] text-white font-bold py-3 px-16 rounded-lg shadow-md transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </>
          ) : (
              <div className="flex justify-center items-center h-full"><p>Carregando pergunta...</p></div>
          )}
        </div>

        <form onSubmit={handleCommentSubmit} className="w-[45%] bg-[#C48836] rounded-[30px] shadow-lg flex flex-col items-center p-6 space-y-4">
          <div className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-lg text-center shadow-md">{workTitle}</div>
          <div className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-lg text-center shadow-md">Comentários</div>
          <div className="w-[85%] h-48 bg-[#FDF6E3] p-3 rounded-lg shadow-inner overflow-y-auto space-y-2">
            {userComments.map((comment, index) => (
              <div key={index} className="bg-white/50 p-2 rounded">
                <p className="text-sm text-gray-700">{comment.comentarios}</p>
              </div>
            ))}
          </div>
          <textarea
            placeholder="Escreva um novo comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-[85%] h-32 bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 font-semibold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-md resize-none"
          ></textarea>
          <button type="submit" className="w-[85%] bg-[#663300] text-white font-bold py-3 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
            Enviar Comentário
          </button>
        </form>
      </main>
    </div>
  );
}

export default QuizPage;