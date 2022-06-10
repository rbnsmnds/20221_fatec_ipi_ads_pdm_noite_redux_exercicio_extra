// Import redux
const redux = require('redux');
// Import prompts
const prompts = require('prompts');

// função criadora de um tipo de ação
const realizarVestibular = (nome, cpf, nota) => {
    const entre6E10 = Math.ramdom() <= 0.7;
    const nota = entre6E10 ? 6 + Math.ramdom() * 4 : Math.ramdom() * 6;
    // ação devolvida como JSON
    return {
      type: 'REALIZAR_VESTIBULAR',
      payload: {
        nome,
        cpf,
        nota,
      },
    };
  };
  
  // função criadora de ação
  const realizarMatricula = (cpf, status) => {
    // ação devolvida é um objeto JSON
    return {
      type: 'REALIZAR_MATRICULA',
      payload: {
        cpf,
        status,
      },
    };
  };
  
// função reducer que chamada a primeira vez,
// seu parâmetro será undefined
// já que não existirá histórico algum
// por isso, configuramos uma lista vazia
// como seu valor padrão

// reducer manipula a seguinte lista
// [{cpf: 1, nome: "Ana", nota: 10},
//  {cpf: 2, nome: "Ana2", nota: 10}]
const historicoVestibular = (historicoVestibularAtual = [], acao) => {
    // se a ação for REALIZAR_VESTIBULAR,
    // adicionamos o novo exame à coleção existente
    if (acao.type === 'REALIZAR_VESTIBULAR') {
      // uma cópia contendo todos os existentes
      // + o novo; não faça push
      return [...historicoVestibularAtual, acao.payload];
    }
    // caso contrário, apenas ignoramos
    // e devolvemos a coleção inalterada
    return historicoVestibularAtual;
  };
  
  // reducer manipula a seguinte lista
  // [{cpf: 1, status: "M"},
  //  {cpf: 2, status: "M"}
  //  {cpf: 3, status: "NM"}]
  const historicoMatriculas = (historicoMatriculasAtual = [], acao) => {
    // se a ação for REALIZAR_MATRICULA,
    // adicionamos o novo exame à coleção existente
    if (acao.type === 'REALIZAR_MATRICULA') {
      // uma cópia contendo todos os existentes
      // + o novo; não faça push
      return [...historicoMatriculasAtual, acao.payload];
    }
    // caso contrário, apenas ignoramos
    // e devolvemos a coleção inalterada
    return historicoMatriculasAtual;
  };
  
  const todosOsReducers = redux.combineReducers({
    historicoMatriculas,
    historicoVestibular,
  });
  
  const store = redux.createStore(todosOsReducers);
  
  const main = async () => {
    const menu =
      '1-Realizar Verstibular\n2-Realizar Matrícula\n3-Visualizar meu status\n4-Visualizar a lista de aprovados\n0-Sair';
    let response;
    do {
      response = await prompts({
        type: 'number',
        name: 'op',
        message: menu,
      });
      switch (response.op) {
        case 1:{
          // 1. pegar o nome do usuario
          const { nome } = await prompts({
            type: 'text',
            name: 'nome',
            message: 'Digite seu nome'
          })
          // 2. pegar o cpf do usuario
          const { cpf } = await prompts({
            type: 'text',
            name: 'CPF',
            message: 'Digite seu CPF'
          })
          // 3. construir uma acao apropriada
          const acao = realizarVestibular (nome, cpf)
          // 4. fazer dispatch da acao
          store.dispatch(acao)
          break;
        }
        case 2:{
          // 1. pegar o cpf com prompts
          const { cpf } = prompts({
            type: 'text',
            name: 'CPF',
            message: 'Digite seu CPF'
          })
          // 2. checar se a pessoa está aprovada
          //    no estado centralizado
          //    (store.getState().historicoVestibular.find)
          const aprovado = store.getState().historicoVestibular.find(aluno => aluno.cpf === cpf && aluno.nota >= 6)
          // 3. produzir uma ação apropriada:
          //    o status poderá ser M ou NM
          store.dispatch(realizarMatricula(cpf, aprovado ? 'M' : "NM"))
        }
      }
    } while (response.op !== 0);
  };
  
  // Write Javascript code!
  const appDiv = document.getElementById('app');
  appDiv.innerHTML = `<h1>JS Starter</h1>`;
  