import React, { Component } from 'react'
import { Layout, Row, Col, Icon } from 'antd'
import Countdown from 'react-countdown-now';
import { connect } from 'react-redux'
import axios from 'axios'
import "./static/style.css"

import QuestaoSimulado from './QuestaoSimulado'

const { Content } = Layout

class ExecucaoSimulado extends Component {
    state = {
        value: null,
        questaoNo: 0
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }

    handleProximo = () => {
        var questaoNo = this.state.questaoNo + 1
        this.setState({questaoNo})
    }

    handleAnterior = () => {
        var questaoNo = this.state.questaoNo - 1
        this.setState({questaoNo})
    }

    handleResponder = (idAlternativa) => {
        console.log('--==handleResponder==--')
        // AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //
        // AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //// AQUI //

        var questao = this.state.simulado.questoes[this.state.questaoNo]
        var request = {
            id: 0,
            idSimulado: this.props.simulado.id,
            idQuestao: questao,
            idAlternativa: idAlternativa,
            idAluno: this.props.usuarioId
        }
        console.log('request', request)
        axios.post('http://localhost:5000/api/simuladoResposta', request)
        .then(res => {
            console.log('response', res.data)
        })
        .catch(error =>{
            console.log('error: ', error)
            this.setState({tableLoading: false})
        })
    }

    render() {
        console.log('props', this.props)
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

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
                            <Countdown date={Date.now() + 90 * 60000} />
                        </Col>
                    </Row>
                </Content>
                <QuestaoSimulado questaoNo={this.state.questaoNo} handleProximo={this.handleProximo} handleAnterior={this.handleAnterior} />
            </Layout>
        );
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
    }
}
 
export default connect(MapStateToProps, mapDispatchToProps)(ExecucaoSimulado)