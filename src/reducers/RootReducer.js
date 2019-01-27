const initState = {
    logged: 'inicio',
    authHeaders: null,
    pageTitle: [],
    habilidades: [],
    conteudos: [],
    areasDeConhecimento: [],
    questoes: [],
    simulado: {
        nome: null,
        turmasDisciplinas: []
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
    else if(action.type === 'SET_LOGGED'){
        return {
            ...state,
            logged: action.logged
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
                turmasDisciplinas: [...state.simulado.turmasDisciplinas]
            }
        }
    }
    else if(action.type === 'SET_SIMULADO_CURSODISCIPLINA'){
        // Verificando se é remoção de item ou inserção
        const id = action.simuladoTurmaDisciplina.id
        let hit = false
        let turmasDisciplinas = []
        state.simulado.turmasDisciplinas.forEach((turmaDisciplina) => {
            if(turmaDisciplina.id === id)
                hit = true
        })

        // Se for remoção
        if(hit){
            turmasDisciplinas = state.simulado.turmasDisciplinas.filter(turmaDisciplina => {
                return (turmaDisciplina.id !== id)
            })
        }
        else{
            turmasDisciplinas = [...state.simulado.turmasDisciplinas, action.simuladoTurmaDisciplina]
        }

        return{
            ...state,
            simulado: {
                nome: state.simulado.nome,
                turmasDisciplinas
            }
        }
    }
    return state;
}

export default RootReducer;