import React, { Component } from "react"
import { Layout, Icon, Form, Button, Row, Col, Select, Progress, Table } from "antd"
import { connect } from 'react-redux'
import axios from "axios"
import { withRouter } from "react-router-dom"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const { Content } = Layout
const Option = Select.Option

const tiposOptions = [
	{
		id: 1,
		description: "Formação Geral"
	},
	{
		id: 2,
		description: "Conhecimento Específico"
	},
	{
		id: 3,
		description: "Todos"
	}
]

class PercentualDeAcertos extends Component {
	constructor(props) {
        super()
		props.setPageTitle('Relatório de Percentual de Acerto')
	}

	state = {
		idSimulado: null,
		xlsUrl: null,
		simuladosOptions: [],
		buttonLoading: false,
		tableLoading: false,
		tableData: [],
		mediaSimulado: null,
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
				axios.get(this.props.backEndPoint+'/api/percentualDeAcerto/'+values.simulado+'/'+values.tipo)
				.then(res => {
					var mediaSimulado = res.data.mediaSimulado !== 'NaN' ? res.data.mediaSimulado : false
					console.log('res.data.alunos', res.data.alunos)
					this.setState({
						idSimulado: values.simulado,
						xlsUrl: this.props.backEndPoint+'/api/percentualDeAcertoDownload/'+values.simulado+'/'+values.tipo,
						tableData: res.data.alunos.map(aluno => {
							return({
								key: aluno.idAluno,
								nome: aluno.nomeAluno,
								taxaAcerto: aluno.taxaAcerto
							})
						}),
						mediaSimulado
					})
				})
				.catch(error =>{
					console.log('error: ', error)
				})
			}
		})
	}
	/*
	change = () => {
		this.setState({
			reportUrl: null
		})
	}*/

	handleImprimir = () => {
        this.setState({buttonLoadingGerarPDF: true})
        const input = document.getElementById('print');
        var HTML_Width = input.offsetWidth;
        var HTML_Height = input.offsetHeight;
        var top_left_margin = 15;
        var PDF_Width = HTML_Width+(top_left_margin*2);
        var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;
        var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;

        html2canvas(input, {
            useCORS: true,
            scale: 3
        })
        .then((canvas) => {
            canvas.getContext('2d');
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
            
            
            for (var i = 1; i <= totalPDFPages; i++) { 
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }
            pdf.save('percentualAcerto-'+this.state.idSimulado+'.pdf');
            this.setState({buttonLoadingGerarPDF: false})
        })
    }

	componentWillMount(){
		this.getSimulados()
	}

	render() {
		const { getFieldDecorator } = this.props.form
		/*
		const buttonReport = this.state.reportUrl === null ?
            <Button className="buttonGreen" onClick={this.gerarRelatorio} loading={this.state.buttonLoading}><Icon type="bar-chart" /> Gerar Relatório</Button>
            :
            <a href={this.state.reportUrl}><Button className="buttonOrange" onClick={this.resetButton}><Icon type="download" /> Baixar Relatório</Button></a>
		*/

		const columns = [
			{
				title: "ID",
				dataIndex: "key",
				width: 20,
				sorter: (a, b) => a.key - b.key
			},
			{
				title: "Aluno",
				dataIndex: "nome",
				sorter: (a, b) => { return a.nome.localeCompare(b.nome)}
			},
			{
				title: "",
				colSpan: 2,
				dataIndex: "percentual",
				width: 600,
				render: (text, record) => {
					return (
						<Progress
							strokeColor={'#41ff45'}
							percent={record.taxaAcerto}
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
								<Form.Item label="Tipo">
									{getFieldDecorator('tipo', {
										rules: [
											{
												required: true, message: 'Por favor selecione o tipo',
											}
										]
									})(
										<Select
											style={{ width: '100%' }}
											placeholder="Selecione o tipo"
											onChange={this.change}
										>
											{
												tiposOptions.map((item) => {
													return (<Option key={item.id}>{item.description}</Option>)
												})
											}
										</Select>
									)}
								</Form.Item>
								<Button className="buttonGreen" onClick={this.gerarRelatorio} loading={this.state.buttonLoading}><Icon type="bar-chart" /> Gerar Relatório</Button>
								{
									this.state.mediaSimulado ?
									<React.Fragment>
										<Button
											style={{marginLeft: 10}}
											key="print"
											type="primary"
											onClick={this.handleImprimir}
											loading={this.state.buttonLoadingGerarPDF}
										>
											<Icon type="file-pdf" />Gerar PDF
										</Button>
										<a href={this.state.xlsUrl}>
											<Button
												style={{marginLeft: 10}}
												key="print"
												className="buttonOrange"
											>
												<Icon type="file-excel" />Gerar Planilha
											</Button>
										</a>
									</React.Fragment>
									: null
								}
							</Form>
						</Col>
					</Row>
				</Content>
				{
					this.state.mediaSimulado ?
					<div id="print" style={{fontVariant: 'normal'}}>
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
									<h2>Visão Geral</h2>
								</Col>
							</Row>
							<Row>
								<Col span={24}>
									<h3>Média no Simulado</h3>
								</Col>
								<Col span={12}>
									<Progress
										strokeColor={'#41ff45'}
										percent={this.state.mediaSimulado}
									/>
								</Col>
							</Row>
							<Row style={{marginTop: 40}}>
								<Col span={24}>
									<h3>Taxa de Acerto por Aluno</h3>
								</Col>
							</Row>
							<Row style={{marginTop: 10}}>
								<Col span={24}>
									<Table
										columns={columns}
										dataSource={this.state.tableData}
										loading={this.state.tableLoading}
									/>
								</Col>
							</Row>
						</Content>
					</div>
					: null
				}

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

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PercentualDeAcertos)))