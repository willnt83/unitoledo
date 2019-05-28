import React, { Component } from "react"
import { Layout, Button, Form, Row, Col, Select } from "antd"
import { withRouter } from "react-router-dom"
import axios from "axios"
import { connect } from 'react-redux'

const { Content } = Layout
const Option = Select.Option

class LancamentoNotas extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Lançamento de Notas de Questões Discursivas')
    }

    state = {
        simuladosOptions: [],
        alunosOptions: []
    }

    getSimulados = () => {
        var cursos = this.props.mainData.cursos.map(curso => {
            return({
                id: curso.id,
                nome: curso.nome,
                idPeriodoLetivo: this.props.periodoLetivo
            })
        })
        var turmas = this.props.mainData.turmas
        .map(turma => {
            return({
                id: turma.id,
                nome: turma.nome,
                idPeriodoLetivo: turma.idPeriodoLetivo,
                idCurso: turma.idCurso
            })
        })

        var disciplinas = this.props.mainData.disciplinas
        .map(disciplina => {
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

        axios.post(this.props.backEndPoint+'/api/getSimuladosQuestoesDiscursivas', request)
		.then(res => {
			this.setState({
                simuladosOptions: res.data
            })
		})
		.catch(error =>{
			console.log(error)
        })
    }

    changeSimulado = (value) => {
        console.log('changeSimulado', value)
        axios.get(this.props.backEndPoint+'/api/getAlunoDiscursiva/'+value)
		.then(res => {
			console.log('res', res)
		})
		.catch(error =>{
			console.log(error)
        })

    }

    changeAluno = () => {
        console.log('change aluno')
    }

    componentWillMount(){
        this.getSimulados()
    }

    render(){
        console.log('this.props.mainData', this.props.mainData)
        const { getFieldDecorator } = this.props.form
        return(
            <Content
                style={{
                    margin: "12px 16px 0 16px",
                    padding: 24,
                    background: "#fff",
                    minHeight: 200
                }}
            >

                <Row>
					<Col span={24}>
						<Form layout="vertical" onSubmit={this.handleSearchSubmit}>
							<Form.Item label="Simulado">
								{getFieldDecorator('simulado')(
									<Select
										style={{ width: '100%' }}
										placeholder="Selecione o simulado"
										onChange={this.changeSimulado}
									>
										{
											this.state.simuladosOptions.map((item) => {
												return (<Option key={item.id}>{item.nome}</Option>)
											})
										}
									</Select>
								)}
							</Form.Item>
                            <Form.Item label="Aluno">
								{getFieldDecorator('aluno')(
									<Select
										style={{ width: '100%' }}
										placeholder="Selecione o aluno"
										onChange={this.changeAluno}
									>
										{
											this.state.alunosOptions.map((item) => {
												return (<Option key={item.id}>{item.nome}</Option>)
											})
										}
									</Select>
								)}
							</Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Content>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        backEndPoint: state.backEndPoint,
        contexto: state.contexto,
        mainData: state.mainData,
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Form.create()(LancamentoNotas)))