import React, { Component } from 'react'
import { Layout, Row, Col, Form, Icon, Button, Card, Select,  } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'

const { Content } = Layout;
const Option = Select.Option;

class GruposSelection extends Component {
	state =  {
		enviarButtonLoading: false
	}

	handleGrupoSubmit = (event) => {
		event.preventDefault();
		this.setState({ enviarButtonLoading : true})
		this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
				var contexto = ''
				this.props.userInfos.forEach(userInfo => {
					if(userInfo.tipo === values.grupo){
						if(userInfo.contextos.length > 1){
							contexto = userInfo.contextos[(userInfo.contextos.length - 1)]
						}
						else{
							contexto = userInfo.contextos[0]
						}
					}
				})

				var config = {
					headers: {
						'Authorization': this.props.authHeaders.authorization,
						'CookieZ': this.props.authHeaders.cookie
					}
				}

				axios.post(`http://localhost:5000/api/getData`, contexto, config)
				.then(res => {
					this.setState({ enviarButtonLoading : false})
				})
				.catch(error =>{
					console.log(error)
					this.setState({ enviarButtonLoading : false})
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
												this.props.grupos.map((item) => {
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

const MapStateToProps = (state) => {
	return {
		authHeaders: state.authHeaders
	}
}

export default connect(MapStateToProps, null)(Form.create()(GruposSelection))