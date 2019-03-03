import React, { Component } from "react"
import { Layout, Row, Col, Button, Form, Input, Card, Select, Icon } from "antd"
import { Link, withRouter } from "react-router-dom"
import axios from "axios"
import { connect } from 'react-redux'
import moment from 'moment'
import SimuladoSteps from './SimuladoSteps'
import SelecaoQuestoes from './SelecaoQuestoes'
import WarningMessage from './WarningMessage'
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
        quantidadeQuestoesSelecionadas: 'Questões',
        mode: null,
        anoOptions: [],
        showWarning: false,
        btnProximoDisabled: true
    }

    getQuestoes = (request) => {
        this.setState({buttonLoadingBuscar: true, btnProximoDisabled: true})
        axios.post('http://localhost:5000/api/getQuestoesSimulado/simulado', request)
        .then(res => {
            var questoes = []
            /*
            if(this.state.mode === 'edit'){
                console.log('edit...')
                questoes = res.data.filter(questao => {
                    var hit = false
                    this.props.simulado.questoes.forEach(questaoSelecionada => {
                        if(questao.id === questaoSelecionada)
                            hit = true
                    })
                    return hit
                })
            }
            // Criação
            else{
            */
                questoes = res.data
            //}
            this.setState({questoes, buttonLoadingBuscar: false, btnProximoDisabled: false})
        })
        .catch(error =>{
            console.log(error)
        })
    }

    componentWillReceiveProps(props) {
        if(props.simulado.questoes && props.simulado.questoes.length > 0){
            this.setState({
                quantidadeQuestoesSelecionadas: 'Questoes | Selecionadas ('+props.simulado.questoes.length+')'
            })
        }
    }

    componentWillMount(){
        // Construindo opções de seleção do campo Ano
        var currDate = moment()
        var anoOptions = []
        var i = 0
        while(i < 10){
            anoOptions.push({
                key: i,
                value: currDate.format('YYYY'),
                description: currDate.format('YYYY')
                
            })
            currDate = currDate.subtract(1, 'years')
            i++
        }
        this.setState({anoOptions})


        // Se for edição e existir questões selecionadas
        if(this.props.simulado.questoes.length > 0){
            //this.setState({mode: 'edit'})

            var request = {
                codigos: this.props.simulado.questoes,
                enade: '',
                discursiva: '',
                fonte: '',
                habilidades: [],
                conteudos: [],
                areaConhecimentos: [],
                anos: [],
                tipo: {
                    id: 0
                }
            }
            this.getQuestoes(request)
        }
    }

    handleSearchSubmit = (event) => {
        event.preventDefault()
        var request = null
        this.props.form.validateFieldsAndScroll((err, values) => {
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

                codigo = values.codigo ? [values.codigo] : []
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
                    codigos: codigo,
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
                this.getQuestoes(request)
            }
            else{
                console.log('erro', err)
                this.setState({buttonLoadingBuscar: false})
            }
        })
    }

    handleProximoButton = () => {
        if(this.props.simulado.questoes.length === 0){
            this.setState({showWarning: true})
        }
        else
            this.props.history.push('/admin/simulados/novo/step-4')
    }

    render(){
        const { getFieldDecorator } = this.props.form
        return(
            <React.Fragment>
                <SimuladoSteps step={2} />
                <Row type="flex" style={{display: 'flex'}}>
                    <Col span={8}>
                        <Card
                            title="Filtros"
                            bordered={false}
                            style={{
                                margin: "4px 4px 4px 16px",
                                padding: 24,
                                background: "#fff",
                                maxHeight: '1053px'
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
                                                this.state.anoOptions.map((item) => {
                                                    return (<Option key={item.key} value={item.value}>{item.description}</Option>)
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
                                height: '1053px',
                                overflowY: 'scroll'
                            }}
                        >
                            <WarningMessage message="Nenhuma questão selecionada" type="error" visible={this.state.showWarning} style={{marginBottom: 10}}/>
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
                                    <Button type="primary" onClick={this.handleProximoButton} disabled={this.state.btnProximoDisabled}>Próximo<Icon type="right" /></Button>
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
        authHeaders: state.authHeaders,
        selectedQuestoes: state.selectedQuestoes

	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(Form.create()(withRouter(NovoSimulado3))))