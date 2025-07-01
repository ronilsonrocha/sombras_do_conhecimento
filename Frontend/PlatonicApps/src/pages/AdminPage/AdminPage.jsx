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
  const [authorName, setAuthorName] = useState('');
  const [workDescription, setWorkDescription] = useState('Selecione uma obra para ver sua descrição.');

  const [selectedWork, setSelectedWork] = useState({ title: 'Escolha sua obra' });

  const works = [
    { 
      title: "Mito de Platão", 
      author: "Platão", 
      description: "Uma famosa alegoria sobre a percepção da realidade e a busca pelo conhecimento verdadeiro, encontrada no livro 'A República'." 
    },
    { 
      title: "A República", 
      author: "Platão", 
      description: "Um diálogo socrático que discute a justiça, a ordem e o caráter da cidade-estado ideal e do homem justo." 
    },
    { 
      title: "O Banquete", 
      author: "Platão", 
      description: "Uma investigação sobre a natureza do amor, apresentada como uma série de discursos de homens notáveis em um simpósio." 
    },
  ];
  const userComments = [
    { user: "Carlos", text: "Uma alegoria incrível sobre a percepção da realidade." },
    { user: "Mariana", text: "Me fez refletir muito sobre o conhecimento e a verdade." },
    { user: "Pedro", text: "Clássico indispensável para entender a filosofia ocidental." },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOptionsPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...quizOptions];
    newOptions[index] = value;
    setQuizOptions(newOptions);
  };

  const handleWorkSelection = (work) => {
    setSelectedWork(work);
    setWorkDescription(work.description);
    setAuthorName(work.author);
    setIsDropdownOpen(false);
    setAdminView('description');
  };

  const handleAdminAction = (view) => {
    if (view === 'addWork') {
      setAuthorName('');
      setWorkDescription('');
    }
    setAdminView(view);
    setIsOptionsPopupOpen(false);
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
              <input type="text" placeholder="Nome do Autor" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full p-3 rounded-lg border-2 border-[#C48836] focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <textarea placeholder="Digite a descrição da obra aqui..." value={workDescription} onChange={(e) => setWorkDescription(e.target.value)} className="w-full h-full p-3 rounded-lg border-2 border-[#C48836] focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
              <div className="mt-auto text-center pt-4">
                <button className="bg-[#C48836] text-white font-bold py-3 px-16 rounded-lg hover:bg-amber-700 transition-colors duration-300 shadow-md">
                  {adminView === 'addWork' ? 'Salvar Obra' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          )}
          {adminView === 'quiz' && (
            <div className="flex flex-col h-full">
              <textarea placeholder="Digite a pergunta do quiz aqui..." value={quizQuestion} onChange={(e) => setQuizQuestion(e.target.value)} className="w-full bg-white text-[#C48836] font-bold p-4 rounded-lg shadow-inner text-xl border-2 border-[#C48836] flex-grow resize-none mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {quizOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2" onClick={() => setCorrectAnswer(String.fromCharCode(65 + index))}>
                    <span className="font-bold text-lg text-[#C48836]">{String.fromCharCode(65 + index)}:</span>
                    <input type="text" placeholder={`Opção ${String.fromCharCode(65 + index)}`} value={option} onChange={(e) => handleOptionChange(index, e.target.value)} className="w-full p-2 rounded-lg border-2 border-[#C48836] focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <label className="font-bold text-lg text-[#C48836]">Opção Correta:</label>
                <div className="bg-white p-2 px-4 rounded-lg border-2 border-[#C48836] font-bold text-amber-700">{correctAnswer}</div>
              </div>
              <div className="mt-auto text-center pt-4">
                <button className="bg-[#C48836] text-white font-bold py-3 px-16 rounded-lg hover:bg-amber-700 transition-colors duration-300 shadow-md">Salvar Questão</button>
              </div>
            </div>
          )}
        </div>

        <div className="w-[45%] bg-[#C48836] rounded-[30px] shadow-lg flex flex-col items-center p-6 space-y-4">
          
          <div className="w-[85%] relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-[#FDF6E3] text-[#C48836] font-semibold py-2 px-4 rounded-lg flex justify-between items-center shadow-md">
              <span className="truncate">{selectedWork.title}</span>
              <svg className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-[#FDF6E3] rounded-lg shadow-xl z-10">
                {works.map((work, index) => (
                  <a key={index} href="#" onClick={() => handleWorkSelection(work)} className="block px-4 py-2 text-[#C48836] hover:bg-gray-200">{work.title}</a>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-lg text-center shadow-md">Comentários</div>

          <div className="w-[85%] h-full bg-[#FDF6E3] p-3 rounded-lg shadow-inner overflow-y-auto space-y-2">
            {userComments.map((comment, index) => (
              <div key={index} className="bg-white/50 p-2 rounded">
                <p className="font-bold text-amber-800">{comment.user}</p>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>

          <div ref={popupRef} className="relative w-[85%]">
            {isOptionsPopupOpen && (
              <div className="absolute bottom-full mb-2 w-full bg-[#FDF6E3] rounded-lg shadow-xl z-10 overflow-hidden">
                <button onClick={() => handleAdminAction('addWork')} className="block w-full text-left px-4 py-3 text-[#C48836] font-semibold hover:bg-yellow-100 transition-colors duration-200">Adicionar Obras</button>
                <button onClick={() => handleAdminAction('editWork')} className="block w-full text-left px-4 py-3 text-[#C48836] font-semibold hover:bg-yellow-100 transition-colors duration-200 border-t border-amber-700/20">Alterar Obras</button>
                <button onClick={() => handleAdminAction('quiz')} className="block w-full text-left px-4 py-3 text-[#C48836] font-semibold hover:bg-yellow-100 transition-colors duration-200 border-t border-amber-700/20">Alterar Quiz</button>
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
