import React, { Component } from 'react'
import { Layout, Row, Col, Icon, Modal, Button } from 'antd'
import Countdown from 'react-countdown-now'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import "./static/style.css"
import QuestaoSimulado from './QuestaoSimulado'

const { Content } = Layout

class ExecucaoSimulado extends Component {
    state = {
        value: null,
        questaoNo: 0,
        questoesRespondidas: 0,
        periodoExecucao: null,
        showModal: false,
        btnSalvarRespostaLoading: false
    }
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        })
    }

    handleProximo = () => {
        var questaoNo = this.state.questaoNo + 1
        this.countRespondidas()
        this.setState({questaoNo})
    }

    handleAnterior = () => {
        var questaoNo = this.state.questaoNo - 1
        this.countRespondidas()
        this.setState({questaoNo})
    }

    handleResponder = (idAlternativa) => {
        this.setState({btnSalvarRespostaLoading: true})
        var questaoId = this.props.simulado.questoes[this.state.questaoNo].id
        var request = {
            id: 0,
            idSimulado: this.props.simulado.id,
            idQuestao: questaoId,
            idAlternativa: idAlternativa,
            idAluno: this.props.usuarioId
        }
        axios.post('http://localhost:5000/api/simuladoResposta', request)
        .then(res => {
            // Atualizando redux simulado.questoes com a alternativa respondida na questão
            var questoes = this.props.simulado.questoes
            questoes[this.state.questaoNo].respondida = idAlternativa

            this.props.setQuestaoRespondida(questoes)
            this.countRespondidas()
            this.setState({btnSalvarRespostaLoading: false})
        })
        .catch(error =>{
            console.log('error: ', error)
            this.setState({btnSalvarRespostaLoading: false})
        })
    }

    handleFinalizarSimulado = () => {
        this.displayModal(true)
    }

    displayModal = (bool) => {
        this.setState({showModal: bool})
    }

    handleModalOk = () => {
        this.showModal(false);
        this.props.history.push('/alunos/execucao-simulado')
    }

    handleModalCancel = () => {
        this.showModal(false);
    }

    countRespondidas = () => {
        var questoesRespondidas = 0
        this.props.simulado.questoes.forEach(questao => {
            if(questao.respondida !== 0)
                questoesRespondidas++
        })
        this.setState({questoesRespondidas})
    }

    componentWillMount(){
        // Settando periodoExecucao (em minutos) com a diferença entre as dataHoras Inicial e Final
        var inicioObj = moment(this.props.simulado.dataHoraInicial, 'DD/MM/YYYY HH:mm')
        var terminoObj = moment(this.props.simulado.dataHoraFinal, 'DD/MM/YYYY HH:mm')
        var periodoExecucaoObj = terminoObj.diff(inicioObj, 'minutes')
        this.setState({periodoExecucao: periodoExecucaoObj})
        this.countRespondidas()
    }

    render() {
        return (
            <Layout className="layout">
                <Content style={{
                    margin: "0",
                    padding: "0 30px 0 24px",
                    background: "#13a54b",
                    color: '#fff'
                }}>
                    <Row>
                        <Col span={24} align="end" style={{fontWeight: 500}}>
                            <Icon type="clock-circle"  style={{ marginRight: 10 }}/>
                            <span style={{ marginRight: 10 }}>Tempo restante:</span>
                            <Countdown date={Date.now() + this.state.periodoExecucao * 60000} />
                        </Col>
                    </Row>
                </Content>
                <QuestaoSimulado
                    questaoNo={this.state.questaoNo}
                    handleProximo={this.handleProximo}
                    handleAnterior={this.handleAnterior}
                    handleResponder={this.handleResponder}
                    handleFinalizarSimulado={this.handleFinalizarSimulado}
                    questoesRespondidas={this.state.questoesRespondidas}
                    btnSalvarRespostaLoading={this.state.btnSalvarRespostaLoading}
                />
                <Modal
                    title="Atenção!"
                    visible={this.state.showModal}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    footer={[
                        <Button key="back" onClick={this.handleModalCancel}><Icon type="close" />Cancelar</Button>,
                        <Button className="buttonGreen" key="submit" type="primary" onClick={this.handleModalOk}>
                            <Icon type="check" />Confirmar
                        </Button>,
                    ]}
                >
                    <p>Você está prestes a finalizar o simulado e não poderá alterar suas respostas posteriormente.</p>
                    <p>Confirmar finalização do simulado?</p>
                </Modal>
            </Layout>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        simulado: state.simulado,
        usuarioId: state.usuarioId
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setQuestaoRespondida: (questoes) => { dispatch({ type: 'SET_QUESTAORESPONDIDA', questoes }) }
    }
}
 
export default connect(MapStateToProps, mapDispatchToProps)(ExecucaoSimulado)