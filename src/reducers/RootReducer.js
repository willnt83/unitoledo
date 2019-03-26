const initState = {
    /*
    // Aluno
    contexto: null,
    contextoData: null,
    usuarioId: 42312,
    usuarioNome: 'IZABELLA DO NASCIMENTO CARDOSO',
    authHeaders: null,
    mainData: {"simulados":[{"id":44,"nome":"das","dataHoraInicial":"2019-01-31T03:00:00.000+0000","dataHoraFinal":"2019-01-31T11:00:00.000+0000","rascunho":false,"status":"Pendente","questoes":null,"cursos":[],"turmas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"id":"049.01SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 01SA","idNivelEnsino":0,"idCurso":null,"idProximaTurma":null}],"disciplinas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12846","nome":"ANÁLISE E PROJETOS DE SIST.DISTRIBUIDOS","idTurno":0,"idNivelEnsino":0},{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12845","nome":"ESTRUTURAS DE DADOS","idTurno":0,"idNivelEnsino":0}]},{"id":45,"nome":"Teste","dataHoraInicial":"2019-01-31T02:00:00.000+0000","dataHoraFinal":"2019-01-31T07:00:00.000+0000","rascunho":false,"status":"Pendente","questoes":null,"cursos":[],"turmas":[],"disciplinas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12845","nome":"ESTRUTURAS DE DADOS","idTurno":0,"idNivelEnsino":0},{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12844","nome":"INOVAÇÕES TECNOLÓGICAS","idTurno":0,"idNivelEnsino":0}]},{"id":51,"nome":"Simulado 4","dataHoraInicial":"2019-02-01T10:00:00.000+0000","dataHoraFinal":"2019-02-28T12:00:00.000+0000","rascunho":false,"status":"Pendente","questoes":null,"cursos":[],"turmas":[],"disciplinas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12848","nome":"12848 - PROJETO: SISTEMAS DISTRIBUIDOS","idTurno":0,"idNivelEnsino":0},{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12843","nome":"12843 - SISTEMAS OPERACIONAIS","idTurno":0,"idNivelEnsino":0}]},{"id":42,"nome":"Simulado 2","dataHoraInicial":"2019-01-01T04:00:00.000+0000","dataHoraFinal":"2019-01-30T02:04:00.000+0000","rascunho":false,"status":"Pendente","questoes":null,"cursos":[],"turmas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"id":"049.01SA","nome":"049.01SA - ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 01SA","idNivelEnsino":0,"idCurso":null,"idProximaTurma":null}],"disciplinas":[]},{"id":49,"nome":"Simulado 1","dataHoraInicial":"2019-02-01T03:00:00.000+0000","dataHoraFinal":"2019-02-28T14:00:00.000+0000","rascunho":false,"status":"Pendente","questoes":null,"cursos":[{"idColigada":0,"id":"49","nome":"49 - ANÁLISE E DESENVOLVIMENTO DE SISTEMAS","idNivelEnsino":0,"idPeriodoLetivo":0}],"turmas":[],"disciplinas":[]}]},
    periodoLetivo: 202,
    pageTitle: [],
    habilidades: [],
    conteudos: [],
    areasDeConhecimento: [],
    questoes: [],
    simulado: {
        id: '',
        nome: null,
        alvos: [],
        questoes: [],
        inicio: {
            data: null,
            hora: null
        },
        fim: {
            data: null,
            hora: null
        }
    },
    selectedQuestoes: [],
    flagSimuladoFinalizado: null,
    contextoAluno: null,
    request: null
    */

    /*
    // Coordenador
    contexto: null,
    contextoData: null,
    usuarioId: null,
    usuarioNome: null,
    authHeaders: null,
    mainData: {"disciplinas":[{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.01SA","id":"12841","nome":"ALGORÍTMO E LÓGICA DE PROGRAMAÇÃO","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12846","nome":"ANÁLISE E PROJETOS DE SIST.DISTRIBUIDOS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12845","nome":"ESTRUTURAS DE DADOS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12844","nome":"INOVAÇÕES TECNOLÓGICAS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12847","nome":"LING. PROGRAMAÇÃO ORIENTADA A OBJETO DISTRIBUÍDOS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12842","nome":"METODOLOGIA DA PESQUISA CIENTÍFICA","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12848","nome":"PROJETO: SISTEMAS DISTRIBUIDOS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12843","nome":"SISTEMAS OPERACIONAIS","idTurno":2,"idNivelEnsino":1}],"cursos":[{"idColigada":1,"id":"49","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS","idNivelEnsino":1,"idPeriodoLetivo":0}],"turmas":[{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.01SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 01SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.02SA"},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.02SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 02SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.03SA"},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.03SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 03SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.04SA"},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.04SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 04SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.05SA"},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.05SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 05SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.05SA"}]},
    periodoLetivo: 201,
    pageTitle: [],
    habilidades: [],
    conteudos: [],
    areasDeConhecimento: [],
    questoes: [],
    simulado: {
        id: '',
        nome: null,
        alvos: [],
        questoes: [],
        inicio: {
            data: null,
            hora: null
        },
        fim: {
            data: null,
            hora: null
        }
    },
    selectedQuestoes: [],
    flagSimuladoFinalizado: null,
    contextoAluno: null,
    request: null
    */

    // Original
    contexto: null,
    contextoData: null,
    usuarioId: null,
    usuarioNome: null,
    authHeaders: null,
    mainData: null,
    periodoLetivo: null,
    periodoLetivoDescricao: null,
    pageTitle: [],
    habilidades: [],
    conteudos: [],
    areasDeConhecimento: [],
    questoes: [],
    simulado: {
        id: '',
        nome: null,
        alvos: [],
        questoes: [],
        inicio: {
            data: null,
            hora: null
        },
        fim: {
            data: null,
            hora: null
        }
    },
    selectedQuestoes: [],
    flagSimuladoFinalizado: null, //flag necessária para contornar a inconsistencia da chamada getData :(
    contextoAluno: null, // variável necessário para contornar a inconsitencia da chamada getData :(((((
    request: null
}

