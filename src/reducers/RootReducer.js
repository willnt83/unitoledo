const initState = {

    contexto: null,
    authHeaders: null,
    mainData: {"simulados":[{"id":44,"nome":"das","dataHoraInicial":"2019-01-31T03:00:00.000+0000","dataHoraFinal":"2019-01-31T11:00:00.000+0000","rascunho":false,"questoes":null,"cursos":[],"turmas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"id":"049.01SA","nome":"ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 01SA","idNivelEnsino":0,"idCurso":null,"idProximaTurma":null}],"disciplinas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12846","nome":"ANÁLISE E PROJETOS DE SIST.DISTRIBUIDOS","idTurno":0,"idNivelEnsino":0},{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12845","nome":"ESTRUTURAS DE DADOS","idTurno":0,"idNivelEnsino":0}]},{"id":45,"nome":"Teste","dataHoraInicial":"2019-01-31T02:00:00.000+0000","dataHoraFinal":"2019-01-31T07:00:00.000+0000","rascunho":false,"questoes":null,"cursos":[],"turmas":[],"disciplinas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12845","nome":"ESTRUTURAS DE DADOS","idTurno":0,"idNivelEnsino":0},{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12844","nome":"INOVAÇÕES TECNOLÓGICAS","idTurno":0,"idNivelEnsino":0}]},{"id":51,"nome":"Simulado 4","dataHoraInicial":"2019-02-01T10:00:00.000+0000","dataHoraFinal":"2019-02-28T12:00:00.000+0000","rascunho":false,"questoes":null,"cursos":[],"turmas":[],"disciplinas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12848","nome":"12848 - PROJETO: SISTEMAS DISTRIBUIDOS","idTurno":0,"idNivelEnsino":0},{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"idTurma":null,"id":"12843","nome":"12843 - SISTEMAS OPERACIONAIS","idTurno":0,"idNivelEnsino":0}]},{"id":42,"nome":"Simulado 2","dataHoraInicial":"2019-01-01T04:00:00.000+0000","dataHoraFinal":"2019-01-30T02:04:00.000+0000","rascunho":false,"questoes":null,"cursos":[],"turmas":[{"idColigada":0,"idFilial":0,"idPeriodoLetivo":0,"id":"049.01SA","nome":"049.01SA - ANÁLISE E DESENVOLVIMENTO DE SISTEMAS - 01SA","idNivelEnsino":0,"idCurso":null,"idProximaTurma":null}],"disciplinas":[]},{"id":49,"nome":"Simulado 1","dataHoraInicial":"2019-02-01T03:00:00.000+0000","dataHoraFinal":"2019-02-28T14:00:00.000+0000","rascunho":false,"questoes":null,"cursos":[{"idColigada":0,"id":"49","nome":"49 - ANÁLISE E DESENVOLVIMENTO DE SISTEMAS","idNivelEnsino":0,"idPeriodoLetivo":0}],"turmas":[],"disciplinas":[]}]},
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