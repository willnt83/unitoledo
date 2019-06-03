import React, { Component } from "react"
import { Layout, Icon, Form, Button, Row, Col, Select} from "antd"
import { connect } from 'react-redux'
import axios from "axios"
import { withRouter } from "react-router-dom"

const { Content } = Layout
const Option = Select.Option

const tiposOptions = [
	{
		id: 1,
		description: "Formação Geral"
	},
	{
		id: 2,
		description: "Conhecimento Específico"
	}
]

class PercentualDeAcertos extends Component {
	constructor(props) {
        super()
		props.setPageTitle('Relatório de Percentual de Acerto')
	}

	state = {
		simuladosOptions: [],
		reportUrl: null,
		buttonLoading: false
	}

	getSimulados = () => {
		var cursos = this.props.mainData.cursos.map(curso => {
            return({
                id: curso.id,
                nome: curso.nome,
                idPeriodoLetivo: this.props.periodoLetivo
            })
        })
        var turmas = this.props.mainData.turmas
        .map(turma => {
            return({
                id: turma.id,
                nome: turma.nome,
                idPeriodoLetivo: turma.idPeriodoLetivo,
                idCurso: turma.idCurso
            })
        })

        var disciplinas = this.props.mainData.disciplinas
        .map(disciplina => {
            return({
                id: disciplina.id,
                nome: disciplina.nome,
                idPeriodoLetivo: disciplina.idPeriodoLetivo,
                idTurma: disciplina.idTurma
            })
        })

        var request = {
            cursos: cursos,
            turmas: turmas,
            disciplinas: disciplinas
		}
		
		axios.post(this.props.backEndPoint+'/api/getAllSimulado', request)
        .then(res => {
			this.setState({
				simuladosOptions: res.data.map(simulado => {
					return({
						id: simulado.id,
						description: simulado.nome
					})
				})
			})
        })
        .catch(error =>{
            console.log('error: ', error)
        })
	}

	gerarRelatorio = () => {
		this.props.form.validateFieldsAndScroll((err, values) => {
			if(!err){
				this.setState({
					buttonLoading: false,
					reportUrl: this.props.backEndPoint+'/api/percentualDeAcerto/'+values.simulado+'/'+values.tipo
				})
			}
		})
	}

	change = () => {
		this.setState({
			reportUrl: null
		})
	}

	componentWillMount(){
		this.getSimulados()
	}

	render() {
		const { getFieldDecorator } = this.props.form
		const buttonReport = this.state.reportUrl === null ?
            <Button className="buttonGreen" onClick={this.gerarRelatorio} loading={this.state.buttonLoading}><Icon type="bar-chart" /> Gerar Relatório</Button>
            :
            <a href={this.state.reportUrl}><Button className="buttonOrange" onClick={this.resetButton}><Icon type="download" /> Baixar Relatório</Button></a>
		
		return (
			<Content
                style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: 280
                }}
            >
				<Row style={{ marginBottom: 16 }}>
					<Col span={24}>
						<h2>Filtros</h2>
					</Col>
				</Row>

				<Row>
					<Col span={24}>
						<Form layout="vertical">
							<Form.Item label="Simulados">
								{getFieldDecorator('simulado', {
									rules: [
										{
											required: true, message: 'Por favor selecione o simulado',
										}
									]
								})(
									<Select
										style={{ width: '100%' }}
										placeholder="Selecione o simulado"
										onChange={this.change}
									>
										{
											this.state.simuladosOptions.map((item) => {
												return (<Option key={item.id}>{item.description}</Option>)
											})
										}
									</Select>
								)}
							</Form.Item>
							<Form.Item label="Tipo">
								{getFieldDecorator('tipo', {
									rules: [
										{
											required: true, message: 'Por favor selecione o tipo',
										}
									]
								})(
									<Select
										style={{ width: '100%' }}
										placeholder="Selecione o tipo"
										onChange={this.change}
									>
										{
											tiposOptions.map((item) => {
												return (<Option key={item.id}>{item.description}</Option>)
											})
										}
									</Select>
								)}
							</Form.Item>
							{buttonReport}
						</Form>
					</Col>
				</Row>

			</Content>
		)
	}
}

const MapStateToProps = (state) => {
	return {
		backEndPoint: state.backEndPoint,
		mainData: state.mainData,
		periodoLetivo: state.periodoLetivo
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
		setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PercentualDeAcertos)))