const RootReducer = (state = initState, action) => {
    if(action.type === 'RESET_ALL'){
        console.log('reducer RESET_ALL')
        return {
            contexto: null,
            contextoData: null,
            usuarioId: null,
            usuarioNome: null,
            authHeaders: null,
            mainData: null,
            periodoLetivo: null,
            periodoLetivoDescricao: null,
            pageTitle: [],
            habilidades: [],
            conteudos: [],
            areasDeConhecimento: [],
            questoes: [],
            simulado: {
                id: '',
                nome: null,
                alvos: [],
                questoes: [],
                inicio: {
                    data: null,
                    hora: null
                },
                fim: {
                    data: null,
                    hora: null
                }
            },
            selectedQuestoes: [],
            flagSimuladoFinalizado: null,
            contextoAluno: null,
            request: null
        }
    }
    else if(action.type === 'SET_HEADERS'){
        return {
            ...state,
            authHeaders: {
                token: action.token
            }
        }
    }
    else if(action.type === 'SET_USUARIO'){
        return {
            ...state,
            usuarioId: action.usuarioId,
            usuarioNome: action.usuarioNome
        }
    }
    else if(action.type === 'SET_CONTEXTO'){
        return {
            ...state,
            contexto: action.contexto
        }
    }
    else if(action.type === 'SET_CONTEXTODATA'){
        return {
            ...state,
            contextoData: action.contextoData
        }
    }
    else if(action.type === 'SET_MAINDATA'){
        return {
            ...state,
            mainData: action.mainData
        }
    }
    else if(action.type === 'SET_PERIODOLETIVO'){
        return{
            ...state,
            periodoLetivo: action.periodo
        }
    }
    else if(action.type === 'SET_PERIODOLETIVODESCRICAO'){
        return{
            ...state,
            periodoLetivoDescricao: action.periodoDescricao
        }
    }
    else if(action.type === 'SET_PAGETITLE'){
        return {
            ...state,
            pageTitle: action.pageTitle
        }
    }
    else if(action.type === 'SET_HABILIDADES'){
        return {
            ...state,
            habilidades: action.habilidades
        }
    }
    else if(action.type === 'SET_CONTEUDOS'){
        return{
            ...state,
            conteudos: action.conteudos
        }
    }
    else if(action.type === 'SET_AREAS_DE_CONHECIMENTO'){
        return{
            ...state,
            areasDeConhecimento: action.areasDeConhecimento
        }
    }
    else if(action.type === 'SET_QUESTOES'){
        return{
            ...state,
            questoes: action.questoes
        }
    }
    else if(action.type === 'RESET_SIMULADO'){
        return{
            ...state,
            simulado: {
                id: '',
                nome: null,
                alvos: [],
                questoes: [],
                inicio: {
                    data: null,
                    hora: null
                },
                fim: {
                    data: null,
                    hora: null
                }
            },
            selectedQuestoes: []
        }
    }
    else if(action.type === 'SET_SIMULADO_NOME'){
        return{
            ...state,
            simulado: {
                id: state.simulado.id,
                nome: action.simuladoNome,
                alvos: [...state.simulado.alvos],
                questoes: state.simulado.questoes,
                inicio: {
                    data: state.simulado.inicio.data,
                    hora: state.simulado.inicio.hora
                },
                fim: {
                    data: state.simulado.fim.data,
                    hora: state.simulado.fim.hora
                }
            }
        }
    }
    else if(action.type === 'SET_SIMULADOALVO'){
        return{
            ...state,
            simulado: {
                id: state.simulado.id,
                nome: state.simulado.nome,
                alvos: action.simuladoAlvos,
                questoes: state.simulado.questoes,
                inicio: {
                    data: state.simulado.inicio.data,
                    hora: state.simulado.inicio.hora
                },
                fim: {
                    data: state.simulado.fim.data,
                    hora: state.simulado.fim.hora
                }
            }
        }
    }
    else if(action.type === 'SET_SIMULADOQUESTAO'){
        var selectedQuestoes = state.selectedQuestoes
        selectedQuestoes.push(action.questao)

        return{
            ...state,
            simulado: {
                id: state.simulado.id,
                nome: state.simulado.nome,
                alvos: state.simulado.alvos,
                questoes: [...state.simulado.questoes, action.questao.id],
                inicio: {
                    data: state.simulado.inicio.data,
                    hora: state.simulado.inicio.hora
                },
                fim: {
                    data: state.simulado.fim.data,
                    hora: state.simulado.fim.hora
                }
            },
            selectedQuestoes
        }
    }
    else if(action.type === 'REMOVE_SIMULADOQUESTAO'){
        var questoes = state.simulado.questoes
        questoes.splice(questoes.indexOf(action.questao.id), 1)

        selectedQuestoes = state.selectedQuestoes.filter(questao =>{
            return (questao.id !== action.questao.id)
        })

        return{
            ...state,
            simulado: {
                id: state.simulado.id,
                nome: state.simulado.nome,
                alvos: state.simulado.alvos,
                questoes,
                inicio: {
                    data: state.simulado.inicio.data,
                    hora: state.simulado.inicio.hora
                },
                fim: {
                    data: state.simulado.fim.data,
                    hora: state.simulado.fim.hora
                }
            },
            selectedQuestoes
        }
    }
    else if(action.type === 'SET_SELECTEDQUESTAO'){
        selectedQuestoes = state.selectedQuestoes
        selectedQuestoes.push(action.questao)
        return{
            ...state,
            selectedQuestoes 
        }
    }
    else if(action.type === 'SET_SIMULADOSTARTFINISH'){
        return{
            ...state,
            simulado: {
                id: state.simulado.id,
                nome: state.simulado.nome,
                alvos: state.simulado.alvos,
                questoes: state.simulado.questoes,
                inicio: action.startFinish.dateTimeInicial,
                fim: action.startFinish.dateTimeFinal
            }
        }
    }
    else if(action.type ==='SET_SIMULADOSFULL'){
        return{
            ...state,
            simulado: action.simulado
        }
    }
    else if(action.type === 'SET_SIMULADORESOLUCAO'){
        return{
            ...state,
            simulado: action.simulado
        }
    }
    else if(action.type === 'SET_QUESTAORESPONDIDA'){
        return{
            ...state,
            simulado: {
                id: state.simulado.id,
                nome: state.simulado.nome,
                alvos: state.simulado.alvos,
                questoes: action.questoes,
                inicio: state.dateTimeInicial,
                fim: state.dateTimeFinal
            }
        }
    }
    else if(action.type === 'SET_SIMULADOFINALIZADO'){
        return{
            ...state,
            flagSimuladoFinalizado: action.simuladoFinalizado
        }
    }
    else if(action.type === 'SET_CONTEXTOALUNO'){
        return{
            ...state,
            contextoAluno: action.contexto
        }
    }
    else if(action.type === 'SET_REQUEST'){
        return{
            ...state,
            request: action.request
        }
    }

    return state
}

export default RootReducer