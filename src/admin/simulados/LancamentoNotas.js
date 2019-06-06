import React, { Component } from "react"
import { Layout, Button, Form, Row, Col, Select, Input, Icon, notification } from "antd"
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
        linhas: [],
        notasFormacaoGeral: [],
        notasConhecimentoEspecifico: []
    }

    showNotification = (msg, success) => {
        var type = null
        var style = null
        if(success){
            type = 'check-circle'
            style = {color: '#4ac955', fontWeight: '800'}
        }
        else {
            type = 'exclamation-circle'
            style = {color: '#f5222d', fontWeight: '800'}
        }
        const args = {
            message: msg,
            icon:  <Icon type={type} style={style} />,
            duration: 1
        }
        notification.open(args)
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
        this.setState({
            linhas: [],
            notasFormacaoGeral: [],
            notasConhecimentoEspecifico: []
        })

        axios.get(this.props.backEndPoint+'/api/getAlunoDiscursiva/'+value)
		.then(res => {
            this.setState({
                linhas: res.data
            })
		})
		.catch(error =>{
			console.log(error)
        })

    }

    handleNotaFormacaoGeralBlur = (element) => {
        var idAluno = parseInt(element.target.id.replace('notaFormacaoGeral_', ''))
        var nota = parseInt(element.target.value)
        var notasFormacaoGeral = this.state.notasFormacaoGeral

        var notasFormacaoGeral2 = notasFormacaoGeral.filter(nota => {
            return (!nota.idAluno || nota.idAluno !== idAluno)
        })

        notasFormacaoGeral2.push({
            idAluno: idAluno,
            nota: nota
        })
        this.setState({notasFormacaoGeral: notasFormacaoGeral2})

    }

    handleNotaConhecimentoEspecificoBlur = (element) => {
        var idAluno = parseInt(element.target.id.replace('notaConhecimentoEspecifico_', ''))
        var nota = parseInt(element.target.value)
        var notasConhecimentoEspecifico = this.state.notasConhecimentoEspecifico

        var notasConhecimentoEspecifico2 = notasConhecimentoEspecifico.filter(nota => {
            return (!nota.idAluno || nota.idAluno !== idAluno)
        })

        notasConhecimentoEspecifico2.push({
            idAluno: idAluno,
            nota: nota
        })
        this.setState({notasConhecimentoEspecifico: notasConhecimentoEspecifico2})
    }

    salvar = () => {
        var request = []
        var idAluno = null
        var notaFormacaoGeralValor = null
        var notaConhecimentoEspecificoValor = null
        this.state.linhas.forEach(linha => {
            idAluno = linha.idAluno
            notaFormacaoGeralValor = 0
            notaConhecimentoEspecificoValor = 0

            this.state.notasFormacaoGeral.forEach(notaFormacaoGeral => {
                if(parseInt(notaFormacaoGeral.idAluno) === parseInt(idAluno)){
                    notaFormacaoGeralValor = notaFormacaoGeral.nota
                }
            })

            this.state.notasConhecimentoEspecifico.forEach(notaConhecimentoEspecifico => {
                if(parseInt(notaConhecimentoEspecifico.idAluno) === parseInt(idAluno)){
                    notaConhecimentoEspecificoValor = notaConhecimentoEspecifico.nota
                }
            })


            request.push({
                id: linha.id,
                idAluno: linha.idAluno,
                nomeAluno: linha.nomeAluno,
                simulado: {
                    id: linha.simulado.id
                },
                notas: {
                    notaFormacaoGeral: notaFormacaoGeralValor,
                    notaConhecimentoEspecifico: notaConhecimentoEspecificoValor
                }
            })
        })

        console.log('request', request)

        axios.post(this.props.backEndPoint+'/api/createUpdateNotaDiscursiva', request)
		.then(res => {
            console.log('response', res.data)
            this.showNotification('Notas salvas com sucesso.', true)
		})
		.catch(error =>{
            console.log(error)
            this.showNotification('Erro ao salvar notas.', false)
        })
    }

    componentWillMount(){
        this.getSimulados()
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.linhas.length !== this.state.linhas.length){
            console.log('linhas', this.state.linhas)
            var notaFormacaoGeral = null
            var notaConhecimentoEspecifico = null

            var strObj = '{'
            var comma = ''
            this.state.linhas.forEach((linha, index) => {
                notaFormacaoGeral = linha.notas.notaFormacaoGeral !== null ? linha.notas.notaFormacaoGeral : ''
                comma = index === 0 ? '' : ', '
                strObj += comma+'"notaFormacaoGeral_'+linha.idAluno+'": "'+notaFormacaoGeral+'"'
            })
            strObj += '}'
            console.log('strObj1', strObj)
            var obj  = JSON.parse(strObj)
            this.props.form.setFieldsValue(obj)


            strObj = '{'
            comma = ''
            this.state.linhas.forEach((linha, index) => {
                notaConhecimentoEspecifico = linha.notas.notaConhecimentoEspecifico !== null ? linha.notas.notaConhecimentoEspecifico : ''
                comma = index === 0 ? '' : ', '
                strObj += comma+'"notaConhecimentoEspecifico_'+linha.idAluno+'": "'+notaConhecimentoEspecifico+'"'
            })
            strObj += '}'
            console.log('strObj2', strObj)
            obj  = JSON.parse(strObj)
            this.props.form.setFieldsValue(obj)
        }
    }

    render(){
        console.log('this.state.linhas', this.state.linhas)
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
                        </Form>
                    </Col>
                </Row>
                {
                    this.state.linhas.length > 0 ?
                    <Row style={{fontWeight: 800}}>
                        <Col span={6}>Nome</Col>
                        <Col span={3}>Formação Geral</Col>
                        <Col span={3}>Conhecimento Específico</Col>
                    </Row>
                    
                    :
                    null
                }
                {
                    this.state.linhas.map(linha => {
                        var notaFormacaoGeralDisabled = linha.notas.formacaoGeral ? false : true
                        var notaConhecimentoEspecificoDisabled = linha.notas.conhecimentoEspecifico ? false : true
                        return(
                            <React.Fragment key={linha.idAluno}>
                                <Row gutter={5}>
                                    <Col span={6}>
                                        {linha.nomeAluno}
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item>
                                            {getFieldDecorator(`notaFormacaoGeral_${linha.idAluno}`)(
                                                <Input
                                                    onBlur={this.handleNotaFormacaoGeralBlur}
                                                    disabled={notaFormacaoGeralDisabled}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item>
                                            {getFieldDecorator(`notaConhecimentoEspecifico_${linha.idAluno}`)(
                                                <Input
                                                    onBlur={this.handleNotaConhecimentoEspecificoBlur}
                                                    disabled={notaConhecimentoEspecificoDisabled}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </React.Fragment>
                        )
                    })
                }
                {
                    this.state.linhas.length > 0 ?
                    <Row>
                        <Col span={24}>
                            <Button
                                type="primary"
                                className="buttonGreen"
                                onClick={this.salvar}
                            >
                                <Icon type="save" />Salvar
                            </Button>
                        </Col>
                    </Row>
                    :
                    null
                }
                
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