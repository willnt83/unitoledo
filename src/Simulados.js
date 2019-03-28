import React, { Component } from 'react'
import { Layout, Table, Button, Icon } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import "./static/style.css"

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
        this.setState({tableLoading: true})
        var request = {
            "id": record.key,
            "status": "Em andamento"
        }

        axios.post('http://localhost:5000/api/statusSimulado', request)
        .then(res => {
            axios.get('http://localhost:5000/api/getSimuladoIdAlunoQuestao/'+record.key+'/'+this.props.contextoAluno.idUtilizador)
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
            window.location.replace("/")
        }

        var requestData = this.props.contextoAluno

        axios.defaults.headers = {
            'Authorization': this.props.authHeaders.token
        }

        //if(this.props.flagSimuladoFinalizado){
            this.setState({tableLoading: true})
            axios.post('http://localhost:5000/api/getData', requestData)
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
        const columns = [
            {
                title: 'ID',
                dataIndex: 'key',
                sorter: (a, b) => a.key - b.key,
            },
			{
				title: "Descrição",
				dataIndex: "nome",
                sorter: (a, b) => { return a.nome.localeCompare(b.nome)},
                width: 799
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
                    />
                </Content>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData,
        usuarioId: state.usuarioId,
        flagSimuladoFinalizado: state.flagSimuladoFinalizado,
        contextoAluno: state.contextoAluno,
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