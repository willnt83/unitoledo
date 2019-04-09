import React, { Component } from 'react'
import { Layout, Table, Row, Col } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import moment from 'moment'
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import "./static/style.css"

const { Content } = Layout

function Label(props) {
    return <div style={{ marginTop: 25, marginBottom: 5 }}>{props.children}</div>;
  }

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
        console.log('this.props.contexto', this.props.contexto)
        console.log('this.props.mainData', this.props.mainData)

        if(this.props.mainData === null || this.props.contexto !== 'ALUNO'){
            this.props.resetAll()
            window.location.replace("/")
        }


        this.setState({
            tableData: this.props.mainData.dash_aluno.list.map(simulado => {
                var dataInicio = moment(simulado.dataInicio, 'YYYY-MM-DD').format('DD/MM/YYYY')
                var dataFim = moment(simulado.dataFinal, 'YYYY-MM-DD').format('DD/MM/YYYY')
                return({
                    id: simulado.idSimulado,
                    dataInicio,
                    dataFim,
                    questoesRespondidas: simulado.questoesRespondidas,
                    respostasCorretas: simulado.questoesCertas
                })
            })
        })


    }

    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                sorter: (a, b) => a.id - b.id
            },
            {
				title: "Início",
				dataIndex: "dataInicio",
				sorter: (a, b) => this.compareByDates(a.dataInicio, b.dataInicio)
            },
            {
				title: "Fim",
				dataIndex: "dataFim",
				sorter: (a, b) => this.compareByDates(a.dataFim, b.dataFim)
            },
            {
                title: 'Questões Respondidas',
                dataIndex: 'questoesRespondidas',
                sorter: (a, b) => a.questoesRespondidas - b.questoesRespondidas
            },
            {
                title: 'Respostas Corretas',
                dataIndex: 'respostasCorretas',
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
                    
                    <Row>
                        <Col span={8} align="middle">
                            <Label>Questões Respondidas</Label>
                            <div style={{ width: '100px' }}>
                            <CircularProgressbar percentage={83} text='83%' />
                            </div>
                        </Col>
                        <Col span={8} align="middle">
                            <Label>Acertos</Label>
                            <div style={{ width: '100px' }}>
                            <CircularProgressbar percentage={83} text='83%' />
                            </div>
                        </Col>
                        <Col span={8} align="middle">
                            <Label>Simulados Concluídos</Label>
                            <div style={{ width: '100px' }}>
                            <CircularProgressbar percentage={83} text='83%' />
                            </div>
                        </Col>
                    </Row>
                    <Table
                        columns={ columns } 
                        dataSource={ this.state.tableData }
                        loading={this.state.tableLoading}
                        style={{marginTop: 30}}
                    />
                </Content>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData,
        contexto: state.contexto
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Dashboard))