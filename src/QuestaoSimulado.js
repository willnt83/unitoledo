import React, { Component } from 'react'
import { Layout, Row, Col, Radio, Button, Icon } from 'antd'
import { connect } from 'react-redux'
import "./static/style.css"

const { Content } = Layout
const RadioGroup = Radio.Group
const alternativasArray = ['A)', 'B)', 'C)', 'D)', 'E)']


class QuestaoSimulado extends Component {
    state = {
        resposta: null,
        questaoNo: null,
        simulado: null
    }
    onChangeRadio = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            resposta: e.target.value,
        });
    }

    componentWillReceiveProps(props){
        console.log('--==componentWillReceiveProps==--')
        this.setState({
            questaoNo: props.questaoNo,
            questaoNoText: parseInt(props.questaoNo) + 1
        })
    }

    componentWillMount(){
        this.setState({
            questaoNo: this.props.questaoNo,
            questaoNoText: parseInt(this.props.questaoNo) + 1,
            simulado: this.props.simulado
        })

    }

    render() {
        console.log('props', this.props)

        var simuladoFonteText = this.props.simulado.fonte ? '<h4>'+this.props.simulado.fonte+'</h4>' : null

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        
        var alternativas = []
        var i = 0
        this.state.simulado.questoes[this.state.questaoNo].alternativas.forEach(alternativa => {
            alternativas.push({
                key: i,
                id: alternativa.id,
                descricao: alternativa.descricao
            })
            i++
        })

        return (
                <Content style={{
                    margin: "20px 25px 0 25px",
                    padding: 24,
                    background: "#fff"
                }}>
                    <h4>{this.state.simulado.nome}</h4>
                    <Row>
                        <Col span={24}>Tempo total: 90 minutos</Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Col span={24}>
                            {simuladoFonteText}
                            <h4>Questão {this.state.questaoNoText}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {this.state.simulado.questoes[this.state.questaoNo].descricao}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <RadioGroup size={'large'} onChange={this.onChangeRadio} value={this.state.value}>
                                {
                                    alternativas.map(alternativa => {
                                        return(
                                            <Radio key={alternativa.key} style={radioStyle} value={alternativa.id}>{alternativasArray[alternativa.key]} {alternativa.descricao}</Radio>
                                        )
                                    })
                                }
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 30 }}>
                        <Col span={8} align="begining"><Button type="primary" onClick={() => this.props.handleAnterior()}><Icon type="left" />Anterior</Button></Col>
                        <Col span={8} align="center"><Button type="primary" onClick={() => this.props.handleResponder(this.state.resposta)}><Icon type="save" />Responder</Button></Col>
                        <Col span={8} align="end"><Button type="success" style={{color: '#fff', backgroundColor: '#73d13d', borderColor: '#73d13d'}} onClick={() => this.props.handleProximo()}>Próximo<Icon type="right" /></Button></Col>
                    </Row>
                </Content>
        );
    }
}
 
const MapStateToProps = (state) => {
	return {
		simulado: state.simulado
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}
 
export default connect(MapStateToProps, mapDispatchToProps)(QuestaoSimulado)