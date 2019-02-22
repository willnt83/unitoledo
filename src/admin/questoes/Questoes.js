import React, { Component } from "react"
import { Layout, Table, Icon, Popconfirm, Form, Input, Button, Row, Col, Select } from "antd"
import { withStyles } from "@material-ui/core/styles"
import BackEndRequests from '../hocs/BackEndRequests'
import { connect } from 'react-redux'
import axios from "axios"
import ModalCadastro from './ModalCadastro'

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
		props.getHabilidades()
        props.getConteudos()
        props.getAreasDeConhecimento()
	}

	state = {
		selectedRowKeys: [], // Check here to configure the default column
		//loading: false,
		tableLoading: false,
		showModalCadastro: false,
		questao: null,
		//searchText: "",
		questoes: null,
		buttonLoadingBuscar: false,
		/*
		filterHabilidadeOptions: null,
		filterConteudoOptions: null,
		filterAreaDeConhecimentoOptions: null,
		filterHabilidades: [],
		filterConteudos: [],
		filterAreasDeConhecimento: [],
		*/
		mode: null,
		tableDisplay: 'none',
		getQuestoesRequest: {
			codigo: '',
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
		}
	}

	resetQuestao = () => {
		this.setState({questao: null})
	}

	showModalCadastro = (row) => {
		this.props.getHabilidades()
		this.props.getConteudos()
		this.props.getAreasDeConhecimento()

		if (typeof row == "undefined") {
			// Create
			this.setState({mode: 'create', showModalCadastro: true})
		} else {
			// Edit
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
				this.setState({questao: row, showModalCadastro: true})
			})
			.catch(error =>{
				console.log(error)
			})
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
				codigo: '',
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

	componentWillUpdate(nextProps, nextState) {
		// Tratando response da requisição deleteQuestao
		if(nextProps.deleteQuestaoResponse && nextProps.deleteQuestaoResponse !== this.props.deleteQuestaoResponse){
			if(nextProps.deleteQuestaoResponse.success){
				this.handleGetQuestoes()
            }
		}

		// Tratando response da getQuestoes
		if(nextProps.getQuestoesResponse && nextProps.getQuestoesResponse !== this.props.getQuestoesResponse){
			var tableDisplay = nextProps.questoes.length > 0 ? 'inline' : 'none'
			this.setState({tableDisplay, buttonLoadingBuscar: false, tableLoading: false})
		}
	}

	render() {
		const { classes } = this.props
		const { getFieldDecorator } = this.props.form

		console.log('this.props.questoes', this.props.questoes)

		const columns = [
			{
				title: "ID",
				dataIndex: "key",
				sorter: (a, b) => a.key - b.key
			},
			{
				title: "Descrição",
				dataIndex: "description",
				sorter: (a, b) => this.compareByAlph(a.description, b.description)/*,
				filterDropdown: ({
					setSelectedKeys,
					selectedKeys,
					confirm,
					clearFilters
				}) => (
					<div className={classes.customFilterDropdown}>
					<Input
						className={classes.customFilterDropdownInput}
						ref={ele => (this.searchInput = ele)}
						placeholder="Buscar"
						value={selectedKeys[0]}
						onChange={e =>
							setSelectedKeys(e.target.value ? [e.target.value] : [])
						}
						onPressEnter={this.handleSearch(selectedKeys, confirm)}
					/>
					<Button
						className={classes.customFilterDropdownButton}
						type="primary"
						onClick={this.handleSearch(selectedKeys, confirm)}
					>
						Buscar
					</Button>
					<Button
						className={classes.customFilterDropdownButton}
						onClick={this.handleReset(clearFilters)}
					>
						Limpar
					</Button>
					</div>
				),
				filterIcon: filtered => (
					<Icon
						type="search"
						style={{ color: filtered ? "#108ee9" : "#aaa" }}
					/>
				),
				onFilter: (value, record) =>
					record.description.toLowerCase().includes(value.toLowerCase()),
				onFilterDropdownVisibleChange: visible => {
					if (visible) {
						setTimeout(() => {
							this.searchInput.focus()
						})
					}
				},
				render: text => {
					const { searchText } = this.state
					return searchText ? (
					<span>
						{text
						.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, "i"))
						.map(
							(fragment, i) =>
							fragment.toLowerCase() === searchText.toLowerCase() ? (
								<span key={i} className="highlight">
								{fragment}
								</span>
							) : (
								fragment
							) // eslint-disable-line
						)}
					</span>
					) : (
					text
					)
				}*/
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
							type="edit"
							style={{ cursor: "pointer" }}
							onClick={() => this.showModalCadastro(record)}
						/>
						<Popconfirm
							title="Confirmar remoção?"
							onConfirm={() => this.handleDeleteQuestao(record.id)}
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
					handleGetQuestoes={this.handleGetQuestoes}
					questao={this.state.questao}
					mode={this.state.mode}
					resetQuestao={this.resetQuestao}
				/>
			</Content>
		)
	}
}

const MapStateToProps = (state) => {
	return {
		habilidades: state.habilidades,
		conteudos: state.conteudos,
		areasDeConhecimento: state.areasDeConhecimento,
		questoes: state.questoes
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(withStyles(styles)(Form.create()(Questoes))))