import React, { Component } from 'react'
import { Layout, Row, Col, Icon, Modal, Button, notification } from 'antd'
import Countdown from 'react-countdown-now'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from "react-router-dom"
import "../../static/style.css"
import QuestaoSimulado from './QuestaoSimulado'

const { Content } = Layout

class ExecucaoSimulado extends Component {
    state = {
        value: null,
        questaoNo: 0,
        questoesRespondidas: 0,
        showModal: false,
        btnSalvarRespostaLoading: false,
        btnFinalizarSimuladoLoading: false
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
            idUltilizador: this.props.contextoAluno.idUtilizador
        }

        axios.post('http://localhost:5000/api/simuladoResposta', request)
        .then(res => {
            // Atualizando redux simulado.questoes com a alternativa respondida na questão
            var questoes = this.props.simulado.questoes
            questoes[this.state.questaoNo].respondida = idAlternativa
            this.props.setQuestaoRespondida(questoes)
            this.countRespondidas()
            this.setState({btnSalvarRespostaLoading: false})
            this.openNotificationRespondido()
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
        this.setState({btnFinalizarSimuladoLoading: true})
        this.displayModal(false)

        var request = {
            "id": this.props.simulado.id,
            "status": "Finalizado"
        }

        axios.post('http://localhost:5000/api/statusSimulado', request)
        .then(res => {
            this.setState({btnFinalizarSimuladoLoading: false})
            this.openNotificationFinalizado()
            this.props.setSimuladoFinalizado(true)
            this.props.history.push('/alunos')
        })
        .catch(error =>{
            console.log(error)
        })
    }

    handleModalCancel = () => {
        this.displayModal(false)
    }

    openNotificationFinalizado = () => {
        const args = {
            message: 'Simulado Finalizado',
            icon: <Icon type="check-circle" style={{color: '#13a54b', fontWeight: '800'}} />,
            //description: 'Simulado finalizado com sucesso.',
            duration: 0
        }
        notification.open(args)
    }

    openNotificationRespondido = () => {
        const args = {
            message: 'Resposta registrada',
            icon: <Icon type="check-circle" style={{color: '#13a54b', fontWeight: '800'}} />,
            duration: 2
        }
        notification.open(args)
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
        if(this.props.mainData === null || this.props.contexto !== 'ALUNO'){
            this.props.resetAll()
            window.location.replace("/")
        }
        this.countRespondidas()
    }

    render() {
        // Settando periodoExecucao (em minutos) com a diferença entre as dataHoras Inicial e Final
        var periodoExecucaoObj = null
        if(this.props.simulado){
            
            var inicioObj = moment()
            var terminoObj = moment(this.props.simulado.fim.data+ ' '+this.props.simulado.fim.hora, 'DD/MM/YYYY HH:mm')
            periodoExecucaoObj = terminoObj.diff(inicioObj, 'minutes')
        }

        return (
            <Layout className="layout">
                <Content
                    style={{
                        margin: "0",
                        padding: "0 30px 0 24px",
                        background: "#13a54b",
                        color: '#fff',
                        maxHeight: 24
                    }}
                >
                    <Row>
                        <Col span={24} align="end" style={{fontWeight: 500}}>
                            <Icon type="clock-circle"  style={{ marginRight: 10 }}/>
                            <span style={{ marginRight: 10 }}>Tempo restante:</span>
                            <Countdown date={Date.now() + periodoExecucaoObj * 60000} daysInHours={true} />
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
                    btnFinalizarSimuladoLoading={this.state.btnFinalizarSimuladoLoading}
                    tempoTotal={this.state.tempoTotalSimulado}
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
        usuarioId: state.usuarioId,
        mainData: state.mainData,
        contexto: state.contexto,
        contextoAluno: state.contextoAluno
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setQuestaoRespondida: (questoes) => { dispatch({ type: 'SET_QUESTAORESPONDIDA', questoes }) },
        setSimuladoFinalizado: (simuladoFinalizado) => { dispatch({ type: 'SET_SIMULADOFINALIZADO', simuladoFinalizado }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}
 
export default connect(MapStateToProps, mapDispatchToProps)(withRouter(ExecucaoSimulado))