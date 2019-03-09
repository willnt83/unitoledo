import React, { Component } from 'react'
import { Layout, Row, Col, Form, Icon, Input, Button, Card } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'

const { Content } = Layout;

class LoginForm extends Component {
	state =  {
		entrarButtonLoading: false
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
					if(res.headers['access-token']){
						this.props.setHeader(res.headers['access-token'])
					}

					if(res.data){
						var hit = false
						res.data.privilegios.forEach(privilegio => {
							if(privilegio === 'personificacao')
								hit = true
						})
						
						if(hit) {
							// Usuário possui privilégio de personificação
							this.props.showModal(true)
						}
						else
							this.setState({ step: 2 })
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

const mapDispatchToProps = (dispatch) => {
    return {
		setHeader: (token) => { dispatch({ type: 'SET_HEADERS', token }) }
    }
}

export default connect(null, mapDispatchToProps)(Form.create()(LoginForm))