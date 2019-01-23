import React, { Component } from "react"
import PropTypes from "prop-types"
import { Layout, Table, Icon, Popconfirm, Modal, Form, Input, Button, Upload, Row, Col, Select } from "antd"
import { TextField, MenuItem, Tooltip } from "@material-ui/core/"
import ButtonUI from "@material-ui/core/Button"
import AddIcon from "@material-ui/icons/Add"
import { withStyles } from "@material-ui/core/styles"
import BackEndRequests from '../hocs/BackEndRequests'
import { connect } from 'react-redux'

//import moment from "moment";

const { Content } = Layout
const Option = Select.Option
const FormItem = Form.Item

const statusOptions = [
	{
		value: true,
		label: "Ativo"
	},
	{
		value: false,
		label: "Inativo"
	}
];

const enadeOptions = [
	{
		value: true,
		label: "Sim"
	},
	{
		value: false,
		label: "Não"
	}
];

const discursivaOptions = [
	{
		value: true,
		label: "Sim"
	},
	{
		value: false,
		label: "Não"
	}
];

const alternativaOptions = [
	{
		value: "A",
		label: "A"
	},
	{
		value: "B",
		label: "B"
	},
	{
		value: "C",
		label: "C"
	},
	{
		value: "D",
		label: "D"
	},
	{
		value: "E",
		label: "E"
	}
];

const anoOptions = [
	{
		value: "2018",
		label: "2018"
	},
	{
		value: "2017",
		label: "2017"
	},
	{
		value: "2016",
		label: "2016"
	},
	{
		value: "2015",
		label: "2015"
	},
	{
		value: "2014",
		label: "2014"
	},
	{
		value: "2013",
		label: "2013"
	},
	{
		value: "2012",
		label: "2012"
	},
	{
		value: "2011",
		label: "2011"
	},
	{
		value: "2010",
		label: "2010"
	},
	{
		value: "2009",
		label: "2009"
	}
];

const tipoOptions = [
	{
		value: 1,
		label: 'Informação geral'
	},
	{
		value: 2,
		label: 'Conhecimento específico'
	}
]

const styles = theme => ({
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
});

class Questoes extends Component {
	constructor(props) {
        super()
        props.setPageTitle('Banco de Questões')
	}

