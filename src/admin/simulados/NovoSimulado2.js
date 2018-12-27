import React, { Component } from "react"
import { Layout, Row, Col, Button, Table, Card } from "antd"
import { Link, withRouter } from "react-router-dom"
import SimuladoSteps from './SimuladoSteps'
import WarningMessage from './WarningMessage'
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
        selectedRowKeys: [],
        showWarning: false
    };

    selectRow = (record) => {
        console.log(record)
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.id) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1);
        } else {
            selectedRowKeys.push(record.id);
        }
        // Incluindo turmaDisciplina no redux store
        this.props.setSimuladoTurmaDisciplina({
            id: record.id,
            descricao: record.description
        })
        this.setState({ selectedRowKeys });
    }
    onSelectedRowKeysChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }

    handleProximoButton = () => {
        if(this.state.selectedRowKeys.length === 0){
            this.setState({
                showWarning: true
            })
        }
        else
            this.props.history.push('/admin/simulados/novo/step-3')
    }

    componentWillMount(){
        if(this.props.simulado.turmasDisciplinas.length > 0){
            let tempArray = []
            tempArray = this.props.simulado.turmasDisciplinas.map((item) => {
                return item.id
            })
            this.setState({
                selectedRowKeys: tempArray
            })
        }
    }

    componentWillUpdate(nextProps, nextState){
        if(nextState.selectedRowKeys.length !== this.state.selectedRowKeys.length)
            this.setState({
                showWarning: false
            })
    }

    render(){
        const columns = [
			{
				title: "Turma / Disciplina",
				dataIndex: "description"
            }
        ]
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange
        };

        return(
            <React.Fragment>
                <SimuladoSteps step={1} />
                    <Row type="flex">
                        <Col span={16}>
                            <Card
                                title="Selecione a Turma / Disciplina"
                                bordered={false}
                                style={{
                                    margin: "4px 4px 4px 16px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 620
                                }}>
                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={24}>
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
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                title="Selecionados"
                                bordered={false}
                                style={{
                                    margin: "4px 16px 4px 4px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 'calc(100% - 8px)'
                            }}>
                                <WarningMessage message="Nenhuma Turma / Disciplina selecionada" type="error" visible={this.state.showWarning} />
                                {
                                    this.props.simulado.turmasDisciplinas.map(turmaDisciplina => {
                                        return (
                                            <p key={ turmaDisciplina.id }>{ turmaDisciplina.descricao }</p>
                                        )
                                    })
                                }
                            </Card>
                        </Col>
                    </Row>
                    <Content
                        style={{
                            margin: "4px 16px 0 16px",
                            padding: 24,
                            background: "#fff",
                            minHeight: 60
                        }}
                    >
                        <Row>
                            <Col span="12" align="start">
                                <Link to="/admin/simulados/novo/step-1"><Button type="primary">Anterior</Button></Link>
                            </Col>
                            <Col span="12" align="end">
                                <Button type="primary" onClick={this.handleProximoButton}>Próximo</Button>
                            </Col>
                        </Row>
                    </Content>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
		simulado: state.simulado
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        setSimuladoTurmaDisciplina: (simuladoTurmaDisciplina) => { dispatch({ type: 'SET_SIMULADO_CURSODISCIPLINA', simuladoTurmaDisciplina }) },
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(NovoSimulado2))