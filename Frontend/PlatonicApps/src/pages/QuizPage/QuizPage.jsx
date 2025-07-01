import React, { useState } from 'react';

const quizQuestions = [
  {
    question: "Qual filósofo é mais associado ao 'Mito da Caverna'?",
    options: ["Aristóteles", "Sócrates", "Platão", "Nietzsche"],
    correctAnswerIndex: 2,
  },
  {
    question: "Qual destes conceitos é central para a filosofia de Aristóteles?",
    options: ["O Imperativo Categórico", "A Vontade de Poder", "A Eudaimonia", "O Contrato Social"],
    correctAnswerIndex: 2,
  }
];

const userComments = [
    "Uma alegoria incrível sobre a percepção da realidade.",
    "Me fez refletir muito sobre o conhecimento e a verdade.",
    "Clássico indispensável para entender a filosofia ocidental.",
    "Achei a leitura densa, mas recompensadora.",
    "Mudou minha forma de ver o mundo.",
];

function QuizPage() {
  const userName = "Anna Carvalho da Silva";
  const selectedWork = "Mito de Platão";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerClick = (answerIndex) => {
    if (!isAnswered) {
      setSelectedAnswer(answerIndex);
      setIsAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = (currentQuestionIndex + 1) % quizQuestions.length;
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const getButtonClass = (answerIndex) => {
    if (!isAnswered) {
      return "bg-[#FDF6E3] hover:bg-yellow-100";
    }
    
    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      return "bg-green-500 text-white";
    }
    if (answerIndex === selectedAnswer) {
      return "bg-red-500 text-white";
    }
    return "bg-[#FDF6E3] opacity-60";
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      
      <header className="w-full h-[15vh] bg-[#C48836] flex items-center justify-between p-6 shadow-lg">
        
        <div className="bg-[#FDF6E3] p-3 rounded-2xl shadow max-w-xs">
          <p className="text-xl text-[#C48836]">
            Bem-vindo(a),
          </p>
          <p className="text-xl text-[#C48836] font-bold truncate">
            {userName}
          </p>
        </div>

        <div>
          <h1 className="text-5xl font-bold text-white">
            Tela Quiz
          </h1>
        </div>

        <div className="w-44"></div>

      </header>

      <main className="flex p-8 space-x-8 h-[85vh]">
        
        <div className="w-[55%] bg-[#FDF6E3] rounded-[30px] p-8 shadow-lg flex flex-col justify-between border-4 border-[#C48836]">
          <div className="w-full bg-[#FDF6E3] text-[#C48836] font-bold py-20 px-6 rounded-lg text-center shadow-inner text-2xl border-4 border-[#C48836] flex items-center justify-center">
            {currentQuestion.question}
          </div>

          <div className="my-6 grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnswered}
                className={`p-4 rounded-lg text-lg font-semibold shadow-md transition-colors duration-300 border-2 border-[#C48836] ${getButtonClass(index)}`}
              >
                {option}
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
        </div>

        <div className="w-[45%] bg-[#C48836] rounded-[30px] shadow-lg flex flex-col items-center p-6 space-y-4">
          
          <div className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-lg text-center shadow-md">
            {selectedWork}
          </div>
          
          <div className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-lg text-center shadow-md">
            Comentários
          </div>

          <div className="w-[85%] h-48 bg-[#FDF6E3] p-3 rounded-lg shadow-inner overflow-y-auto space-y-2">
            {userComments.map((comment, index) => (
              <div key={index} className="bg-white/50 p-2 rounded">
                <p className="text-sm text-gray-700">{comment}</p>
              </div>
            ))}
          </div>

          <textarea
            placeholder="Escreva um novo comentário..."
            className="w-[85%] h-32 bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 font-semibold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-md resize-none"
          ></textarea>

          <button className="w-[85%] bg-[#663300] text-white font-bold py-3 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
            Enviar Comentário
          </button>

        </div>

      </main>

    </div>
  );
}

export default QuizPage;
