import React, { Component } from "react"
import { Layout, Icon, Row, Col } from "antd"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { connect } from 'react-redux'

import "antd/dist/antd.css"
import "./static/index.css"

import PageTitle from "./layout/PageTitle"
import ListMenu from "./layout/ListMenu"
import Dashboard from "./Dashboard";
import Conteudos from "./cadastros/Conteudos";
import Habilidades from "./cadastros/Habilidades"
import AreasDeConhecimento from "./cadastros/AreasDeConhecimento"
import Fontes from "./cadastros/Fontes"
import AreaGestor from "./area-do-gestor/AreaGestor"
import Questoes from "./questoes/Questoes"
import Simulados from "./simulados/Simulados"
import NovoSimulado1 from "./simulados/NovoSimulado1"
import NovoSimulado2 from "./simulados/NovoSimulado2"
import NovoSimulado3 from "./simulados/NovoSimulado3"
import NovoSimulado4 from "./simulados/NovoSimulado4"
import LancamentoNotas from "./simulados/LancamentoNotas"
import PercentualDeAcertos from "./relatorios/PercentualDeAcertos"
import HabilidadesConteudos from "./relatorios/HabilidadesConteudos"
import Detalhado from "./relatorios/Detalhado"

const { Header, Sider, Footer } = Layout

const routes = [
  {
    path: "/app-prova/admin",
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Dashboard />
  },
  {
    path: "/app-prova/admin/cadastros/habilidades",
    sidebar: () => <div>Cadastro/Habilidade</div>,
    main: () => <Habilidades />
  },
  {
    path: "/app-prova/admin/cadastros/conteudos",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Conteudos />
  },
  {
    path: "/app-prova/admin/cadastros/areas-de-conhecimento",
    sidebar: () => <div>Cadastro/Áreas de Conhecimento</div>,
    main: () => <AreasDeConhecimento />
  },
  {
    path: "/app-prova/admin/cadastros/fontes",
    sidebar: () => <div>Cadastro/Fontes</div>,
    main: () => <Fontes />
  },
  {
    path: "/app-prova/admin/area-do-gestor",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <AreaGestor />
  },
  {
    path: "/app-prova/admin/simulados",
    exact: true,
    sidebar: () => <div>Simulados</div>,
    main: () => <Simulados />
  },
  {
    path: "/app-prova/admin/simulados/novo/step-1",
    sidebar: () => <div>Simulados</div>,
    main: () => <NovoSimulado1 />
  },
  {
    path: "/app-prova/admin/simulados/novo/step-2",
    sidebar: () => <div>Simulados</div>,
    main: () => <NovoSimulado2 />
  },
  {
    path: "/app-prova/admin/simulados/novo/step-3",
    sidebar: () => <div>Simulados</div>,
    main: () => <NovoSimulado3 />
  },
  {
    path: "/app-prova/admin/simulados/novo/step-4",
    sidebar: () => <div>Simulados</div>,
    main: () => <NovoSimulado4 />
  },
  {
    path: "/app-prova/admin/lancamento-de-notas",
    sidebar: () => <div>Lançamento de Notas</div>,
    main: () => <LancamentoNotas />
  },
  {
    path: "/app-prova/admin/banco-de-questoes",
    sidebar: () => <div>Questões</div>,
    main: () => <Questoes />
  },
  {
    path: "/app-prova/admin/relatorios/percentual-de-acertos",
    sidebar: () => <div>Percentual de Acertos</div>,
    main: () => <PercentualDeAcertos />
  },
  {
    path: "/app-prova/admin/relatorios/habilidades-e-conteudos",
    sidebar: () => <div>Habilidades e Conteúdos</div>,
    main: () => <HabilidadesConteudos />
  },
  {
    path: "/app-prova/admin/relatorios/detalhado",
    sidebar: () => <div>Detalhado</div>,
    main: () => <Detalhado />
  }
];

class AdminIndex extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: false
		};
	}


	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
	};

	componentWillMount(){
		if(window.innerWidth <= 1200)
		this.setState({collapsed: true});
	}

  	render() {
		const displayLogo = this.state.collapsed ? 'none' : 'block'
		return (
			<Router>
				<Layout style={{ minHeight: "100vh" }}>
					<Sider
						trigger={null} collapsible collapsed={this.state.collapsed}
						breakpoint="lg"
						collapsedWidth="80"
					>
						<div className="logo" style={{display: displayLogo}}>UNITOLEDO</div>
						<ListMenu />
					</Sider>
					<Layout>
						<Header style={{ background: "#fff", padding: 0 }}>
							<Row style={{paddingRight: '24px'}}>
								<Col span={10} style={{paddingLeft: 20}}>
									<Icon
										className="trigger"
										type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
										onClick={this.toggle}
									/>
									<PageTitle pageTitle={this.props.pageTitle} />
								</Col>
								<Col span={14} align="end" className="loggedUser">
									<Icon type="user" style={{marginRight: '8px'}} />{this.props.usuarioNome} / {this.props.periodoLetivoDescricao}
								</Col>
							</Row>
						</Header>
						{routes.map((route, index) => (
							<Route
								key={index}
								path={route.path}
								exact={route.exact}
								component={route.main}
							/>
						))}
						<Footer style={{ textAlign: "center" }}>UNITOLEDO ©2018</Footer>
					</Layout>
				</Layout>
			</Router>
		);
  	}
}

const MapStateToProps = (state) => {
  return {
    pageTitle: state.pageTitle,
    usuarioNome: state.usuarioNome,
    periodoLetivoDescricao: state.periodoLetivoDescricao
  }
}

export default connect(MapStateToProps)(AdminIndex);
