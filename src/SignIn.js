import React, { Component } from 'react'
import { Layout, Card, Row, Col, Form, Icon, Input, Select, Button } from 'antd'
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
			usuario: '',
			senha: '',
			grupos: [],
			entrarButtonLoading: false,
			enviarButtonLoading: false
		};
	}

	/*
	handleChange(event) {
		const target = event.target;
		const name = target.name;
		const value = target.value;
		
		this.setState({
			[name]: value
		});
	}
	*/
	
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
				}, {})
				.then(res => {
					console.log('axios request header', axios.default.header)
					console.log('res', res)
					console.log('xxxxxx', res.headers['Access-Token']);
					if(res.data){
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

	handleGrupoSubmit = (event) => {
		event.preventDefault();

		this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
				console.log('values', values)
			}
				
        })
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
		if(this.state.step === 1){
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
		logged: state.logged
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLogged: (logged) => { dispatch({ type: 'SET_LOGGED', logged }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Form.create()(SignIn)))