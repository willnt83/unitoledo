import React, { Component } from "react"
import { Row, Col, Card } from "antd"
import { connect } from 'react-redux'
import BackEndRequests from '../hocs/BackEndRequests'

class SelecaoQuestoes extends Component {
    state = {
        questoes: []
    }

    componentWillReceiveProps() {
        if(this.props.questoes.length > 0){
            this.setState({
                questoes: this.props.questoes
            })
        }
    }

    render(){
        console.log(this.props)
        return(
            <React.Fragment>
                {
                    this.state.questoes.map(questao => {
                        console.log(questao)
                        return(
                            <Row key={questao.id} style={{marginBottom: 20}}>
                                <Col span={24}>
                                    <Card
                                        title={questao.description}
                                        extra='Selecionar'
                                    >
                                        {
                                            questao.alternativas.map(alternativa => {
                                                return(
                                                    <p><code key={alternativa.id}>{alternativa.descricao}</code></p>
                                                )
                                            })
                                        }
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
        questoes: state.questoes
	}
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(SelecaoQuestoes));