import React, { Component } from "react"
import { Layout, Form, Input, Button, Table, Row, Col, Icon } from "antd"
import { Link } from "react-router-dom"
import { connect } from 'react-redux'

const { Content } = Layout
const FormItem = Form.Item
const tableData = [
    {
        key: 1,
        nome: 'Análise e Desenvolvimento de Sistemas - 06/2017',
        status: 1,
        instituicao: 'Unitoledo - Araçatuba - SP',
        comecou: '30/10/2017',
        finaliza: '30/10/2017'
    },
    {
        key: 2,
        nome: 'Simulado - Teste',
        status: 0,
        instituicao: 'Unitoledo - Araçatuba - SP',
        comecou: '02/03/2018',
        finaliza: '02/03/2018'
    },
    {
        key: 3,
        nome: 'Análise e Desenvolvimento de Sistemas - 10/2017',
        status: 1,
        instituicao: 'Unitoledo - Araçatuba - SP',
        comecou: '15/20/2018',
        finaliza: '15/20/2018'
    }
]


class Simulados extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados')
    }

    handleSubmit = () => {
        console.log('submit')
    }

    render(){
        const columns = [
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
				title: "Instituição",
				dataIndex: "instituicao",
				sorter: (a, b) => a.id - b.id
			},
			{
				title: "Começou em",
				dataIndex: "comecou",
				sorter: (a, b) => a.id - b.id
			},
			{
				title: "Finaliza em",
				dataIndex: "finaliza",
				sorter: (a, b) => a.id - b.id
            },
            {
				title: "Operação",
				colSpan: 2,
				dataIndex: "operacao",
				align: "center",
				width: 150,
				render: (text, record) => {
					return (
                        <React.Fragment>
                            <Button type="primary"><Icon type="reload" />Republicar</Button>
                        </React.Fragment>
					);
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
                        dataSource={ tableData }
                    />
                    <Row>
                        <Col span="24" align="middle">
                            <Link to="/admin/simulados/novo/step-1"><Button type="primary"><Icon type="plus" />Novo Simulado</Button></Link>
                        </Col>
                    </Row>
                </Content>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(null, mapDispatchToProps)(Simulados)