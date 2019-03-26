import React, { Component } from "react"
import { Layout, Table, Icon, Popconfirm, Form, Button, Row, Col, Select, notification } from "antd"
import { withStyles } from "@material-ui/core/styles"
import BackEndRequests from '../hocs/BackEndRequests'
import { connect } from 'react-redux'
import axios from "axios"
import { withRouter } from "react-router-dom"
import ModalCadastro from './ModalCadastro'
import ModalViewQuestao from './ModalViewQuestao'

const { Content } = Layout
const Option = Select.Option

const styles = () => ({
	customFilterDropdown: {
		padding: 8,
		borderRadius: 6,
		background: "#fff",
		boxShadow: "0 1px 6px rgba(0, 0, 0, .2)"
	},
	customFilterDropdownInput: {
		width: 130,
		marginRight: 8
	},
	customFilterDropdownButton: {
		marginRight: 8
	},
	highlight: {
		color: "#f50"
	},
	group: {
		width: "auto",
		height: "auto",
		display: "flex",
		flexWrap: "nowrap",
		flexDirection: "row"
	},
	datePickerTextField: {
		marginTop: 20,
		width: 200
	}
})

class Questoes extends Component {
	constructor(props) {
        super()
		props.setPageTitle('Banco de Questões')
		props.getHabilidades('ativo')
        props.getConteudos('ativo')
        props.getAreasDeConhecimento('ativo')
	}

	state = {
		selectedRowKeys: [],
		tableLoading: false,
		showModalCadastro: false,
		showModalViewQuestao: false,
		questao: null,
		questoes: null,
		buttonLoadingBuscar: false,
		mode: null,
		tableDisplay: 'none',
		getQuestoesRequest: {
			codigos: [],
			enade: '',
			discursiva: '',
			fonte: '',
			habilidades: [],
			conteudos: [],
			areaConhecimentos: [],
			anos: [],
			tipo: {
				id: 0
			}
		},
		op: null
	}

	requestGetAlternativas = (row) => {
		axios.get('http://localhost:5000/api/getAlternativas/'+row.key)
		.then(res => {
			this.setState({mode: 'edit'})
			var alternativaLetras = ['A', 'B', 'C', 'D', 'E']
			var alternativaCorreta = null
			var alternativas = res.data.map((alternativa, index) => {
				if(alternativa.correta)
					alternativaCorreta = alternativaLetras[index]
				return({
					id: alternativa.id,
					correta: alternativa.correta,
					descricao: alternativa.descricao
				})
			})

			row.valueAlternativaCorreta = alternativaCorreta
			row.alternativas = alternativas
			this.setState({questao: row})
		})
		.catch(error =>{
			console.log(error)
		})
	}

	setQuestao = (questao) => {
		this.setState({questao})
	}

	resetQuestao = () => {
		this.setState({questao: null})
	}

	loadModalViewQuestao = (row) => {
		this.requestGetAlternativas(row)
		this.showModalViewQuestaoF(true, 'view')
	}

	showModalViewQuestaoF = (bool, op = null) => {
		this.setState({showModalViewQuestao: bool, op})
	}

	showModalCadastro = (row) => {
		if (typeof row == "undefined") {
			// Create
			this.setState({mode: 'create', showModalCadastro: true})
		} else {
			// Edit
			this.requestGetAlternativas(row)
			this.setState({showModalCadastro: true})
		}
	}

	hideModalCadastro = () => {
		this.setState({
			showModalCadastro: false
		})
	}

	handleGetQuestoes = () => {
		this.setState({ tableLoading: true })
		this.props.getQuestoes(this.state.getQuestoesRequest)
	}

	handleDeleteQuestao = (id) => {
		this.setState({tableLoading: true})
		this.props.deleteQuestao(id)
	}

	// Filtros e Ordenação
	compareByAlph = (a, b) => {
		if (a > b) return -1
		if (a < b) return 1
		return 0
	}

