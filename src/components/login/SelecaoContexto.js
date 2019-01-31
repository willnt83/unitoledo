import React, { Component } from 'react'
import { Layout, Row, Col, Form, Icon, Button, Card, Select,  } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import axios from 'axios'

const { Content } = Layout;
const Option = Select.Option;

class ContextoSelection extends Component {
	state =  {
		enviarButtonLoading: false,
		periodos:[],
		showPeriodosSelect: 'none',
		showEnviarButton: 'none',
		contexto: null,
		periodo: null,
		contextoData: null
	}

	handleSelectContextoChange = (value) => {
		this.setState({contexto: value})
		if(value === 'COORDENADOR'){
			var selectedContexto = null

			this.props.userInfos.forEach(userInfo => {
				if(userInfo.tipo === value)
					selectedContexto = userInfo.contextos[0]
			})
			this.setState({contextoData: selectedContexto})

			var config = {
				headers: {
					'Authorization': this.props.authHeaders.authorization,
					'CookieZ': this.props.authHeaders.cookie
				}
			}

			axios.post('http://localhost:5000/api/getPeriodo', selectedContexto, config)
			.then(res => {
				var periodos = res.data.periodos.map((item) => {
					return ({
						key: item.id,
						description: item.descricao
					})
				})

				this.setState({
					periodos: periodos,
					showPeriodosSelect: 'block'
				})
			})
			.catch(error =>{
				console.log(error)
			})
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
				showPeriodosSelect: 'block'
			})
		}
	}

	handleSelectPeriodoChange = (value) => {
		if(this.state.contexto === 'PROFESSOR'){
			// Identificando o contexto do tipo e periodo
			this.props.userInfos.forEach(userInfo => {
				if(userInfo.tipo === this.state.contexto){
					userInfo.contextos.forEach(contexto => {
						if(contexto.idPeriodoLetivo === parseInt(value)){
							this.setState({contextoData: contexto})
						}
					})
				}
			})
		}

		this.setState({
			periodo: value,
			showEnviarButton: 'block'
		})
	}

	handleContextoSubmit = (event) => {
		event.preventDefault();
		this.setState({ enviarButtonLoading : true})

		var config = {
			headers: {
				'Authorization': this.props.authHeaders.authorization,
				'CookieZ': this.props.authHeaders.cookie
			}
		}

		var requestData = null

		if(this.state.contexto === 'COORDENADOR'){
			requestData = {
				...this.state.contextoData,
				idPeriodoLetivo: this.state.periodo
			}
		}
		else{
			requestData = this.state.contextoData
		}

		axios.post('http://localhost:5000/api/getData', requestData, config)
		.then(res => {
			this.props.setMainData(res.data)

			if(this.state.periodo)
				this.props.setPeriodoLetivo(this.state.periodo)

			if(this.state.contexto === 'ALUNO'){
				this.props.history.push('/alunos')
			}
			else{
				this.props.history.push('/admin')
			}
			
		})
		.catch(error =>{
			console.log(error)
		})
	}

	render () {
		const { getFieldDecorator } = this.props.form;
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
													return (<Option key={item.description}>{item.description}</Option>)
												})
											}
										</Select>
									)}
								</Form.Item>
								<Form.Item style={{display: this.state.showPeriodosSelect}}>
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
		authHeaders: state.authHeaders
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
		setMainData: (mainData) => { dispatch({ type: 'SET_MAINDATA', mainData }) },
		setPeriodoLetivo: (periodo) => { dispatch({ type: 'SET_PERIODOLETIVO', periodo }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Form.create()(ContextoSelection)))