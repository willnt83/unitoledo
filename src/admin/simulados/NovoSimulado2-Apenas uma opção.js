import React, { Component } from "react"
import { Layout, Row, Col, Button, Table } from "antd"
import { Link } from "react-router-dom"
import SimuladoSteps from './SimuladoSteps'
import { connect } from 'react-redux'

const { Content } = Layout
const tableData = [
    {id: 1, description: 'Tecnologia em Alimentos'},
    {id: 2, description: 'Tecnologia em Construção de Edifícios'},
    {id: 3, description: 'Tecnologia em Fabricação Mecânica'},
    {id: 4, description: 'Tecnologia em Fotografia'},
    {id: 5, description: 'Tecnologia em Gastronomia'},
    {id: 6, description: 'Tecnologia em Jogos Digitais'},
    {id: 7, description: 'Tecnologia em Processos Químicos'},
    {id: 8, description: 'Tecnologia em Produção Multimídia'},
    {id: 9, description: 'Tecnologia em Saneamento Ambiental'},
    {id: 10, description: 'Química'}
]

class NovoSimulado2 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Seleção de Curso')
    }

    state = {
        selectedRowKeysCurso: [],
    };

    selectRow = (record) => {
        console.log(record)
        let selectedRowKeys = [...this.state.selectedRowKeys]
        if (selectedRowKeys.indexOf(record.id) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
        }
        else {
            selectedRowKeys = []
            selectedRowKeys.push(record.id)
        }
        this.setState({ selectedRowKeys })
    }
    onSelectedRowKeysChange = (selectedRowKeys) => {
        if(selectedRowKeys.length === 1)
            this.setState({ selectedRowKeys })
        else if(selectedRowKeys.length === 2){
            this.setState({ selectedRowKeys: [selectedRowKeys[1]] })
        }
        else
            this.setState({ selectedRowKeys: [] })
    }

    render(){
        const columns = [
			{
				title: "Cursos",
				dataIndex: "description"
            }
        ]
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
        }

        return(
            <React.Fragment>
                <SimuladoSteps step={1} />
                    <Row>
                        <Col span={12}>
                            <Content
                                style={{
                                    margin: "24px 16px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 280
                                }}
                            >
                                <Row style={{ marginBottom: 20 }}>
                                    <Col span="24">
                                        <Table
                                            rowSelection={ rowSelection }
                                            columns={ columns }
                                            dataSource={ tableData }
                                            rowKey={ record => record.id }
                                            onRow={(record) => ({
                                                onClick: () => {
                                                this.selectRow(record);
                                                },
                                            })}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12" align="start">
                                        <Link to="/admin/simulados/novo/step-1"><Button type="primary">Anterior</Button></Link>
                                    </Col>
                                    <Col span="12" align="end">
                                        <Link to="/admin/simulados/novo/step-3"><Button type="primary">Próximo</Button></Link>
                                    </Col>
                                </Row>
                            </Content>
                        </Col>
                        <Col span={12}>
                            <Content
                                style={{
                                    margin: "24px 16px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 280
                                }}
                            >
                            <div>aaaaaaaaaaahhhhhhh</div>
                            </Content>
                        </Col>
                    </Row>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(null, mapDispatchToProps)(NovoSimulado2)