	state = {
		selectedRowKeys: [], // Check here to configure the default column
		loading: false,
		tableLoading: false,
		visible: false,
		visibleAlternativa: false,
		buttonConfirmQuestoesState: false,
		alternativaCorretaDisabled: false,

		inId: "",
		inStatus: true,
		inHabilidade: "",
		inHabilidadeError: false,
		inConteudo: "",
		inConteudoError: false,
		inAreaConhecimento: "",
		inAreaConhecimentoError: false,
		inPadraoEnade: true,
		inPadraoEnadeError: false,
		inAno: "",
		inAnoError: false,
		inDescricao: "",
		inDescricaoError: false,
		inFonte: "",
		inFonteError: false,
		inDiscursiva: false,
		inTipo: "",
		inTipoError: false,
		inAlternativa: "",
		inAlternativaError: false,
		inAlternativaA: "",
		inAlternativaAError: false,
		inAlternativaB: "",
		inAlternativaBError: false,
		inAlternativaC: "",
		inAlternativaCError: false,
		inAlternativaD: "",
		inAlternativaDError: false,
		inAlternativaE: "",
		inAlternativaEError: false,
		idAlternativaA: "",
		idAlternativaB: "",
		idAlternativaC: "",
		idAlternativaD: "",
		idAlternativaE: "",
		searchText: "",
		questoes: null,
		filterHabilidadeOptions: null,
		filterConteudoOptions: null,
		filterAreaDeConhecimentoOptions: null,
		filterHabilidades: [],
		filterConteudos: [],
		filterAreasDeConhecimento: []
	};

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
			buttonConfirmQuestoesState: false
		});
	}

	showModal = rowId => {
		this.props.getHabilidades();
		this.props.getConteudos();
		this.props.getAreasDeConhecimento();
		if (typeof rowId == "undefined") {
			// Create
			this.setState({
			inId: "",
			inHabilidade: "",
			inConteudo: "",
			inAreaConhecimento: "",
			inStatus: true,
			inPadraoEnade: "",
			inAno: "",
			inDescricao: "",
			inFonte: "",
			inDiscursiva: false,
			inAlternativa: ""
			});
		} else {
			// Edit
			this.setState({
			inId: this.props.questoes[rowId].id,
			inHabilidade: this.props.questoes[rowId].habilidadeId,
			inConteudo: this.props.questoes[rowId].conteudoId,
			inAreaConhecimento: this.props.questoes[rowId].areaConhecimentoId,
			inStatus: this.props.questoes[rowId].valueStatus,
			inPadraoEnade: this.props.questoes[rowId].valueEnade,
			inAno: this.props.questoes[rowId].valueAno,
			inDescricao: this.props.questoes[rowId].description,
			inFonte: this.props.questoes[rowId].fonte,
			inDiscursiva: this.props.questoes[rowId].valueDiscursiva,
			inAlternativa: this.props.questoes[rowId].valueAlternativaCorreta,
			inAlternativaA: this.props.questoes[rowId].alternativas[0].descricao,
			inAlternativaB: this.props.questoes[rowId].alternativas[1].descricao,
			inAlternativaC: this.props.questoes[rowId].alternativas[2].descricao,
			inAlternativaD: this.props.questoes[rowId].alternativas[3].descricao,
			inAlternativaE: this.props.questoes[rowId].alternativas[4].descricao,
			idAlternativaA: this.props.questoes[rowId].alternativas[0].id,
			idAlternativaB: this.props.questoes[rowId].alternativas[1].id,
			idAlternativaC: this.props.questoes[rowId].alternativas[2].id,
			idAlternativaD: this.props.questoes[rowId].alternativas[3].id,
			idAlternativaE: this.props.questoes[rowId].alternativas[4].id
			});
	
		}
		this.setState({
			visible: true
		});
	}

	showModalAlternativa = () => {
		this.setState({
			visibleAlternativa: true
		});
	}

	handleGetQuestoes = () => {
		this.setState({ tableLoading: true })
		this.props.getQuestoes()
	}

	// Handlers
	handleCreateUpdateQuestao = () => {
		let corretaA = false, corretaB = false, corretaC = false, corretaD = false, corretaE = false;
		switch(this.state.inAlternativa){
			case 'A': {
				corretaA = true;
				break;
			}
			case 'B': {
				corretaB = true;
				break;
			}
			case 'C': {
				corretaC = true;
				break;
			}
			case 'D': {
				corretaD = true;
				break;
			}
			case 'E': {
				corretaE = true;
				break;
			}
			default:
				break;
		}

		let request = {
			"id": this.state.inId,
			"descricao": this.state.inDescricao,
			"status": this.state.inStatus,
			"enade": this.state.inPadraoEnade,
			"discursiva": this.state.inDiscursiva,
			"fonte": this.state.inFonte,
			"ano": this.state.inAno,
			"alterCorreta": this.state.inAlternativa,
			"imagem": "caminho da imagem",
			"conteudo": {
				"id": this.state.inConteudo
			},
			"habilidade": {
				"id": this.state.inHabilidade
			},
			"areaConhecimento": {
				"id": this.state.inAreaConhecimento
			},
			"alternativas" : [
				{
					"id": this.state.idAlternativaA,
					"descricao": this.state.inAlternativaA,
					"correta": corretaA
				},
				{
					"id": this.state.idAlternativaB,
					"descricao": this.state.inAlternativaB,
					"correta": corretaB
				},
				{
					"id": this.state.idAlternativaC,
					"descricao": this.state.inAlternativaC,
					"correta": corretaC
				},
				{
					"id": this.state.idAlternativaD,
					"descricao": this.state.inAlternativaD,
					"correta": corretaD
				},
				{
					"id": this.state.idAlternativaE,
					"descricao": this.state.inAlternativaE,
					"correta": corretaE
				}
			]
		};

		this.props.createUpdateQuestao(request);
	}

	handleDeleteQuestao = (id) => {
		this.props.deleteQuestao(id)
	}

	handleCancelAlternativa = () => {
		this.setState({
			visibleAlternativa: false
		});
	}

	handleButtonConfirmQuestoes = () => {
		let validationError = false;
		// Validações
		if(this.state.inHabilidade === ''){
			this.setState({ inHabilidadeError: true })
			validationError = true;
		}
		else {
			this.setState({ inHabilidadeError: false })
		}

		if(this.state.inConteudo === ''){
			this.setState({ inConteudoError: true })
			validationError = true;
		}
		else {
			this.setState({ inConteudoError: false })
		}

		if(this.state.inAreaConhecimento === ''){
			this.setState({ inAreaConhecimentoError: true })
			validationError = true;
		}
		else {
			this.setState({ inAreaConhecimentoError: false })
		}

		if(this.state.inPadraoEnade === ''){
			this.setState({ inPadraoEnadeError: true })
			validationError = true;
		}
		else {
			this.setState({ inPadraoEnadeError: false })
		}

		if(this.state.inAno === ''){
			this.setState({ inAnoError: true })
			validationError = true;
		}
		else {
			this.setState({ inAnoError: false })
		}

		if(this.state.inDescricao === ''){
			this.setState({ inDescricaoError: true })
			validationError = true;
		}
		else {
			this.setState({ inDescricaoError: false })
		}

		if(this.state.inFonte === ''){
			this.setState({ inFonteError: true })
			validationError = true;
		}
		else {
			this.setState({ inFonteError: false })
		}

		if(!validationError){
			this.setState({
				buttonConfirmQuestoesState: true
			});
			this.handleCreateUpdateQuestao();
		}
	}

	handleButtonConfirmAlternativa = () => {
	let validationError = false;

	if(this.state.inAlternativa === '') {
		this.setState({
		inAlternativaError: true
		});
		validationError = true;
	}
	else {
		this.setState({
		inAlternativaError: false
		});
	}

	if(this.state.inAlternativaA === '') {
		this.setState({
		inAlternativaAError: true
		});
		validationError = true;
	}
	else {
		this.setState({
		inAlternativaAError: false
		});
	}

	if(this.state.inAlternativaB === '') {
		this.setState({
		inAlternativaBError: true
		});
		validationError = true;
	}
	else {
		this.setState({
		inAlternativaBError: false
		});
	}

	if(this.state.inAlternativaC === '') {
		this.setState({
		inAlternativaCError: true
		});
		validationError = true;
	}
	else {
		this.setState({
		inAlternativaCError: false
		});
	}

	if(this.state.inAlternativaD === '') {
		this.setState({
		inAlternativaDError: true
		});
		validationError = true;
	}
	else {
		this.setState({
		inAlternativaDError: false
		});
	}

	if(this.state.inAlternativaE === '') {
		this.setState({
		inAlternativaEError: true
		});
		validationError = true;
	}
	else {
		this.setState({
		inAlternativaEError: false
		});
	}

	if(!validationError){
		this.handleCancelAlternativa();
	}
	}

	hideQuestoesModal = () => {
		this.setState({
			visible: false
		});
	}

	handleFormInput = event => {
	const target = event.target;

	this.setState({
		[target.name]: target.value
	});
	}

	// Filtros e Ordenação
	compareByAlph = (a, b) => {
		if (a > b) return -1;
		if (a < b) return 1;
		return 0;
	}

	handleSearch = (selectedKeys, confirm) => () => {
	confirm();
	this.setState({ searchText: selectedKeys[0] });
	}

	handleReset = clearFilters => () => {
	clearFilters();
	this.setState({ searchText: "" });
	}

	handleChange = name => event => {
	this.setState({
		[name]: event.target.value
	});
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

	componentWillUpdate(nextProps, nextState) {
		let bool = null;
		if(nextState.inDiscursiva !== this.state.inDiscursiva){
			bool = nextState.inDiscursiva;
			this.setState({
				alternativaCorretaDisabled: bool
			})
		}
		
		if(nextProps.questoes.length > 0 && (nextProps.questoes.length !== this.props.questoes.length)){
			this.setState({
				questoes: nextProps.questoes
			})
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

		// Tratando response da requisição createUpdateQuestao
		if(nextProps.createUpdateQuestaoResponse && nextProps.createUpdateQuestaoResponse !== this.props.createUpdateQuestaoResponse){
			if(nextProps.createUpdateQuestaoResponse.success){
				this.resetInputStates();
				this.hideQuestoesModal();
				this.handleGetQuestoes();
			}
			else{
				this.resetInputStates();
				this.hideQuestoesModal();
			}
		}

		// Tratando response da requisição deleteQuestao
		if(nextProps.deleteQuestaoResponse && nextProps.deleteQuestaoResponse !== this.props.deleteQuestaoResponse){
			if(nextProps.deleteQuestaoResponse.success){
				this.handleGetQuestoes();
			}
		}
	}

	render() {
		const { classes } = this.props;
		const { selectedRowKeys, visible, buttonConfirmQuestoesState,  visibleAlternativa} = this.state;
		const hasSelected = selectedRowKeys.length > 0;
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
							this.searchInput.focus();
						});
					}
				},
				render: text => {
					const { searchText } = this.state;
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
					);
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
							onClick={() => this.showModal(record.key)}
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
					);
				}
			}
		];

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
							<FormItem label="Habilidades" style={{marginBottom: '5px'}}>
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
							</FormItem>
							<FormItem label="Conteúdos" style={{marginBottom: '5px'}}>
								<Select
									mode="multiple"
									style={{ width: '100%' }}
									placeholder="Selecione os conteúdos"
									defaultValue={[]}
									onChange={this.handleChangeConteudosFilter}
								>
									{this.state.filterConteudoOptions}
								</Select>
							</FormItem>
							<FormItem label="Áreas de Conhecimento" style={{marginBottom: '5px'}}>
								<Select
									mode="multiple"
									style={{ width: '100%' }}
									placeholder="Selecione as áreas de conhecimento"
									defaultValue={[]}
									onChange={this.handleChangeAreasDeConhecimentoFilter}
								>
									{this.state.filterAreaDeConhecimentoOptions}
								</Select>
							</FormItem>
						</Form>
					</Col>
				</Row>

				<div style={{ marginBottom: 16 }}>
					<Tooltip title="Adicionar Questão" placement="right">
						<ButtonUI
							variant="fab"
							aria-label="Add"
							onClick={() => this.showModal()}
							style={{ backgroundColor: "#228B22", color: "#fff" }}
						>
							<AddIcon />
						</ButtonUI>
					</Tooltip>
					<span style={{ marginLeft: 8 }}>
						{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
					</span>
				</div>

				<Table 
					columns={ columns } 
					dataSource={ this.state.questoes }
					loading={ this.state.tableLoading }
				/>

				<Modal
					title="Questão"
					visible={visible}
					buttonConfirmQuestoesState={buttonConfirmQuestoesState}
					onCancel={this.hideQuestoesModal}
					width={900}
					footer={[
					<Button key="back" onClick={this.hideQuestoesModal}>
						<Icon type="close" />Cancelar
					</Button>,
					<Button
						key="submit"
						type="primary"
						loading={buttonConfirmQuestoesState}
						onClick={this.handleButtonConfirmQuestoes}
					>
						<Icon type="check" />Confirmar
					</Button>
					]}
				>
					<Row gutter={32}>
						<Col span={8}>
							<TextField
								id="habilidade"
								select
								label="Habilidade"
								fullWidth={true}
								className={classes.textField}
								value={this.state.inHabilidade}
								onChange={this.handleChange("inHabilidade")}
								InputLabelProps={{ shrink: true }}
								SelectProps={{
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
								required
								error={this.state.inHabilidadeError}
							>
								{this.props.habilidades.map(option => (
									<MenuItem key={option.id} value={option.id}>
										{option.description}
									</MenuItem>
								))}
							</TextField>
						</Col>
						<Col span={8}>
							<TextField
								id="conteudo"
								select
								label="Conteudo"
								fullWidth={true}
								className={classes.textField}
								value={this.state.inConteudo}
								onChange={this.handleChange("inConteudo")}
								InputLabelProps={{ shrink: true }}
								SelectProps={{
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
								required
								error={this.state.inConteudoError}
							>
								{this.props.conteudos.map(option => (
									<MenuItem key={option.id} value={option.id}>
										{option.description}
									</MenuItem>
								))}
							</TextField>
						</Col>
						<Col span={8}>
							<TextField
								id="areaConhecimento"
								select
								label="Área de Conhecimento"
								fullWidth={true}
								className={classes.textField}
								value={this.state.inAreaConhecimento}
								onChange={this.handleChange("inAreaConhecimento")}
								InputLabelProps={{ shrink: true }}
								SelectProps={{
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
								required
								error={this.state.inAreaConhecimentoError}
							>
								{this.props.areasDeConhecimento.map(option => (
									<MenuItem key={option.id} value={option.id}>
										{option.description}
									</MenuItem>
								))}
							</TextField>
						</Col>
					</Row>
					<Row gutter={32}>
						<Col span={8}>
							<TextField
								id="status"
								select
								label="Status"
								fullWidth={true}
								className={classes.textField}
								value={this.state.inStatus}
								onChange={this.handleChange("inStatus")}
								InputLabelProps={{ shrink: true }}
								SelectProps={{
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
								required
							>
								{statusOptions.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Col>
						<Col span={8}>
							<TextField
								id="status"
								select
								label="Padrão Enade"
								fullWidth={true}
								className={classes.textField}
								value={this.state.inPadraoEnade}
								onChange={this.handleChange("inPadraoEnade")}
								InputLabelProps={{ shrink: true }}
								SelectProps={{
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
								required
								error={this.state.inPadraoEnadeError}
							>
								{enadeOptions.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Col>
						<Col span={8}>
							<TextField
								id="ano"
								select
								label="Ano"
								fullWidth={true}
								className={classes.textField}
								value={this.state.inAno}
								onChange={this.handleChange("inAno")}
								InputLabelProps={{ shrink: true }}
								SelectProps={{
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
								required
								error={this.state.inAnoError}
							>
								{anoOptions.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Col>
					</Row>
					
					<TextField
						id="descricao"
						name="inDescricao"
						value={this.state.inDescricao}
						label="Descrição"
						placeholder="Descrição"
						multiline
						rows="4"
						fullWidth={true}
						onChange={this.handleFormInput}
						required
						error={this.state.inDescricaoError}
					/>
					<Row gutter={32}>
						<Col span={8}>
							<TextField
								id="fonte"
								name="inFonte"
								value={this.state.inFonte}
								label="Fonte"
								placeholder="Fonte"
								fullWidth={true}
								onChange={this.handleFormInput}
								style={{marginTop: 17}}
								required
								error={this.state.inFonteError}
							/>
						</Col>
						<Col span={8}>
							<TextField
								id="tipo"
								select
								label="Tipo"
								fullWidth={true}
								className={classes.textField}
								value={this.state.inTipo}
								onChange={this.handleChange("inTipo")}
								InputLabelProps={{ shrink: true }}
								SelectProps={{
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
								required
								error={this.state.inTipoError}
							>
								{tipoOptions.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Col>
						<Col span={8}>
							<TextField
								id="discursiva"
								select
								label="Discursiva"
								fullWidth={true}
								className={classes.textField}
								value={this.state.inDiscursiva}
								onChange={this.handleChange("inDiscursiva")}
								InputLabelProps={{ shrink: true }}
								SelectProps={{
									MenuProps: {
										className: classes.menu
									}
								}}
								margin="normal"
								required
							>
								{discursivaOptions.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Col>
					</Row>
					<br/><br/>
					<Row gutter={48}>
						<Col span={12}>
							<Upload>
								<Button>
									<Icon type="upload" /> Imagem
								</Button>
							</Upload>
						</Col>
						<Col span={12}>
							<Button
								disabled={this.state.alternativaCorretaDisabled}
								key="submit"
								type="primary"
								onClick={this.showModalAlternativa}
								style={{float: "right"}}
								>
								<Icon type="ordered-list" />Alternativas
							</Button>
						</Col>
					</Row>
				</Modal>

				<Modal
					title="Alternativas"
					visible={visibleAlternativa}
					onCancel={this.handleCancelAlternativa}
					footer={[
						<Button
							key="back"
							onClick={this.handleCancelAlternativa}
						>
							<Icon type="close" />Cancelar
						</Button>,
						<Button
							key="submit"
							type="primary"
							onClick={this.handleButtonConfirmAlternativa}
						>
							<Icon type="check" />Confirmar
						</Button>
					]}
				>
					<TextField
						id="alternativaCorreta"
						select
						label="Alternativa correta"
						fullWidth={true}
						className={classes.textField}
						value={this.state.inAlternativa}
						onChange={this.handleChange("inAlternativa")}
						InputLabelProps={{ shrink: true }}
						SelectProps={{
						MenuProps: {
							className: classes.menu
						}
						}}
						margin="normal"
						style={{marginTop: 17}}
						required
						error = {this.state.inAlternativaError}
					>
						{alternativaOptions.map(option => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
						))}
					</TextField>
					<TextField
						name="inAlternativaA"
						value={this.state.inAlternativaA}
						label="Alternativa A"
						placeholder="Alternativa A"
						fullWidth={true}
						onChange={this.handleFormInput}
						required
						style={{marginTop: 12}}
						error = {this.state.inAlternativaAError}
					/>
					<TextField
						name="inAlternativaB"
						value={this.state.inAlternativaB}
						label="Alternativa B"
						placeholder="Alternativa B"
						fullWidth={true}
						onChange={this.handleFormInput}
						required
						style={{marginTop: 12}}
						error = {this.state.inAlternativaBError}
					/>
					<TextField
						name="inAlternativaC"
						value={this.state.inAlternativaC}
						label="Alternativa C"
						placeholder="Alternativa C"
						fullWidth={true}
						onChange={this.handleFormInput}
						required
						style={{marginTop: 12}}
						error = {this.state.inAlternativaCError}
					/>
					<TextField
						name="inAlternativaD"
						value={this.state.inAlternativaD}
						label="Alternativa D"
						placeholder="Alternativa D"
						fullWidth={true}
						onChange={this.handleFormInput}
						required
						style={{marginTop: 12}}
						error = {this.state.inAlternativaDError}
					/>
					<TextField
						name="inAlternativaE"
						value={this.state.inAlternativaE}
						label="Alternativa E"
						placeholder="Alternativa E"
						fullWidth={true}
						onChange={this.handleFormInput}
						required
						style={{marginTop: 12}}
						error = {this.state.inAlternativaEError}
					/>
				</Modal>
			</Content>
		);
	}
}

Questoes.propTypes = {
	classes: PropTypes.object.isRequired
};

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

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(withStyles(styles)(Questoes)));