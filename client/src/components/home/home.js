import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Foto from "./foto.jpg";

export default function Home() {

  const navigate = useNavigate();

  const [peso, setPeso] = useState("");
  const [agua, setAgua] = useState(null);

  function calcularAgua() {

    if (!peso || peso <= 0) {
      alert("Digite um peso válido");
      return;
    }

    const quantidade = (peso * 35) / 1000;

    setAgua(quantidade.toFixed(1));
  }

  return (

    <div className="home-container">

      <section className="hero">

        <div className="hero-content">

          <span className="hero-badge">
            Plataforma nutricional inteligente
          </span>

          <h1>
            Acompanhe sua
            {" "}
            <span>nutrição</span>
            {" "}
            com o EquilibraPro
          </h1>

          <p>
            Visualize receitas conforme seus objetivos,
            organize refeições, acompanhe nutrientes
            e tenha uma experiência completa de
            acompanhamento alimentar.
          </p>

          <div className="buttons">

            <button
              className="primary"
              onClick={() => navigate("/cadastro")}
            >
              Comece Agora
            </button>

            <button
              className="secondary"
              onClick={() => navigate("/login")}
            >
              Entrar
            </button>

          </div>

        </div>

      </section>

      <section className="funcionalidades">

        <h2>
          Recursos da plataforma
        </h2>

        <div className="func-grid">

          <div className="func-card">

            <h3>
              Feed comunitário
            </h3>

            <p>
              Visualização de conteúdos e interação com outros usuários.
            </p>

          </div>

          <div className="func-card">

            <h3>
              Planejamento alimentar
            </h3>

            <p>
              Organização de refeições e receitas
              para facilitar a rotina alimentar.
            </p>

          </div>

          <div className="func-card">

            <h3>
              Recomendações personalizadas
            </h3>

            <p>
              Sugestões de receitas baseadas
              nas preferências e objetivos
              do usuário.
            </p>

          </div>

          <div className="func-card">

            <h3>
              Controle de hidratação
            </h3>

            <p>
              Acompanhamento da ingestão diária
              de água.
            </p>

          </div>

        </div>

      </section>

      <section className="agua-section">

        <div className="agua-content">

          <span className="section-tag">
            Hidratação diária
          </span>

          <h2>
            Calcule sua ingestão ideal de água
          </h2>

          <p>
            Descubra a quantidade aproximada
            de água recomendada diariamente
            com base no seu peso corporal.
          </p>

          <div className="agua-calculadora">

            <input
              type="number"
              placeholder="Digite seu peso (kg)"
              value={peso}
              onChange={(e) =>
                setPeso(e.target.value)
              }
            />

            <button
              className="primary"
              onClick={calcularAgua}
            >
              Calcular
            </button>

          </div>

          {agua && (

            <div className="resultado-agua">

              <h3>
                Quantidade recomendada:
              </h3>

              <span>
                {agua} litros por dia
              </span>

            </div>

          )}

        </div>

      </section>

      <section className="exercicios-section">

        <div className="exercicios-content">

          <span className="section-tag">
            Saúde completa
          </span>

          <h2>
            Lembre-se: movimentar o corpo é essencial
          </h2>

          <p>
            Alimentação saudável e atividade física andam
            juntas. A prática regular de exercícios ajuda a
            controlar o peso, fortalecer o coração, melhorar
            o humor e aumentar a disposição no dia a dia.
          </p>

          <p>
            Separe pelo menos 30 minutos por dia para se
            movimentar: caminhe, pedale, dance ou pratique
            a atividade que você mais gosta. Pequenos
            hábitos, quando somados a uma boa alimentação,
            transformam a sua saúde.
          </p>

          <div className="exercicios-dicas">
            <div className="dica">
              <strong>💪 Força</strong>
              <span>Faça alongamentos ou exercícios de força 2 a 3 vezes por semana.</span>
            </div>
            <div className="dica">
              <strong>🚶 Movimento</strong>
              <span>Substitua o carro por uma caminhada sempre que possível.</span>
            </div>
            <div className="dica">
              <strong>💧 Hidrate-se</strong>
              <span>Beba água antes, durante e depois dos exercícios.</span>
            </div>
          </div>

        </div>

      </section>

      <section className="receitas-home">

        <span className="section-tag">
          Receitas em alta
        </span>

        <h2>
          Receitas mais acessadas
        </h2>

        <div className="receitas-grid">

          <div className="receita-card">

            <div className="receita-img"></div>

            <div className="receita-info">

              <h3>
                Sanduíche Natural
              </h3>

              <p>
                Receita leve e prática com
                ingredientes saudáveis para
                refeições rápidas.
              </p>

              <button
                className="primary"
                onClick={() => navigate("/receitas")}
              >
                Ver receita
              </button>

            </div>

          </div>

          <div className="receita-card">

            <div className="receita-img"></div>

            <div className="receita-info">

              <h3>
                Vitamina de Banana
              </h3>

              <p>
                Bebida nutritiva rica em energia,
                ideal para café da manhã ou lanche.
              </p>

              <button
                className="primary"
                onClick={() => navigate("/receitas")}
              >
                Ver receita
              </button>

            </div>

          </div>

        </div>

      </section>

      <section className="sobre">

        <div className="sobre-texto">

          <span className="section-tag">
            Sobre nós
          </span>

          <h2>
            Desenvolvido para transformar hábitos alimentares
          </h2>

          <p>
            O EquilibraPro foi desenvolvido com o objetivo
            de ajudar pessoas a organizarem sua alimentação
            de forma prática, saudável e inteligente.
          </p>

          <p>
            Somos as criadoras do sistema e desenvolvemos
            essa plataforma como parte do nosso Trabalho
            de Conclusão de Curso.
          </p>

          <p>
            Nosso foco é facilitar o dia a dia dos usuários
            através de tecnologia, organização alimentar
            e incentivo a hábitos mais equilibrados.
          </p>

        </div>

        <div className="sobre-img">

          <img
            src={Foto}
            alt="Criadoras do sistema"
          />

        </div>

      </section>

      <section className="como">

        <span className="section-tag">
          Como funciona
        </span>

        <h2>
          Nutrição personalizada para cada usuário
        </h2>

        <p>
          Utilizamos informações fornecidas por você
          para entender seus objetivos, preferências
          alimentares e rotina.
        </p>

        <p>
          Com base nesses dados, sugerimos receitas,
          ingredientes e refeições que mais combinam
          com o seu perfil nutricional.
        </p>

        <p>
          Quanto mais completo seu perfil,
          melhores serão as recomendações.
        </p>

        <button
          className="primary"
          onClick={() => navigate("/cadastro")}
        >
          Fazer meu cadastro
        </button>

      </section>

    </div>
  );
}