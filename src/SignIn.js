import React, { Component } from 'react'
import { Layout, Card, Row, Col, Form, Icon, Input, Select, Button, Modal } from 'antd'
import axios from 'axios'
//import AdminIndex from './admin/AdminIndex'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"

const { Content } = Layout;
const Option = Select.Option;

class SignIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 1,
			invalidLogin: null,
			grupos: [],
			entrarButtonLoading: false,
			enviarButtonLoading: false,
			buscarButtonLoading: false,
			buscarUsuarioLoading: false,
			responseUserLogin: null,
			showModalBuscarUsuarios: false
		};
	}

	handleLoginSubmit = (event) => {
		event.preventDefault();

		this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
				this.setState({ entrarButtonLoading: true })
				/*
				usuario: values.userName,
				senha: values.password
				*/

				axios.post(`http://localhost:5000/api/login/user`, {
					usuario: 'appprova',
					senha: 'qw90PO@!'
				})
				.then(res => {
					console.log('cookie', res.headers['cookie'])
					console.log('Token', res.headers['access-token'])
					console.log('loginUser data', res.data)
					
					if(res.headers['access-token'])
						this.props.setToken(res.headers['access-token'])
					if(res.headers['cookie'])
						this.props.setCookie(res.headers['cookie'])

					if(res.data){
						var hit = false
						res.data.privilegios.forEach(privilegio => {
							if(privilegio === 'personificacao')
								hit = true
						})
						
						if(hit) {
							// Usuário possui privilégio de personificação
							this.showModal(true)
						}
						else
							this.setState({ step: 2 })
						/*
						this.setState({
							responseLogin: res.data.grupos
						})
						var grupos = []
						var i = 0
						res.data.grupos.forEach((grupo) => {
							grupos.push({
								key: i,
								description: grupo.tipo
							})
							i++
						})
						this.setState({
							grupos: grupos,
							step: 2
						})
						//this.props.history.push('/alunos')
						*/
					}
					else
						console.log('login invalido')
					this.setState({
						entrarButtonLoading: false
					})

				})
				.catch(error =>{
					console.log(error)
					this.setState({
						entrarButtonLoading: false
					})
				})
            }
        })
	}

	handleSearchUserSubmit = (event) => {
		event.preventDefault();
		console.log('handleSearchUserSubmit')
		this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
				var data = {
					params: {
						user: 'joao'
					}
				}
				
				axios.defaults.headers = {
					'Authorization': this.props.token,
						'CookieZ': this.props.cookie
				}
				
				axios.get(`http://localhost:5000/api/getUser`, data)
				.then(res => {
					console.log('loginContexto response:', res)
				})
				.catch(error =>{
					console.log('Error:', error)
				})
			}
		})
	}

	handleGrupoSubmit = (event) => {
		event.preventDefault();
		this.setState({ enviarButtonLoading : true})
		this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
				var contexto = ''
				console.log('values', values.grupo)
				console.log('state responseLogin', this.state.responseLogin)
				this.state.responseLogin.forEach(grupo => {
					if(grupo.tipo === values.grupo){
						if(grupo.contextos.length > 1){
							contexto = grupo.contextos[(grupo.contextos.length - 1)]
						}
						else{
							contexto = grupo.contextos[0]
						}
					}
				})

				var config = {
					headers: {
						'Authorization': this.props.token,
						'CookieZ': this.props.cookie
					}
				}

				axios.post(`http://localhost:5000/api/contexto`, contexto, config)
				.then(res => {
					console.log('response contexto', res.data)
					this.setState({ enviarButtonLoading : false})
				})
				.catch(error =>{
					console.log(error)
					this.setState({ enviarButtonLoading : false})
				})
			}
        })
	}

	showModal = (showModal) => {
		this.setState({ showModalBuscarUsuarios: showModal });
    };

	handleModalOk = () => {
        this.showModal(false);
    }

    handleModalCancel = () => {
        this.showModal(false);
    }

	componentWillUpdate(nextProps, nextState) {
		if(this.state.grupos.length !== nextState.grupos.length && nextState.grupos.length > 0){
			this.setState({
				displayGruposSelect: 'block'
			})
		}
	}
	
	render () {
		const { getFieldDecorator } = this.props.form;
		if(this.state.step === 1) {
			return (
				<React.Fragment>
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
									<Form onSubmit={this.handleLoginSubmit} className="login-form">
										<Form.Item>
											{getFieldDecorator('userName', {
												rules: [{ required: true, message: 'Informe o usuário' }],
											})(
												<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Usuário" />
											)}
										</Form.Item>
										<Form.Item>
										{getFieldDecorator('password', {
											rules: [{ required: true, message: 'Informe a senha' }],
										})(
											<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Senha" />
										)}
										</Form.Item>
										<Form.Item style={{padding: 10}}>
											<Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.entrarButtonLoading}>Entrar</Button>
										</Form.Item>
									</Form>
								</Card>
							</Col>
						</Row>
					</Content>
					<Modal
						title="Selecionar usuário"
						visible={this.state.showModalBuscarUsuarios}
						onCancel={() => this.showModal(false)}
						footer={[
							<Button key="back" onClick={() => this.showModal(false)}><Icon type="close" />Cancelar</Button>,
							<Button key="submit" className="buttonGreen" onClick={() => this.showModal(false)}><Icon type="check" />Selecionar</Button>
						]}
					>
						<Form layout="vertical" onSubmit={this.handleSearchUserSubmit}>
							<Row>
								<Col span={18}>
									<Form.Item>
										<Input
											id="usuário"
											placeholder="Buscar usuário"
											onChange={this.handleInput}
										/>
									</Form.Item>
								</Col>
								<Col span={6} align="end">
									<Button type="primary" htmlType="submit" loading={this.state.buscarUsuarioLoading}><Icon type="search" />Buscar</Button>
								</Col>
							</Row>
						</Form>
					</Modal>
				</React.Fragment>
			)
		}
		else{
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
								<Form onSubmit={this.handleGrupoSubmit} className="grupo-form">
									<Form.Item>
										{getFieldDecorator('grupo', {
											rules: [
												{
													required: true, message: 'Por favor selecione o grupo',
												}
											]
										})(
											<Select
												style={{ width: '100%' }}
												placeholder="Selecione o Grupo"
											>
												{
													this.state.grupos.map((item) => {
														return (<Option key={item.description}>{item.description}</Option>)
													})
												}
											</Select>
										)}
									</Form.Item>
									<Form.Item style={{padding: 10}}>
										<Button type="primary" htmlType="submit" className="group-form-button" loading={this.state.enviarButtonLoading}>Enviar</Button>
									</Form.Item>
								</Form>
							</Card>
						</Col>
					</Row>
				</Content>
			)
		}
	}
}

const MapStateToProps = (state) => {
	return {
		logged: state.logged,
		token: state.token,
		cookie: state.cookie
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
		setLogged: (logged) => { dispatch({ type: 'SET_LOGGED', logged }) },
		setToken: (token) => { dispatch({ type: 'SET_TOKEN', token }) },
		setCookie: (cookie) => { dispatch({ type: 'SET_COOKIE', cookie }) },
		
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Form.create()(SignIn)))