import React, { Component } from "react"
import { Layout, Icon, Form, Button, Row, Col, Select, Progress, Table } from "antd"
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import axios from "axios"
import { withRouter } from "react-router-dom"
import moment from 'moment'



const { Content } = Layout
const Option = Select.Option

class PlanilhaEnade extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Planilhas Enade')
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
        dataDash: [],
        file: [],
        loadPlanilha: false,
        loadExcluir: false
	}
    compareByDates = (a, b) => {
        a = moment(a, 'DD/MM/YYYY HH:mm')
            b = moment(b, 'DD/MM/YYYY HH:mm')
        if (a > b) return -1
        if (a < b) return 1
        return 0
    }

	getPlanilhasEnade = () => {				
		axios.get(this.props.backEndPoint+'/api/getPlanilhaEnade')
        .then(res => {
                    var dataHoraImportacao = null ;                   
                    var tableData = []
                    tableData = res.data.map(planilha => {
                        dataHoraImportacao = moment(planilha.dataHoraImportacao)                        

                        return ({
                            ano: planilha.ano,
                            codigoArea: planilha.codArea,
                            area: planilha.area,
                            percentual: planilha.percentual,
                            dataAtualizacao: dataHoraImportacao.format('DD/MM/YYYY HH:mm')
                        })
                    })
					
                    this.setState({tableLoading: false})
                    this.setState({tableData})			
        })
        .catch(error =>{
            console.log('error: ', error)
        })
    }
    
    onDrop = (acceptedFiles, rejectedFiles) => {
        this.setState({loadPlanilha: true})
        console.log(acceptedFiles)       
        var reader = new FileReader()
        reader.readAsDataURL(acceptedFiles[0])
        reader.onload = (event) => {
            var bodyFormData = new FormData()
            bodyFormData.append('file', acceptedFiles[0]) 
            axios({
                method: 'post',
                url: this.props.backEndPoint+'/api/enade/import',
                data: bodyFormData,
                config: { headers: {'Content-Type': 'multipart/form-data' }}
            })
            .then(res => {
                this.getPlanilhasEnade();
                alert("Planilha incluida com sucesso");
                this.setState({loadPlanilha: false})
            })
            .catch(error =>{
                console.log(error)
            })

        }
        reader.onerror = function (error) {
            console.log('Error: ', error)
            return false
        }
    }

    excluirPlanilha = (ano, codArea) => {
        this.setState({loadPlanilha: true})
        axios.get(this.props.backEndPoint+'/api/deletePlanilha/'+ano+'/'+codArea)
        .then(res => {
            alert("Planilha do Enade Excluida com sucesso")
            this.getPlanilhasEnade();	
            this.setState({loadPlanilha: false})	
        })
        .catch(error =>{
            console.log('error: ', error)
            alert("Erro ao excluir Planilha do Enade")
            this.setState({loadPlanilha: false})
        })
    }

	componentWillMount(){
        this.getPlanilhasEnade();
	}

	render() {
		const { getFieldDecorator } = this.props.form

		const columns = [
			{
				title: "ANO",
				dataIndex: "ano",
				width: 100,
				sorter: (a, b) => a.key - b.key
			},
			{
				title: "Código Área",
				dataIndex: "codigoArea",
				width: 150,
				sorter: (a, b) => { return a.codigoArea.localeCompare(b.codigoArea)}
			},
			{
				title: "Área",
				dataIndex: "area",
				width: 400,
				sorter: (a, b) => { return a.area.localeCompare(b.area)}
            },
            {
				title: "Data de Atualização",
				dataIndex: "dataAtualizacao",
				width: 200,
				sorter: (a, b) => { return a.dataAtualizacao.localeCompare(b.dataAtualizacao)}
            },
            {
				title: "Excluir planilha",
				colSpan: 2,
				dataIndex: "excluirPlanilha",
				align: "center",
                width: 150,
               
				render: (text, record) => {                                       
					return (
                        <React.Fragment>                        
                            <Row style={{marginTop: 5}}>
                                <Col span={24}>
                                    <Button className="actionButton buttonRed" title="Excluir Planilha" onClick={() => this.excluirPlanilha(record.ano, record.codigoArea)}>
                                        {this.state.loadExcluir ? <Icon type="load" /> : <Icon type="delete" /> }
                                        {this.state.loadExcluir ? "Excluindo Planilha" : "Excluir Planilha" }                                        
                                    </Button>                                    
                                </Col>
                            </Row>
                        </React.Fragment>
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
						background: "#fff"
					}}
				>    
                    <Row>
						<Col span={24}>
							<Form layout="vertical">								
                                <Dropzone onDrop={this.onDrop}>
                                    {({getRootProps, getInputProps}) => (
                                        <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                            <Button type="primary" size={'large'}>
                                                {this.state.loadPlanilha ? <Icon type="loading" /> : <Icon type="upload" />}
                                                {this.state.loadPlanilha ? "Importando Planilha"   : "Importar Planilha"}
                                            </Button>
                                        </div>
                                    )}
                                </Dropzone>                               							
							</Form>
						</Col>
					</Row>
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

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(withRouter(PlanilhaEnade)))