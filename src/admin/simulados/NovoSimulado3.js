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

const dificuldadeOptions = [
	{
		value: 'facil',
		label: 'Fácil'
	},
	{
		value: 'medio',
		label: "Médio"
    },
    {
		value: 'dificil',
		label: "Difícil"
    }
]

class NovoSimulado3 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Seleção de Conteúdo')
        props.getHabilidades()
        props.getConteudos()
        props.getAreasDeConhecimento()
        props.getFontes()
    }

    state = {
        buttonLoadingBuscar: false,
        questoes: null,
        mode: null,
        anoOptions: [],
        showWarning: false,
        btnProximoDisabled: true,
        countEspecifico: null,
        countGeral: null,
        countFacil: null,
        countMedio: null,
        countDificil: null,
        firstLoad: true,
        habilidadesOptions: [],
        conteudosOptions: []
    }

    getQuestoes = (request) => {
        this.setState({buttonLoadingBuscar: true, btnProximoDisabled: true})
        axios.post(this.props.backEndPoint+'/api/getQuestoesSimulado/simulado', request)
        .then(res => {
            var questoes = []
            var labelStatus = null
            questoes = res.data
            this.setState({questoes, buttonLoadingBuscar: false, btnProximoDisabled: false})

            var tempArray = questoes.map(questao => {
                labelStatus = questao.status === true ? 'Ativo' : 'Inativo'

                return ({
                    key: questao.id,
                    description: questao.descricao,
                    labelStatus: labelStatus,
                    valueStatus: questao.status,
                    valueEnade: questao.enade,
                    valueDiscursiva: questao.discursiva,
                    valueAno: questao.ano,
                    ano: questao.ano,
                    habilidade: questao.habilidade.description,
                    habilidadeId: questao.habilidade.id,
                    conteudo: questao.conteudo.description,
                    conteudoId: questao.conteudo.id,
                    areaConhecimento: questao.areaConhecimento.description,
                    areaConhecimentoId: questao.areaConhecimento.id,
                    fonte: questao.fonte.description,
                    fonteId: questao.fonte.id,
                    dificuldade: questao.dificuldade,
                    imagem: questao.imagem,
                    tipoId: questao.tipo.id
                })
            })
            this.props.setQuestoes(tempArray)

            if(this.state.firstLoad){
                var countEspecifico = 0
                var countGeral = 0
                var countFacil = 0
                var countMedio = 0
                var countDificil = 0

                tempArray.filter(questao =>{
                    if(this.props.simulado.questoes.indexOf(questao.key) > -1)
                        return true
                    else{
                        return false
                    }
                })
                .forEach(questao => {
                    if(questao.tipoId === 1) countGeral++
                    else countEspecifico++
                    if(questao.dificuldade === 'facil') countFacil++
                    else if(questao.dificuldade === 'medio') countMedio++
                    else if(questao.dificuldade === 'dificil') countDificil++
                })
                this.setState({
                    countEspecifico,
                    countGeral,
                    countFacil,
                    countMedio,
                    countDificil,
                    firstLoad: false
                })
            }
        })
        .catch(error =>{
            console.log(error)
        })
    }

    updateQuestionCounter = (questao, op) => {
        var countEspecifico = this.state.countEspecifico
        var countGeral = this.state.countGeral
        var countFacil = this.state.countFacil
        var countMedio = this.state.countMedio
        var countDificil = this.state.countDificil
        if(op === 'add'){
            if(questao.tipo.id === 1) countGeral++
            else if(questao.tipo.id === 2) countEspecifico++

            if(questao.dificuldade === 'facil') countFacil++
            else if(questao.dificuldade === 'medio') countMedio++
            else if(questao.dificuldade === 'dificil') countDificil++
        }
        else{
            if(questao.tipo.id === 1) countGeral--
            else if(questao.tipo.id === 2) countEspecifico--

            if(questao.dificuldade === 'facil') countFacil--
            else if(questao.dificuldade === 'medio') countMedio--
            else if(questao.dificuldade === 'dificil') countDificil--
        }

        this.setState({
            countEspecifico,
            countGeral,
            countFacil,
            countMedio,
            countDificil
        })
    }

    changeAreaDeConhecimento = (values) => {
		this.props.form.setFieldsValue({
            habilidades: [],
            conteudos: []
		})

		var request = values.map(value => {
			return(
				{id: value}
			)
		})

		axios.post(this.props.backEndPoint+'/api/getHabilidades/areas', request)
		.then(res => {
			this.setState({
				habilidadesOptions: res.data.map(habilidade => {
					return({
						id: habilidade.id,
						description: habilidade.description
					})
				})
			})
		})
		.catch(error =>{
			console.log(error)
		})

		axios.post(this.props.backEndPoint+'/api/getConteudos/areas', request)
		.then(res => {
			this.setState({
				conteudosOptions: res.data.map(conteudo => {
					return({
						id: conteudo.id,
						description: conteudo.description
					})
				})
			})
		})
		.catch(error =>{
			console.log(error)
		})
	}

    componentWillMount(){
        if(this.props.mainData === null || (this.props.contexto !== 'COORDENADOR' && this.props.contexto !== 'PROFESSOR')){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }

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
                content: '',
                discursiva: '',
                dificuldade: '',
                fonte: [],
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
                var dificuldade = null
                var habilidades = []
                var conteudos = []
                var areasDeConhecimento = []
                //var padraoEnade = null
                var anos = []
                var fontes = []
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
                if(values.fontes){
                    fontes = values.fontes.map(fonte =>{
                        return({id: parseInt(fonte)})
                    })
                }

                if(values.dificuldade)
                    dificuldade = values.dificuldade
                else
                    dificuldade = ''

                if(values.anos){
                    anos = values.anos.map(ano =>{
                        return({ano: ano})
                    })
                }
                
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
                    enade: '',
                    content: '',
                    dificuldade: dificuldade,
                    discursiva: discursiva,
                    fonte: fontes,
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
            this.props.history.push('/app-prova/admin/simulados/novo/step-4')
    }

    render(){
        const { getFieldDecorator } = this.props.form

        var questaoQuantidades = this.props.simulado.questoes.length > 0 ? 
        <React.Fragment>
            <p>Questões Selecionadas ({this.props.simulado.questoes.length})</p>
            <p>Conhecimento: Geral ({this.state.countGeral}) | Específico ({this.state.countEspecifico})</p>
            <p>Dificuldade: Fácil ({this.state.countFacil}) | Médio ({this.state.countMedio}) | Difícil ({this.state.countDificil})</p>
        </React.Fragment>
        : 'Questões'

            
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
                                <FormItem label="Áreas de Conhecimento">
                                    {getFieldDecorator('areasDeConhecimento')(
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione as Áreas de Conhecimento"
                                            onChange={this.changeAreaDeConhecimento}
                                        >
                                            {
                                                this.props.areasDeConhecimento.map((item) => {
                                                    return (<Option key={item.id}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
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
                                                this.state.habilidadesOptions.map((item) => {
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
                                                this.state.conteudosOptions.map((item) => {
                                                    return (<Option key={item.id}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem label="Dificuldade">
                                    {getFieldDecorator('dificuldade')(
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Selecione a dificuldade"
                                            allowClear={true}
                                        >
                                            {
                                                dificuldadeOptions.map((item) => {
                                                    return (<Option key={item.value} value={item.value}>{item.label}</Option>)
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
                                <FormItem label="Fontes">
                                    {getFieldDecorator('fontes')(
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione"
                                            allowClear={true}
                                        >
                                            {
                                                this.props.fontes.map((item) => {
                                                    return (<Option key={item.id}>{item.description}</Option>)
                                                })
                                            }
                                        </Select>
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
                            title={questaoQuantidades}
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
                            <SelecaoQuestoes questoes={this.state.questoes} mode='edit' updateQuestionCounter={this.updateQuestionCounter} />
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
                                    <Link to="/app-prova/admin/simulados/novo/step-2"><Button type="default"><Icon type="left" />Anterior</Button></Link>
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
        backEndPoint: state.backEndPoint,
        mainData: state.mainData,
        contexto: state.contexto,
		habilidades: state.habilidades,
		conteudos: state.conteudos,
        areasDeConhecimento: state.areasDeConhecimento,
        fontes: state.fontes,
        questoes: state.questoes,
        simulado: state.simulado,
        selectedQuestoes: state.selectedQuestoes
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) },
        setQuestoes: (questoes) => { dispatch({ type: 'SET_QUESTOES', questoes }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(Form.create()(withRouter(NovoSimulado3))))