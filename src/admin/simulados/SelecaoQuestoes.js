import React, { Component } from "react"
import { Row, Col, Card, Button, Icon } from "antd"
import { connect } from 'react-redux'
import BackEndRequests from '../hocs/BackEndRequests'

class SelecaoQuestoes extends Component {
    state = {
        questoes: []
    }

    componentWillReceiveProps(props) {
        if(props.questoes !== null){
            this.setState({
                questoes: props.questoes
            })
        }
    }

    render(){
        return(
            <React.Fragment>
                {
                    this.state.questoes.map(questao => {
                        return(
                            <Row key={questao.id} style={{marginBottom: 20}}>
                                <Col span={24}>
                                    <Card>
                                        <h4>({questao.fonte})</h4>
                                        <h4 style={{marginBottom: 20}}>{questao.id} - {questao.descricao}</h4>
                                        {
                                            questao.alternativas.map(alternativa => {
                                                return(
                                                    <p key={alternativa.id}><code>{alternativa.descricao}</code></p>
                                                )
                                            })
                                        }
                                        <Row>
                                            <Col span={24} align="end">
                                                <Button className="buttonGreen"><Icon type="check" />Selecionar</Button>
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
	}
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(SelecaoQuestoes));