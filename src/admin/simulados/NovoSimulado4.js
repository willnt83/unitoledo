import React, { Component } from "react"
import { Layout, Row, Col, Button, Card, Form, Input, TimePicker, DatePicker, Icon } from "antd"
import { Link } from "react-router-dom"
import { connect } from 'react-redux'
import ptBr from 'antd/lib/locale-provider/pt_BR'
import moment from 'moment'
import 'moment/locale/pt-br'
import SimuladoSteps from './SimuladoSteps'
import SelecaoQuestoes from './SelecaoQuestoes'
moment.locale('pt-br')


const { Content } = Layout

class NovoSimulado4 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Finalização')
    }

    state = {
        quantidadeQuestoesSelecionadas: 'Questões Selecionadas'
    }

    componentWillReceiveProps(props) {
        if(props.simulado.questoes.length > 0){
            this.setState({
                quantidadeQuestoesSelecionadas: 'Questoes Selecionadas ('+props.simulado.questoes.length+')'
            })
        }
    }

    handleFinalizarButton = (mode) => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            let dataInicial = values.dataInicial.format('YYYY-MM-DD')
            let horarioInicial = values.horarioInicial.format('HH:mm')
            let dateTimeInicial = moment(dataInicial + ' ' + horarioInicial, 'YYYY/MM/DD HH:mm')

            let dataFinal = values.dataFinal.format('YYYY-MM-DD')
            let horarioFinal = values.horarioFinal.format('HH:mm')
            let dateTimeFinal = moment(dataFinal + ' ' + horarioFinal, 'YYYY/MM/DD HH:mm')

            if (!err) {
                this.props.setStartFinish({dateTimeInicial: dateTimeInicial.format(), dateTimeFinal: dateTimeFinal.format()})
            }
            else{
                console.log(err)
            }
        })

    }

    componentDidMount(){
        if(this.props.simulado.nome !== null || this.props.simulado.nome !== ''){
            this.props.form.setFieldsValue({
                nome: this.props.simulado.nome
            })
        }
    }

    render(){
        console.log('props', this.props)
        const { getFieldDecorator } = this.props.form
        return(
            <React.Fragment>
                <SimuladoSteps step={3} />
                <Form layout="vertical" >
                    <Row>
                        <Col span={24}>
                            <Content
                                style={{
                                    margin: "4px 16px 4px 16px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 30
                                }}
                            >
                                <Form.Item
                                    label="Nome"
                                >
                                    {getFieldDecorator('nome', {
                                        rules: [{ required: true, message: 'Por favor informe o nome do simulado' }]
                                    })(
                                        <Input
                                            id="nome"
                                            placeholder="Digite o nome do simulado"
                                        />
                                    )}
                                </Form.Item>
                            </Content>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={8}>
                            <Card
                                title="Período para Resolução"
                                bordered={false}
                                style={{
                                    margin: "4px 4px 4px 16px",
                                    padding: 24,
                                    background: "#fff"
                                }}
                            >
                                <Form.Item
                                    label="Data Inicial"
                                >
                                    {getFieldDecorator('dataInicial', {
                                        rules: [{ required: true, message: 'Por favor informe a data inicial' }]
                                    })(
                                        <DatePicker
                                            locale={ptBr}
                                            format="DD/MM/YYYY"
                                            placeholder="Selecione a data"
                                            style={ {width: '100%'} }
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="Horário Inicial"
                                >
                                    {getFieldDecorator('horarioInicial', {
                                        rules: [{ required: true, message: 'Por favor informe o horário inicial' }]
                                    })(
                                        <TimePicker
                                            locale={ptBr}
                                            format="HH:mm"
                                            defaultOpenValue={moment('00:00', 'HH:mm')}
                                            placeholder="Selecione o horário"
                                            style={ {width: '100%'} }
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="Data Final"
                                >
                                    {getFieldDecorator('dataFinal', {
                                        rules: [{ required: true, message: 'Por favor informe a data final' }]
                                    })(
                                        <DatePicker
                                            locale={ptBr}
                                            format="DD/MM/YYYY"
                                            placeholder="Informe a data"
                                            style={ {width: '100%'} }
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="Horário Final"
                                >
                                    {getFieldDecorator('horarioFinal', {
                                        rules: [{ required: true, message: 'Por favor informe o horário final' }]
                                    })(
                                        <TimePicker
                                            locale={ptBr}
                                            format="HH:mm"
                                            defaultOpenValue={moment('00:00', 'HH:mm')}
                                            placeholder="Informe o horário"
                                            style={ {width: '100%'} }
                                        />
                                    )}
                                </Form.Item>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Card
                                title={this.state.quantidadeQuestoesSelecionadas}
                                bordered={false}
                                style={{
                                    margin: "4px 16px 4px 4px",
                                    padding: 24,
                                    background: "#fff",
                                    height: 'calc(100% - 8px)'
                                }}
                            >
                                {<SelecaoQuestoes questoes={this.props.selectedQuestoes} mode='read' />}
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Content
                                style={{
                                    margin: "12px 16px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 60
                                }}
                            >
                                <Row>
                                    <Col span={12} align="start">
                                        <Link to="/admin/simulados/novo/step-3"><Button type="default"><Icon type="left" />Anterior</Button></Link>
                                    </Col>
                                    <Col span={12} align="end">
                                        <Button
                                            type="primary"
                                            onClick={() => this.handleFinalizarButton('rascunho')}
                                        >
                                            <Icon type="save" />Salvar Como Rascunho
                                        </Button>
                                        <Button
                                            className="buttonGreen"
                                            style={{marginLeft: '30px'}}
                                            onClick={() => this.handleFinalizarButton('publico')}
                                        >
                                            <Icon type="check" />Finalizar
                                        </Button>
                                    </Col>
                                </Row>
                            </Content>
                        </Col>
                    </Row>
                </Form>
            </React.Fragment>
        )
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
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        setStartFinish: (startFinish) => { dispatch({ type: 'SET_SIMULADOSTARTFINISH', startFinish }) },

    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(NovoSimulado4))