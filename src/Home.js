import React, { Component } from 'react'
import { Layout, Table, Button, Icon, Row, Col, Modal } from 'antd'
import Countdown from 'react-countdown-now';
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
                    margin: "0",
                    padding: "0 30px 0 24px",
                    background: "#13a54b",
                    color: '#fff'
                }}>
                    <Row>
                        <Col span={24} align="end" style={{fontWeight: 500}}>
                            <Icon type="clock-circle"  style={{ marginRight: 10 }}/>
                            <span style={{ marginRight: 10 }}>Tempo restante:</span>
                            <Countdown date={Date.now() + 90 * 60000} />
                        </Col>
                    </Row>
                </Content>
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
                    title="Basic Modal"
                    visible={this.state.showModal}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                >
                    <p>Modal mensagem...</p>
                </Modal>
            </React.Fragment>
        );
    }
}
 
export default Home;