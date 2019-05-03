import React, { Component } from "react"
import { Layout, Icon, Row, Col, Button, Modal, Menu } from "antd"
import { BrowserRouter as Router, Route, withRouter, Link } from "react-router-dom"
import { connect } from 'react-redux'
import axios from "axios"
//import PageTitle from "./layout/PageTitle"
import Dashboard from './Dashboard'
import Simulados from './Simulados'
import ExecucaoSimulado from './components/execucaoSimulado/ExecucaoSimulado'

import "antd/dist/antd.css"
import "../static/style.css"

//const { Header, Content, Footer, Sider } = Layout
const { Header, Footer, Sider } = Layout

const routes = [
	{
		path: "/alunos",
		exact: true,
		main: () => <Dashboard />
	},
	{
		path: "/alunos/simulados",
		main: () => <Simulados />
	},
	{
		path: "/alunos/execucao-simulado",
		main: () => <ExecucaoSimulado />
	}
];

class AlunosIndex extends Component {
	state = {
		showModalLogout: false,
		btnConfirmarLoading: false
	};

	goHome = () => {
		window.location.replace("/alunos")
	}

	showHideModalLogout = (bool) => {
		console.log('showHideModalLogout')
		this.setState({showModalLogout: bool})
	}
	
	handleConfirmLogout = () => {
		console.log('handleConfirmLogout')
		this.setState({btnConfirmarLoading: true})
		var request = {}
        axios.defaults.headers = {
            'Authorization': this.props.authHeaders.token
        }
        axios.post(this.props.backEndPoint+'/api/logout', request)
        .then(res => {
            this.setState({btnConfirmarLoading: false})
            this.props.resetAll()
            this.showHideModalLogout(false)
            window.location.replace("/")
        })
        .catch(error =>{
            console.log(error)
        })
	}

	render() {
		var periodoLetivo = ''
		if(this.props.contextoAluno)
			periodoLetivo = this.props.contextoAluno.descricao
		else
			periodoLetivo = ''
		return (
			<React.Fragment>
				<Router>
					<Layout style={{minHeight: '100vh'}}>
						<Sider
							breakpoint="lg"
							collapsedWidth="0"
							/*onBreakpoint={(broken) => { console.log(broken); }}
							onCollapse={(collapsed, type) => { console.log(collapsed, type); }}*/
						>
							<div className="logo" onClick={() => this.goHome()}>UNITOLEDO</div>
							<Menu theme="dark" mode="inline">
								<Menu.Item key='1'>
									<Link to='/alunos'>
										<Icon type="right-square" />
										<span className="nav-text">Dashboard</span>
									</Link>
								</Menu.Item>
								<Menu.Item key='2'>
									<Link to='/alunos/simulados'>
										<Icon type="right-square" />
										<span className="nav-text">Simulados</span>
									</Link>
								</Menu.Item>
								<Menu.Item key='3' onClick={() => this.showHideModalLogout(true)}>
									<Icon type="right-square" />
									<span className="nav-text">Sair</span>
								</Menu.Item>
							</Menu>
						</Sider>
						<Layout className="layout">
							<Header style={{padding: '0 25px 0 0'}}>
								<Row style={{color: '#fff'}}>
									<Col xs={8} sm={16} md={24} lg={32} align="end">
										<Icon type="user" /> {this.props.usuarioNome} / {periodoLetivo}
									</Col>
								</Row>
							</Header>
							{/*
							<Content style={{
								padding: 12,
								background: "#fff"
							}}>
								<Row>
									<Col span={12}><PageTitle pageTitle="Simulados" /></Col>
								</Row>
							</Content>
							*/}
								{routes.map((route, index) => (
									<Route
										key={index}
										path={route.path}
										exact={route.exact}
										component={route.main}
									/>
								))}
							<Footer style={{ textAlign: 'center' }}>
								UNITOLEDO ©2018
							</Footer>
						</Layout>
					</Layout>
				</Router>
				<Modal
					title="Sair do Sistema"
					visible={this.state.showModalLogout}
					onOk={this.handleModalLogoutOk}
					onCancel={() => this.showHideModalLogout(false)}
					footer={[
						<Button key="back" onClick={() => this.showHideModalLogout(false)}><Icon type="close" /> Cancelar</Button>,
						<Button className="buttonGreen" key="primary" type="primary" onClick={this.handleConfirmLogout} loading={this.state.btnConfirmarLoading}>
							<Icon type="check" /> Confirmar
						</Button>,
					]}
				>
					<p>Você está prestes a sair do sistema. Todos os dados não salvos serão perdidos!</p>
				</Modal>
			</React.Fragment>
		)
	}
}

const MapStateToProps = (state) => {
	return {
		backEndPoint: state.backEndPoint,
		pageTitle: state.pageTitle,
		usuarioNome: state.usuarioNome,
		authHeaders: state.authHeaders,
		contextoAluno: state.contextoAluno
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(AlunosIndex));
