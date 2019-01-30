const initState = {
    authHeaders: null,
    mainData: null,
    pageTitle: [],
    habilidades: [],
    conteudos: [],
    areasDeConhecimento: [],
    questoes: [],
    simulado: {
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
    else if(action.type === 'SET_MAINDATA'){
        console.log('SET_MAINDATA')
        return {
            ...state,
            mainData: action.mainData
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
    else if(action.type === 'SET_SIMULADO_NOME'){
        return{
            ...state,
            simulado: {
                nome: action.simuladoNome,
                alvos: [...state.simulado.alvos]
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
                nome: state.simulado.nome,
                alvos: action.simuladoAlvos
            }
        }
    }
    else if(action.type === 'SET_SIMULADOQUESTAO'){
        var questoes = state.simulado.questoes
        var selectedQuestoes = state.selectedQuestoes
        questoes.push(action.questao.id)
        selectedQuestoes.push(action.questao)

        return{
            ...state,
            simulado: {
                nome: state.simulado.nome,
                alvos: state.simulado.alvos,
                questoes
            },
            selectedQuestoes
        }
    }
    else if(action.type === 'REMOVE_SIMULADOQUESTAO'){
        questoes = state.simulado.questoes
        questoes.splice(questoes.indexOf(action.questao.id), 1)

        selectedQuestoes = state.selectedQuestoes.filter(questao =>{
            return (questao.id !== action.questao.id)
        })

        return{
            ...state,
            simulado: {
                nome: state.simulado.nome,
                alvos: state.simulado.alvos,
                questoes
            },
            selectedQuestoes
        }
    }
    else if(action.type === 'SET_SIMULADOSTARTFINISH'){
        return{
            ...state,
            simulado: {
                nome: state.simulado.nome,
                alvos: state.simulado.alvos,
                questoes: state.simulado.questoes,
                inicio: action.startFinish.dateTimeInicial,
                fim: action.startFinish.dateTimeFinal
            }
        }
    }

    return state
}

export default RootReducer