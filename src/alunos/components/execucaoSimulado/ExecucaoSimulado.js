import React, { Component } from 'react'
import { Layout, Row, Col, Icon, Modal, Button, notification } from 'antd'
import Countdown from 'react-countdown-now'
import moment from 'moment'
import { connect } from 'react-redux'
import axios from 'axios'
import { withRouter } from "react-router-dom"
import "../../../static/style.css"
import QuestaoSimulado from './QuestaoSimulado'

const { Content } = Layout

class ExecucaoSimulado extends Component {
    state = {
        value: null,
        questaoNo: 0,
        questoesRespondidas: 0,
        showModal: false,
        btnSalvarRespostaLoading: false,
        btnFinalizarSimuladoLoading: false,
        showModalPercentualAcerto: false,
        //questoesRespondidas: null,
        questoesRespondidasCorretamente: null,
        percentualAcerto: null,
        btnDisabled: false
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
        this.setState({btnSalvarRespostaLoading: true, btnDisabled: true})
        var questaoId = this.props.simulado.questoes[this.state.questaoNo].id
        var request = {
            id: 0,
            idSimulado: this.props.simulado.id,
            idQuestao: questaoId,
            idAlternativa: idAlternativa,
            idUltilizador: this.props.contextoAluno.idUtilizador
        }

        axios.post(this.props.backEndPoint+'/api/simuladoResposta', request)
        .then(res => {
            // Atualizando redux simulado.questoes com a alternativa respondida na questão
            var questoes = this.props.simulado.questoes
            questoes[this.state.questaoNo].respondida = idAlternativa
            this.props.setQuestaoRespondida(questoes)
            this.countRespondidas()
            this.setState({btnSalvarRespostaLoading: false, btnDisabled: false})
            this.openNotificationRespondido()
        })
        .catch(error =>{
            console.log('error: ', error)
            this.setState({btnSalvarRespostaLoading: false, btnDisabled: false})
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

        axios.get(this.props.backEndPoint+'/api/finalizaSimulado/'+this.props.simulado.id+'/'+this.props.contextoAluno.idUtilizador)
        .then(res => {
            this.setState({btnFinalizarSimuladoLoading: false})
            this.openNotificationFinalizado()
            this.props.setSimuladoFinalizado(true)
            this.loadModalPercentualAcerto()
            //this.props.history.push('/alunos')
        })
        .catch(error =>{
            console.log(error)
        })
    }

    loadModalPercentualAcerto = () => {
        axios.get(this.props.backEndPoint+'/api/getResult/'+this.props.simulado.id+'/'+this.props.contextoAluno.idUtilizador)
        .then(res => {
            console.log('res.data', res.data)
            this.setState({
                questoesRespondidas: res.data.result[0].questoesRespondidas,
                questoesRespondidasCorretamente: res.data.result[0].questoesCertas,
                percentualAcerto: res.data.result[0].percentual
            })
            this.showModalPercentualAcertoF(true)
        })
        .catch(error =>{
            console.log(error)
        })
    }

    showModalPercentualAcertoF = (bool) => {
        this.setState({showModalPercentualAcerto : bool})

        if(!bool)
            this.props.history.push('/alunos')
    }

    handleModalCancel = () => {
        this.displayModal(false)
    }

    openNotificationFinalizado = () => {
        const args = {
            message: 'Simulado Finalizado',
            icon: <Icon type="check-circle" style={{color: '#13a54b', fontWeight: '800'}} />,
            //description: 'Simulado finalizado com sucesso.',
            duration: 5
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
            window.location.replace("/app-prova")
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
                    btnDisabled={this.state.btnDisabled}
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
                    <p><strong>Questões respondidas: {this.state.questoesRespondidas} de {this.props.simulado.questoes.length}</strong></p>
                    <p>Confirmar finalização do simulado?</p>
                </Modal>

                <Modal
                    title="Resultado"
                    visible={this.state.showModalPercentualAcerto}
                    onOk={this.handleModalPercentualAcertoOk}
                    onCancel={() => this.showModalPercentualAcertoF(false)}
                    footer={[
                        <Button className="buttonGreen" key="submit" type="primary" onClick={() => this.showModalPercentualAcertoF(false)}>
                            <Icon type="check" />Ok
                        </Button>
                    ]}
                >
                    <p>Questões respondidas: <strong>{this.state.questoesRespondidas}</strong></p>
                    <p>Questões respondidas corretamente: <strong> {this.state.questoesRespondidasCorretamente}</strong></p>
                    <p>Percentual de acerto: <strong>{this.state.percentualAcerto}%</strong></p>
                </Modal>
            </Layout>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        backEndPoint: state.backEndPoint,
        simulado: state.simulado,
        usuarioId: state.usuarioId,
        mainData: state.mainData,
        contexto: state.contexto,
        contextoAluno: state.contextoAluno,
        questoesRespondidas: state.questoesRespondidas
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