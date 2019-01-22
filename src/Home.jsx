import React, { Component } from 'react';
import { Layout, Menu, Table, Button } from 'antd';
import "./static/style.css"

const { Header, Content, Footer } = Layout;

const tableData = [
    {
        key: 1,
        nome: 'Análise e Desenvolvimento de Sistemas - 06/2017',
        status: 1,
        inicio: '30/10/2017',
        fim: '30/10/2017'
    },
    {
        key: 2,
        nome: 'Simulado - Teste',
        status: 0,
        inicio: '02/03/2018',
        fim: '02/03/2018'
    },
    {
        key: 3,
        nome: 'Análise e Desenvolvimento de Sistemas - 10/2017',
        status: 1,
        inicio: '15/20/2018',
        fim: '15/20/2018'
    }
]

class Home extends Component {
    render() {
        const columns = [
			{
				title: "Nome",
				dataIndex: "nome",
				sorter: (a, b) => a.id - b.id
            },
            {
				title: "Criado em",
				dataIndex: "inicio",
				sorter: (a, b) => a.id - b.id
			},
            {
				title: "Finaliza em",
				dataIndex: "fim",
				sorter: (a, b) => a.id - b.id
            },
            {
				title: "Status",
                dataIndex: "status",
                align: "center",
				sorter: (a, b) => a.id - b.id
			},
            {
				title: "Operação",
				colSpan: 2,
				dataIndex: "operacao",
				align: "center",
				width: 150,
				render: (text, record) => {
					return (
                        <React.Fragment>
                            <Button type="primary">Executar</Button>
                        </React.Fragment>
					);
				}
			}
        ]
        return (
            <Layout className="layout">
                <Header>
                    <div className="logoa">UNITOLEDO</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">Home</Menu.Item>
                        <Menu.Item key="2" style={{float: 'right'}}>Nome do Aluno</Menu.Item>
                        {/*<Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>*/}
                    </Menu>
                </Header>
                <Content style={{
                    margin: "20px 25px 0 25px",
                    padding: 24,
                    background: "#fff"
                }}>
                    <h3>Simulados Disponíveis</h3>
                    <Table 
                        columns={ columns } 
                        dataSource={ tableData }
                    />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    UNITOLEDO ©2018
                </Footer>
            </Layout>
        );
    }
}
 
export default Home;