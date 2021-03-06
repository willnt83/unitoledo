import React, { Component } from 'react'
import { Layout, Row, Col, Radio, Button, Icon } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import "../../../static/style.css"

const { Content } = Layout
const RadioGroup = Radio.Group
const alternativasArray = ['A', 'B', 'C', 'D', 'E']


class QuestaoSimulado extends Component {
    state = {
        resposta: null,
        questaoNo: null,
        simulado: null,
        btnDisplayAnterior: null,
        btnDisplayProximo: null,
        btnDisplayFinalizarSimulado: null,
        btnSalvarRespostaLoading: false,
        btnFinalizarSimuladoLoading: false,
        tempoTotalSimulado: null
    }

    checkResponse = (questaoNo) => {
        return this.props.simulado.questoes[questaoNo].respondida !== 0 ? this.props.simulado.questoes[questaoNo].respondida : null
    }

    onChangeRadio = (e) => {
        this.setState({
            resposta: e.target.value,
        });
    }

    componentWillMount(){
        var btnDisplayProximo = this.props.simulado.questoes.length > 1 ? 'inline' : 'none'
        var btnDisplayFinalizarSimulado = this.props.simulado.questoes.length > 1 ? 'none' : 'inline'

        // Verificando se a questão já foi respondida. Se sim, retornará o id da alternativa, se não, retorna null
        var resposta = this.checkResponse(this.props.questaoNo)

        // Tempo total do simulado
        var dataHoraInicialObj = moment(this.props.simulado.inicio.data+' '+this.props.simulado.inicio.hora, 'DD/MM/YY HH:mm')
        var dataHoraFinalObj = moment(this.props.simulado.fim.data+' '+this.props.simulado.fim.hora, 'DD/MM/YY HH:mm')


        this.setState({
            questaoNo: this.props.questaoNo,
            questaoNoText: parseInt(this.props.questaoNo) + 1,
            simulado: this.props.simulado,
            btnDisplayAnterior: 'none',
            btnDisplayProximo,
            btnDisplayFinalizarSimulado,
            resposta,
            tempoTotalSimulado: dataHoraFinalObj.diff(dataHoraInicialObj, 'minutes')
        })
    }


    componentWillReceiveProps(props){
        this.setState({
            questaoNo: props.questaoNo,
            questaoNoText: parseInt(props.questaoNo) + 1
        })
    }

    componentWillUpdate(nextProps, nextState){
        var quantidadeQuestoes = nextProps.simulado.questoes.length
        // Se houver troca de questão
        if(nextState.questaoNo !== null && nextState.questaoNo !== this.state.questaoNo){
            // Tratamento dos botoes anterior próximo e finalizar simulado
            if(nextState.questaoNo === 0){
                // Primeira questão
                this.setState({btnDisplayAnterior: 'none', btnDisplayProximo: 'inline', btnDisplayFinalizarSimulado: 'none'})
            }
            else if((nextState.questaoNo + 1) === quantidadeQuestoes){
                // Última questão
                this.setState({btnDisplayAnterior: 'inline', btnDisplayProximo: 'none', btnDisplayFinalizarSimulado: 'inline'})
            }
            else{
                this.setState({btnDisplayAnterior: 'inline', btnDisplayProximo: 'inline', btnDisplayFinalizarSimulado: 'none'})
            }
            //

            // Carregando alternativas respondidas
            // Verificando se a questão já foi respondida. Se sim, retornará o id da alternativa, se não, retorna null
            var resposta = this.checkResponse(nextProps.questaoNo)
            this.setState({resposta})
        }
        if(nextProps.btnSalvarRespostaLoading !== this.props.btnSalvarRespostaLoading){
            this.setState({btnSalvarRespostaLoading: nextProps.btnSalvarRespostaLoading})
        }

        if(nextProps.btnFinalizarSimuladoLoading !== this.props.btnFinalizarSimuladoLoading){
            this.setState({btnFinalizarSimuladoLoading: nextProps.btnFinalizarSimuladoLoading})
        }
    }

    render() {
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
                    <h4>{this.state.simulado.nome} (Questões respondidas: {this.props.questoesRespondidas} de {this.props.simulado.questoes.length})</h4>
                    <h4>Tempo total: {this.state.tempoTotalSimulado} minutos</h4>

                    <Row style={{ marginTop: 20 }}>
                        <Col span={24}>
                            {simuladoFonteText}
                            <h4>Questão {this.state.questaoNoText} de {this.props.simulado.questoes.length}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="descricaoHtml" span={24} dangerouslySetInnerHTML={{__html: this.state.simulado.questoes[this.state.questaoNo].descricao}} />
                    </Row>
                    <Row>
                        <Col span={24}>
                            <RadioGroup style={{width: '80%'}} size={'large'} onChange={this.onChangeRadio} value={this.state.resposta}>
                                {
                                    alternativas.map(alternativa => {
                                        return(
                                            <Radio key={alternativa.key} style={radioStyle} value={alternativa.id} style={{display: 'block'}}>
                                                <span className="bold">Alternativa {alternativasArray[alternativa.key]}</span>
                                                <Row>
                                                    <Col span={24}dangerouslySetInnerHTML={{__html: alternativa.descricao}} style={{whiteSpace: 'normal', marginLeft: 24}} />
                                                </Row>
                                            </Radio>
                                        )
                                    })
                                }
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 30 }}>
                        <Col span={8} align="begining"><Button type="default" onClick={() => this.props.handleAnterior()} style={{display: this.state.btnDisplayAnterior}} disabled={this.props.btnDisabled}><Icon type="left" />Anterior</Button></Col>
                        <Col span={8} align="center"><Button type="primary" onClick={() => this.props.handleResponder(this.state.resposta)} loading={this.state.btnSalvarRespostaLoading}><Icon type="save" />Salvar Resposta</Button></Col>
                        <Col span={8} align="end">
                            <Button className="buttonGreen" type="success" style={{display: this.state.btnDisplayProximo}} onClick={() => this.props.handleProximo()} disabled={this.props.btnDisabled}>Próximo<Icon type="right" /></Button>
                            <Button className="buttonOrange" type="success" style={{display: this.state.btnDisplayFinalizarSimulado}} onClick={() => this.props.handleFinalizarSimulado()} loading={this.state.btnFinalizarSimuladoLoading} disabled={this.props.btnDisabled}><Icon type="check-circle" />Finalizar Simulado</Button>
                        </Col>
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