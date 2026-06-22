import { useState } from "react";
import "./cadastro.css";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {

  const navigate = useNavigate();

  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [atividade, setAtividade] = useState("");
  const [objetivo, setObjetivo] = useState("");

  const [restricoes, setRestricoes] = useState([]);
  const [condicoes, setCondicoes] = useState([]);

  const handleCheckboxChange = (valor, estado, setEstado) => {

    if (estado.includes(valor)) {

      setEstado(
        estado.filter((item) => item !== valor)
      );

    } else {

      setEstado([
        ...estado,
        valor
      ]);
    }
  };

  const calcularIdade = (dataNascimento) => {

    const hoje = new Date();

    const nascimento = new Date(dataNascimento);

    let idade =
      hoje.getFullYear() -
      nascimento.getFullYear();

    const mes =
      hoje.getMonth() -
      nascimento.getMonth();

    if (
      mes < 0 ||
      (
        mes === 0 &&
        hoje.getDate() < nascimento.getDate()
      )
    ) {
      idade--;
    }

    return idade;
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const idadeCalculada =
      calcularIdade(dataNascimento);

    const dados = {
      dataNascimento,
      idade: idadeCalculada,
      genero,
      peso,
      altura,
      atividade,
      objetivo,
      restricoes,
      condicoes,
    };

    console.log(
      "Dados do usuário:",
      dados
    );

    alert(
      "Cadastro completo realizado!"
    );

    navigate("/receitas");
  };

  return (

    <div className="cadastro-container">

      <form onSubmit={handleSubmit}>

        <h2 className="cadastro-titulo">

          Complete seu
          {" "}
          <span>perfil</span>

        </h2>

        {/* LINHA 1 */}
        <div className="form-row">

          <div className="form-group">

            <label>
              Data de nascimento
            </label>

            <input
              type="date"
              value={dataNascimento}
              onChange={(e) =>
                setDataNascimento(
                  e.target.value
                )
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Gênero
            </label>

            <select
              value={genero}
              onChange={(e) =>
                setGenero(
                  e.target.value
                )
              }
              required
            >

              <option value="">
                Selecione
              </option>

              <option>
                Feminino
              </option>

              <option>
                Masculino
              </option>

              <option>
                Outro
              </option>

            </select>

          </div>

        </div>

        {/* LINHA 2 */}
        <div className="form-row">

          <div className="form-group">

            <label>
              Peso (kg)
            </label>

            <input
              type="number"
              value={peso}
              onChange={(e) =>
                setPeso(
                  e.target.value
                )
              }
              required
            />

          </div>

          <div className="form-group">

            <label>
              Altura (cm)
            </label>

            <input
              type="number"
              value={altura}
              onChange={(e) =>
                setAltura(
                  e.target.value
                )
              }
              required
            />

          </div>

        </div>

        {/* LINHA 3 */}
        <div className="form-row">

          <div className="form-group">

            <label>
              Nível de atividade física
            </label>

            <select
              value={atividade}
              onChange={(e) =>
                setAtividade(
                  e.target.value
                )
              }
              required
            >

              <option value="">
                Selecione
              </option>

              <option>
                Sedentário
              </option>

              <option>
                Leve
              </option>

              <option>
                Moderado
              </option>

              <option>
                Intenso
              </option>

            </select>

          </div>

          <div className="form-group">

            <label>
              Objetivo
            </label>

            <select
              value={objetivo}
              onChange={(e) =>
                setObjetivo(
                  e.target.value
                )
              }
              required
            >

              <option value="">
                Selecione
              </option>

              <option>
                Emagrecimento
              </option>

              <option>
                Ganho de massa
              </option>

              <option>
                Manutenção
              </option>

              <option>
                Reeducação alimentar
              </option>

            </select>

          </div>

        </div>

        {/* RESTRIÇÕES E CONDIÇÕES */}
        <div className="form-row">

          {/* RESTRIÇÕES */}
          <div className="opcoes-card">

            <h3>
              Restrições alimentares
            </h3>

            <div className="checkbox-group">

              {[
                "Intolerância à lactose",
                "Intolerância ao glúten",
                "Alergia a amendoim",
                "Vegetariano",
                "Vegano",
              ].map((item) => (

                <div
                  className="checkbox-item"
                  key={item}
                >

                  <input
                    type="checkbox"
                    checked={
                      restricoes.includes(item)
                    }
                    onChange={() =>
                      handleCheckboxChange(
                        item,
                        restricoes,
                        setRestricoes
                      )
                    }
                  />

                  <label>
                    {item}
                  </label>

                </div>

              ))}

            </div>

          </div>

          {/* CONDIÇÕES */}
          <div className="opcoes-card">

            <h3>
              Condições de saúde
            </h3>

            <div className="checkbox-group">

              {[
                "Diabetes",
                "Hipertensão",
                "Colesterol alto",
              ].map((item) => (

                <div
                  className="checkbox-item"
                  key={item}
                >

                  <input
                    type="checkbox"
                    checked={
                      condicoes.includes(item)
                    }
                    onChange={() =>
                      handleCheckboxChange(
                        item,
                        condicoes,
                        setCondicoes
                      )
                    }
                  />

                  <label>
                    {item}
                  </label>

                </div>

              ))}

            </div>

          </div>

        </div>

        <button className="botao-finalizar">

          Finalizar Cadastro

        </button>

      </form>

    </div>
  );
}