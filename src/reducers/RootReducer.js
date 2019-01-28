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
        alvos: []
    }
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
    else if(action.type === 'SET_SIMULADO_CURSODISCIPLINA'){
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
        }

        return{
            ...state,
            simulado: {
                nome: state.simulado.nome,
                alvos
            }
        }
    }
    return state;
}

export default RootReducer;