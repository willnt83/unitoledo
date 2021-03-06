import React, { Component } from "react"
import { Layout, Icon, Form, Button, Row, Col, Select, Table } from "antd"
import { connect } from 'react-redux'
import axios from "axios"
import { withRouter } from "react-router-dom"


const { Content } = Layout
const Option = Select.Option

class EnadePorAluno extends Component {
    constructor(props) {
        super()
		props.setPageTitle('Relatório Conceito Enade por Aluno')
    }
    
    state = {
		idSimulado: null,
		xlsUrl: null,		
        simuladosOptions: [],
        idsSimulados:[],
		enadeOptions: [],
		buttonLoading: false,
		tableLoading: false,		
		dataAvail: false,
		buttonLoadingGerarPDF: false
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
		
		axios.post(this.props.backEndPoint+'/api/getAllSimuladoEnade', request)
        .then(res => {
			this.setState({
				simuladosOptions: res.data.map(simulado => {
					return({
						id: simulado.id,
						description: simulado.nome
					})
                })               
			})
        })
        .catch(error =>{
            console.log('error: ', error)
        })
    }

    getPlanilhasEnade = () => {				
		axios.get(this.props.backEndPoint+'/api/getPlanilhaEnade')
        .then(res => {
            console.log(res)
            this.setState({
				enadeOptions: res.data.map(enade => {
					return({
                        id: enade.ano +''+enade.codArea,
						description: 'Enade: ' + enade.ano + ' | Área: ' + enade.area
					})
                })               
			})
        })
        .catch(error =>{
            console.log('error: ', error)
        })
    }    
    /*
    changeSimulado = (values) => {
        var simulados = []
        
        simulados = values.map(value =>{
            return({id: value})
        })
        console.log(simulados);
        this.setState({idsSimulados: simulados})
		console.log(this.state.idsSimulados);
	}
	*/
    
    handleSearchSubmit = (event) => {
		event.preventDefault()
		this.setState({buttonLoading: true})
		var request = null
		var simulados = []
		var enadeAno = []

		this.props.form.validateFieldsAndScroll((err, values) => {
			if(values.simulados){
				simulados = values.simulados.map(simulado =>{
					return({id: parseInt(simulado)})
				})
            }
            if(values.enade){
				enadeAno = values.enade.split('-');
				console.log(enadeAno);
			}
			console.log('Diegão, aqui estão os ids dos simulados', simulados)			
		})
		
		request = {
			ano: enadeAno[0],
			codArea: enadeAno[1],
			simulados: simulados			
		}	
		
		this.getReports(request);
	}

	getReports = (request) => {
		console.log(request);
		//axios.post(this.props.backEndPoint+'/api/getGestor', request)
		axios.post(this.props.backEndPoint+'/api/relatorio/conceitoEnadeAluno', request)
			.then(res => {
				console.log(res);
				window.open(this.props.backEndPoint+'/api/relatorio/conceitoEnadeAluno/'+res.data.file, '_blank');	
				this.setState({buttonLoading: false})		
			})
			.catch(error =>{							
				alert("Erro ao gerar o relatório");				
				console.log('error: ', error)
				this.setState({buttonLoading: false})		
			})
	}
	componentWillMount(){
        this.getSimulados()
        this.getPlanilhasEnade()
    }
    
    render() {
		const { getFieldDecorator } = this.props.form

		return (
			<React.Fragment>
				<Content
					style={{
					margin: "24px 16px",
					padding: 24,
					background: "#fff",
					minHeight: 280
					}}
				>
					<Row style={{ marginBottom: 16 }}>
						<Col span={24}>
							<h2>Filtros</h2>
						</Col>
					</Row>
					<Row>
						<Col span={24}>
                            <Form layout="vertical" onSubmit={this.handleSearchSubmit}>
                                <Form.Item label="Planilha Enade">
									{getFieldDecorator('enade', {
										rules: [
											{
												required: true, message: 'Por favor selecione o ano do enade',
											}
										]
									})(
										<Select
											style={{ width: '100%' }}
											placeholder="Selecione o ano do enade"
											onChange={this.change}
										>
											{
												this.state.enadeOptions.map((item) => {
													return (<Option key={item.id}>{item.description}</Option>)
												})
											}
										</Select>
									)}
								</Form.Item>
								<Form.Item label="Simulados">
									{getFieldDecorator('simulados', {
										rules: [
											{
												required: true, message: 'Por favor selecione o simulado',
											}
										]
									})(
										<Select
                                            mode="multiple"
											style={{ width: '100%' }}
											placeholder="Selecione o simulado"
											onChange={this.changeSimulado}
										>
											{
												this.state.simuladosOptions.map((item) => {
													return (<Option key={item.id}>{item.description}</Option>)
												})
											}
										</Select>
									)}
								</Form.Item>                                
							    <Button
							    	style={{marginLeft: 10}}
							    	key="print"                                    
                                    htmlType="submit"
                                    type="primary"
                                    size={'large'}
                                    //onClick={this.gerarRelatorio}
							    >
									{this.state.buttonLoading ? <Icon type="loading" /> : <Icon type="file-excel"/> }
									{this.state.buttonLoading ? 'Gerando Planilha' : 'Gerar Planilha' }
							    	
							    </Button>								
							</Form>
						</Col>
					</Row>
				</Content>
				
			</React.Fragment>
		)
	}
}

const MapStateToProps = (state) => {
	return {
		backEndPoint: state.backEndPoint,
		mainData: state.mainData,
		periodoLetivo: state.periodoLetivo
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
		setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(withRouter(EnadePorAluno)))