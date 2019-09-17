import React, { Component } from 'react'
import { Layout, Row, Col, Form, Icon, Button, Card, Select,  } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import axios from 'axios'

const { Content } = Layout
const Option = Select.Option

class ContextoSelection extends Component {
	state =  {
		enviarButtonLoading: false,
		periodos:[],
		showPeriodosSelect: 'none',
		showEnviarButton: 'none',
		contexto: null,
		periodo: null,
		contextoData: null,
		hasPeriodo: false
	}

	handleSelectContextoChange = (value) => {
		this.setState({
			contexto: value,
			hasPeriodo: false
		})
		if(value === 'COORDENADOR'){
			var selectedContexto = null

			this.props.userInfos.forEach(userInfo => {
				if(userInfo.tipo === value)
					selectedContexto = userInfo.contextos[0]
			})
			this.setState({contextoData: selectedContexto})

			axios.post(this.props.backEndPoint+'/api/getPeriodo', selectedContexto)
			.then(res => {
				var periodos = res.data.periodos.map((item) => {
					return ({
						key: item.id,
						description: item.descricao
					})
				})

				periodos = periodos.reverse()

				this.setState({
					periodos: periodos,
					hasPeriodo: true
				})
			})
			.catch(error =>{
				console.log(error)
			})
		}
		else if(value === 'APPPROVA - ADMIN' || value === 'PERSONIFICAÇÃO'){
			this.setState({showEnviarButton: 'block'})
		}
		else{
			var periodos = []
			this.props.userInfos.forEach(userInfo => {
				if(userInfo.tipo === value){
					userInfo.contextos.forEach(contexto => {
						periodos.push({
							key: contexto.idPeriodoLetivo,
							description: contexto.descricao
						})
					})
				}
			})

			this.setState({
				periodos: periodos,
				hasPeriodo: true
			})
		}
	}

	handleSelectPeriodoChange = (value) => {
		if(this.state.contexto === 'PROFESSOR' || this.state.contexto === 'ALUNO'){
			// Identificando o contexto do tipo e periodo
			this.props.userInfos.forEach(userInfo => {
				if(userInfo.tipo === this.state.contexto){
					userInfo.contextos.forEach(contexto => {
						if(contexto.idPeriodoLetivo === parseInt(value)){
							this.props.setContextoAluno(contexto)
							this.setState({contextoData: contexto})
							this.props.setPeriodoLetivoDescricao(contexto.descricao)
						}
					})
				}
			})
		}
		else{
			var periodoDescricao = this.state.periodos
			.filter(periodo => {
				return(periodo.key === parseInt(value))
			})
			.map(periodo => {
				return(periodo.description)
			})
			this.props.setPeriodoLetivoDescricao(periodoDescricao)
		}
		this.setState({
			periodo: value,
			showEnviarButton: 'block'
		})
	}

	handleContextoSubmit = (event) => {
		event.preventDefault()
		this.setState({ enviarButtonLoading : true})

		var requestData = null
		if(this.state.contexto === 'APPPROVA - ADMIN'){
			this.props.setMainData({user: 'APPProva - Admin'})
			this.props.setContexto(this.state.contexto)
			this.props.history.push('/app-prova/admin')
		}
		else if(this.state.contexto === 'PERSONIFICAÇÃO'){
			this.props.showModal(true)
			this.setState({enviarButtonLoading: false})
		}
		else{
			if(this.state.contexto === 'COORDENADOR'){
				requestData = {
					...this.state.contextoData,
					idPeriodoLetivo: this.state.periodo
				}
			}
			else{
				requestData = this.state.contextoData
			}
	
			axios.post(this.props.backEndPoint+'/api/getData', requestData)
			.then(res => {
				this.props.setMainData(res.data)
				if(this.state.periodo)
					this.props.setPeriodoLetivo(parseInt(this.state.periodo))
	
				this.props.setContexto(this.state.contexto)
	
				if(this.state.contexto === 'ALUNO'){
					this.props.history.push('/app-prova/alunos')
				}
				else{
					// Acesso ao admin
					// Se for admin app prova
						// tratar a lista de acesso para gerar o menu
	
					// senao se for professor ou coordenador
					this.props.history.push('/app-prova/admin')
				}
				
			})
			.catch(error =>{
				console.log(error)
			})
		}
	}

	componentWillUpdate(nextProps, nextState){
		if(nextProps.clearContexto && !this.props.clearContexto){
			this.props.setClearContexto(false)
			this.props.form.setFieldsValue({
				contexto: ''
			})
		}
	}

	render () {
		const { getFieldDecorator } = this.props.form
		return (
			<Content
				id="mainContent"
				style={{
					padding: "50px 24px 0 24px",
					background: "#fff"
				}}
			>
				<Row>
					<Col span={24} align="center">
						<Card
							style={{ width: 400, minHeight: 461, marginTop: 50 }}
						>
							
							<Row style={{marginTop: 20, paddingBottom: 20}}>
								<Col span={24} align="center">
									<h1>UNITOLEDO</h1>
									<h4>Sistema Online de Simulados</h4>
								</Col>
							</Row>
							<Row style={{paddingBottom: 20}}>
								<Col span={24} align="center" style={{color: 'red', fontSize: 40}}>
									<Icon type="lock" />
								</Col>
							</Row>
							<Form onSubmit={this.handleContextoSubmit} className="contexto-form">
								<Form.Item>
									{getFieldDecorator('contexto', {
										rules: [
											{
												required: true, message: 'Por favor selecione o contexto',
											}
										]
									})(
										<Select
											name="contexto"
											style={{ width: '100%' }}
											placeholder="Selecione o contexto"
											onChange={this.handleSelectContextoChange}
										>
											{
												this.props.contextos.map((item) => {
													return (<Option key={item.value} value={item.description}>{item.description}</Option>)
												})
											}
										</Select>
									)}
								</Form.Item>
								{
									this.state.hasPeriodo ?
										<Form.Item>
											<Select
												name="periodo"
												style={{ width: '100%' }}
												placeholder="Selecione o período"
												onChange={this.handleSelectPeriodoChange}
											>
												{
													this.state.periodos.map((item) => {
														return (<Option key={item.key}>{item.description}</Option>)
													})
												}
											</Select>
										</Form.Item>
										:
										null

								}

								<Form.Item style={{padding: 10}}>
									<Button
										type="primary"
										htmlType="submit"
										className="group-form-button"
										loading={this.state.enviarButtonLoading}
										style={{display: this.state.showEnviarButton}}
									>Enviar</Button>
								</Form.Item>
							</Form>
						</Card>
					</Col>
				</Row>
			</Content>
		)
	}
}

const MapStateToProps = (state) => {
	return {
		backEndPoint: state.backEndPoint,
		authHeaders: state.authHeaders
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
			setContexto: (contexto) => { dispatch({ type: 'SET_CONTEXTO', contexto }) },
			setMainData: (mainData) => { dispatch({ type: 'SET_MAINDATA', mainData }) },
			setPeriodoLetivo: (periodo) => { dispatch({ type: 'SET_PERIODOLETIVO', periodo }) },
			setContextoAluno: (contexto) => { dispatch({ type: 'SET_CONTEXTOALUNO', contexto }) },
			setPeriodoLetivoDescricao: (periodoDescricao) => { dispatch({ type: 'SET_PERIODOLETIVODESCRICAO', periodoDescricao }) },
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Form.create()(ContextoSelection)))