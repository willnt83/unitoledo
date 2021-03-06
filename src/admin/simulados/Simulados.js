import React, { Component } from "react"
import { Layout, Button, Table, Row, Col, Icon, Modal } from "antd"
import { withRouter } from "react-router-dom"
import axios from "axios"
import { connect } from 'react-redux'
import moment from 'moment'
import ModalImprimir from './ModalImprimirSimulado'

const { Content } = Layout

class Simulados extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados')
    }

    state = {
        tableData: null,
        tableLoading: false,
        showModal: false,
        simuladoId: null,
        confirmarRemocaoLoading: false,
        showModalImprimir: false,
        simulado: null,
        serverTimeObj: null
    }

    compareByDates = (a, b) => {
        a = moment(a, 'DD/MM/YYYY HH:mm')
        b = moment(b, 'DD/MM/YYYY HH:mm')
		if (a > b) return -1
		if (a < b) return 1
		return 0
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

        axios.post(this.props.backEndPoint+'/api/getAllSimulado', request)
        .then(res => {
            var inicio = null
            var termino = null
            var situacao = null
            var alvos = []
            var tableData = []
            tableData = res.data.map(simulado => {
                inicio = moment(simulado.dataHoraInicial)
                termino = moment(simulado.dataHoraFinal)
                situacao = (simulado.rascunho) ? 'Rascunho' : 'Público'

                alvos = []
                if(simulado.cursos && simulado.cursos.length > 0){
                    simulado.cursos.forEach(curso => {
                        alvos.push({
                            key: curso.id,
                            name: curso.nome,
                            tipo: 'Curso'
                        })
                    })
                }

                if(simulado.turmas && simulado.turmas.length > 0){
                    simulado.turmas.forEach(turma => {
                        alvos.push({
                            key: turma.id,
                            name: turma.nome,
                            tipo: 'Turma'
                        })
                    })
                }

                if(simulado.disciplinas && simulado.disciplinas.length > 0){
                    simulado.disciplinas.forEach(disciplina => {
                        alvos.push({
                            key: disciplina.id,
                            name: disciplina.nome,
                            tipo: 'Disciplina'
                        })
                    })
                }

                return ({
                    key: simulado.id,
                    nome: simulado.nome,
                    alvos: alvos,
                    questoes: simulado.questoes,
                    situacao: situacao,
                    rascunho: simulado.rascunho,
                    status: simulado.status,
                    inicio: inicio.format('DD/MM/YYYY HH:mm'),
                    termino: termino.format('DD/MM/YYYY HH:mm'),
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

    newSimulado = () => {
        this.props.history.push('/app-prova/admin/simulados/novo/step-1')
    }

    changeSimuladoSituacao = (id, rascunho) => {
        this.setState({tableLoading: true})
        var turnTo = rascunho ? false : true
        var request =  {
            "id": id,
            "rascunho": turnTo
        }

        axios.post(this.props.backEndPoint+'/api/updateStatus', request)
        .then(res => {
            this.getSimulados()
            this.getCurrentServerTime()
        })
        .catch(error =>{
            console.log('error: ', error)
            this.setState({tableLoading: false})
        })
    }

    editRepublicarSimulados = (record, op) => {
        this.setState({tableLoading: true})
        axios.get(this.props.backEndPoint+'/api/getSimuladoId/'+record.key)
        .then(res => {
            var response = res.data[0]
                // Transformando record para o formato de redux simulado
                var alvos = []
                var cursos = []
                var turmas = []
                var disciplinas = []

                // Cursos
                if(response.cursos && response.cursos.length > 0){
                    cursos = response.cursos.map(curso => {
                        return{
                            key: curso.id,
                            name: curso.nome,
                            tipo: 'Curso'
                        }
                    })
                    cursos.forEach(curso => {
                        alvos.push(curso)
                    })
                }

                // Turmas
                if(response.turmas && response.turmas.length > 0){
                    turmas = response.turmas.map(turma => {
                        return{
                            key: turma.id,
                            name: turma.nome,
                            parentKey: turma.idCurso,
                            tipo: 'Turma'
                        }
                    })
                    turmas.forEach(turma => {
                        alvos.push(turma)
                    })
                }

                // Disciplinas
                if(response.disciplinas && response.disciplinas.length > 0){
                    disciplinas = response.disciplinas.map(disciplina => {
                        return{
                            key: disciplina.id,
                            name: disciplina.nome,
                            parentKey: disciplina.idTurma,
                            tipo: 'Disciplina'
                        }
                    })
                    disciplinas.forEach(disciplina => {
                        alvos.push(disciplina)
                    })
                }

                this.setState({selectedRows: alvos})

                // Questões
                var questoes = []
                if(response.questoes.length > 0){
                    questoes = response.questoes.map(questao => {
                        return questao.id
                    })
                }

                // Datas
                var inicioObj = moment(response.dataHoraInicial)
                var terminoObj = moment(response.dataHoraFinal)
                var simulado = null

                if(op === 'editar'){
                    simulado = {
                        id: response.id,
                        nome: response.nome,
                        alvos: alvos,
                        questoes: questoes,
                        inicio: {
                            data: inicioObj.format('DD/MM/YYYY'),
                            hora: inicioObj.format('HH:mm')
                        },
                        fim: {
                            data: terminoObj.format('DD/MM/YYYY'),
                            hora: terminoObj.format('HH:mm')
                        },
                        enade: response.enade,
                        content: response.content,
                    }
                    this.props.setFullSimulado(simulado)
                    this.props.history.push('/app-prova/admin/simulados/novo/step-1')
                }
                else if(op === 'republicar'){
                    simulado = {
                        id: null,
                        nome: response.nome,
                        alvos: alvos,
                        questoes: questoes,
                        inicio: {
                            data: null,
                            hora: null
                        },
                        fim: {
                            data: null,
                            hora: null
                        },
                        enade: response.enade,
                        content: response.content
                    }
                    this.props.setFullSimulado(simulado)
                    this.props.history.push('/app-prova/admin/simulados/novo/step-1')
                }
                else{ // imprimir
                    this.props.setFullSimulado(simulado)
                    
                }
                this.setState({tableLoading: false})
        })
        .catch(error =>{
            console.log(error)
            this.setState({tableLoading: false})
        })
    }

    deleteSimulado = (id) => {
        this.setState({tableLoading: true, confirmarRemocaoLoading: true})
        axios.get(this.props.backEndPoint+'/api/deleteSimulado/'+id)
        .then(res => {
            this.showModal(false, '')
            this.setState({confirmarRemocaoLoading: false})
            this.getSimulados()
            this.getCurrentServerTime()
        })
        .catch(error =>{
            console.log('error: ', error)
            this.setState({tableLoading: false, confirmarRemocaoLoading: false})
        })
    }

    showModal = (bool, id) => {
        this.setState({showModal: bool, simuladoId: id})
    }

    handleShowModalImprimir = (record, bool) => {
        if(bool){
            this.setState({tableLoading: true})
            axios.get(this.props.backEndPoint+'/api/getSimuladoIdPrint/'+record.key)
            .then(res => {
                this.setState({showModalImprimir: bool, simulado: res.data[0], tableLoading: false})
            })
            .catch(error =>{
                console.log(error)
                this.setState({tableLoading: false})
            })
        }
        else
            this.setState({showModalImprimir: bool})
    }

    handleModalOk = () => {
        this.deleteSimulado(this.state.simuladoId)
    }

    handleModalCancel = () => {
        this.showModal(false, null)
    }

    componentWillMount(){
        if(this.props.mainData === null || (this.props.contexto !== 'COORDENADOR' && this.props.contexto !== 'PROFESSOR')){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }

        this.props.resetSimulado()
        this.setState({tableLoading: true})
        this.getSimulados()
        this.getCurrentServerTime()
    }

    getCurrentServerTime = () => {
        // Recuperando horário do servidor
        axios.get(this.props.backEndPoint+'/api/getDateTime')
        .then(res => {             
            var currentDTObj = moment(res.data, 'YYYY-MM-DDTHH:mm:ss')
            this.setState({serverTimeObj: currentDTObj})
        })
        .catch(error =>{
            console.log(error)
        })
    }

    render(){
        const columns = [
            {
				title: "ID",
                dataIndex: "key",
                width: 100,
                sorter: (a, b) => a.key - b.key,
                /*fixed: 'left'*/
            },
			{
				title: "Nome",
                dataIndex: "nome",
                sorter: (a, b) => { return a.nome.localeCompare(b.nome)},
                width: 400,
                /*fixed: 'left'*/
            },
            {
				title: "Disponibilidade",
                dataIndex: "situacao",
                align: "center",
                width: 160,
				sorter: (a, b) => { return a.situacao.localeCompare(b.situacao)}
            },
            {
				title: "Status",
                dataIndex: "status",
                align: "center",
                width: 150,
				sorter: (a, b) => { return a.status.localeCompare(b.status)}
            },
			{
				title: "Início em",
                dataIndex: "inicio",
                align: "center",
                width: 200,
				sorter: (a, b) => this.compareByDates(a.inicio, b.inicio)
			},
			{
				title: "Término em",
                dataIndex: "termino",
                align: "center",
                width: 200,
				sorter: (a, b) => this.compareByDates(a.termino, b.termino)
            },
            {
				title: "Ações",
				colSpan: 1,
				dataIndex: "actions",
				align: "center",
                width: 300,
                className: "actionCol",
				render: (text, record) => {
                    var publicarButtonDisabled = false
                    var moverRascunhoButtonDisabled = false
                    var editarButtonDisabled = false
                    var exlcuirButtonDisabled = false
                    var republicarButtonDisabled = false

                    publicarButtonDisabled = record.rascunho ? false : true
                    moverRascunhoButtonDisabled = record.rascunho ? true : false
                    
                    var currDateTime = moment(this.state.serverTimeObj, "DD/MM/YYYY HH:mm:ss")
                    //var currDateTime = moment()
                    console.log('Data e hora servidor ' + currDateTime)
                    
                    if(
                        (record.inicioObj <= currDateTime && currDateTime <= record.terminoObj && record.situacao !== 'Rascunho') ||
                        record.status === 'Realizado'
                    ){
                        publicarButtonDisabled = true
                        moverRascunhoButtonDisabled = true
                        editarButtonDisabled = true
                        exlcuirButtonDisabled = true
                    }
                    else{
                        republicarButtonDisabled = true
                    }
                    

					return (
                        <React.Fragment>
                            <Row>
                                <Col span={24}>
                                    <Button className="actionButton buttonGreen" title="Publicar" onClick={() => this.changeSimuladoSituacao(record.key, record.rascunho)} disabled={publicarButtonDisabled}><Icon type="global" /></Button>
                                    <Button className="actionButton buttonOrange" title="Mover para Rascunho" onClick={() => this.changeSimuladoSituacao(record.key, record.rascunho)} disabled={moverRascunhoButtonDisabled}><Icon type="file-text" /></Button>
                                    <Button className="actionButton" title="Editar" type="primary" onClick={() => this.editRepublicarSimulados(record, 'editar')} disabled={editarButtonDisabled}><Icon type="edit" /></Button>
                                </Col>
                            </Row>
                            <Row  style={{marginTop: 5}}>
                                <Col span={24}>
                                    <Button className="actionButton buttonRed" title="Excluir" onClick={() => this.showModal(true, record.key)} disabled={exlcuirButtonDisabled}><Icon type="delete" /></Button>
                                    <Button className="actionButton buttonPurple" title="Republicar" onClick={() => this.editRepublicarSimulados(record, 'republicar')} disabled={republicarButtonDisabled}><Icon type="redo" /></Button>
                                    <Button className="actionButton buttonGreen" title="Imprimir" onClick={() => this.handleShowModalImprimir(record, true)}><Icon type="printer" /></Button>
                                </Col>
                            </Row>
                        </React.Fragment>
					)
				}
			}
        ]
        return(
            <React.Fragment>
                <Content
                    style={{
                        margin: "12px 16px 0 16px",
                        padding: 24,
                        background: "#fff",
                        minHeight: 200
                    }}
                >
                    <Table
                        columns={ columns }
                        dataSource={ this.state.tableData }
                        loading={ this.state.tableLoading }
                        scroll = {{x : 1000}}
                    />
                    <Row>
                        <Col span={24} align="middle">
                            <Button type="primary" onClick={() => this.newSimulado()}><Icon type="plus" />Novo Simulado</Button>
                        </Col>
                    </Row>
                </Content>
                <Modal
                    title="Atenção!"
                    visible={this.state.showModal}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                    footer={[
                        <Button key="back" onClick={this.handleModalCancel}><Icon type="close" />Cancelar</Button>,
                        <Button className="buttonGreen" key="submit" type="primary" onClick={this.handleModalOk}>
                            <Icon type="check" />Confirmar
                        </Button>,
                    ]}
                >
                    <p>Confirma remoção do simulado?</p>
                </Modal>

                <ModalImprimir
					showModalImprimir = {this.state.showModalImprimir}
                    handleShowModalImprimir = {this.handleShowModalImprimir}
                    simulado = {this.state.simulado}
				/>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        backEndPoint: state.backEndPoint,
        contexto: state.contexto,
        mainData: state.mainData,
        periodoLetivo: state.periodoLetivo,
        simulado: state.simulado
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        resetSimulado: () => { dispatch({ type: 'RESET_SIMULADO' }) },
        setFullSimulado: (simulado) => { dispatch({ type: 'SET_SIMULADOSFULL', simulado }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Simulados))