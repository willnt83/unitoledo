const initState = {
    // Original
    backEndPoint: 'http://localhost:5000',
    //backEndPoint: 'https://app-prova.unitoledo.br',
    currentDT: null,
    contexto: null,
    contextoData: null,
    usuarioId: null,
    usuarioNome: null,
    authHeaders: null,
    mainData: null,
    periodoLetivo: null,
    periodoLetivoDescricao: null,
    privilegios: [],
    pageTitle: [],
    habilidades: [],
    conteudos: [],
    areasDeConhecimento: [],
    fontes: [],
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
        },
        enade: null,
        content: null
    },
    selectedQuestoes: [],
    flagSimuladoFinalizado: null, //flag necessária para contornar a inconsistencia da chamada getData :(
    contextoAluno: null, // variável necessário para contornar a inconsitencia da chamada getData :(((((
    request: null
}

const RootReducer = (state = initState, action) => {
    if(action.type === 'RESET_ALL'){
        return {
            backEndPoint: 'http://localhost:5000',
            //backEndPoint: 'https://app-prova.unitoledo.br',
            currentDT: null,
            contexto: null,
            contextoData: null,
            usuarioId: null,
            usuarioNome: null,
            authHeaders: null,
            mainData: null,
            periodoLetivo: null,
            periodoLetivoDescricao: null,
            privilegios: [],
            pageTitle: [],
            habilidades: [],
            conteudos: [],
            areasDeConhecimento: [],
            fontes: [],
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
                },
                enade: null,
                content: null
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
    else if(action.type === 'SET_CURRENTDATETIME'){
        return {
            ...state,
            currentDT: action.currentDT
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
    else if(action.type === 'SET_PRIVILEGIOS'){
        return{
            ...state,
            privilegios: action.privilegios
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
    else if(action.type === 'SET_FONTES'){
        return {
            ...state,
            fontes: action.fontes
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
                },
                enade: null,
                content: null
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
                },
                enade: action.enade,
                content: action.content
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
                },
                enade: state.simulado.enade,
                content: state.simulado.content
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
                },
                enade: state.simulado.enade,
                content: state.simulado.content
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
                },
                enade: state.simulado.enade,
                content: state.simulado.content
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
                fim: action.startFinish.dateTimeFinal,
                enade: state.simulado.enade,
                content: state.simulado.content
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
                inicio: state.simulado.inicio,
                fim: state.simulado.fim,
                enade: state.simulado.enade,
                content: state.simulado.content
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