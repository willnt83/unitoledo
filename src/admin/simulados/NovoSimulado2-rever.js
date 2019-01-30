import React, { Component } from "react"
import { Layout, Row, Col, Button, Table, Card, Icon } from "antd"
import { Link, withRouter } from "react-router-dom"
import SimuladoSteps from './SimuladoSteps'
import WarningMessage from './WarningMessage'
import { connect } from 'react-redux'

const { Content } = Layout

const data = [
    {
        index: 0,
        key: 1,
        name: '1 - Análise de Sistemas',
        tipo: 'Curso',
        children: [
            {
                index: 0,
                key: 11,
                parentKey: 1,
                name: '11 - Análise de Sistemas Turma I',
                tipo: 'Turma',
            }, {
                index: 1,
                key: 12,
                parentKey: 1,
                name: '12 - Análise de Sistemas Turma II',
                tipo: 'Turma',
                children: [
                    {
                        index: 0,
                        key: 121,
                        parentsParentKey: 1,
                        parentKey: 12,
                        name: '121 - Intrudução à Lógica de Programação',
                        tipo: 'Disciplina',
                    }, {
                        index: 1,
                        key: 122,
                        parentsParentKey: 1,
                        parentKey: 12,
                        name: '122 - Linguagens Formais e Autômatos',
                        tipo: 'Disciplina'
                    }, {
                        index: 2,
                        key: 123,
                        parentsParentKey: 1,
                        parentKey: 12,
                        name: '123 - Cálculo I',
                        tipo: 'Disciplina'
                    }
                ],
            }, {
                index: 2,
                key: 13,
                name: '13 - Análise de Sistemas Iniciantes',
                tipo: 'Turma',
            }
        ],
    }, {
        index: 1,
        key: 2,
        name: '2 - Engenharia Elétrica',
        tipo: 'Curso',
        children: [
            {
                index: 0,
                key: 21,
                parentKey: 2,
                name: '21 - Engenharia Turma I',
                tipo: 'Turma'
            }, {
                index: 1,
                key: 22,
                parentKey: 2,
                name: '22 - Engenharia Turma II',
                tipo: 'Turma'
            }, {
                index: 3,
                key: 23,
                parentKey: 2,
                name: '23 - Engenharia Turma III',
                tipo: 'Turma'
            }
        ]
    }
];

class NovoSimulado2 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Seleção de Público Alvo')
    }

    state = {
        showWarning: false,
        alvos: null,
        dataTable: [],
        selectedRowKeys: []
    };

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
        console.log('--==componentWillMount==--')
        // Salvando data em variável de state
        console.log('salvando data em state.dataTable')
        this.setState({dataTable: data})


        if(this.props.simulado.alvos.length > 0){
            var tempArray = []
            tempArray = this.props.simulado.alvos.map((item) => {
                return item.id
            })
            console.log('tempArray', tempArray)
            this.setState({
                selectedRowKeys: tempArray
            })
        }
    }

    /*
    componentWillUpdate(nextProps, nextState){
        if(nextState.selectedRowKeys.length !== this.state.selectedRowKeys.length)
            this.setState({
                showWarning: false
            })
    }
    */

    saveSelectedRowKeys = (key, selectedRows) => {
        // Incluindo alvo no redux store
        this.props.setSimuladoAlvo(selectedRows)

        var selectedRowKeys = this.state.selectedRowKeys
        selectedRowKeys.push(key)
        this.setState({ selectedRowKeys });
    }

    // Função que procura a row na dataTable e remove seus filhos
    // Retorna a key dos filhos removidos
    removeChildren = (key, index) => {
        console.log('--==removeChildren==--')
        console.log('key', key)
        console.log('index', index)

        var tempDataTable = this.state.dataTable
        console.log('tempDataTable', tempDataTable)
        var i = 0
        var j = 0
        var removeIndex = null
        var tempSelectedRowKeys = []
        var tempSelectedRows = []
        this.state.dataTable.forEach(row =>{
            row.children.forEach(child => {
                // Se o filho tem filhos
                if(child.children){
                }
                // Se o filho nao tem filhos
                else{
                    if(child.parentKey === key){
                        console.log('Filho '+child.key+' do pai: '+key)
                        // Removendo da tabela de seleção
                        delete tempDataTable[index].children

                        // Removendo das chaves selecionadas
                        // Se o filho está nas chaves selecionadas
                        console.log('selectedRowKeys', this.state.selectedRowKeys)
                        removeIndex = this.state.selectedRowKeys.indexOf(child.key)

                        if(removeIndex > -1){
                            tempSelectedRowKeys = this.state.selectedRowKeys
                            tempSelectedRowKeys.splice(removeIndex, 1)
                            this.setState({selectedRowKeys: tempSelectedRowKeys})

                            tempSelectedRows = this.props.simulado.alvos
                            console.log('tempSelectedRows', tempSelectedRows)
                            removeIndex = 0
                            i = 0
                            tempSelectedRows.forEach(row => {
                                if(row.key === child.key){
                                    removeIndex = i
                                    console.log('row encontrada, preciso remover index ', i)
                                }
                                i++
                            })
                            console.log('tempSelectedRows antes', tempSelectedRows)
                            tempSelectedRows.splice(removeIndex, 1)
                            console.log('tempSelectedRows depois', tempSelectedRows)
                            this.props.setSimuladoAlvo(tempSelectedRows)
                        }
                    }
                }
            })
        })
    }

    render(){
        //console.log(this.props.simulado)
        const { selectedRowKeys } = this.state
        const columns = [
            {
                title: 'Público Alvo',
                dataIndex: 'name',
                key: 'name',
            }, {
                title: 'Tipo',
                dataIndex: 'tipo',
                width: '30%',
                key: 'tipo',
            }
        ];

        const rowSelection = {
            selectedRowKeys,
            onSelect: (record, selected, selectedRows) => {
                console.log('--==onSelect==--')
                console.log('record', record)
                console.log('selected', selected)
                console.log('selectedRows', selectedRows)

                this.saveSelectedRowKeys(record.key, selectedRows)
                // Se a row possuir filhos, remove-os da seleção
                
                /*if(record.children){
                    this.removeChildren(record.key, record.index)
                }
                else{
                    console.log('nao possui filho, OK!')
                }*/
            }
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
                                            columns={columns}
                                            rowSelection={rowSelection}
                                            dataSource={this.state.dataTable}
                                        />
                                        {/*
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
                                        */}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card
                                title="Públicos Alvo Selecionados"
                                bordered={false}
                                style={{
                                    margin: "4px 16px 4px 4px",
                                    padding: 24,
                                    background: "#fff",
                                    minHeight: 'calc(100% - 8px)'
                            }}>
                                <WarningMessage message="Nenhuma Público Alvo selecionado" type="error" visible={this.state.showWarning} />
                                {
                                    this.props.simulado.alvos.map(alvo => {
                                        return (
                                            <p key={ alvo.key }>{ alvo.name }</p>
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
        setSimuladoAlvo: (simuladoAlvos) => { dispatch({ type: 'SET_SIMULADOALVO', simuladoAlvos }) },
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(NovoSimulado2))