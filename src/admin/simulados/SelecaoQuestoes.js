import React, { Component } from "react"
import { Row, Col, Card, Button, Icon } from "antd"
import { connect } from 'react-redux'
import BackEndRequests from '../hocs/BackEndRequests'

class SelecaoQuestoes extends Component {
    state = {
        questoes: [],
        first: true
    }

    componentWillReceiveProps(props) {
        if(props.questoes !== null){
            this.setState({
                questoes: props.questoes
            })

            if(this.state.first){
                props.questoes.forEach(questao => {
                    // Verifica em redux.selectedQuestoes se a questão consta nele
                    var hit = false
                    this.props.selectedQuestoes.forEach(selectedQuestao => {
                        if(selectedQuestao.id === questao.id){
                            hit = true
                        }
                    })

                    if(this.props.simulado.questoes.indexOf(questao.id) > -1 && !hit){
                        this.props.setSelectedQuestao(questao)
                    }
                })
                this.setState({first: false})
            }
        }
    }

    render(){
        if(this.state.questoes){
            return(
                <React.Fragment>
                    {
                        this.state.questoes.map(questao => {
                            var hit = false
                            var selectButton = null
                            var alternativas = null
                            // Verificando se a questao já está selecionada
                            if(this.props.simulado.questoes){
                                if(this.props.simulado.questoes.indexOf(questao.id) > -1){
                                    hit = true
                                }
                            }
                            if(this.props.mode === 'edit'){
                                selectButton = (hit) ?
                                    <Button  className="buttonOrange" onClick={() => this.props.removeSimuladoQuestao(questao)}><Icon type="check" />Remover Seleção</Button>
                                    :<Button className="buttonGreen" onClick={() => this.props.setSimuladoQuestao(questao)}><Icon type="check" />Selecionar</Button>
                            }
                            return(
                                <Row key={questao.id} style={{marginBottom: 20}}>
                                    <Col span={24}>
                                        <Card>
                                            <h4>({questao.fonte.description})</h4>
                                            <h4 style={{marginBottom: 20}}>{questao.id} - {questao.descricao}</h4>
                                                {alternativas}
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
        else return null
    }
}

const MapStateToProps = (state) => {
	return {
        simulado: state.simulado,
        selectedQuestoes: state.selectedQuestoes
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSimuladoQuestao: (questao) => { dispatch({ type: 'SET_SIMULADOQUESTAO', questao }) },
        setSelectedQuestao: (questao) => { dispatch({ type: 'SET_SELECTEDQUESTAO', questao }) },
        removeSimuladoQuestao: (questao) => { dispatch({ type: 'REMOVE_SIMULADOQUESTAO', questao }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(SelecaoQuestoes))