import React, { Component } from "react"
import { Layout, Icon, Form, Button, Row, Col, Select, Progress, Table } from "antd"
import { connect } from 'react-redux'
import axios from "axios"
import { withRouter } from "react-router-dom"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const { Content } = Layout
const Option = Select.Option

class Detalhado extends Component {
	constructor(props) {
        super()
		props.setPageTitle('Relatório Detalhado')
	}

	state = {
		idSimulado: null,
		xlsUrl: null,
		simuladosOptions: [],
		buttonLoading: false,
		tableLoading: false,
		tableData: [],
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
				axios.get(this.props.backEndPoint+'/api/relatorioDetalhado/'+values.simulado)
				.then(res => {
					console.log('response', res.data)


					this.setState({
						dataAvail: true,
						tableData: res.data.map(row => {
							return({
								matricula: row.matricula,
								aluno: row.aluno,
								quantidadeAcertosFG: row.qtdAcertoFG,
								notaFG: row.notaObjetivasFG+'%',
								quantidadeAcertosCE: row.qtdAcertoCE,
								notaCE: row.notaObjetivasCE+'%',
								totalAcertosObjetiva: row.totalAcertoObjetivas,
								totalNotaObjetiva: row.notaObjetivasTotal,
								notaDiscursivaFG: row.notaDiscursivaFG+'%',
								notaDiscursivaCE: row.notaDiscursivaCE+'%',
								notaFinalFG: row.notaFinalFG+'%',
								notaFinalCE: row.notaFinalCE+'%',
								notaTotal: row.notaTotal+'%'
							})
						}),
						xlsUrl: this.props.backEndPoint+'/api/relatorioDetalhadoDownload/'+values.simulado,
					})

				})
				.catch(error =>{
					console.log('error: ', error)
				})
			}
		})
	}

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
            pdf.save('detalhado.pdf');
            this.setState({buttonLoadingGerarPDF: false})
        })
    }

	componentWillMount(){
		this.getSimulados()
	}

	render() {
		console.log('tableData', this.state.tableData)
		const { getFieldDecorator } = this.props.form

		const columns = [
			{
				title: "Matrícula",
				dataIndex: "matricula",
				width: 20,
				sorter: (a, b) => a.matricula - b.matricula
			},
			{
				title: "Nome do Aluno",
				dataIndex: "aluno",
				width: 300,
				sorter: (a, b) => { return a.aluno.localeCompare(b.aluno)}
			},
			{
				title: "Quantidade de acertos em FG",
				dataIndex: "quantidadeAcertosFG",
				sorter: (a, b) => a.quantidadeAcertosFG - b.quantidadeAcertosFG
			},
			{
				title: "Nota FG objetivas (%)",
				dataIndex: "notaFG",
				sorter: (a, b) => a.notaFG - b.notaFG
			},
			{
				title: "Quantidades de acertos em CE",
				dataIndex: "quantidadeAcertosCE",
				sorter: (a, b) => a.quantidadeAcertosCE - b.quantidadeAcertosCE
			},
			{
				title: "Nota CE objectivas (%)",
				dataIndex: "notaCE",
				sorter: (a, b) => a.notaCE - b.notaCE
			},
			{
				title: "Total de acertos objetivas",
				dataIndex: "totalAcertosObjetiva",
				sorter: (a, b) => a.totalAcertosObjetiva - b.totalAcertosObjetiva
			},
			{
				title: "Taxa de acerto total objetivas",
				dataIndex: "totalNotaObjetiva",
				sorter: (a, b) => a.totalNotaObjetiva - b.totalNotaObjetiva
			},
			{
				title: "Nota FG discursivas (%)",
				dataIndex: "notaDiscursivaFG",
				sorter: (a, b) => a.notaDiscursivaFG - b.notaDiscursivaFG
			},
			{
				title: "Nota CE discursivas (%)",
				dataIndex: "notaDiscursivaCE",
				sorter: (a, b) => a.notaDiscursivaCE - b.notaDiscursivaCE
			},
			{
				title: "Nota final FG (%)",
				dataIndex: "notaFinalFG",
				sorter: (a, b) => a.notaFinalFG - b.notaFinalFG
			},
			{
				title: "Nota final CE (%)",
				dataIndex: "notaFinalCE",
				sorter: (a, b) => a.notaFinalCE - b.notaFinalCE
			},
			{
				title: "Nota final total (%)",
				dataIndex: "notaTotal",
				sorter: (a, b) => a.notaTotal - b.notaTotal
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
								<Button className="buttonGreen" onClick={this.gerarRelatorio} loading={this.state.buttonLoading}><Icon type="bar-chart" /> Gerar Relatório</Button>
								{
									this.state.dataAvail ?
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
					this.state.dataAvail ?
					<div id="print" style={{fontVariant: 'normal'}}>
						<Content
							style={{
								margin: "24px 16px",
								padding: 24,
								background: "#fff",
							}}
						>
							<Row style={{ marginBottom: 16 }}>
								<Col span={24}>
									<h2>Relatório Detalhado</h2>
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

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(withRouter(Detalhado)))