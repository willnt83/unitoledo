import React, { Component } from "react"
import { Layout, Icon, Row, Col } from "antd"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { connect } from 'react-redux'
import PageTitle from "./layout/PageTitle"
import Home from './Home'
import ExecucaoSimulado from './ExecucaoSimulado'

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
		collapsed: false
	};
	/*
	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
	};
	*/
	render() {
		return (
			<Router>
			<Layout className="layout">
				<Header>
					<div className="mainLogo">UNITOLEDO</div>
					<div style={{float: 'right', color: '#fff'}}><Icon type="user" /> Nome do Aluno</div>
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
		)
	}
}

const MapStateToProps = (state) => {
  return {
    pageTitle: state.pageTitle
  }
}

export default connect(MapStateToProps)(AlunosIndex);
