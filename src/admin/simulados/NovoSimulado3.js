import React, { Component } from "react"
import { Layout, Row, Col, Button, Form, Input, Card, Select, Icon } from "antd"
import { Link } from "react-router-dom"
import axios from "axios"
import { connect } from 'react-redux'
import SimuladoSteps from './SimuladoSteps'
import SelecaoQuestoes from './SelecaoQuestoes'
import BackEndRequests from '../hocs/BackEndRequests'

const { Content } = Layout
const FormItem = Form.Item
const Option = Select.Option

const tipoOptions = [
	{
		key: 1,
		description: 'Formação geral'
	},
	{
		key: 2,
		description: 'Conhecimento específico'
	}
]

const simNaoOptions = [
	{
		key: "S",
		description: "Sim"
	},
	{
		key: "N",
		description: "Não"
	}
]

const anoOptions = [
	{
		key: "2018",
		description: "2018"
	},
	{
		key: "2017",
		description: "2017"
	},
	{
		key: "2016",
		description: "2016"
	},
	{
		key: "2015",
		description: "2015"
	},
	{
		key: "2014",
		description: "2014"
	},
	{
		key: "2013",
		description: "2013"
	},
	{
		key: "2012",
		description: "2012"
	},
	{
		key: "2011",
		description: "2011"
	},
	{
		key: "2010",
		description: "2010"
	},
	{
		key: "2009",
		description: "2009"
	}
]

class NovoSimulado3 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Seleção de Conteúdo')
        props.getHabilidades()
        props.getConteudos()
        props.getAreasDeConhecimento()
    }

    state = {
        buttonLoadingBuscar: false,
        questoes: null,
        quantidadeQuestoesSelecionadas: 'Questões'
    }

    componentWillReceiveProps(props) {
        if(props.simulado.questoes && props.simulado.questoes.length > 0){
            this.setState({
                quantidadeQuestoesSelecionadas: 'Questoes | Selecionadas ('+props.simulado.questoes.length+')'
            })
        }
    }

    handleSearchSubmit = (event) => {
        this.setState({buttonLoadingBuscar: true})
        event.preventDefault()
        var request = null
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('values', values)
            if(!err){
                var codigo = null
                var habilidades = []
                var conteudos = []
                var areasDeConhecimento = []
                var padraoEnade = null
                var anos = []
                var fonte = null
                var discursiva = null
                var tipo = null

                codigo = values.codigo ? values.codigo : ''
                if(values.habilidades){
                    habilidades = values.habilidades.map(habilidade =>{
                        return({id: parseInt(habilidade)})
                    })
                }
                if(values.conteudos){
                    conteudos = values.conteudos.map(conteudo =>{
                        return({id: parseInt(conteudo)})
                    })
                }
                if(values.areasDeConhecimento){
                    areasDeConhecimento = values.areasDeConhecimento.map(areaDeConhecimento =>{
                        return({id: parseInt(areaDeConhecimento)})
                    })
                }

                if(values.padraoEnade)
                    padraoEnade = values.padraoEnade
                else
                    padraoEnade = ''

                if(values.anos){
                    anos = values.anos.map(ano =>{
                        return({ano: ano})
                    })
                }
                fonte = values.fonte ? values.fonte : ''
                
                if(values.discursiva)
                    discursiva = values.discursiva
                else
                    discursiva = ''
                
                if(values.tipo)
                    tipo = parseInt(values.tipo)
                else
                    tipo = 0
                
                request = {
                    codigo: codigo,
                    enade: padraoEnade,
                    discursiva: discursiva,
                    fonte: fonte,
                    habilidades: habilidades,
                    conteudos: conteudos,
                    areaConhecimentos: areasDeConhecimento,
                    anos: anos,
                    tipo: {
                        id: tipo
                    }
                }

                console.log('request', request)
        
                axios.post('http://localhost:5000/api/getQuestoesSimulado', request)
                .then(res => {
                    console.log('response', res.data)
                    this.setState({questoes: res.data, buttonLoadingBuscar: false})
                })
                .catch(error =>{
                    console.log(error)
                })
            }
            else{
                console.log('erro', err)
                this.setState({buttonLoadingBuscar: false})
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form
        return(
            <React.Fragment>
                <SimuladoSteps step={2} />
                <Row type="flex">
                    <Col span={8}>
                        <Card
                            title="Filtros"
                            bordered={false}
                            style={{
                                margin: "4px 4px 4px 16px",
                                padding: 24,
                                background: "#fff",
                                maxHeight: '100%'
                            }}
                        >
                            <Form layout="vertical" onSubmit={this.handleSearchSubmit}>
                                <FormItem label="Código">
                                    {getFieldDecorator('codigo')(
                                        <Input placeholder="Informe o código da questão" />
                                    )}
                                </FormItem>
                                <FormItem label="Habilidades">
                                    {getFieldDecorator('habilidades')(
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione as Habilidades"
                                        >
                                            {
                                                this.props.habilidades.map((item) => {
                                                    return (<Option key={item.id}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="Conteúdos">
                                    {getFieldDecorator('conteudos')(
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione os Conteúdos"
                                        >
                                            {
                                                this.props.conteudos.map((item) => {
                                                    return (<Option key={item.id}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="Áreas de Conhecimento">
                                    {getFieldDecorator('areasDeConhecimento')(
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione as Áreas de Conhecimento"
                                        >
                                            {
                                                this.props.areasDeConhecimento.map((item) => {
                                                    return (<Option key={item.id}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="Padrão ENADE">
                                    {getFieldDecorator('padraoEnade')(
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Padrão ENADE"
                                            allowClear={true}
                                        >
                                            {
                                                simNaoOptions.map((item) => {
                                                    return (<Option key={item.key}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="Anos">
                                    {getFieldDecorator('anos')(
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Anos"
                                        >
                                            {
                                                anoOptions.map((item) => {
                                                    return (<Option key={item.key}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="Fonte">
                                    {getFieldDecorator('fonte')(
                                        <Input placeholder="Fonte"/>
                                    )}
                                </FormItem>
                                <FormItem label="Discursiva">
                                    {getFieldDecorator('discursiva')(
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Discursiva"
                                            allowClear={true}
                                        >
                                            {
                                                simNaoOptions.map((item) => {
                                                    return (<Option key={item.key}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="Tipo">
                                    {getFieldDecorator('tipo')(
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="tipo"
                                            allowClear={true}
                                        >
                                            {
                                                tipoOptions.map((item) => {
                                                    return (<Option key={item.key}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={this.state.buttonLoadingBuscar}
                                    >
                                        <Icon type="search" />Buscar
                                    </Button>
                                </FormItem>
                            </Form>
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
                            <SelecaoQuestoes questoes={this.state.questoes} mode='edit' />
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Content
                            style={{
                                margin: "4px 16px",
                                padding: 24,
                                background: "#fff",
                                minHeight: 60
                            }}
                        >
                        
                            <Row>
                                <Col span={12} align="start">
                                    <Link to="/admin/simulados/novo/step-2"><Button type="default"><Icon type="left" />Anterior</Button></Link>
                                </Col>
                                <Col span={12} align="end">
                                    <Link to="/admin/simulados/novo/step-4"><Button type="primary">Próximo<Icon type="right" /></Button></Link>
                                </Col>
                            </Row>
                        </Content>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
		habilidades: state.habilidades,
		conteudos: state.conteudos,
		areasDeConhecimento: state.areasDeConhecimento,
        questoes: state.questoes,
        simulado: state.simulado,
        authHeaders: state.authHeaders

	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(Form.create()(NovoSimulado3)))