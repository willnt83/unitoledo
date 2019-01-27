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
            if (!err) {
				/*
				var data = {
					params: {
						user: encodeURI(values.usuario)
					}
				}
				*/
				var data = {
					params: {
						user: encodeURI('ronnie')
					}
				}


				axios.defaults.headers = {
					'Authorization': this.props.authHeaders.authorization,
					'CookieZ': this.props.authHeaders.cookie
				}

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
					console.log(error)
				})
			}
		})
	}
	
	getContexto = (usuarioId) => {
		var data = {
			id: usuarioId
		}

		var config = {
			headers: {
				'Authorization': this.props.authHeaders.authorization,
				'CookieZ': this.props.authHeaders.cookie
			}
		}

		axios.post(`http://localhost:5000/api/contexto`, data, config)
		.then(res => {
			console.log(res.data)
			this.props.handleUserSelection(res.data)
		})
		.catch(error =>{
			console.log(error)
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
							<Button type="primary" className="actionButton" title="Selecionar Usuário" onClick={() => this.getContexto(record.id)}><Icon type="login" /></Button>
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
		authHeaders: state.authHeaders
	}
}

export default connect(MapStateToProps, null)(Form.create()(PersonificacaoSelecaoAluno))