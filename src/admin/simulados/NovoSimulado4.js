import React, { Component } from "react"
import { Layout, Row, Col, Button, Card, Form, Input, TimePicker, DatePicker, Icon, Modal } from "antd"
import { Link, withRouter } from "react-router-dom"
import axios from "axios"
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
        quantidadeQuestoesSelecionadas: 'Questões Selecionadas',
        dataFinalValidation: {
            validateStatus: 'success',
            help: ''
        },
        horaFinalValidation: {
            validateStatus: 'success',
            help: ''
        },
        buttonLoadingSalvar: false,
        questoes: null
    }

    getQuestoes = (request) => {
        this.setState({buttonLoadingBuscar: true, btnProximoDisabled: true})
        axios.post(this.props.backEndPoint+'/api/getQuestoesSimulado/simulado', request)
        .then(res => {
            var questoes = []
            questoes = res.data
            this.setState({questoes})
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

    componentWillReceiveProps(props) {
        if(props.simulado.questoes.length > 0){
            this.setState({
                quantidadeQuestoesSelecionadas: 'Questoes Selecionadas ('+props.simulado.questoes.length+')'
            })
        }
    }

    handleFinalizarButton = (mode) => {
        let rascunho = null
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                let dataInicial = values.dataInicial.format('YYYY-MM-DD')
                let horarioInicial = values.horarioInicial.format('HH:mm')
                let dateTimeInicial = moment(dataInicial + ' ' + horarioInicial, 'YYYY/MM/DD HH:mm')
                let dataFinal = values.dataFinal.format('YYYY-MM-DD')
                let horarioFinal = values.horarioFinal.format('HH:mm')
                let dateTimeFinal = moment(dataFinal + ' ' + horarioFinal, 'YYYY/MM/DD HH:mm')
                var error = false
                if(dateTimeFinal <= dateTimeInicial){
                    error = true
                    this.setState({
                        dataFinalValidation:{
                            validateStatus: 'error',
                            help: 'Data e Horário Final não podem ser menores ou iguais que Data e Horario Inicial'
                        },
                        horaFinalValidation:{
                            validateStatus: 'error',
                            help: 'Data e Horário Final não podem ser menores ou iguais que Data e Horario Inicial'
                        }
                    })
                }
                else{
                    this.setState({
                        dataFinalValidation:{
                            validateStatus: 'success',
                            help: ''
                        },
                        horaFinalValidation:{
                            validateStatus: 'success',
                            help: ''
                        }
                    })
                }
                
                if(!error){
                    this.props.setStartFinish({dateTimeInicial: dateTimeInicial.format(), dateTimeFinal: dateTimeFinal.format()})
                    this.setState({buttonLoadingSalvar: true})
                    rascunho = mode === 'rascunho' ? true : false
                    let questoes = this.props.simulado.questoes.map(questao => {
                        return(
                            {id: questao}
                        )
                    })

                    let cursos = this.props.simulado.alvos
                    .map(alvo => {
                        if(alvo.tipo === 'Curso'){
                            return({
                                id: alvo.key,
                                nome: alvo.name,
                                idPeriodoLetivo: this.props.periodoLetivo
                            })
                        }
                        else
                            return false
                    })
                    .filter(alvo => {
                        return(alvo) // retorna somente se existir alvo
                    })
                    let turmas = this.props.simulado.alvos
                    .map(alvo =>{
                        if(alvo.tipo === 'Turma'){
                            return({
                                id: alvo.key,
                                nome: alvo.name,
                                idPeriodoLetivo: this.props.periodoLetivo,
                                idCurso: alvo.parentKey
                            })
                        }
                        else return false
                    })
                    .filter(alvo => {
                        return(alvo) // retorna somente se existir alvo
                    })

                    let disciplinas = this.props.simulado.alvos.map(alvo =>{
                        if(alvo.tipo === 'Disciplina'){
                            return({
                                id: alvo.key,
                                nome: alvo.name,
                                idPeriodoLetivo: this.props.periodoLetivo,
                                idTurma: alvo.parentKey
                            })
                        }
                        else return false
                    })
                    .filter(alvo => {
                        return(alvo) // retorna somente se existir alvo
                    })

                    var request = {
                            id: this.props.simulado.id,
                            nome: this.props.simulado.nome,
                            rascunho: rascunho,
                            dataHoraInicial: dateTimeInicial.format(),
                            dataHoraFinal: dateTimeFinal.format(),
                            questoes: questoes,
                            cursos: cursos,
                            turmas: turmas,
                            disciplinas: disciplinas,
                            status: 'Pendente',
                            enade: this.props.simulado.enade,
                            content: this.props.simulado.content
                    }
                    console.log(request);
                    axios.post(this.props.backEndPoint+'/api/createUpdateSimulado', request)
                    .then(res => {
                        this.successModal(this.props)
                        this.setState({buttonLoadingSalvar: false})
                    })
                    .catch(error =>{
                        console.log('error: ', error)
                        this.setState({buttonLoadingSalvar: false})
                    })
                }
                else{
                    console.log(err)
                }
            }
            else{
                if(typeof(values.dataFinal) === 'undefined'){
                    this.setState({
                        dataFinalValidation:{
                            validateStatus: 'error',
                            help: 'Por favor informe a data final'
                        }
                    })
                }
                else{
                    this.setState({
                        dataFinalValidation:{
                            validateStatus: 'success',
                            help: ''
                        }
                    })
                }

                if(typeof(values.horaFinal) === 'undefined'){
                    this.setState({
                        horaFinalValidation:{
                            validateStatus: 'error',
                            help: 'Por favor informe a hora final'
                        }
                    })
                }
                else{
                    this.setState({
                        horaFinalValidation:{
                            validateStatus: 'success',
                            help: ''
                        }
                    })
                }
            }
        })
    }

    componentDidMount(){
        if(this.props.simulado.nome !== null && this.props.simulado.nome !== ''){
            this.props.form.setFieldsValue({
                nome: this.props.simulado.nome
            })
        }

        if(this.props.simulado.inicio.data !== null && this.props.simulado.inicio.data !== ''){
            this.props.form.setFieldsValue({
                dataInicial: moment(this.props.simulado.inicio.data, 'DD/MM/YYYY')
            })
        }


        if(this.props.simulado.inicio.hora !== null && this.props.simulado.inicio.hora !== ''){
            this.props.form.setFieldsValue({
                horarioInicial: moment(this.props.simulado.inicio.hora, 'HH:mm')
            })
        }

        if(this.props.simulado.fim.data !== null && this.props.simulado.fim.data !== ''){
            this.props.form.setFieldsValue({
                dataFinal: moment(this.props.simulado.fim.data, 'DD/MM/YYYY')
            })
        }

        if(this.props.simulado.fim.hora !== null && this.props.simulado.fim.hora !== ''){
            this.props.form.setFieldsValue({
                horarioFinal: moment(this.props.simulado.fim.hora, 'HH:mm')
            })
        }
    }

    successModal(props){
        Modal.success({
            title: 'Simulado salvo com sucesso',
            onOk() {
                props.resetSimulado()
                props.history.push('/app-prova/admin/simulados/')
            }
        })
    }

    render(){
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
                                    validateStatus={this.state.dataFinalValidation.validateStatus}
                                    help={this.state.dataFinalValidation.help}
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
                                    validateStatus={this.state.horaFinalValidation.validateStatus}
                                    help={this.state.horaFinalValidation.help}
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
                                {<SelecaoQuestoes questoes={this.state.questoes} mode='read' />}
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
                                        <Link to="/app-prova/admin/simulados/novo/step-3"><Button type="default"><Icon type="left" />Anterior</Button></Link>
                                    </Col>
                                    <Col span={12} align="end">
                                        <Button
                                            type="primary"
                                            onClick={() => this.handleFinalizarButton('rascunho')}
                                            loading={this.state.buttonLoadingSalvar}
                                        >
                                            <Icon type="save" />Salvar Como Rascunho
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
        backEndPoint: state.backEndPoint,
        mainData: state.mainData,
        contexto: state.contexto,
        simulado: state.simulado,
        questoes: state.questoes,
        selectedQuestoes: state.selectedQuestoes,
        periodoLetivo: state.periodoLetivo
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        resetSimulado: () => { dispatch({ type: 'RESET_SIMULADO' }) },
        setStartFinish: (startFinish) => { dispatch({ type: 'SET_SIMULADOSTARTFINISH', startFinish }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Form.create()(NovoSimulado4)))