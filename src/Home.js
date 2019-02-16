import React, { Component } from 'react'
import { Layout, Table, Button, Icon } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import "./static/style.css"

const { Content } = Layout;

class Home extends Component {
    state = {
        tableData: [],
        tableLoading: false
    };

    getSimulado = (record) => {
        this.setState({tableLoading: true})
        axios.get('http://localhost:5000/api/getSimuladoIdAlunoQuestao/'+record.key+'/'+this.props.usuarioId)
        .then(res => {
            this.setState({tableLoading: false})
            var simulado = {
                id: record.key,
                nome: record.nome,
                dataHoraInicial: record.inicio,
                dataHoraFinal: record.fim,
                questoes: res.data
            }
            this.props.setSimulado(simulado)
            this.props.history.push('/alunos/execucao-simulado')
        })
        .catch(error =>{
            this.setState({tableLoading: false})
            console.log(error)
        })
    }

    componentWillMount(){
        var tableData = this.props.mainData.simulados.map(simulado => {
            var inicioObj = moment(simulado.dataHoraInicial)
            var inicio = inicioObj.format('DD/MM/YYYY HH:mm')

            var terminoObj = moment(simulado.dataHoraFinal)
            var termino = terminoObj.format('DD/MM/YYYY HH:mm')

            return({
                key: simulado.id,
                nome: simulado.nome,
                inicio: inicio,
                fim: termino
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
				title: "Executar",
				colSpan: 2,
				dataIndex: "acao",
				align: "center",
                width: 150,
                className: "actionCol",
				render: (text, record) => {
					return (
                        <React.Fragment>
                            <Button className="actionButton buttonGreen" title="Executar" onClick={() => this.getSimulado(record)}><Icon type="caret-right" /></Button>
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
            </React.Fragment>
        );
    }
}

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData,
        usuarioId: state.usuarioId
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSimulado: (simulado) => { dispatch({ type: 'SET_SIMULADORESOLUCAO', simulado }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Home))