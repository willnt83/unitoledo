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
        tableData: null,
        alvos: null,
    };

    /*
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
    */

    onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
        console.log('--==onSelectedRowKeysChange==--')
        console.log('selectedRowKeys', selectedRowKeys)
        console.log('selectedRows', selectedRows)

        // Lógica para comportamento de seleção hierárquica

        // Incluindo alvo no redux store
        console.log('selectedRows', selectedRows)
        this.props.setSimuladoAlvo(selectedRows)

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
        var alvos = []
        var turmas = []
        var disciplinas = []
        // Se mainData possuir cursos
        if(this.props.mainData.cursos && this.props.mainData.cursos.length > 0){
            alvos = this.props.mainData.cursos.map(curso => {

                /************************** Turmas  /**************************/
                // Verifica se existem Turmas em mainData
                if(this.props.mainData.turmas && this.props.mainData.turmas.length > 0){
                    // Percorre mainData.turmas a procura de Turmas filhas do Curso
                    turmas = this.props.mainData.turmas.map(turma => {
                        // Verifica se a turma corrente pertence ao curso corrente
                        if(turma.idCurso === curso.id){
                            // Se achou turma pertencente ao curso corrente


                            /************************** Disciplinas  /**************************/
                            // Verifica se existem disciplinas em mainData
                            if(this.props.mainData.disciplinas && this.props.mainData.disciplinas.length > 0){
                                // Percorre maindata.disciplinas a procura de disciplinas filhas da turma
                                disciplinas = this.props.mainData.disciplinas
                                .map(disciplina => {
                                    // retorno de map disciplinas
                                    return({
                                        key: disciplina.id,
                                        parentKey: disciplina.idTurma,
                                        name: disciplina.nome,
                                        tipo: 'Disciplina'
                                    })
                                })
                                .filter(disciplina => {
                                    // Verifica se a disciplina corrente pertence à turma corrente
                                    return (disciplina.parentKey === turma.id)
                                })
                                
                            }

                            if(disciplinas.length > 0){
                                // Se disciplinas da turma foram encontradas
                                // retorno de map turmas
                                return({
                                    key: turma.id,
                                    parentKey: curso.id,
                                    name: turma.nome,
                                    tipo: 'Turma',
                                    children: disciplinas
                                })
                            }
                            else{
                                // Não encontrou nenhuma turma pertencente ao curso corrente
                                // retorno de map turmas
                                return({
                                    key: turma.id,
                                    parentKey: curso.id,
                                    name: turma.nome,
                                    tipo: 'Turma'
                                })
                            }
                        }
                        else {
                            // Não achou nenhuma turma que pertença ao curso corrente
                            // retorno de map turmas
                            return []
                        }
                    })
                }

                if(turmas.length > 0){
                    // Se turmas foram encontradas para o curso
                    // retorno de map cursos
                    return ({
                        key: curso.id,
                        name: curso.nome,
                        tipo: 'Curso',
                        children: turmas
                    })
                }
                else{
                    // Não achou nenhuma turma que pertença ao curso
                    return ({
                        key: curso.id,
                        name: curso.nome,
                        tipo: 'Curso'
                    })
                }
            })

            
        }
        else {
            // Não possui cursos em mainData, fazer esse caso....
        }

        this.setState({
            tableData:alvos
        })
    }

    componentWillUpdate(nextProps, nextState){
        if(nextState.selectedRowKeys.length !== this.state.selectedRowKeys.length)
            this.setState({
                showWarning: false
            })
    }

    render(){
        console.log('PROPS',this.props)
        const { selectedRowKeys } = this.state
        /*
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
        */

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

        
        /*
        const data = [
            {
                key: 1,
                name: 'Análise de Sistemas',
                tipo: 'Curso',
                children: [
                    {
                        key: 11,
                        name: 'Análise de Sistemas Turma I',
                        tipo: 'Turma',
                    }, {
                        key: 12,
                        name: 'Análise de Sistemas Turma II',
                        tipo: 'Turma',
                        children: [
                            {
                                key: 121,
                                name: 'Intrudução à Lógica de Programação',
                                tipo: 'Disciplina',
                            }, {
                                key: 122,
                                name: 'Linguagens Formais e Autômatos',
                                tipo: 'Disciplina'
                            }, {
                                key: 123,
                                name: 'Cálculo I',
                                tipo: 'Disciplina'
                            }
                        ],
                    }, {
                        key: 13,
                        name: 'Análise de Sistemas Iniciantes',
                        tipo: 'Turma',
                    }
                ],
            }, {
                key: 2,
                name: 'Engenharia Elétrica',
                tipo: 'Curso',
            }
        ];*/
      

        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {

                console.log('--==onChange==--')
                console.log('selectedRowKeys:', selectedRowKeys)
                console.log('selectedRows: ', selectedRows)

                // Seleção de filhos
                if(selectedRows.length > 0){
                    selectedRows.forEach(row => {
                        // Se a row selecionada for do tipo Curso
                        if(row.tipo === 'Curso'){

                            // Procurar todos os filhos (turmas e disciplinas) desse curso e selecionar também
                            this.state.tableData.forEach(item =>{
                                // O item de data é o item sendo procurado?
                                if(item.key === row.key){
                                    console.log('item '+item.key+ ' é o item procurado')
                                    // Verifica se tem filho
                                    if(item.children){
                                        console.log('Ele possui children!')
                                        //Percorre as children
                                        item.children.forEach(child => {
                                            // Verifica se o filho possui filhos
                                            if(child.children){
                                                if(selectedRowKeys.indexOf(child.key) === -1){
                                                    selectedRowKeys.push(child.key)
                                                    selectedRows.push(child)
                                                }
                                                // Percorre os filhos do filho
                                                child.children.forEach(childChildren => {
                                                    // Se a child ainda não estiver selecionada
                                                    if(selectedRowKeys.indexOf(childChildren.key) === -1){
                                                        console.log('childChildren key '+childChildren.key+' ainda não foi selecionada, inserindo em selectedRowKeys')
                                                        // Insere em selectedRowKeys
                                                        selectedRowKeys.push(childChildren.key)
                                                        // Insere objeto em selectedRows
                                                        selectedRows.push(childChildren)
                                                    }
                                                })
                                            }
                                            else{
                                                // Filho não possui filhos
                                                // Se a child ainda não estiver selecionada
                                                if(selectedRowKeys.indexOf(child.key) === -1){
                                                    console.log('child key '+child.key+' ainda não foi selecionada, inserindo em selectedRowKeys')
                                                    // Insere em selectedRowKeys
                                                    selectedRowKeys.push(child.key)
                                                    // Insere objeto em selectedRows
                                                    selectedRows.push(child)
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }






                this.onSelectedRowKeysChange(selectedRowKeys, selectedRows)
            },
            /*onSelect: (record, selected, selectedRows) => {
                console.log('onSelect')
                console.log('record', record)
                console.log('selected', selected)
                console.log('selectedRows', selectedRows)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log('onSelectAll')
                console.log(selected, selectedRows, changeRows);
            },*/
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
                                            dataSource={this.state.tableData}
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