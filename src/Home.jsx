import React, { Component } from 'react'
import { Layout, Table, Button } from 'antd'
import { Link } from "react-router-dom"
import "./static/style.css"

const { Content } = Layout;

const tableData = [
    {
        key: 1,
        nome: 'Análise e Desenvolvimento de Sistemas - 06/2017',
        inicio: '30/10/2017',
        fim: '30/10/2017',
        duracao: '1h'
    },
    {
        key: 2,
        nome: 'Simulado - Teste',
        inicio: '02/03/2018',
        fim: '02/03/2018',
        duracao: '2hs'
    },
    {
        key: 3,
        nome: 'Análise e Desenvolvimento de Sistemas - 10/2017',
        inicio: '15/20/2018',
        fim: '15/20/2018',
        duracao: '1hr'
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
				title: "Duração",
                dataIndex: "duracao",
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
                            <Link to="/execucao-simulado"><Button type="primary">Executar</Button></Link>
                        </React.Fragment>
					);
				}
			}
        ]
        return (
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
        );
    }
}
 
export default Home;