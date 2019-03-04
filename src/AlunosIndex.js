import React, { Component } from "react"
import { Layout, Icon, Row, Col, Button, Modal } from "antd"
import { BrowserRouter as Router, Route, withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import axios from "axios"
import PageTitle from "./layout/PageTitle"
import Home from './Home'
import ExecucaoSimulado from './components/execucaoSimulado/ExecucaoSimulado'

import "antd/dist/antd.css"
import "./static/style.css"

const { Header, Content, Footer } = Layout

const routes = [
	{
		path: "/alunos",
		exact: true,
		main: () => <Home />
	},{
		path: "/alunos/execucao-simulado",
		exact: true,
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
        axios.defaults.headers = {
            'Authorization': this.props.authHeaders.authorization,
            'CookieZ': this.props.authHeaders.cookie
        }
        
        var request = {}
        axios.post('http://localhost:5000/api/logout', request)
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
		return (
			<React.Fragment>
				<Router>
					<Layout className="layout">
						<Header style={{padding: '0 25px 0 0'}}>
							<Row style={{color: '#fff'}}>
								<Col span={12}>
									<div className="mainLogo" onClick={() => this.goHome()} style={{cursor: 'pointer'}}>UNITOLEDO</div>
								</Col>
								<Col span={11} align="end">
									<Icon type="user" /> {this.props.usuarioNome}
								</Col>
								<Col span={1} align="end" title="Sair">
									<Button onClick={() => this.showHideModalLogout(true)}><Icon type="poweroff" /></Button>
								</Col>
							</Row>
							
							
							
						</Header>
						<Content style={{
							padding: 12,
							background: "#fff"
						}}>
							<Row>
								<Col span={12}><PageTitle pageTitle="Execução do Simulado" /></Col>
							</Row>
						</Content>

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
		pageTitle: state.pageTitle,
		usuarioNome: state.usuarioNome,
		authHeaders: state.authHeaders
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(AlunosIndex));
