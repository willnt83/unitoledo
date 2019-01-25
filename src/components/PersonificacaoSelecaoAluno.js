import React, { Component } from 'react'
import { Row, Col, Form, Icon, Input, Button, Modal, Table } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'

class PersonificacaoSelecaoAluno extends Component {
	constructor(props) {
        super(props);
	}
	
	state = {
		usuarios: [],
		tableLoading: false,
		showTable: false
	}

    handleSearchUserSubmit = (event) => {
		event.preventDefault();
		this.props.form.validateFieldsAndScroll((err, values) => {
			console.log(values)
            if (!err) {
				var data = {
					params: {
						user: values.usuario
					}
				}
				
				axios.defaults.headers = {
					'Authorization': this.props.token,
						'CookieZ': this.props.cookie
				}
				
				axios.get(`http://localhost:5000/api/getUser`, data)
				.then(res => {
					console.log(res.data)
					this.setState({ usuarios: res.data })
				})
				.catch(error =>{
					console.log('Error:', error)
				})
			}
		})
    }
    
	render () {
		const { getFieldDecorator } = this.props.form;

		const columns = [
			{
				title: 'ID',
				dataIndex: 'id',
				align: 'center',
				sorter: (a, b) => a.id - b.id,
			},
			{
				title: 'Nome',
				dataIndex: 'nome',
				sorter: (a, b) => a.id - b.id,
			},
			{
				title: 'Selecionar',
				colSpan: 2,
				dataIndex: 'selecionar',
				align: 'center',
				width: 150,
				render: (text, record) => {
					return(
						<React.Fragment>
							<Button className="actionButton buttonGreen" title="Selecionar Usuário" onClick={() => this.props.getContexto(record.id)}><Icon type="check" /></Button>
						</React.Fragment>
					);
				}
			}
		]
		
		return (
			<Modal
				title="Personificação - Selecionar Usuário"
				visible={this.props.visible}
				onCancel={() => this.props.showModal(false)}
				footer={[
					<Button key="back" onClick={() => this.props.showModal(false)}><Icon type="close" />Cancelar</Button>,
					<Button key="submit" className="buttonGreen" onClick={() => this.props.showModal(false)}><Icon type="check" />Selecionar</Button>
				]}
				width={800}
			>
				<Form layout="vertical" onSubmit={this.handleSearchUserSubmit}>
					<Row>
						<Col span={18}>
							<Form.Item>
								{getFieldDecorator('usuario', {
									rules: [{ required: true, message: 'Informe o usuário' }],
								})(
									<Input
										id="usuario"
										placeholder="Buscar usuário"
										onChange={this.handleInput}
									/>
								)}
							</Form.Item>
						</Col>
						<Col span={6} align="end">
							<Button type="primary" htmlType="submit" loading={this.state.buscarUsuarioLoading}><Icon type="search" />Buscar</Button>
						</Col>
					</Row>
				</Form>
				<Table
                    columns={columns}
                    dataSource={this.state.usuarios}
					loading={this.state.tableLoading}
					visible={this.state.showTable}
					rowKey="id"
                />
			</Modal>
		)
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

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(PersonificacaoSelecaoAluno))