import React, { Component } from 'react'
import { Layout, Table, Button, Icon, Modal } from 'antd'
import { withRouter } from "react-router-dom"
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
    state = {
        showModal: false
    };

    showModal = (showModal) => {
		this.setState({
			showModal: showModal
		});
    };
    
    handleModalOk = () => {
        this.showModal(false);
        this.props.history.push('/alunos/execucao-simulado')
    }

    handleModalCancel = () => {
        this.showModal(false);
    }

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
				title: "Ação",
				colSpan: 2,
				dataIndex: "acao",
				align: "center",
                width: 150,
                className: "actionCol",
				render: (text, record) => {
					return (
                        <React.Fragment>
                            <Button className="actionButton buttonGreen" title="Executar" onClick={() => this.showModal(true)}><Icon type="caret-right" /></Button>
                        </React.Fragment>
					);
				}
			}
        ]
        return (
            <React.Fragment>
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
                <Modal
                    title="Atenção!"
                    visible={this.state.showModal}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    footer={[
                        <Button key="back" onClick={this.handleModalCancel}>Cancelar</Button>,
                        <Button key="submit" type="primary" onClick={this.handleModalOk}>
                            Quero iniciar!
                        </Button>,
                    ]}
                >
                    <p>Você está prestes a inicar a resolução do simulado XXX. Ao iniciar o simulado, o tempo para execução do simulado começará a contar e não poderá mais ser parado. </p>
                </Modal>
            </React.Fragment>
        );
    }
}
 
export default withRouter(Home);