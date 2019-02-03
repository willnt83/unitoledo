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
        showWarning: false,
        alvos: null,
        tableData: [],
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
        if(this.props.simulado.alvos.length > 0){
            var tempArray = []
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
                                        name: disciplina.id+' - '+disciplina.nome,
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
                                    name: turma.id+' - '+turma.nome,
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
                                    name: turma.id+' - '+turma.nome,
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
                        name: curso.id+' - '+curso.nome,
                        tipo: 'Curso',
                        children: turmas
                    })
                }
                else{
                    // Não achou nenhuma turma que pertença ao curso
                    return ({
                        key: curso.id,
                        name: curso.id+' - '+curso.nome,
                        tipo: 'Curso'
                    })
                }
            })

            
        }
        else {
            // Não possui cursos em mainData, fazer esse caso....
        }
        this.setState({
            tableData: alvos
        })
    }

    /*
    componentWillUpdate(nextProps, nextState){
        if(nextState.selectedRowKeys.length !== this.state.selectedRowKeys.length)
            this.setState({
                showWarning: false
            })
    }
    */

    // Função que recebe a key da row seleciona, procura a row na tableData e remove seus filhos
    // Retorna a key dos filhos removidos
    searchKeyRemoveChildren = (key) => {
        var tempTableData = this.state.tableData
        var keysToBeRemoved = []
        var hit = false
        var countCurso = 0
        var countTurma = 0

        // Buscando a key, percorre cursos
        this.state.tableData.forEach(curso =>{
            if(curso.children){
                // Se o curso possuir turmas
                // Percorre suas turmas (nível Turmas)
                countTurma = 0
                curso.children.forEach(turma => {
                    // Neste ponto, sabe-se que a key que buscamos possui filhos, então não há a necessidade de buscar nos filhos dos filhos, pois nenhum deles será a key buscada
                    if(turma.key === key){
                        // Setta flag pra indicar que o registro foi encontado
                        hit = true
                        // Se encontrou o registro
                        // Percorre suas disciplinas pra pegar suas keys e alimentar o vetor de keys a serem removidas
                        turma.children.forEach(disciplina => {
                            keysToBeRemoved.push(disciplina.key)
                        })
                        // Removendo da tabela de seleção
                        delete tempTableData[countCurso].children[countTurma].children
                        this.setState({tableData: tempTableData})

                    }
                    countTurma++
                })

                if(!hit){
                    // Se não encontrou o registro em Turmas, verifica-se se o pai (Curso) é a key buscada
                    if(curso.key === key){
                        // O curso é a key buscada
                        // Percorre seus filhos (nível Turmas) para recolher as keys a serem removidas
                        curso.children.forEach(turma => {
                            if(turma.children){
                                // Se turmas tem disciplinas, precorre as disciplinas
                                turma.children.forEach(disciplina => {
                                    keysToBeRemoved.push(disciplina.key)
                                })
                            }

                            // Coleta-se a key da turma também tendo ela disciplinas ou não, pois ela será removida também
                            keysToBeRemoved.push(turma.key)
                        })

                        // Removendo da tabela de seleção
                        delete tempTableData[countCurso].children
                        this.setState({tableData: tempTableData})
                    }
                    else {
                        // O pai não é a key buscada, nenhuma ação é realizada
                    }
                }
            }
            else{
                // Sabe-se que a key buscada possui filhos, então ela não será nenhuma dessas que não possui filhos
                // Nenhuma ação é realizada
            }
            countCurso++
        })
        return keysToBeRemoved
    }

    // Função que recebe selectedRows e um vetor de chaves a serem removidas da selectedRows
    // Retorna selectedRows atualizada com as chaves removidas
    removeSelectedRows = (selectedRows, keys) => {
        var newSelectedRows = selectedRows.filter(row => {
            // Removendo as keys que estão na lista de keys a serem removidas
            return(keys.indexOf(row.key) < 0)
        })
        return newSelectedRows
    }

    // Função que recebe key e percorre o vedor de state.selectedRowKeys para remover caso esteja lá
    removeSelectedRowKeys = (selectedRowKeys, keysToBeRemoved) => {
        var newSelectedRowKeys = selectedRowKeys.filter(selectedRowKey => {
            if(keysToBeRemoved.indexOf(selectedRowKey) > -1){
                return false
            }
            else{
                return true
            }
        })
        return newSelectedRowKeys
    }

    // Função que recebe a key dermarcada, verifica se a mesma possuia filhos e os restaura se houver
    // Não há retorno na função, apenas a tableData é atualizada com os filhos restaurados
    searchKeyRestoreChildren = (key) => {
        //var hit = false
        var countCursos = 0
        var countTurmas = 0
        var tempTableData = this.state.tableData
        var tempDisciplinas = []
        var tempTurmas = []
        var hit = false
        // Percorre os cursos
        this.state.tableData.forEach(curso => {
            if(curso.children){
                // Se o curso possuir turmas
                // Percorre turmas
                curso.children.forEach(turma => {
                    if(turma.key === key){
                        hit = true
                        // Se encontrar a key buscada em turma
                        // Verifica se existem disciplinas em mainData
                        if(this.props.mainData.disciplinas){
                            // mainData possui disciplinas, percorre para encontrar filhos da turma
                            this.props.mainData.disciplinas.forEach(disciplina =>{
                                if(disciplina.idTurma === key){
                                    tempDisciplinas.push({
                                        key: disciplina.id,
                                        name: disciplina.nome,
                                        parentKey: disciplina.idTurma,
                                        tipo: 'Disciplina'
                                    })
                                }
                            })
                        }
                        
                        tempTableData[countCursos].children[countTurmas].children = tempDisciplinas
                        this.setState({tableData: tempTableData})
                    }
                    countTurmas++
                })
            }
            else{
                // Desmarcando curso
                if(curso.key === key){
                    // Verifica se existem turmas em mainData
                    if(this.props.mainData.turmas){
                        // mainData possui turmas, percorre as turmas para encontrar os filhos do curso
                        this.props.mainData.turmas.forEach(turma => {
                            tempDisciplinas = []
                            if(turma.idCurso === key){
                                // Turma filho do curso encontrada
                                // Verifica se existem disciplinas em mainData
                                if(this.props.mainData.disciplinas){

                                    // mainData possui disciplinas, percorre para encontrar filhos da turma
                                    this.props.mainData.disciplinas.forEach(disciplina =>{
                                        if(disciplina.idTurma === turma.id){
                                            tempDisciplinas.push({
                                                key: disciplina.id,
                                                name: disciplina.nome,
                                                parentKey: disciplina.idTurma,
                                                tipo: 'Disciplina'
                                            })
                                        }
                                    })
                                }

                                if(tempDisciplinas.length > 0) {
                                    tempTurmas.push({
                                        key: turma.id,
                                        name: turma.nome,
                                        parentKey: turma.idCurso,
                                        tipo: 'Disciplina',
                                        children: tempDisciplinas
                                    })
                                }
                                else{
                                    tempTurmas.push({
                                        key: turma.id,
                                        name: turma.nome,
                                        parentKey: turma.idCurso,
                                        tipo: 'Disciplina'
                                    })
                                }

                                tempTableData[countCursos].children = tempTurmas
                                this.setState({tableData: tempTableData})
                            }
                        })
                    }
                }
            }
            countCursos++
        })
    }

    render(){
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
                var selectedRowKeys = this.state.selectedRowKeys
                var rowsToBeRemoved = []

                // Seleção
                if(selected){
                    // Se a row possuir filhos, remove-os da seleção
                    if(record.children){
                        rowsToBeRemoved = this.searchKeyRemoveChildren(record.key)
                        selectedRows = this.removeSelectedRows(selectedRows, rowsToBeRemoved)
                        selectedRowKeys = this.removeSelectedRowKeys(selectedRowKeys, rowsToBeRemoved)
                    }

                    // Incluindo alvo no redux store
                    this.props.setSimuladoAlvo(selectedRows)

                    selectedRowKeys.push(record.key)
                    this.setState({ selectedRowKeys });
                }
                // Dermarcação
                else{
                    // Incluindo alvo no redux store
                    this.props.setSimuladoAlvo(selectedRows)

                    selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1)
                    this.setState({ selectedRowKeys });

                    this.searchKeyRestoreChildren(record.key)
                }
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
        setSimuladoAlvo: (simuladoAlvos) => { dispatch({ type: 'SET_SIMULADOALVO', simuladoAlvos }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(NovoSimulado2))