import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ClientPage() {
  const userName = "Anna Carvalho da Silva";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            Tela Cliente
          </h1>
        </div>

        <div>
          <Link to="/login">
            <button className="bg-[#663300] text-white font-bold py-3 px-14 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
              Sair
            </button>
          </Link>
        </div>

      </header>

      <main className="flex p-8 space-x-8 h-[85vh]">
        
        <div className="w-[55%] bg-[#FDF6E3] rounded-[30px] p-6 shadow-lg flex flex-col border-4 border-[#C48836]">
          <div className="flex-grow overflow-y-auto pr-2">
            <p className="text-gray-700 text-lg leading-relaxed">
              De onde é que ele vem?
              <br/><br/>
              Ao contrário da crença popular, o Lorem Ipsum não é simplesmente texto aleatório. Tem raízes numa peça de literatura clássica em Latim, de 45 AC, tornando-o com mais de 2000 anos. Richard McClintock, um professor de Latim no Colégio Hampden-Sydney, na Virgínia, procurou uma das palavras em Latim mais obscuras (consectetur) numa passagem Lorem Ipsum, e atravessando as cidades do mundo na literatura clássica, descobriu a sua origem. Lorem Ipsum vem das secções 1.10.32 e 1.10.33 do "de Finibus Bonorum et Malorum" (Os Extremos do Bem e do Mal), por Cícero, escrito a 45AC. Este livro é um tratado na teoria da ética, muito popular durante a Renascença. A primeira linha de Lorem Ipsum, "Lorem ipsum dolor sit amet..." aparece de uma linha na secção 1.10.32.
            </p>
          </div>
        </div>

        <div className="w-[45%] bg-[#C48836] rounded-[30px] shadow-lg flex flex-col items-center p-6 space-y-4">
          
          <div className="w-[85%] relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#FDF6E3] text-[#C48836] font-semibold py-2 px-4 rounded-lg flex justify-between items-center shadow-md"
            >
              <span>Escolha sua obra</span>
              <svg className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-[#FDF6E3] rounded-lg shadow-xl z-10">
                <a href="#" className="block px-4 py-2 text-[#C48836] hover:bg-gray-200">Obra 1</a>
                <a href="#" className="block px-4 py-2 text-[#C48836] hover:bg-gray-200">Obra 2</a>
                <a href="#" className="block px-4 py-2 text-[#C48836] hover:bg-gray-200">Obra 3</a>
              </div>
            )}
          </div>
          
          <div className="w-[85%] bg-[#FDF6E3] text-[#C48836] font-bold py-3 px-4 rounded-lg text-center shadow-md">
            Comentários
          </div>

          <input 
            type="text"
            placeholder="Descrição do comentário"
            className="w-[85%] bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-md"
          />

          <textarea
            placeholder="Escreva seu comentário aqui..."
            className="w-[85%] h-full bg-[#FDF6E3] text-[#C48836] placeholder-amber-800 font-semibold p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-md resize-none"
          ></textarea>

          <Link to="/difficulty" className="w-[85%]">
            <button className="w-full bg-[#663300] text-white font-bold py-3 rounded-lg hover:bg-opacity-80 transition-all duration-300 shadow-md">
              Quiz
            </button>
          </Link>

        </div>
      </main>
    </div>
  );
}

export default ClientPage;
