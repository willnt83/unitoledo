import React, { Component } from "react"
import { Link, withRouter } from "react-router-dom"
import { Menu, Icon, Modal, Button } from 'antd'
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
        axios.post('http://localhost:5000/api/logout', request)
        .then(res => {
            this.setState({btnConfirmarLoading: false})
            this.showHideModalLogout(false)
            window.location.replace("/");
        })
        .catch(error =>{
            console.log(error)
        })
    }

    render(){
        return(
            <React.Fragment>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Link to="/admin">
                            <Icon type="dashboard" />
                            <span>Dashboard</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="bars" /><span>Cadastros</span></span>}>
                        <Menu.Item key="2">
                            <Link to="/admin/cadastros/habilidades">
                                <Icon type="right-square" />
                                <span>Habilidade</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/admin/cadastros/conteudos">
                                <Icon type="right-square" />
                                <span>Conteúdo</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/admin/cadastros/areas-de-conhecimento">
                                <Icon type="right-square" />
                                <span>Área de Conhecimento</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="6">
                        <Link to="/admin/area-do-gestor">
                            <Icon type="area-chart" />
                            <span>Área do Gestor</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <Link to="/admin/simulados">
                            <Icon type="file-done" />
                            <span>Simulados</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link to="/admin/banco-de-questoes">
                            <Icon type="hdd" />
                            <span>Banco de Questões</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                        <Link to="/admin/meus-alunos">
                            <Icon type="team" />
                            <span>Meus Alunos</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="10">
                        <Link to="/admin/editar-perfil">
                            <Icon type="edit" />
                            <span>Editar Perfil</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="11" onClick={() => this.logout()}>
                        <Icon type="export" />
                        <span>Sair</span>
                    </Menu.Item>
                </Menu>
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

export default withRouter(ListMenu)