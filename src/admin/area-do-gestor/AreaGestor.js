import React, { Component } from "react"
import { Layout, Icon, Form, Button, Row, Col, Select, Progress, Table } from "antd"
import { connect } from 'react-redux'
import axios from "axios"
import { withRouter } from "react-router-dom"
import moment from 'moment'

const { Content } = Layout
const Option = Select.Option


class AreaGestor extends Component {
	constructor(props) {
        super()
		props.setPageTitle('Acompanhamento dos Simulados')
	}

	state = {
		idSimulado: null,
		xlsUrl: null,
		simuladosOptions: [],
		buttonLoading: false,
		tableLoading: false,
		tableData: [],
		dataAvail: false,
        buttonLoadingGerarPDF: false,
        dataDash: []
	}
    compareByDates = (a, b) => {
        a = moment(a, 'DD/MM/YYYY HH:mm')
            b = moment(b, 'DD/MM/YYYY HH:mm')
        if (a > b) return -1
        if (a < b) return 1
        return 0
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
		
		axios.post(this.props.backEndPoint+'/api/getGestor', request)
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

	acompanhaSimulado = () => {
		this.props.form.validateFieldsAndScroll((err, values) => {
            
			if(!err){
				axios.get(this.props.backEndPoint+'/api/acompanhamentoSimulado/'+values.simulado)
				.then(res => {
                    var dataDash = res.data;
                    this.setState({dataDash})
					var inicio = null
                    var termino = null
                    var tableData = []
                    tableData = res.data.list.map(list => {
                        inicio = moment(list.dataInicial)
                        termino = moment(list.dataFinal)

                        return ({
                            key: list.idSimulado,
                            nome: list.nome,
                            questoesRespondidas: list.questoesRespondidas,
                            respostasCorretas: list.questoesCertas,
                            percentual: list.percentual,
                            dataInicio: inicio.format('DD/MM/YYYY HH:mm'),
                            dataFim: termino.format('DD/MM/YYYY HH:mm'),
                            inicioObj: inicio,
                            terminoObj: termino
                        })
                    })
					
                    this.setState({tableLoading: false})
                    this.setState({tableData})
                    this.atualizaPage();
				})
				.catch(error =>{
					console.log('error: ', error)
				})
			}
		})
	}

	atualizaPage = () => {
        setTimeout(() => {
            this.acompanhaSimulado();
         }, 5000);
    }

	componentWillMount(){
        this.getSimulados();
	}

	render() {
        console.log('tableData', this.state.tableData)
		const { getFieldDecorator } = this.props.form

		const columns = [
			{
				title: "ID",
				dataIndex: "key",
				width: 20,
				sorter: (a, b) => a.key - b.key
			},
			{
				title: "Nome",
				dataIndex: "nome",
				width: 200,
				sorter: (a, b) => { return a.nome.localeCompare(b.nome)}
			},
			{
				title: "Questões Respondidas",
				dataIndex: "questoesRespondidas",
				width: 200,
				sorter: (a, b) => a.questoesRespondidas - b.questoesRespondidas
            },
            {
				title: "Questões Certas",
				dataIndex: "respostasCorretas",
				width: 200,
				sorter: (a, b) => a.respostasCorretas - b.respostasCorretas
			},
			{
				title: "%",
				colSpan: 2,
				dataIndex: "percentual",
				width: 200,
				render: (text, record) => {
					return (
						<Progress
							strokeColor={'#41ff45'}
							percent={record.percentual}
						/>
					)
				}
			}
		]


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
								<Button className="buttonGreen" onClick={this.acompanhaSimulado} loading={this.state.buttonLoading}><Icon type="bar-chart" /> Acompanhar Simulado</Button>								
							</Form>
						</Col>
					</Row>
				</Content>
				<Content
					style={{
						margin: "24px 16px",
						padding: 24,
						background: "#fff"
					}}
				>

					{
                        (this.state.dataDash && this.state.dataDash.total) ?
                            <Row>
                                <Col sm={24} md={8}>
                                    <Row type="flex">
                                        <Col md={24} align="center">
                                            <Progress 
                                                type="dashboard" 
                                                gapDegree={360}
                                                strokeColor="#FFA500"
                                                percent={1}
                                                format={() =>
                                                    this.state.dataDash.total.totalQuestoesRespondidas ?
                                                    this.state.dataDash.total.totalQuestoesRespondidas
                                                    : null
                                                } 
                                            />
                                        </Col>
                                        <Col md={24} align="center" style={{fontSize: 17}}>
                                            Questões Respondidas
                                        </Col>  
                                    </Row>
                                </Col>  
                                <Col sm={24} md={8}>
                                    <Row type="flex">
                                        <Col md={24} align="center">
                                            <Progress 
                                                type="dashboard" 
                                                strokeColor="#006400"
                                                gapDegree={360}
                                                percent={1}
                                                format={() =>
                                                    this.state.dataDash.total.totalQuestoesCertas ?
                                                    this.state.dataDash.total.totalQuestoesCertas
                                                    : 0
                                                } 
                                            />
                                        </Col>
                                        <Col md={24} align="center" style={{fontSize: 17}}>
                                            Questões Certas
                                        </Col>  
                                    </Row>
                                </Col>  
                                <Col sm={24} md={8}>
                                    <Row type="flex">
                                        <Col md={24} align="center">
                                            <Progress 
                                                type="circle" 
                                                percent={
                                                    this.state.dataDash.total ?
                                                    this.state.dataDash.total.totalPercentual
                                                    : null
                                                } 
                                            />
                                        </Col>
                                        <Col md={24} align="center" style={{fontSize: 17}}>
                                            Percentual de acerto
                                        </Col>  
                                    </Row>
                                </Col>   
                                <Row style={{marginTop: 10}}>
                                    <Col span={24}>
                                        <Table
                                            columns={columns}
                                            dataSource={this.state.tableData}
                                            loading={this.state.tableLoading}
                                            scroll={{ x: 1000 }}
                                        />
                                    </Col>
                                </Row> 
                            </Row>                         
                                            
                        :
                            <Row>
                                <Col span={24}>
                                    Nenhum simulado disponível.
                                </Col>
                            </Row>
                    }
							
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

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(withRouter(AreaGestor)))