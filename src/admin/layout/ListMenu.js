import React, { Component } from "react"
import { Link, withRouter } from "react-router-dom"
import { Menu, Icon, Modal, Button } from 'antd'
import { connect } from 'react-redux'
import axios from "axios"

const { SubMenu } = Menu

class ListMenu extends Component {
    state = {
        showModalLogout: false,
        btnConfirmarLoading: false
    }

    showHideModalLogout = (bool) => {
        this.setState({showModalLogout : bool})
    }

    logout = () => {
        this.setState({showModalLogout: true})
    }

    handleConfirmLogout = () => {
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
            window.location.replace("/app-prova")
        })
        .catch(error =>{
            console.log(error)
        })
    }

    render(){
        var menu = null
        console.log('this.props.mainData', this.props.mainData)
        if(this.props.mainData && this.props.mainData.user && this.props.mainData.user === 'APPProva - Admin'){
            menu = (
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <SubMenu key="sub1" title={<span><Icon type="bars" /><span>Cadastros</span></span>}>
                        <Menu.Item key="1">
                            <Link to="/app-prova/admin/cadastros/habilidades">
                                <Icon type="right-square" />
                                <span>Habilidade</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/app-prova/admin/cadastros/conteudos">
                                <Icon type="right-square" />
                                <span>Conteúdo</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/app-prova/admin/cadastros/areas-de-conhecimento">
                                <Icon type="right-square" />
                                <span>Área de Conhecimento</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/app-prova/admin/cadastros/fontes">
                                <Icon type="right-square" />
                                <span>Fontes</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="5">
                        <Link to="/app-prova/admin/banco-de-questoes">
                            <Icon type="hdd" />
                            <span>Banco de Questões</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="6" onClick={() => this.logout()}>
                        <Icon type="export" />
                        <span>Sair</span>
                    </Menu.Item>
                </Menu>
            )
        }
        else{
            menu =
                (<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Link to="/app-prova/admin">
                            <Icon type="dashboard" />
                            <span>Dashboard</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="bars" /><span>Cadastros</span></span>}>
                        <Menu.Item key="2">
                            <Link to="/app-prova/admin/cadastros/habilidades">
                                <Icon type="right-square" />
                                <span>Habilidade</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/app-prova/admin/cadastros/conteudos">
                                <Icon type="right-square" />
                                <span>Conteúdo</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/app-prova/admin/cadastros/areas-de-conhecimento">
                                <Icon type="right-square" />
                                <span>Área de Conhecimento</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to="/app-prova/admin/cadastros/fontes">
                                <Icon type="right-square" />
                                <span>Fontes</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="6">
                        <Link to="/app-prova/admin/area-do-gestor">
                            <Icon type="area-chart" />
                            <span>Área do Gestor</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <Link to="/app-prova/admin/simulados">
                            <Icon type="file-done" />
                            <span>Simulados</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link to="/app-prova/admin/lancamento-de-notas">
                            <Icon type="solution" />
                            <span>Lançamento de Notas</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                        <Link to="/app-prova/admin/banco-de-questoes">
                            <Icon type="hdd" />
                            <span>Banco de Questões</span>
                        </Link>
                    </Menu.Item>

                    <SubMenu key="sub2" title={<span><Icon type="bar-chart" /><span>Relatórios</span></span>}>
                        <Menu.Item key="10">
                            <Link to="/app-prova/admin/relatorios/percentual-de-acertos">
                                <Icon type="right-square" />
                                <span>Percentual de Acertos</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="11">
                            <Link to="/app-prova/admin/relatorios/habilidades-e-conteudos">
                                <Icon type="right-square" />
                                <span>Habilidades e Conteúdos</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="12">
                            <Link to="/app-prova/admin/relatorios/detalhado">
                                <Icon type="right-square" />
                                <span>Detalhado</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="13">
                        <Link to="/app-prova/admin/meus-alunos">
                            <Icon type="team" />
                            <span>Meus Alunos</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="14" onClick={() => this.logout()}>
                        <Icon type="export" />
                        <span>Sair</span>
                    </Menu.Item>
                </Menu>)
        }

        return(
            <React.Fragment>
                {menu}
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
        authHeaders: state.authHeaders,
        privilegios: state.privilegios,
        mainData: state.mainData
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(ListMenu))