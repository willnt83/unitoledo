import React, { Component } from 'react'
import { Layout, Table, Row, Col, Icon, Progress } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import axios from "axios"


const { Content } = Layout

class Dashboard extends Component {

    constructor(props) {
        super()
    }

    state = {
        tableData: null,
        tableLoading: false,
        showModal: false,
        simuladoId: null,
        confirmarRemocaoLoading: false,
        showModalImprimir: false,
        simulado: null,
        dataDash: []
    }

    componentWillMount(){
        if(this.props.mainData === null || (this.props.contexto !== 'COORDENADOR' && this.props.contexto !== 'PROFESSOR' && this.props.contexto !== 'APPPROVA - ADMIN')){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }

        this.props.resetSimulado();
        this.getSimulados()
    }


    getSimulados = () => {
        var cursos = this.props.mainData.cursos.map(curso => {
            return({
                id: curso.id,
                nome: curso.nome,
                idPeriodoLetivo: this.props.periodoLetivo
            })
        })
        var turmas = this.props.mainData.turmas
        .map(turma => {
            return({
                id: turma.id,
                nome: turma.nome,
                idPeriodoLetivo: turma.idPeriodoLetivo,
                idCurso: turma.idCurso
            })
        })
        var disciplinas = this.props.mainData.disciplinas
        .map(disciplina => {
            return({
                id: disciplina.id,
                nome: disciplina.nome,
                idPeriodoLetivo: disciplina.idPeriodoLetivo,
                idTurma: disciplina.idTurma
            })
        })
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
            console.log(this.state.dataDash.total)
            // var inicio = null
            // var termino = null
            // var situacao = null
            // var alvos = []
            // var tableData = []
            // tableData = res.data.map(simulado => {
            //     inicio = moment(simulado.dataHoraInicial)
            //     termino = moment(simulado.dataHoraFinal)
            //     situacao = (simulado.rascunho) ? 'Rascunho' : 'Público'

            //     alvos = []
            //     if(simulado.cursos && simulado.cursos.length > 0){
            //         simulado.cursos.forEach(curso => {
            //             alvos.push({
            //                 key: curso.id,
            //                 name: curso.nome,
            //                 tipo: 'Curso'
            //             })
            //         })
            //     }

            //     if(simulado.turmas && simulado.turmas.length > 0){
            //         simulado.turmas.forEach(turma => {
            //             alvos.push({
            //                 key: turma.id,
            //                 name: turma.nome,
            //                 tipo: 'Turma'
            //             })
            //         })
            //     }

            //     if(simulado.disciplinas && simulado.disciplinas.length > 0){
            //         simulado.disciplinas.forEach(disciplina => {
            //             alvos.push({
            //                 key: disciplina.id,
            //                 name: disciplina.nome,
            //                 tipo: 'Disciplina'
            //             })
            //         })
            //     }

            //     return ({
            //         key: simulado.id,
            //         nome: simulado.nome,
            //         alvos: alvos,
            //         questoes: simulado.questoes,
            //         situacao: situacao,
            //         rascunho: simulado.rascunho,
            //         status: simulado.status,
            //         inicio: inicio.format('DD/MM/YYYY HH:mm'),
            //         termino: termino.format('DD/MM/YYYY HH:mm'),
            //         inicioObj: inicio,
            //         terminoObj: termino
            //     })
            // })

            // this.setState({tableLoading: false})
            // this.setState({tableData})
        })
        .catch(error =>{
            console.log('error: ', error)
            this.setState({tableLoading: false})
        })
    }
    render(){
        return(
            <Content
                style={{
                    margin: "24px 16px",
                    padding: 24,
                    background: "#fff",
                    minHeight: 280
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