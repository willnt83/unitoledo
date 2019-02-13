import React, { Component } from "react"
import { Layout, Table, Icon, Popconfirm, Form, Input, Button, Row, Col, Select } from "antd"
import { withStyles } from "@material-ui/core/styles"
import BackEndRequests from '../hocs/BackEndRequests'
import { connect } from 'react-redux'

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
	}

	state = {
		selectedRowKeys: [], // Check here to configure the default column
		loading: false,
		tableLoading: false,
		showModalCadastro: false,
		questao: null,
		searchText: "",
		questoes: null,
		filterHabilidadeOptions: null,
		filterConteudoOptions: null,
		filterAreaDeConhecimentoOptions: null,
		filterHabilidades: [],
		filterConteudos: [],
		filterAreasDeConhecimento: [],
		mode: null
	}

	/*
	resetInputStates = () => {
		this.setState({
			inId: "",
			inDescricao: "",
			inStatus: true,
			inPadraoEnade: "sim",
			inFonte: "",
			inAno: "",
			inAlternativa: "",
			inHabilidade: "",
			inConteudo: "",
			inAreaConhecimento: "",
			inDiscursiva: "",
			alternativaCorretaDisabled: false,
		})
	}
	*/

	showModalCadastro = (row) => {
		this.props.getHabilidades()
		this.props.getConteudos()
		this.props.getAreasDeConhecimento()

		if (typeof row == "undefined") {
			// Create
			this.setState({mode: 'create'})
		} else {
			// Edit
			this.setState({mode: 'edit'})
			this.setState({questao: row})
		}
		this.setState({
			showModalCadastro: true
		})
	}

	hideModalCadastro = () => {
		this.setState({
			showModalCadastro: false
		})
	}

	handleGetQuestoes = () => {
		this.setState({ tableLoading: true })
		this.props.getQuestoes()
	}

	// Handlers
	handleDeleteQuestao = (id) => {
		this.setState({tableLoading: true})
		this.props.deleteQuestao(id)
	}

	handleCancelAlternativa = () => {
		this.setState({
			visibleAlternativa: false
		})
	}

	handleButtonConfirmAlternativa = () => {
		let validationError = false

		if(this.state.inAlternativa === '') {
			this.setState({
			inAlternativaError: true
			})
			validationError = true
		}
		else {
			this.setState({
			inAlternativaError: false
			})
		}

		if(this.state.inAlternativaA === '') {
			this.setState({
			inAlternativaAError: true
			})
			validationError = true
		}
		else {
			this.setState({
			inAlternativaAError: false
			})
		}

		if(this.state.inAlternativaB === '') {
			this.setState({
			inAlternativaBError: true
			})
			validationError = true
		}
		else {
			this.setState({
			inAlternativaBError: false
			})
		}

		if(this.state.inAlternativaC === '') {
			this.setState({
			inAlternativaCError: true
			})
			validationError = true
		}
		else {
			this.setState({
			inAlternativaCError: false
			})
		}

		if(this.state.inAlternativaD === '') {
			this.setState({
			inAlternativaDError: true
			})
			validationError = true
		}
		else {
			this.setState({
			inAlternativaDError: false
			})
		}

		if(this.state.inAlternativaE === '') {
			this.setState({
			inAlternativaEError: true
			})
			validationError = true
		}
		else {
			this.setState({
			inAlternativaEError: false
			})
		}

		if(!validationError){
			this.handleCancelAlternativa()
		}
	}

	handleFormInput = event => {
	const target = event.target

	this.setState({
		[target.name]: target.value
	})
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

	// Filtros
	handleChangeHabilidadesFilter = (values) => {
		if(values.length > 0){
			this.setState({
				filterHabilidades: values
			})
		}
		else{
			this.setState({
				filterHabilidades: []
			})
		}
	}

	handleChangeConteudosFilter = (values) => {
		if(values.length > 0){
			this.setState({
				filterConteudos: values
			})
		}
		else{
			this.setState({
				filterConteudos: []
			})
		}
	}

	handleChangeAreasDeConhecimentoFilter = (values) => {
		if(values.length > 0){
			this.setState({
				filterAreasDeConhecimento: values
			})
		}
		else{
			this.setState({
				filterAreasDeConhecimento: []
			})
		}
	}

	componentDidMount() {
        this.handleGetQuestoes()
	}
	// /Filtros

	componentWillReceiveProps(nextProps){
		console.log('atualizando table...')
		if(nextProps.questoes){
			this.setState({
				questoes: nextProps.questoes
			})
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.questoes.length > 0 && (nextProps.questoes.length !== this.props.questoes.length)){
			/*
			console.log('atualizando table...')
			this.setState({
				questoes: nextProps.questoes
			})
			*/
		}

		// Atualização da table
        if(nextProps.questoes.length && nextProps.questoes !== this.props.questoes){
			this.setState({tableLoading: false})
			let habilidadeOptions = []
			let conteudoOptions = []
			let areaDeConhecimentoOptions = []
			let tempKeys = []

			// Construindo opções de filtro de habilidades
			habilidadeOptions = nextProps.questoes.map((item) => {
				if(tempKeys.indexOf(item.habilidadeId) === -1){
					tempKeys.push(item.habilidadeId)
					return (<Option key={item.habilidadeId} filtro="habilidades">{item.habilidade}</Option>)
				}
				else
					return null
			})

			// Reset do array temporario
			tempKeys.length = 0

			// Construindo opções de filtro de conteudos
			conteudoOptions = nextProps.questoes.map((item) => {
				if(tempKeys.indexOf(item.conteudoId) === -1){
					tempKeys.push(item.conteudoId)
					return (<Option key={item.conteudoId} filtro="conteudos">{item.conteudo}</Option>)
				}
				else
					return null
			})

			// Reset do array temporario
			tempKeys.length = 0

			// Construindo opções de filtro de áreas de conhecimento
			areaDeConhecimentoOptions = nextProps.questoes.map((item) => {
				if(tempKeys.indexOf(item.areaConhecimentoId) === -1){
					tempKeys.push(item.areaConhecimentoId)
					return (<Option key={item.areaConhecimentoId} filtro="areasDeConhecimento">{item.areaConhecimento}</Option>)
				}
				else
					return null
			})


			this.setState({
				filterHabilidadeOptions: habilidadeOptions,
				filterConteudoOptions: conteudoOptions,
				filterAreaDeConhecimentoOptions: areaDeConhecimentoOptions
			})
		}

		// Tratando alterações dos valores de filtro
		if(
			this.state.filterHabilidades.length !== nextState.filterHabilidades.length
			|| this.state.filterConteudos.length !== nextState.filterConteudos.length
			|| this.state.filterAreasDeConhecimento.length !== nextState.filterAreasDeConhecimento.length
		){
			// Existe filtro
			if(
				nextState.filterHabilidades.length > 0
				|| nextState.filterConteudos.length > 0
				|| nextState.filterAreasDeConhecimento.length > 0
			){
				// Filtra questões
				let filteredQuestoes = []
				let allQuestoes = this.props.questoes
				let hit = false
				if(nextState.filterHabilidades.length > 0){
					filteredQuestoes = allQuestoes.filter((questao) => {
						hit = false
						nextState.filterHabilidades.forEach((value) => {
							if(questao.habilidadeId === parseInt(value)){
								hit = true
							}
						})
						return hit
					})
					allQuestoes = filteredQuestoes
				}

				if(nextState.filterConteudos.length > 0){
					filteredQuestoes = allQuestoes.filter((questao) => {
						hit = false
						nextState.filterConteudos.forEach((value) => {
							if(questao.conteudoId === parseInt(value)){
								hit = true
							}
						})
						return hit
					})
					allQuestoes = filteredQuestoes
				}

				if(nextState.filterAreasDeConhecimento.length > 0){
					filteredQuestoes = allQuestoes.filter((questao) => {
						hit = false
						nextState.filterAreasDeConhecimento.forEach((value) => {
							if(questao.areaConhecimentoId === parseInt(value)){
								hit = true
							}
						})
						return hit
					})
					allQuestoes = filteredQuestoes
				}

				this.setState({
					questoes: filteredQuestoes
				})

			}
			// Não existe filtro
			else{
				// Retorna todas as questões
				this.setState({
					questoes: this.props.questoes
				})
			}
		}

		// Tratando response da requisição deleteQuestao
		if(nextProps.deleteQuestaoResponse && nextProps.deleteQuestaoResponse !== this.props.deleteQuestaoResponse){
			if(nextProps.deleteQuestaoResponse.success){
				this.handleGetQuestoes()
            }
		}
	}

	render() {
		const { classes } = this.props
		const columns = [
			{
				title: "ID",
				dataIndex: "id",
				sorter: (a, b) => a.id - b.id
			},
			{
				title: "Descrição",
				dataIndex: "description",
				sorter: (a, b) => this.compareByAlph(a.description, b.description),
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
				}
			},
			{
				title: "Habilidade",
				dataIndex: "habilidade",
				sorter: (a, b) => a.id - b.id
			},
			{
				title: "Conteúdo",
				dataIndex: "conteudo",
				sorter: (a, b) => a.id - b.id
			},
			{
				title: "Área de Conhecimento",
				dataIndex: "areaConhecimento",
				sorter: (a, b) => a.id - b.id
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
						<Form layout="vertical">
							<Form.Item label="Habilidades" style={{marginBottom: '5px'}}>
								<Select
									id="filterHabilidades"
									mode="multiple"
									style={{ width: '100%' }}
									placeholder="Selecione as habilidades"
									defaultValue={[]}
									notFoundContent="Sem registros"
									onChange={this.handleChangeHabilidadesFilter}
								>
									{this.state.filterHabilidadeOptions}
								</Select>
							</Form.Item>
							<Form.Item label="Conteúdos" style={{marginBottom: '5px'}}>
								<Select
									mode="multiple"
									style={{ width: '100%' }}
									placeholder="Selecione os conteúdos"
									defaultValue={[]}
									onChange={this.handleChangeConteudosFilter}
								>
									{this.state.filterConteudoOptions}
								</Select>
							</Form.Item>
							<Form.Item label="Áreas de Conhecimento" style={{marginBottom: '5px'}}>
								<Select
									mode="multiple"
									style={{ width: '100%' }}
									placeholder="Selecione as áreas de conhecimento"
									defaultValue={[]}
									onChange={this.handleChangeAreasDeConhecimentoFilter}
								>
									{this.state.filterAreaDeConhecimentoOptions}
								</Select>
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
					columns={ columns } 
					dataSource={ this.state.questoes }
					loading={ this.state.tableLoading }
				/>

				<ModalCadastro
					showModalCadastro={this.state.showModalCadastro}
					hideModalCadastro={this.hideModalCadastro}
					handleGetQuestoes={this.handleGetQuestoes}
					questao={this.state.questao}
					mode={this.state.mode}
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