	handleSearch = (selectedKeys, confirm) => () => {
		confirm()
		this.setState({ searchText: selectedKeys[0] })
	}

	handleReset = clearFilters => () => {
		clearFilters()
		this.setState({ searchText: "" })
	}

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value
		})
	}

	openNotificationError = (message) => {
        const args = {
            message: message,
            icon: <Icon type="stop" style={{color: '#f5222d', fontWeight: '800'}} />,
            duration: 0
        }
        notification.open(args)
    }

	handleSearchSubmit = (event) => {
		event.preventDefault()
		this.setState({buttonLoadingBuscar: true, tableLoading: true})
		var request = null
		var habilidades = []
		var conteudos = []
		var areasDeConhecimento = []

		this.props.form.validateFieldsAndScroll((err, values) => {
			if(values.habilidades){
				habilidades = values.habilidades.map(habilidade =>{
					return({id: parseInt(habilidade)})
				})
			}
			if(values.conteudos){
				conteudos = values.conteudos.map(conteudo =>{
					return({id: parseInt(conteudo)})
				})
			}
			if(values.areasDeConhecimento){
				areasDeConhecimento = values.areasDeConhecimento.map(areaDeConhecimento =>{
					return({id: parseInt(areaDeConhecimento)})
				})
			}
			
			request = {
				codigos: [],
				enade: '',
				discursiva: '',
				fonte: '',
				habilidades: habilidades,
				conteudos: conteudos,
				areaConhecimentos: areasDeConhecimento,
				anos: [],
				tipo: {
					id: 0
				}
			}

			this.setState({getQuestoesRequest: request})

			this.props.getQuestoes(request)
		})
	}

	componentWillMount(){
        if(this.props.mainData === null || (this.props.contexto !== 'COORDENADOR' && this.props.contexto !== 'PROFESSOR')){
            this.props.resetAll()
            window.location.replace("/")
        }
    }

	componentWillUpdate(nextProps, nextState) {
		// Tratando response da requisição deleteQuestao
		if(nextProps.deleteQuestaoResponse && nextProps.deleteQuestaoResponse !== this.props.deleteQuestaoResponse){
			if(nextProps.deleteQuestaoResponse.success){
				this.handleGetQuestoes()
			}
			else{
				// Exibir mensagem de erro de remoção
				this.openNotificationError(nextProps.deleteQuestaoResponse.message)
				this.setState({tableLoading: false})
			}
		}

		// Tratando response da getQuestoes
		if(nextProps.getQuestoesResponse && nextProps.getQuestoesResponse !== this.props.getQuestoesResponse){
			var tableDisplay = nextProps.questoes.length > 0 ? 'inline' : 'none'
			this.setState({tableDisplay, buttonLoadingBuscar: false, tableLoading: false})
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form
		const columns = [
			{
				title: "ID",
				dataIndex: "key",
				sorter: (a, b) => a.key - b.key
			},
			{
				title: "Descrição",
				dataIndex: "description",
				sorter: (a, b) => this.compareByAlph(a.description, b.description),
			},
			{
				title: "Habilidade",
				dataIndex: "habilidade",
				sorter: (a, b) => this.compareByAlph(a.habilidade, b.habilidade),
				width: 139
			},
			{
				title: "Conteúdo",
				dataIndex: "conteudo",
				sorter: (a, b) => this.compareByAlph(a.conteudo, b.conteudo)
			},
			{
				title: "Área de Conhecimento",
				dataIndex: "areaConhecimento",
				sorter: (a, b) => this.compareByAlph(a.areaConhecimento, b.areaConhecimento),
				width: 93
			},
			{
				title: "Status",
				dataIndex: "labelStatus",
				align: "center",
				width: 150,
				filters: [
					{
						text: "Ativo",
						value: "Ativo"
					},
					{
						text: "Inativo",
						value: "Inativo"
					}
				],
				filterMultiple: false,
				onFilter: (value, record) => record.labelStatus.indexOf(value) === 0
			},
			{
				title: "Operação",
				colSpan: 2,
				dataIndex: "operacao",
				align: "center",
				width: 150,
				render: (text, record) => {
					return (
					<React.Fragment>
						<Icon
							type="eye"
							style={{ cursor: 'pointer'}}
							onClick={() => this.loadModalViewQuestao(record)}
						/>
						<Icon
							type="edit"
							style={{ cursor: 'pointer', marginLeft: 20 }}
							onClick={() => this.showModalCadastro(record)}
						/>
						<Popconfirm
							title="Confirmar remoção?"
							onConfirm={() => this.handleDeleteQuestao(record.key)}
						>
							<a href="/admin/cadastros/questoes" style={{ marginLeft: 20 }}>
								<Icon type="delete" style={{ color: "red" }} />
							</a>
						</Popconfirm>
					</React.Fragment>
					)
				}
			}
		]

		return (
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
							<Form.Item label="Habilidades">
								{getFieldDecorator('habilidades')(
									<Select
										mode="multiple"
										style={{ width: '100%' }}
										placeholder="Selecione as Habilidades"
									>
										{
											this.props.habilidades.map((item) => {
												return (<Option key={item.id}>{item.description}</Option>)
											})
										}
									</Select>
								)}
							</Form.Item>
							<Form.Item label="Conteúdos">
								{getFieldDecorator('conteudos')(
									<Select
										mode="multiple"
										style={{ width: '100%' }}
										placeholder="Selecione os Conteúdos"
									>
										{
											this.props.conteudos.map((item) => {
												return (<Option key={item.id}>{item.description}</Option>)
											})
										}
									</Select>
								)}
							</Form.Item>
							<Form.Item label="Áreas de Conhecimento">
								{getFieldDecorator('areasDeConhecimento')(
									<Select
										mode="multiple"
										style={{ width: '100%' }}
										placeholder="Selecione as Áreas de Conhecimento"
									>
										{
											this.props.areasDeConhecimento.map((item) => {
												return (<Option key={item.id}>{item.description}</Option>)
											})
										}
									</Select>
								)}
							</Form.Item>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									loading={this.state.buttonLoadingBuscar}
								>
									<Icon type="search" />Buscar
								</Button>
							</Form.Item>
						</Form>
					</Col>
				</Row>
				<Row>
					<Col span={24} align="end" style={{marginTop: '10px', marginBottom: '10px'}}>
						<Button className="actionButton buttonGreen" title="Nova questão" onClick={() => this.showModalCadastro()}><Icon type="plus" /> Nova Questão</Button>
					</Col>
				</Row>

				<Table
					style={{display: this.state.tableDisplay}}
					columns={ columns } 
					dataSource={ this.props.questoes }
					loading={ this.state.tableLoading }
				/>

				<ModalCadastro
					showModalCadastro={this.state.showModalCadastro}
					hideModalCadastro={this.hideModalCadastro}
					showModalViewQuestaoF={this.showModalViewQuestaoF}
					questao={this.state.questao}
					mode={this.state.mode}
					resetQuestao={this.resetQuestao}
					setQuestao={this.setQuestao}
				/>
				<ModalViewQuestao
					showModalViewQuestao={this.state.showModalViewQuestao}
					showModalViewQuestaoF={this.showModalViewQuestaoF}
					hideModalCadastro={this.hideModalCadastro}
					handleGetQuestoes={this.handleGetQuestoes}
					questao={this.state.questao}
					resetQuestao={this.resetQuestao}
					op={this.state.op}
				/>
			</Content>
		)
	}
}

const MapStateToProps = (state) => {
	return {
		mainData: state.mainData,
		contexto: state.contexto,
		habilidades: state.habilidades,
		conteudos: state.conteudos,
		areasDeConhecimento: state.areasDeConhecimento,
		questoes: state.questoes
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
		setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
		resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(withStyles(styles)(Form.create()(withRouter(Questoes)))))