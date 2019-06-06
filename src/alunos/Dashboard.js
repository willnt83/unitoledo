import React, { Component } from 'react'
import { Layout, Table, Row, Col, Icon } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import moment from 'moment'
//import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios'
import "../static/style.css"

const { Content } = Layout

class Dashboard extends Component {
    state = {
        tableData: [],
        tableLoading: false
    }

    compareByDates = (a, b) => {
        a = moment(a, 'DD/MM/YYYY HH:mm')
            b = moment(b, 'DD/MM/YYYY HH:mm')
        if (a > b) return -1
        if (a < b) return 1
        return 0
    }

    componentWillMount(){
        this.setState({tableLoading: true})
        if(this.props.mainData === null || this.props.contexto !== 'ALUNO'){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }

        axios.defaults.headers = {
            'Authorization': this.props.authHeaders.token
        }
        // Atualizando dados do dashboard
        axios.post(this.props.backEndPoint+'/api/getData', this.props.contextoAluno)
		.then(res => {
            this.props.setMainData(res.data)
            var tableData = res.data.dash_aluno.list.map(simulado => {
                var nome = null
                var dataInicio = null
                var dataFim = null

                res.data.simulados.forEach(row => {
                    if(row.id === simulado.idSimulado){
                        nome = row.nome
                        dataInicio = moment(row.dataHoraInicial).format('DD/MM/YYYY hh:mm:ss')
                        dataFim = moment(row.dataHoraFinal).format('DD/MM/YYYY hh:mm:ss')
                    }
                })

                return({
                    key: simulado.idSimulado,
                    nome: nome,
                    dataInicio,
                    dataFim,
                    questoesRespondidas: simulado.questoesRespondidas,
                    respostasCorretas: simulado.questoesCertas
                })
            })
            this.setState({
                tableLoading: false,
                tableData
            })

		})
		.catch(error =>{
			console.log(error)
        })
    }

    render(){
        const columns = [
            {
                title: 'ID',
                dataIndex: 'key',
                sorter: (a, b) => a.key - b.key
            },
            {
				title: "Simulado",
				dataIndex: "nome",
				sorter: (a, b) => { return a.nome.localeCompare(b.nome)},
            },
            {
				title: "Iniciou em",
                dataIndex: "dataInicio",
                align: "center",
				sorter: (a, b) => this.compareByDates(a.dataInicio, b.dataInicio)
            },
            {
				title: "Finalizou em",
                dataIndex: "dataFim",
                align: "center",
				sorter: (a, b) => this.compareByDates(a.dataFim, b.dataFim)
            },
            {
                title: 'Questões Respondidas',
                dataIndex: 'questoesRespondidas',
                align: "center",
                sorter: (a, b) => a.questoesRespondidas - b.questoesRespondidas
            },
            {
                title: 'Respostas Corretas',
                dataIndex: 'respostasCorretas',
                align: "center",
                sorter: (a, b) => a.respostasCorretas - b.respostasCorretas
            },
        ]

        return (
            <React.Fragment>
                <Content style={{
                    margin: "20px 25px 0 25px",
                    padding: 24,
                    background: "#fff"
                }}>
                    <h3>Dashboard</h3>
                    {
                        (this.props.mainData && this.props.mainData.dash_aluno) ?

                            <Row>
                                <Col sm={24} md={6}>
                                    <Row type="flex"  align="middle">
                                        <Col span={10} align="end" style={{paddingRight: 25}}>
                                            <Icon type="edit" style={{fontSize: 35, color: '#4286f4'}} />
                                        </Col>
                                        <Col span={14}>
                                            <Col span={24} align="start" style={{fontSize: 20, fontWeight: 800, color: '#4286f4'}}>
                                                {   this.props.mainData.dash_aluno ?
                                                    this.props.mainData.dash_aluno.total.totalQuestoesRespondidas
                                                    :
                                                    null
                                                }
                                            </Col>
                                            <Col span={24} align="start" style={{fontSize: 17}}>
                                                Questões Respondidas
                                            </Col>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={24} md={6}>
                                    <Row type="flex"  align="middle">
                                        <Col span={10} align="end" style={{paddingRight: 25}}>
                                            <Icon type="smile" style={{fontSize: 35, color: '#f88b0e'}} />
                                        </Col>
                                        <Col span={14}>
                                            <Col span={24} align="start" style={{fontSize: 20, fontWeight: 800, color: '#f88b0e'}}>
                                                {
                                                    this.props.mainData.dash_aluno ?
                                                    this.props.mainData.dash_aluno.total.totalQuestoesCertas
                                                    :
                                                    null
                                                }
                                            </Col>
                                            <Col span={24} align="start" style={{fontSize: 17}}>
                                                Respondidas Corretamente
                                            </Col>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={24} md={6}>
                                    <Row type="flex"  align="middle">
                                        <Col span={10} align="end" style={{paddingRight: 25}}>
                                            <Icon type="check" style={{fontSize: 35, color: '#13a54b'}} />
                                        </Col>
                                        <Col span={14}>
                                            <Col span={24} align="start" style={{fontSize: 20, fontWeight: 800, color: '#13a54b'}}>
                                                {
                                                    this.props.mainData.dash_aluno ?
                                                    this.props.mainData.dash_aluno.total.totalSimulado
                                                    :
                                                    null
                                                }
                                            </Col>
                                            <Col span={24} align="start" style={{fontSize: 17}}>
                                                Simulados Realizados
                                            </Col>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={24} md={6}>
                                    <Row type="flex"  align="middle">
                                        <Col span={10} align="end" style={{paddingRight: 25}}>
                                            <Icon type="percentage" style={{fontSize: 35, color: '#13a54b'}} />
                                        </Col>
                                        <Col span={14}>
                                            <Col span={24} align="start" style={{fontSize: 20, fontWeight: 800, color: '#13a54b'}}>
                                                {
                                                    this.props.mainData.dash_aluno ?
                                                    parseFloat(this.props.mainData.dash_aluno.total.totalPercentual.toFixed(2))
                                                    :
                                                    null
                                                }
                                            </Col>
                                            <Col span={24} align="start" style={{fontSize: 17}}>
                                                Percentual
                                            </Col>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            :
                            <Row>
                                <Col span={24}>
                                    Nenhum simulado disponível.
                                </Col>
                            </Row>
                    }
                </Content>
                {
                (this.props.mainData && this.props.mainData.dash_aluno) ?
                    <Content style={{
                        margin: "20px 25px 0 25px",
                        padding: 24,
                        background: "#fff"
                    }}>
                        <Table
                            columns={ columns } 
                            dataSource={ this.state.tableData }
                            loading={this.state.tableLoading}
                        />
                    </Content>
                    : null
                }
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        backEndPoint: state.backEndPoint,
        mainData: state.mainData,
        contexto: state.contexto,
        contextoAluno: state.contextoAluno,
        flagSimuladoFinalizado: state.flagSimuladoFinalizado,
        authHeaders: state.authHeaders
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) },
        setSimuladoFinalizado: (simuladoFinalizado) => { dispatch({ type: 'SET_SIMULADOFINALIZADO', simuladoFinalizado }) },
        setMainData: (mainData) => { dispatch({ type: 'SET_MAINDATA', mainData }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Dashboard))