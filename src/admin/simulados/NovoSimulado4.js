import React, { Component } from "react"
import { Layout, Row, Col, Button, Card, Form, Input, TimePicker, DatePicker, Icon } from "antd"
import { Link } from "react-router-dom"
import SimuladoSteps from './SimuladoSteps'
import { connect } from 'react-redux'

import ptBr from 'antd/lib/locale-provider/pt_BR';
import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-br');


const { Content } = Layout
const FormItem = Form.Item
/*
const Option = Select.Option

const simNaoOptions = [
	{
		key: true,
		description: "Sim"
	},
	{
		key: false,
		description: "Não"
	}
]


const cursos = [
	{
		key: 1,
		description: "Curso 1"
	},
	{
		key: 2,
		description: "Curso 2"
	},
	{
		key: 3,
		description: "Curso 3"
	},
	{
		key: 4,
		description: "Curso 4"
	}
]
*/

class NovoSimulado4 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Finalização')
    }

    handleFinalizarButton = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.props.setSimuladoNome(values.nome)
              console.log('Gravando simulado...')
            }
            else{

            }
        })
    }

    componentDidMount(){
        if(this.props.simulado.nome !== null || this.props.simulado.nome !== ''){
            this.props.form.setFieldsValue({
                nome: this.props.simulado.nome
            });
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <React.Fragment>
                <SimuladoSteps step={3} />
                <Form layout="vertical">
                    <Row>
                        <Col span={24}>
                            <Content
                                bordered={false}
                                style={{
                                    margin: "4px 16px 4px 16px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 30
                                }}
                            >
                                <FormItem
                                    label="Nome"
                                >
                                    {getFieldDecorator('nome', {
                                        rules: [{ required: true, message: 'Por favor informe o nome do simulado' }]
                                    })(
                                        <Input
                                            id="nome"
                                            placeholder="Digite o nome do simulado"
                                            onChange={this.handleInput}
                                        />
                                    )}
                                </FormItem>
                            </Content>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={8}>
                            <Card
                                title="Início"
                                bordered={false}
                                style={{
                                    margin: "4px 4px 4px 16px",
                                    padding: 24,
                                    background: "#fff"
                                }}
                            >
                                <FormItem
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
                                </FormItem>
                                <FormItem
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
                                </FormItem>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                title="Fim"
                                bordered={false}
                                style={{
                                    margin: "4px 4px 4px 4px",
                                    padding: 24,
                                    background: "#fff"
                                }}
                            >
                                <FormItem
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
                                </FormItem>
                                <FormItem
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
                                </FormItem>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                title="Tempo Para Responder à Atividade"
                                bordered={false}
                                style={{
                                    margin: "4px 16px 4px 4px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 'calc(100% - 8px)'
                                }}
                            >
                                <FormItem
                                    label="Tempo de atividade"
                                >
                                    {getFieldDecorator('tempoDeAtividade', {
                                        rules: [{ required: true, message: 'Por favor informe o tempo de atividade' }]
                                    })(
                                        <TimePicker
                                            locale={ptBr}
                                            format="HH:mm"
                                            defaultOpenValue={moment('00:00', 'HH:mm')}
                                            placeholder="Informe o tempo"
                                            style={ {width: '100%'} }
                                        />
                                    )}
                                </FormItem>
                            </Card>
                        </Col>
                    </Row>
                    {/*<Row>
                        <Col span={24}>
                            <Content
                                bordered={false}
                                style={{
                                    margin: "4px 16px 4px 16px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 30
                                }}
                            >
                                <FormItem>
                                    <Checkbox>Gostaria de exibir ao aluno as questões corrigidas imediatamente após a entrega?</Checkbox>
                                </FormItem>
                            </Content>
                        </Col>
                    </Row>*/}
                    <Row type="flex">
                        {/*<Col span={8}>
                            <Card
                                title="Filtro de Cursos"
                                bordered={false}
                                style={{
                                    margin: "4px 4px 4px 16px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 300
                                }}
                            >
                                <FormItem label="Exibir simulado para todos os cursos?">
                                    {getFieldDecorator('exibirParaTodosOsCursos', {
                                        rules: [{ required: true, message: 'Por favor informe se o simulado deve ser exibido para todos os cursos' }]
                                    })(
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Selecione"
                                            defaultValue={[]}
                                            onChange={this.handleChange}
                                        >
                                            {
                                                simNaoOptions.map((item) => {
                                                    return (<Option key={item.key}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="Cursos">
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Selecione os Cursos"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            cursos.map((item) => {
                                                return (<Option key={item.key}>{item.description}</Option>)
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Card>
                        </Col>*/}
                        <Col span={24}>
                            <Card
                                title="Questões Adicionadas: 4"
                                bordered={false}
                                style={{
                                    margin: "4px 16px 4px 4px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 'calc(100% - 8px)'
                                }}
                            >
                                <p>Questão 1</p>
                                <p>Questão 2</p>
                                <p>Questão 3</p>
                                <p>Questão 4</p>
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
                                        <Link to="/admin/simulados/novo/step-3"><Button type="primary"><Icon type="left" />Anterior</Button></Link>
                                    </Col>
                                    <Col span={12} align="end">
                                        <Button
                                            type="primary"
                                            onClick={this.handleFinalizarButton}
                                            style={{backgroundColor: '#73d13d', borderColor: '#73d13d'}}
                                        >
                                            <Icon type="save" />Salvar Como Rascunho
                                        </Button>
                                        <Button
                                            type="primary"
                                            onClick={this.handleFinalizarButton}
                                            style={{marginLeft: '30px', backgroundColor: '#73d13d', borderColor: '#73d13d'}}
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
		simulado: state.simulado
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(NovoSimulado4))