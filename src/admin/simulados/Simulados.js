import React, { Component } from "react"
import { Layout, Form, Input, Button, Table, Row, Col, Icon } from "antd"
import { Link } from "react-router-dom"
import axios from "axios"
import { connect } from 'react-redux'
import moment from 'moment'
//moment.locale('pt-br')

const { Content } = Layout
const FormItem = Form.Item

class Simulados extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados')
    }

    state = {
        tableData: null,
        tableLoading: false
    }

    handleSubmit = () => {
        console.log('submit')
    }

    componentWillMount(){
        this.setState({tableLoading: true})
        console.log('props', this.props)
        var cursos = this.props.mainData.cursos.map(curso => {
            return({
                id: curso.id,
                nome: curso.nome,
                idPeriodoLetivo: curso.idPeriodoLetivo
            })
        })

        var turmas = this.props.mainData.turmas.map(turma => {
            return({
                id: turma.id,
                nome: turma.nome,
                idPeriodoLetivo: turma.idPeriodoLetivo,
                idCurso: turma.idCurso
            })
        })

        var disciplinas = this.props.mainData.disciplinas.map(disciplina => {
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

        console.log('request', request)

        axios.post('http://localhost:5000/api/getSimuladoPeriodo', request)
        .then(res => {
            console.log('response: ', res.data)

            var tableData = res.data.map(simulado => {
                var status = (simulado.rascunho) ? 'Rascunho' : 'Público'
                var inicio = moment(simulado.dataHoraInicial).format('DD/MM/YYYY')
                var termino = moment(simulado.dataHoraFinal).format('DD/MM/YYYY')
                return({
                    id: simulado.id,
                    nome: simulado.nome,
                    status: status,
                    inicio: inicio,
                    termino: termino
                })
            })
            this.setState({tableLoading: false})
            console.log('tableData', tableData)
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
				title: "ID",
				dataIndex: "id",
				sorter: (a, b) => a.id - b.id
            },
			{
				title: "Nome",
				dataIndex: "nome",
				sorter: (a, b) => a.id - b.id
            },
            {
				title: "Status",
				dataIndex: "status",
				sorter: (a, b) => a.id - b.id
			},
			{
				title: "Início em",
				dataIndex: "inicio",
				sorter: (a, b) => a.id - b.id
			},
			{
				title: "Término em",
				dataIndex: "termino",
				sorter: (a, b) => a.id - b.id
            },
            {
				title: "Ações",
				colSpan: 2,
				dataIndex: "actions",
				align: "center",
                width: 300,
                className: "actionCol",
				render: (text, record) => {
					return (
                        <React.Fragment>
                            <Button className="actionButton buttonGreen" title="Publicar"><Icon type="global" /></Button>
                            <Button className="actionButton buttonOrange" title="Mover para Rascunho"><Icon type="file-text" /></Button>
                            <Button className="actionButton" title="Editar" type="primary"><Icon type="edit" /></Button>
                            <Button className="actionButton buttonRed" title="Excluir"><Icon type="delete" /></Button>
                        </React.Fragment>
					);
				}
			}
        ]
        return(
            <React.Fragment>
                {/*
                <Content
                    style={{
                        margin: "12px 16px 0 16px",
                        padding: 24,
                        background: "#fff",
                        maxHeight: 200
                    }}
                >
                    <h3>Buscar Simulados</h3>
                    <Form layout="vertical">
                        <FormItem
                            label="Nome"
                        >
                            <Input placeholder="Digite o nome do simulado" />
                        </FormItem>
                        <FormItem>
                            <Button type="primary"><Icon type="search" />Buscar</Button>
                        </FormItem>
                    </Form>
                </Content>
                */}

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
                    />
                    <Row>
                        <Col span={24} align="middle">
                            <Link to="/admin/simulados/novo/step-1"><Button type="primary"><Icon type="plus" />Novo Simulado</Button></Link>
                        </Col>
                    </Row>
                </Content>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Simulados)