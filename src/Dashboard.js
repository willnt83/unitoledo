import React, { Component } from 'react'
import { Layout, Table, Row, Col, Icon } from 'antd'
import { withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import moment from 'moment'
//import CircularProgressbar from 'react-circular-progressbar';
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
				title: "Iniciou em",
				dataIndex: "dataInicio",
				sorter: (a, b) => this.compareByDates(a.dataInicio, b.dataInicio)
            },
            {
				title: "Finalizou em",
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
        console.log('this.props.mainData.dash_aluno.total.totalQuestoesCertas', this.props.mainData.dash_aluno.total.totalQuestoesCertas)
        return (
            <React.Fragment>
                <Content style={{
                    margin: "20px 25px 0 25px",
                    padding: 24,
                    background: "#fff"
                }}>
                    <h3>Dashboard</h3>
                    
                    <Row>
                        <Col span={8}>
                            <Row type="flex"  align="middle">
                                <Col span={10} align="end" style={{paddingRight: 25}}>
                                    <Icon type="edit" style={{fontSize: 35, color: '#4286f4'}} />
                                </Col>
                                <Col span={14}>
                                    <Col span={24} align="start" style={{fontSize: 20, fontWeight: 800, color: '#4286f4'}}>
                                        {this.props.mainData.dash_aluno.total.totalQuestoesCertas}
                                    </Col>
                                    <Col span={24} align="start" style={{fontSize: 17}}>
                                        Questões Respondidas
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row type="flex"  align="middle">
                                <Col span={10} align="end" style={{paddingRight: 25}}>
                                    <Icon type="smile" style={{fontSize: 35, color: '#f88b0e'}} />
                                </Col>
                                <Col span={14}>
                                    <Col span={24} align="start" style={{fontSize: 20, fontWeight: 800, color: '#f88b0e'}}>
                                        {this.props.mainData.dash_aluno.total.totalQuestoesRespondidas}
                                    </Col>
                                    <Col span={24} align="start" style={{fontSize: 17}}>
                                        Respondidas Corretamente
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Row type="flex"  align="middle">
                                <Col span={10} align="end" style={{paddingRight: 25}}>
                                    <Icon type="check" style={{fontSize: 35, color: '#13a54b'}} />
                                </Col>
                                <Col span={14}>
                                    <Col span={24} align="start" style={{fontSize: 20, fontWeight: 800, color: '#13a54b'}}>
                                        {this.props.mainData.dash_aluno.total.totalSimulado}
                                    </Col>
                                    <Col span={24} align="start" style={{fontSize: 17}}>
                                        Simulados Realizados
                                    </Col>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Content>
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