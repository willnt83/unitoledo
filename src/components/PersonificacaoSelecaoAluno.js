import React, { Component } from 'react'
import { Row, Col, Form, Icon, Input, Button, Modal, Table } from 'antd'
import { connect } from 'react-redux'
import axios from 'axios'

class PersonificacaoSelecaoAluno extends Component {
	state = {
		usuarios: [],
		buscarButtonLoading: false,
		displayTable: 'none',
		tableLoading: false
	}

    handleSearchUserSubmit = (event) => {
		event.preventDefault();
		this.setState({
			buscarButtonLoading: true,
			tableLoading: true
		})
		this.props.form.validateFieldsAndScroll((err, values) => {
			console.log(values)
            if (!err) {
				var data = {
					params: {
						user: encodeURI(values.usuario)
					}
				}
				
				axios.defaults.headers = {
					'Authorization': this.props.token,
						'CookieZ': this.props.cookie
				}

				console.log('request data: ', data)
				
				axios.get(`http://localhost:5000/api/getUser`, data)
				.then(res => {
					this.setState({
						buscarButtonLoading: false,
						tableLoading: false,
						usuarios: res.data,
						displayTable: 'block'
					})
				})
				.catch(error =>{
					this.setState({
						buscarButtonLoading: false,
						tableLoading: false
					})
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
							<Button type="primary" className="actionButton" title="Selecionar Usuário" onClick={() => this.props.getContexto(record.id)}><Icon type="login" /></Button>
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
							<Button type="primary" htmlType="submit" loading={this.state.buscarButtonLoading}><Icon type="search" />Buscar</Button>
						</Col>
					</Row>
				</Form>
				<Table
                    columns={columns}
                    dataSource={this.state.usuarios}
					loading={this.state.tableLoading}
					visible={this.state.showTable}
					rowKey="id"
					style={{display: this.state.displayTable}}
					locale={{ emptyText: 'Sem resultados' }}
					scroll={{y: 400}}
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