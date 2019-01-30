import React, { Component } from "react"
import { Row, Col, Card, Button, Icon } from "antd"
import { connect } from 'react-redux'
import BackEndRequests from '../hocs/BackEndRequests'

class SelecaoQuestoes extends Component {
    state = {
        questoes: [],
    }

    componentWillReceiveProps(props) {
        if(props.questoes !== null){
            this.setState({
                questoes: props.questoes
            })
        }
    }

    render(){
        console.log('simulado', this.props.simulado)
        return(
            <React.Fragment>
                {
                    this.state.questoes.map(questao => {
                        var hit = false
                        var selectButton = null
                        // Verificando se a questao já está selecionada
                        if(this.props.simulado.questoes){
                            console.log('questoes selecionadas:', this.props.simulado.questoes)
                            if(this.props.simulado.questoes.indexOf(questao.id) > -1) hit = true
                        }
                        
                        selectButton = hit ?
                            <Button  className="buttonOrange" onClick={() => this.props.removeSimuladoQuestao(questao.id)}><Icon type="check" />Remover Seleção</Button>
                            :<Button className="buttonGreen" onClick={() => this.props.setSimuladoQuestao(questao.id)}><Icon type="check" />Selecionar</Button>
                        return(
                            <Row key={questao.id} style={{marginBottom: 20}}>
                                <Col span={24}>
                                    <Card>
                                        <h4>({questao.fonte})</h4>
                                        <h4 style={{marginBottom: 20}}>{questao.id} - {questao.descricao}</h4>
                                        {
                                            questao.alternativas.map(alternativa => {
                                                var correta = alternativa.correta ? 'correta' : 'errada'
                                                return(
                                                    <p key={alternativa.id}><code className={correta}>{alternativa.descricao}</code></p>
                                                )
                                            })
                                        }
                                        <Row>
                                            <Col span={24} align="end">
                                                {selectButton}
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        simulado: state.simulado
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSimuladoQuestao: (questaoId) => { dispatch({ type: 'SET_SIMULADOQUESTAO', questaoId }) },
        removeSimuladoQuestao: (questaoId) => { dispatch({ type: 'REMOVE_SIMULADOQUESTAO', questaoId }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(SelecaoQuestoes));