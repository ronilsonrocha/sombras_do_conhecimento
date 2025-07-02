import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminPage() {
  const adminName = "Admin";
  
  const [isOptionsPopupOpen, setIsOptionsPopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const popupRef = useRef(null);

  const [adminView, setAdminView] = useState('description');

  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizOptions, setQuizOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('facil');
  
  const [authorName, setAuthorName] = useState('');
  const [workName, setWorkName] = useState('');
  const [workDescription, setWorkDescription] = useState('Selecione uma obra para ver sua descrição.');

  const [selectedWork, setSelectedWork] = useState(null);
  const [works, setWorks] = useState([]);
  const [displayedComments, setDisplayedComments] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allUserComments = [
    { workId: 1, user: "Carlos", text: "Uma alegoria incrível sobre a percepção da realidade." },
    { workId: 1, user: "Mariana", text: "Me fez refletir muito sobre o conhecimento e a verdade." },
    { workId: 2, user: "Pedro", text: "Clássico indispensável para entender a filosofia ocidental." },
    { workId: 3, user: "Ana", text: "Amei a forma como os diálogos foram construídos." },
    { workId: 2, user: "Lucas", text: "Precisei ler duas vezes para absorver tudo, mas valeu a pena." },
  ];

  const fetchWorks = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/content/obras/sql_all/');
      if (!response.ok) throw new Error('Falha ao carregar obras.');
      const data = await response.json();
      setWorks(data.obras || []);
    } catch (err) {
      setError('Não foi possível carregar a lista de obras.');
      console.error(err);
    }
  };

  const fetchAllComments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/feedback/avaliacoes/all_feedbacks/');
      if (!response.ok) throw new Error('Falha ao carregar comentários.');
      const data = await response.json();
      if (data.status === 'success') {
        setAllComments(data.feedbacks || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorks();
    fetchAllComments();

    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOptionsPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...quizOptions];
    newOptions[index] = value;
    setQuizOptions(newOptions);
  };

  const handleWorkSelection = (work) => {
    setSelectedWork(work);
    setWorkDescription(work.texto);
    setAuthorName(work.nome_autor);
    setWorkName(work.nome_obra);
    setIsDropdownOpen(false);
    setAdminView('description');
    
    const filteredComments = allUserComments.filter(comment => comment.workId === work.id);
    setDisplayedComments(filteredComments);
  };

  const handleAdminAction = (view) => {
    if (view === 'addWork') {
      setAuthorName('');
      setWorkName('');
      setWorkDescription('');
    }
    if (view === 'quiz' && !selectedWork) {
        alert("Por favor, selecione uma obra primeiro para adicionar uma questão.");
        return;
    }
    setAdminView(view);
    setIsOptionsPopupOpen(false);
  };

  const handleSaveWork = async () => {
    setLoading(true);
    setError('');
    const isEditing = adminView === 'editWork';
    const url = isEditing 
      ? `http://127.0.0.1:8000/content/obras/${selectedWork.id}/` 
      : 'http://127.0.0.1:8000/content/obras/';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_autor: authorName,
          nome_obra: workName,
          texto: workDescription,
        }),
      });
      if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} a obra.`);
      alert(`Obra ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
      fetchWorks();
      setAdminView('description');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    if (!selectedWork) {
      setError("Nenhuma obra selecionada para associar a questão.");
      return;
    }
    setLoading(true);
    setError('');
    
    const questionPayload = {
      texto_enunciado: quizQuestion,
      nivel: quizDifficulty,
      letra_correta: correctAnswer,
      alternativas: quizOptions.map((option, index) => ({
        letra: String.fromCharCode(65 + index),
        texto: option,
      })),
    };

    try {
      const createQuestionResponse = await fetch('http://127.0.0.1:8000/quiz/perguntas/sql_create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionPayload),
      });
      
      const createData = await createQuestionResponse.json();
      if (!createQuestionResponse.ok || createData.status !== 'success') {
        throw new Error(createData.message || 'Falha ao criar a pergunta.');
      }
      
      const newQuestionId = createData.pergunta_id;

      const associatePayload = {
        pergunta_id: newQuestionId,
        obra_id: selectedWork.id,
      };

      const associateResponse = await fetch('http://127.0.0.1:8000/quiz/pergunta-obras/associate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(associatePayload),
      });

      const associateData = await associateResponse.json();
      if (!associateResponse.ok || associateData.status !== 'success') {
        throw new Error(associateData.message || 'Falha ao associar pergunta à obra.');
      }

      alert(`Pergunta criada e associada à obra "${selectedWork.nome_obra}" com sucesso!`);
      setQuizQuestion('');
      setQuizOptions(['', '', '', '']);
      setCorrectAnswer('');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      
      <header className="w-full h-[15vh] bg-[#C48836] flex items-center justify-between p-6 shadow-lg">
        
        <div className="bg-[#FDF6E3] p-3 rounded-2xl shadow max-w-xs">
          <p className="text-xl text-[#C48836]">Bem-vindo(a),</p>
          <p className="text-xl text-[#C48836] font-bold truncate">{adminName}</p>
        </div>

        <div><h1 className="text-5xl font-bold text-white">Tela Admin</h1></div>

        <div>
          <Link to="/login">
            <button className="bg-[#663300] text-white font-bold py-3 px-14 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">Sair</button>
          </Link>
        </div>
      </header>

      <main className="flex p-8 space-x-8 h-[85vh]">
        
        <div className="w-[55%] bg-[#FDF6E3] rounded-[30px] p-6 shadow-lg flex flex-col border-4 border-[#C48836]">
          {adminView === 'description' && (
            <div className="flex-grow w-full p-2 text-gray-700 text-lg leading-relaxed bg-transparent overflow-y-auto">
              {workDescription}
            </div>
          )}
          {(adminView === 'addWork' || adminView === 'editWork') && (
            <div className="flex flex-col h-full space-y-4">
              <input type="text" placeholder="Nome da Obra" value={workName} onChange={(e) => setWorkName(e.target.value)} className="w-full p-3 rounded-lg border-2 border-[#C48836] focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <input type="text" placeholder="Nome do Autor" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full p-3 rounded-lg border-2 border-[#C48836] focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <textarea placeholder="Digite a descrição da obra aqui..." value={workDescription} onChange={(e) => setWorkDescription(e.target.value)} className="w-full h-full p-3 rounded-lg border-2 border-[#C48836] focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              <div className="mt-auto text-center pt-4">
                <button onClick={handleSaveWork} disabled={loading} className="bg-[#C48836] text-white font-bold py-3 px-16 rounded-lg hover:bg-amber-700 transition-colors duration-300 shadow-md disabled:opacity-50">
                  {loading ? 'Salvando...' : (adminView === 'addWork' ? 'Salvar Obra' : 'Salvar Alterações')}
                </button>
              </div>
            </div>
          )}
          {adminView === 'quiz' && (
            <div className="flex flex-col h-full">
              <textarea placeholder="Digite a pergunta do quiz aqui..." value={quizQuestion} onChange={(e) => setQuizQuestion(e.target.value)} className="w-full bg-white text-[#C48836] font-bold p-4 rounded-lg shadow-inner text-xl border-2 border-[#C48836] flex-grow resize-none mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {quizOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 cursor-pointer" onClick={() => setCorrectAnswer(String.fromCharCode(65 + index))}>
                    <span className="font-bold text-lg text-[#C48836]">{String.fromCharCode(65 + index)}:</span>
                    <input type="text" placeholder={`Opção ${String.fromCharCode(65 + index)}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full p-2 rounded-lg border-2 border-[#C48836] focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <label className="font-bold text-lg text-[#C48836]">Nível:</label>
                <select value={quizDifficulty} onChange={(e) => setQuizDifficulty(e.target.value)} className="p-2 rounded-lg border-2 border-[#C48836] focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
                <label className="font-bold text-lg text-[#C48836] ml-auto">Opção Correta:</label>
                <div className="bg-white p-2 px-4 rounded-lg border-2 border-[#C48836] font-bold text-amber-700">{correctAnswer}</div>
              </div>
              <div className="mt-auto text-center pt-4">
                <button onClick={handleSaveQuestion} disabled={loading} className="bg-[#C48836] text-white font-bold py-3 px-16 rounded-lg hover:bg-amber-700 transition-colors duration-300 shadow-md disabled:opacity-50">{loading ? 'Salvando...' : 'Salvar Questão'}</button>
              </div>
            </div>
          )}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>

        <div className="w-[45%] bg-[#C48836] rounded-[30px] shadow-lg flex flex-col items-center p-6 space-y-4">
          
          <div className="w-[85%] relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-[#FDF6E3] text-[#C48836] font-semibold py-2 px-4 rounded-lg flex justify-between items-center shadow-md">
              <span className="truncate">{selectedWork ? selectedWork.nome_obra : 'Escolha sua obra'}</span>
              <svg className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-[#FDF6E3] rounded-lg shadow-xl z-10">
                {works.map((work) => (
                  <a key={work.id} href="#" onClick={() => handleWorkSelection(work)} className="block px-4 py-2 text-[#C48836] hover:bg-gray-200">{work.nome_obra}</a>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-lg text-center shadow-md">Comentários</div>

          <div className="w-[85%] flex-grow bg-[#FDF6E3] p-3 rounded-lg shadow-inner overflow-y-auto space-y-2" style={{ maxHeight: 'calc(100% - 12rem)' }}>
            {displayedComments.length > 0 ? (
              displayedComments.map((comment) => (
                <div key={comment.id_avaliacao} className="bg-white/50 p-2 rounded">
                  <p className="font-bold text-amber-800">{comment.nome_usuario}</p>
                  <p className="text-sm text-gray-700">{comment.comentarios}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-4">Selecione uma obra para ver os comentários.</p>
            )}
          </div>

          <div ref={popupRef} className="relative w-[85%]">
            {isOptionsPopupOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-[#FDF6E3] rounded-lg shadow-xl z-10 overflow-hidden">
                <button onClick={() => handleAdminAction('addWork')} className="block w-full text-left px-4 py-3 text-[#C48836] font-semibold hover:bg-yellow-100 transition-colors duration-200">Adicionar Obras</button>
                <button onClick={() => handleAdminAction('editWork')} className="block w-full text-left px-4 py-3 text-[#C48836] font-semibold hover:bg-yellow-100 transition-colors duration-200 border-t border-amber-700/20">Alterar Obras</button>
                <button onClick={() => handleAdminAction('quiz')} className="block w-full text-left px-4 py-3 text-[#C48836] font-semibold hover:bg-yellow-100 transition-colors duration-200 border-t border-amber-700/20">Adicionar Questão</button>
              </div>
            )}
            <button onClick={() => setIsOptionsPopupOpen(!isOptionsPopupOpen)} className="w-full bg-[#663300] text-white font-bold py-3 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md flex items-center justify-center space-x-2">
              <span>Opções</span>
              <svg className={`w-5 h-5 transition-transform duration-300 ${isOptionsPopupOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default AdminPage;
