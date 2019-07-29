import React, { Component } from 'react'
import { Layout, Table, Row, Col, Icon, Progress } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import axios from "axios"
import moment from 'moment'

const { Content } = Layout

class Dashboard extends Component {

    constructor(props) {
        super()
    }

    state = {
        tableData: [],
        tableLoading: false,
        showModal: false,
        simuladoId: null,
        confirmarRemocaoLoading: false,
        showModalImprimir: false,
        simulado: null,
        dataDash: []
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
        if(this.props.mainData === null || (this.props.contexto !== 'COORDENADOR' && this.props.contexto !== 'PROFESSOR' && this.props.contexto !== 'APPPROVA - ADMIN')){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }

        this.props.resetSimulado();
        this.getSimulados()
    }


    getSimulados = () => {
        if(this.props.mainData.user && this.props.mainData.user === 'APPProva - Admin')
            window.location.replace("/app-prova/admin/banco-de-questoes")
        if(this.props.mainData.cursos){
            var cursos = this.props.mainData.cursos.map(curso => {
                return({
                    id: curso.id,
                    nome: curso.nome,
                    idPeriodoLetivo: this.props.periodoLetivo
                })
            })
        }
        if(this.props.mainData.turmas){
            var turmas = this.props.mainData.turmas
            .map(turma => {
                return({
                    id: turma.id,
                    nome: turma.nome,
                    idPeriodoLetivo: turma.idPeriodoLetivo,
                    idCurso: turma.idCurso
                })
            })
        }
        if(this.props.mainData.disciplinas){
            var disciplinas = this.props.mainData.disciplinas
            .map(disciplina => {
                return({
                    id: disciplina.id,
                    nome: disciplina.nome,
                    idPeriodoLetivo: disciplina.idPeriodoLetivo,
                    idTurma: disciplina.idTurma
                })
            })
        }
        var request = {
            cursos: cursos,
            turmas: turmas,
            disciplinas: disciplinas
        }
        

        axios.post(this.props.backEndPoint+'/api/getDashAdmin', request)
        .then(res => {
            console.log(res)
            var dataDash = res.data;
            this.setState({dataDash})
            
            var inicio = null
            var termino = null
            var tableData = []
            tableData = res.data.list.map(list => {
                inicio = moment(list.dataInicio)
                termino = moment(list.dataFinal)
                return ({
                    key: list.idSimulado,
                    nome: list.nome,
                    questoesRespondidas: list.questoesRespondidas,
                    respostasCorretas: list.questoesCertas,
                    percentual: list.percentual,
                    dataInicio: inicio.format('DD/MM/YYYY HH:mm'),
                    dataFim: termino.format('DD/MM/YYYY HH:mm'),
                    inicioObj: inicio,
                    terminoObj: termino
                })
            })

            this.setState({tableLoading: false})
            this.setState({tableData})
        })
        .catch(error =>{
            console.log('error: ', error)
            this.setState({tableLoading: false})
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
            {
                title: 'Percentual',
                dataIndex: 'percentual',
                align: "center",
                sorter: (a, b) => a.percentual - b.percentual
            },
        ]

        return(
            <React.Fragment>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        background: "#fff"
                    }}
                >
                {
                     (this.state.dataDash && this.state.dataDash.total) ?
                        <Row>
                            <Col sm={24} md={6}>
                                <Row type="flex">
                                    <Col md={24} align="center">
                                        <Progress 
                                            type="dashboard" 
                                            gapDegree={360}
                                            percent={1}
                                            format={() => 
                                                this.state.dataDash.total.totalSimulado ?
                                                this.state.dataDash.total.totalSimulado
                                                : 0
                                            }
                                        />
                                    </Col>
                                    <Col md={24} style={{fontSize: 17}} align="center">
                                        Simulados Concluídos
                                    </Col>  
                                </Row>
                            </Col>
                            <Col sm={24} md={6}>
                                <Row type="flex">
                                    <Col md={24} align="center">
                                        <Progress 
                                            type="dashboard" 
                                            gapDegree={360}
                                            strokeColor="#FFA500"
                                            percent={1}
                                            format={() =>
                                                this.state.dataDash.total.totalQuestoesRespondidas ?
                                                this.state.dataDash.total.totalQuestoesRespondidas
                                                : null
                                            } 
                                        />
                                    </Col>
                                    <Col md={24} align="center" style={{fontSize: 17}}>
                                        Questões Respondidas
                                    </Col>  
                                </Row>
                            </Col>  
                            <Col sm={24} md={6}>
                                <Row type="flex">
                                    <Col md={24} align="center">
                                        <Progress 
                                            type="dashboard" 
                                            strokeColor="#006400"
                                            gapDegree={360}
                                            percent={1}
                                            format={() =>
                                                this.state.dataDash.total.totalQuestoesCertas ?
                                                this.state.dataDash.total.totalQuestoesCertas
                                                : 0
                                            } 
                                        />
                                    </Col>
                                    <Col md={24} align="center" style={{fontSize: 17}}>
                                        Questões Certas
                                    </Col>  
                                </Row>
                            </Col>  
                            <Col sm={24} md={6}>
                                <Row type="flex">
                                    <Col md={24} align="center">
                                        <Progress 
                                            type="circle" 
                                            percent={
                                                this.state.dataDash.total ?
                                                this.state.dataDash.total.totalPercentual
                                                : null
                                            } 
                                        />
                                    </Col>
                                    <Col md={24} align="center" style={{fontSize: 17}}>
                                        Percentual de acerto
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
                <Content
                    style={{
                        margin: "16px 16px",
                        padding: 24,
                        background: "#fff"
                    }}
                >
                    <Table
                        columns={ columns } 
                        dataSource={ this.state.tableData }
                        loading={this.state.tableLoading}
                        scroll={{x: 1000}}
                    />
                </Content>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData,
        contexto: state.contexto,
        backEndPoint: state.backEndPoint,
        periodoLetivo: state.periodoLetivo,
        simulado: state.simulado
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) },
        resetSimulado: () => { dispatch({ type: 'RESET_SIMULADO' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Dashboard))