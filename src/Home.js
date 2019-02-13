import React, { Component } from 'react'
import { Layout, Table, Button, Icon, Modal } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import "./static/style.css"

const { Content } = Layout;

class Home extends Component {
    state = {
        showModal: false,
        tableData: [],
        tableLoading: false
    };

    getSimulado = (simuladoId) => {
        this.setState({tableLoading: true})
        //axios.get('http://localhost:5000/api/getSimuladoIdAluno/'+simuladoId)
        axios.get('http://localhost:5000/api/getSimuladoId/'+simuladoId)
        .then(res => {
            this.setState({tableLoading: false})
            console.log('response', res.data)
            this.props.setSimulado(res.data[0])
            this.showModal(true)
        })
        .catch(error =>{
            this.setState({tableLoading: false})
            console.log(error)
        })
    }

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

    componentWillMount(){
        var tableData = this.props.mainData.simulados.map(simulado => {
            var inicioObj = moment(simulado.dataHoraInicial)
            var inicio = inicioObj.format('DD/MM/YYYY HH:mm')

            var terminoObj = moment(simulado.dataHoraFinal)
            var termino = terminoObj.format('DD/MM/YYYY HH:mm')

            //var duracaoObj = terminoObj - inicioObj
            //var duracao = duracaoObj.format('HH:mm')

            return({
                key: simulado.id,
                nome: simulado.nome,
                inicio: inicio,
                fim: termino,
                duracao: '-'
            })
        })

        this.setState({tableData})
    }

    render() {
        const columns = [
			{
				title: "Descrição",
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
				title: "Executar",
				colSpan: 2,
				dataIndex: "acao",
				align: "center",
                width: 150,
                className: "actionCol",
				render: (text, record) => {
					return (
                        <React.Fragment>
                            <Button className="actionButton buttonGreen" title="Executar" onClick={() => this.getSimulado(record.key)}><Icon type="caret-right" /></Button>
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
                        dataSource={ this.state.tableData }
                        loading={this.state.tableLoading}
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

const MapStateToProps = (state) => {
	return {
		mainData: state.mainData
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSimulado: (simulado) => { dispatch({ type: 'SET_SIMULADORESOLUCAO', simulado }) },
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Home))