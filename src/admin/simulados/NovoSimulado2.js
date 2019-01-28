import React, { Component } from "react"
import { Layout, Row, Col, Button, Table, Card, Icon } from "antd"
import { Link, withRouter } from "react-router-dom"
import SimuladoSteps from './SimuladoSteps'
import WarningMessage from './WarningMessage'
import { connect } from 'react-redux'

const { Content } = Layout

class NovoSimulado2 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Seleção de Público Alvo')
    }

    state = {
        selectedRowKeys: [],
        showWarning: false,
        alvos: null,
    };

    selectRow = (record) => {
        console.log(record)
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.id) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1);
        } else {
            selectedRowKeys.push(record.id);
        }
        // Incluindo alvo no redux store
        this.props.setSimuladoAlvo({
            id: record.id,
            descricao: record.description,
            tipo: record.tipo
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
        if(this.props.simulado.alvos.length > 0){
            let tempArray = []
            tempArray = this.props.simulado.alvos.map((item) => {
                return item.id
            })
            this.setState({
                selectedRowKeys: tempArray
            })
        }

        // Dados da tabela de seleção do alvo
        // Se mainData possuir cursos
        var cursos = []
        if(this.props.mainData.cursos && this.props.mainData.cursos.length > 0){
            cursos = this.props.mainData.cursos.map(curso => {
                return ({
                    id: curso.id,
                    description: curso.nome,
                    tipo: 'CURSO'
                })
            })
            this.setState({
                alvos: cursos
            })
        }

        // Se mainData possuir turmas
        if(this.props.mainData.turmas && this.props.mainData.turmas.length > 0){
            var turmas = this.props.mainData.turmas.map(turma => {
                return ({
                    id: turma.id,
                    description: turma.nome,
                    tipo: 'TURMA'
                })
            })

            if(cursos.length > 0){
                this.setState({
                    alvos: cursos.concat(turmas)
                })
            }
            else{
                this.setState({
                    alvos: turmas
                })
            }
        }
    }

    componentWillUpdate(nextProps, nextState){
        if(nextState.selectedRowKeys.length !== this.state.selectedRowKeys.length)
            this.setState({
                showWarning: false
            })
    }

    render(){
        console.log('props', this.props)
        const columns = [
            {
				title: "Id",
				dataIndex: "id"
            },
			{
				title: "Alvo",
				dataIndex: "description"
            },
            {
				title: "Tipo",
				dataIndex: "tipo"
            }
        ]
        const { selectedRowKeys } = this.state
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
                                title="Selecione a Público Alvo"
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
                                            className="tableSelect"
                                            bordered={true}
                                            rowSelection={ rowSelection }
                                            columns={ columns }
                                            dataSource={ this.state.alvos }
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
                                    this.props.simulado.alvos.map(alvo => {
                                        return (
                                            <p key={ alvo.id }>{ alvo.descricao }</p>
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
                            <Col span={12} align="start">
                                <Link to="/admin/simulados/novo/step-1"><Button type="default"><Icon type="left" />Anterior</Button></Link>
                            </Col>
                            <Col span={12} align="end">
                                <Button type="primary" onClick={this.handleProximoButton}>Próximo<Icon type="right" /></Button>
                            </Col>
                        </Row>
                    </Content>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData,
		simulado: state.simulado
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        setSimuladoAlvo: (simuladoAlvo) => { dispatch({ type: 'SET_SIMULADO_CURSODISCIPLINA', simuladoAlvo }) },
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(NovoSimulado2))