import React from 'react';
import { Link } from "react-router-dom";

import { Menu, Icon } from 'antd';

const { SubMenu } = Menu;


const ListMenu = () => (
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
        <Menu.Item key="11">
            <Link to="/sair">
                <Icon type="export" />
                <span>Sair</span>
            </Link>
        </Menu.Item>
    </Menu>
);

export default ListMenu;