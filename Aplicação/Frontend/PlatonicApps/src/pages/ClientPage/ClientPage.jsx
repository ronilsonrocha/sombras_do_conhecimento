import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ClientPage() {
  const [userName, setUserName] = useState('');
  const [works, setWorks] = useState([]);
  const [selectedWork, setSelectedWork] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userComments, setUserComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (userData && userData.nome) {
      setUserName(userData.nome);
    }

    const fetchWorks = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('http://127.0.0.1:8000/content/obras/');
        if (!response.ok) throw new Error('Falha ao buscar obras.');
        const data = await response.json();
        setWorks(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserComments = async () => {
      if (!userData?.id) return;
      try {
        const response = await fetch(`http://127.0.0.1:8000/feedback/avaliacoes/user_feedbacks/?usuario_id=${userData.id}`);
        if (!response.ok) throw new Error('Falha ao buscar comentários.');
        const data = await response.json();
        if (data.status === 'success') {
          setUserComments(data.feedbacks || []);
        }
      } catch (err) {
        console.error("Erro ao buscar comentários:", err);
      }
    };

    fetchWorks();
    fetchUserComments();
  }, []);

  const handleSelectWork = async (workId) => {
    setIsDropdownOpen(false);
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://127.0.0.1:8000/content/obras/${workId}/`);
      if (!response.ok) throw new Error('Falha ao buscar detalhes da obra.');
      const data = await response.json();
      setSelectedWork(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userData?.id) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/feedback/avaliacoes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comentarios: newComment,
          usuario_id: userData.id,
        }),
      });

      if (!response.ok) throw new Error('Falha ao enviar comentário.');
      
      const createdComment = await response.json();
      setUserComments(prevComments => [...prevComments, createdComment]);
      setNewComment('');

    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
    }
  };

  const handleGoToQuiz = () => {
    if (!selectedWork) {
      alert("Por favor, selecione uma obra primeiro!");
      return;
    }
    navigate('/difficulty', { state: { obraId: selectedWork.id, workTitle: selectedWork.nome_obra } });
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      
      <header className="w-full h-[15vh] bg-[#C48836] flex items-center justify-between p-6 shadow-lg">
        
        <div className="bg-[#FDF6E3] p-3 rounded-2xl shadow max-w-xs">
          <p className="text-xl text-[#C48836]">Bem-vindo(a),</p>
          <p className="text-xl text-[#C48836] font-bold truncate">{userName || 'Usuário'}</p>
        </div>

        <div><h1 className="text-5xl font-bold text-white">Tela Cliente</h1></div>

        <div>
          <Link to="/login">
            <button className="bg-[#663300] text-white font-bold py-3 px-14 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">Sair</button>
          </Link>
        </div>
      </header>

      <main className="flex p-8 space-x-8 h-[85vh]">
        
        <div className="w-[55%] bg-[#FDF6E3] rounded-[30px] p-6 shadow-lg flex flex-col border-4 border-[#C48836]">
          <div className="flex-grow overflow-y-auto pr-2">
            {loading && <p>Carregando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {selectedWork ? (
              <p className="text-gray-700 text-lg leading-relaxed">{selectedWork.texto}</p>
            ) : (
              <p className="text-gray-500">Selecione uma obra para ler a descrição.</p>
            )}
          </div>
        </div>

        <form onSubmit={handleCommentSubmit} className="w-[45%] bg-[#C48836] rounded-[30px] shadow-lg flex flex-col items-center p-6 space-y-4">
          
          <div className="w-[85%] relative">
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#FDF6E3] text-[#C48836] font-semibold py-2 px-4 rounded-lg flex justify-between items-center shadow-md"
            >
              <span>{selectedWork ? selectedWork.nome_obra : 'Escolha sua obra'}</span>
              <svg className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-[#FDF6E3] rounded-lg shadow-xl z-10">
                {works.map((work) => (
                  <a 
                    key={work.id} 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleSelectWork(work.id); }}
                    className="block px-4 py-2 text-[#C48836] hover:bg-gray-200"
                  >
                    {work.nome_obra}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-lg text-center shadow-md">Comentários</div>

          <div className="w-[85%] h-48 bg-[#FDF6E3] p-3 rounded-lg shadow-inner overflow-y-auto space-y-2">
            {userComments.length > 0 ? userComments.map((comment) => (
              <div key={comment.id_avaliacao} className="bg-white/50 p-2 rounded">
                <p className="text-sm text-gray-700">{comment.comentarios}</p>
              </div>
            )) : <p className="text-sm text-gray-500 text-center mt-4">Nenhum comentário encontrado.</p>}
          </div>

          <textarea
            placeholder="Escreva um novo comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-[85%] h-32 bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 font-semibold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-md resize-none"
          ></textarea>

          <button 
            type="submit"
            className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 rounded-lg hover:bg-yellow-100 transition-all duration-300 shadow-md"
          >
            Enviar Comentário
          </button>

          <button 
            type="button" 
            onClick={handleGoToQuiz}
            disabled={!selectedWork}
            className="w-[85%] bg-[#663300] text-white font-bold py-3 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quiz
          </button>

        </form>
      </main>
    </div>
  );
}

export default ClientPage;
