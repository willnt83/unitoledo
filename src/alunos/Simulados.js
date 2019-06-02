import React, { Component } from 'react'
import { Layout, Table, Button, Icon } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import "../static/style.css"

const { Content } = Layout

class Simulados extends Component {
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

    getSimulado = (record) => {
        console.log('record', record)
        this.setState({tableLoading: true})
        var request = {
            "id": record.key,
            "status": "Em andamento"
        }

        axios.post(this.props.backEndPoint+'/api/statusSimulado', request)
        .then(res => {
            axios.get(this.props.backEndPoint+'/api/getSimuladoIdAlunoQuestao/'+record.key+'/'+this.props.contextoAluno.idUtilizador+'/'+this.props.usuarioNome)
            .then(res => {
                this.setState({tableLoading: false})
                var inicioObj = moment(record.inicio, 'DD/MM/YYYY HH:mm')
                var fimObj = moment(record.fim, 'DD/MM/YYYY HH:mm')

                var simulado = {
                    id: record.key,
                    nome: record.nome,
                    inicio: {
                        data: inicioObj.format('DD/MM/YYYY'),
                        hora: inicioObj.format('HH:mm')
                    },
                    fim: {
                        data: fimObj.format('DD/MM/YYYY'),
                        hora: fimObj.format('HH:mm')
                    },
                    questoes: res.data
                }
                console.log('setSimulado', simulado)
                this.props.setSimulado(simulado)
                this.props.history.push('/app-prova/alunos/execucao-simulado')
            })
            .catch(error =>{
                this.setState({tableLoading: false})
                console.log(error)
            })
        })
        .catch(error =>{
            console.log(error)
        })
    }

    buildTableData = () => {
        var tableData = this.props.mainData.simulados.map(simulado => {
            var inicioObj = moment(simulado.dataHoraInicial)
            var inicio = inicioObj.format('DD/MM/YYYY HH:mm')
            var terminoObj = moment(simulado.dataHoraFinal)
            var termino = terminoObj.format('DD/MM/YYYY HH:mm')


            var status = simulado.status
            var btnExecutarDisabled = false
            var currDate = moment()
            
            if(terminoObj <= currDate)
                status = 'Expirado'

            if(status === 'Expirado' || status === 'Finalizado' || inicioObj > currDate)
                btnExecutarDisabled = true

            return({
                key: simulado.id,
                nome: simulado.nome,
                inicio: inicio,
                fim: termino,
                status: status,
                btnExecutarDisabled
            })
        })
        this.setState({tableData})
    }

    componentWillMount(){
        if(this.props.mainData === null || this.props.contexto !== 'ALUNO'){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }

        var requestData = this.props.contextoAluno

        axios.defaults.headers = {
            'Authorization': this.props.authHeaders.token
        }

        //if(this.props.flagSimuladoFinalizado){
            this.setState({tableLoading: true})
            axios.post(this.props.backEndPoint+'/api/getData', requestData)
            .then(res => {
                this.props.setMainData(res.data)
                this.buildTableData()
                this.setState({tableLoading: false})
            })
            .catch(error =>{
                console.log(error)
            })
        //}
        //else{
            this.buildTableData()
        //}
        
    }

    render() {
        console.log('this.props.usuarioNome', this.props.usuarioNome)
        const columns = [
            {
                title: 'ID',
                dataIndex: 'key',
                sorter: (a, b) => a.key - b.key
            },
			{
				title: "Descrição",
				dataIndex: "nome",
                sorter: (a, b) => { return a.nome.localeCompare(b.nome)},
                width: 300
            },
            {
				title: "Inicia em",
				dataIndex: "inicio",
				sorter: (a, b) => this.compareByDates(a.inicio, b.inicio)
			},
            {
				title: "Finaliza em",
				dataIndex: "fim",
				sorter: (a, b) => this.compareByDates(a.fim, b.fim)
            },
            {
                title: 'Status',
                dataIndex: 'status',
                sorter: (a, b) => { return a.status.localeCompare(b.status)}
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
                            <Button className="actionButton buttonGreen" title="Executar" onClick={() => this.getSimulado(record)} disabled={record.btnExecutarDisabled}><Icon type="caret-right" /></Button>
                        </React.Fragment>
					)
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
                        scroll={{ y: 950 }}
                    />
                </Content>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        backEndPoint: state.backEndPoint,
        mainData: state.mainData,
        usuarioId: state.usuarioId,
        flagSimuladoFinalizado: state.flagSimuladoFinalizado,
        contextoAluno: state.contextoAluno,
        usuarioNome: state.usuarioNome,
        contexto: state.contexto,
        authHeaders: state.authHeaders
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSimulado: (simulado) => { dispatch({ type: 'SET_SIMULADORESOLUCAO', simulado }) },
        setMainData: (mainData) => { dispatch({ type: 'SET_MAINDATA', mainData }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Simulados))