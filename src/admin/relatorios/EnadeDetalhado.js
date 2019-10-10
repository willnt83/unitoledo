import React, { Component } from "react"
import { Layout, Icon, Form, Button, Row, Col, Select, Table } from "antd"
import { connect } from 'react-redux'
import axios from "axios"
import { withRouter } from "react-router-dom"


const { Content } = Layout
const Option = Select.Option

class EnadeDetalhado extends Component {
    constructor(props) {
        super()
		props.setPageTitle('Relatório Enade Detalhado')
    }
    
    state = {
		idSimulado: null,
		xlsUrl: null,		
		simuladosOptions: [],
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
		
		axios.post(this.props.backEndPoint+'/api/getAllSimulado', request)
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

    gerarRelatorio = () => {
		this.props.form.validateFieldsAndScroll((err, values) => {
			if(!err){
                window.open(this.props.backEndPoint+'/api/excel/acertoDetalhado/'+values.simulado, '_blank');				
			}
		})
	}
	componentWillMount(){
		this.getSimulados()
    }
    
    render() {
		console.log('tableData', this.state.tableData)
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
							<Form layout="vertical">
								<Form.Item label="Simulados">
									{getFieldDecorator('simulado', {
										rules: [
											{
												required: true, message: 'Por favor selecione o simulado',
											}
										]
									})(
										<Select
											style={{ width: '100%' }}
											placeholder="Selecione o simulado"
											onChange={this.change}
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
                                    className="buttonOrange"
                                    onClick={this.gerarRelatorio}
							    >
							    	<Icon type="file-excel" />Gerar Planilha
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

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(withRouter(EnadeDetalhado)))