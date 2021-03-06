import React, { Component } from 'react'
import { Layout, Row, Col, Form, Icon, Input, Button, Card } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'

const { Content } = Layout;

class LoginForm extends Component {
	state =  {
		entrarButtonLoading: false,
		loginSuccess: true
	}
	handleLoginSubmit = (event) => {
		event.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
				this.setState({ entrarButtonLoading: true })
				axios.post(this.props.backEndPoint+'/api/login/user', {
					usuario: values.userName,
					senha: values.password
					/*
					usuario: 'appprova',
					senha: 'qw90PO@!'
					*/
				})
				.then(res => {
					if(res.headers['access-token']){
						this.props.setHeader(res.headers['access-token'])
					}

					axios.defaults.headers = {
						'Authorization': this.props.authHeaders.token
					}

					if(res.data){
						console.log('res.data', res.data)
						this.props.setPrivilegios(res.data.privilegios)
						if(res.data.userInfo){
							this.props.setUsuario(res.data.userInfo.id, res.data.userInfo.nome)
						}
						this.props.handleUserLogin(res.data)
					}
					else
						console.log('login invalido')
					this.setState({
						entrarButtonLoading: false
					})
				})
				.catch(error =>{

					this.setState({
						entrarButtonLoading: false,
						loginSuccess: false
					})
				})
            }
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
							{
								!this.state.loginSuccess ?
								<Row style={{marginBottom: 20}}>
									<Col span={24} style={{color: 'red', fontWeight: 800}}>
										Usuário ou senha inválidos
									</Col>
								</Row>:null
							}
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
}

const MapStateToProps = (state) => {
	return {
		backEndPoint: state.backEndPoint,
		authHeaders: state.authHeaders
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
			setHeader: (token) => { dispatch({ type: 'SET_HEADERS', token }) },
			setUsuario: (usuarioId, usuarioNome) => { dispatch({ type: 'SET_USUARIO', usuarioId, usuarioNome }) },
			setPrivilegios: (privilegios) => { dispatch({ type: 'SET_PRIVILEGIOS', privilegios }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(LoginForm))