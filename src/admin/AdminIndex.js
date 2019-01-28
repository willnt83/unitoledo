import React, { Component } from "react"
import { Layout, Icon } from "antd"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { connect } from 'react-redux'

import "antd/dist/antd.css"
import "./static/index.css"

import PageTitle from "./layout/PageTitle"
import ListMenu from "./layout/ListMenu"
import Dashboard from "./Dashboard";
import Conteudos from "./conteudos/Conteudos";
import Habilidades from "./habilidades/Habilidades"
import AreasDeConhecimento from "./areas-de-conhecimento/AreasDeConhecimento"
import AreaGestor from "./area-do-gestor/AreaGestor"
import Questoes from "./questoes/Questoes"
import Simulados from "./simulados/Simulados"
import NovoSimulado1 from "./simulados/NovoSimulado1"
import NovoSimulado2 from "./simulados/NovoSimulado2"
import NovoSimulado3 from "./simulados/NovoSimulado3"
import NovoSimulado4 from "./simulados/NovoSimulado4"

const { Header, Sider, Footer } = Layout

const routes = [
  {
    path: "/admin",
    exact: true,
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Dashboard />
  },
  {
    path: "/admin/cadastros/habilidades",
    sidebar: () => <div>Cadastro/Habilidade</div>,
    main: () => <Habilidades />
  },
  {
    path: "/admin/cadastros/conteudos",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Conteudos />
  },
  {
    path: "/admin/cadastros/areas-de-conhecimento",
    sidebar: () => <div>Cadastro/Áreas de Conhecimento</div>,
    main: () => <AreasDeConhecimento />
  },
  {
    path: "/admin/area-do-gestor",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <AreaGestor />
  },
  {
    path: "/admin/simulados",
    exact: true,
    sidebar: () => <div>Simulados</div>,
    main: () => <Simulados />
  },
  {
    path: "/admin/simulados/novo/step-1",
    sidebar: () => <div>Simulados</div>,
    main: () => <NovoSimulado1 />
  },
  {
    path: "/admin/simulados/novo/step-2",
    sidebar: () => <div>Simulados</div>,
    main: () => <NovoSimulado2 />
  },
  {
    path: "/admin/simulados/novo/step-3",
    sidebar: () => <div>Simulados</div>,
    main: () => <NovoSimulado3 />
  },
  {
    path: "/admin/simulados/novo/step-4",
    sidebar: () => <div>Simulados</div>,
    main: () => <NovoSimulado4 />
  },
  {
    path: "/admin/banco-de-questoes",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <Questoes />
  },
  {
    path: "/admin/meus-alunos",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <h1>Meus Alunos</h1>
  },
  {
    path: "/admin/editar-perfil",
    sidebar: () => <div>Cadastro/Conteudo</div>,
    main: () => <h1>Editar Perfil</h1>
  }
];

class AdminIndex extends Component {
  state = {
    collapsed: false
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  render() {
    return (
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
            <div className="logo">UNITOLEDO</div>
            <ListMenu />
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
              />
              <PageTitle pageTitle={this.props.pageTitle} />
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
    pageTitle: state.pageTitle
  }
}

export default connect(MapStateToProps)(AdminIndex);
