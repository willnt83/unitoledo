const initState = {

    contexto: null,
    authHeaders: null,
    mainData: {"disciplinas":[{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.01SA","id":"12841","nome":"ALGORÍTMO E LÓGICA DE PROGRAMAÇÃO","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12846","nome":"ANÁLISE E PROJETOS DE SIST.DISTRIBUIDOS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12845","nome":"ESTRUTURAS DE DADOS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12844","nome":"INOVAÇÕES TECNOLÓGICAS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12847","nome":"LING. PROGRAMAÇÃO ORIENTADA A OBJETO DISTRIBUÍDOS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12842","nome":"METODOLOGIA DA PESQUISA CIENTÍFICA","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12848","nome":"PROJETO: SISTEMAS DISTRIBUIDOS","idTurno":2,"idNivelEnsino":1},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"idTurma":"049.05SA","id":"12843","nome":"SISTEMAS OPERACIONAIS","idTurno":2,"idNivelEnsino":1}],"cursos":[{"idColigada":1,"id":"49","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS","idNivelEnsino":1,"idPeriodoLetivo":0}],"turmas":[{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.01SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 01SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.02SA"},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.02SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 02SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.03SA"},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.03SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 03SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.04SA"},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.04SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 04SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.05SA"},{"idColigada":1,"idFilial":1,"idPeriodoLetivo":201,"id":"049.05SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 05SA","idNivelEnsino":1,"idCurso":"49","idProximaTurma":"049.05SA"}]},
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
    selectedQuestoes: []

   /*
   contexto: null,
   usuarioId: null,
   authHeaders: null,
   mainData: null,
   periodoLetivo: null,
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
   selectedQuestoes: []
   */
}

const RootReducer = (state = initState, action) => {
    if(action.type === 'SET_HEADERS'){
        return {
            ...state,
            authHeaders: {
                authorization: action.headerFields.token,
                cookie: action.headerFields.cookie
            }
        }
    }
    else if(action.type === 'SET_USUARIO'){
        return {
            ...state,
            usuarioId: action.usuario
        }
    }
    else if(action.type === 'SET_CONTEXTO'){
        return {
            ...state,
            contexto: action.contexto
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
        console.log('reducer SET_QUESTOES')
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
            }
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
        /*
        // Verificando se é remoção de item ou inserção
        const id = action.simuladoAlvo.id
        let hit = false
        let alvos = []
        state.simulado.alvos.forEach((alvo) => {
            if(alvo.id === id)
                hit = true
        })

        // Se for remoção
        if(hit){
            alvos = state.simulado.alvos.filter(alvo => {
                return (alvo.id !== id)
            })
        }
        else{
            alvos = [...state.simulado.alvos, action.simuladoAlvo]
        }*/

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

    return state
}

export default RootReducer