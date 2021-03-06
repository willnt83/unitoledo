import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout, Table, Icon, Popconfirm, Modal, Input, Button, Row, Col, notification } from 'antd'
import { TextField, MenuItem } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'
import BackEndRequests from '../hocs/BackEndRequests'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"

const { Content } = Layout;
const statusOptions = [{
    value: true,
    label: 'Ativo'
},
{
    value: false,
    label: 'Inativo'
}];

const styles = ({
    customFilterDropdown: {
        padding: 8,
        borderRadius: 6,
        background: '#fff',
        boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'
    },
    customFilterDropdownInput: {
        width: 130,
        marginRight: 8
    },
    customFilterDropdownButton: {
        marginRight: 8
    },
    highlight: {
        color: '#f50'
    }
})

class Conteudos extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Conteúdos')
    }

    state = {
        loading: false,
        visible: false,
        buttonConfirmConteudoState: false,
        tableLoading: false,
        inId: '',
        inDescricao: '',
        inAreaDeConhecimento: '',
        inStatus: true,
        searchText: ''
    };

    resetInputStates = () => {
		this.setState({
			inId: "",
			inDescricao: "",
            inStatus: true,
            buttonConfirmConteudoState: false
		})
	}

    showConteudosModal = (rowId) => {
        if(typeof(rowId) == "undefined") {
            // Create
            this.setState({
                inId: '',
                inDescricao: '',
                inStatus: true
            })
        }
        else {
            // Edit
            this.setState({
                inId: this.props.conteudos[rowId].id,
                inDescricao: this.props.conteudos[rowId].description,
                inAreaDeConhecimento: this.props.conteudos[rowId].areaDeConhecimento.id,
                inStatus: this.props.conteudos[rowId].valueStatus
            })
        }

        this.setState({
            visible: true
        });
    }

    hideConteudosModal = () => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    handleGetAreasDeConhecimento = () => {
        this.props.getAreasDeConhecimento('ativo');
    }

    handleGetConteudos = () => {
        this.setState({tableLoading: true})
        this.props.getConteudos('');
    }

    handleCreateUpdateConteudo = () => {
        this.setState({ buttonConfirmConteudoState: true })
        let request = {
            id: this.state.inId,
            description: this.state.inDescricao,
            areaConhecimento: {id: this.state.inAreaDeConhecimento},
            status: this.state.inStatus
        }
        this.props.createUpdateConteudo(request)
    }

    handleDeleteConteudo = (id) => {
        this.props.deleteConteudo(id)
    }
    
    handleFormInput = (event) => {
		const target = event.target;
		
		this.setState({
			[target.name]: target.value
        });
    }
    
    handleSearch = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    componentWillMount(){
        if(this.props.mainData === null || (this.props.contexto !== 'COORDENADOR' && this.props.contexto !== 'PROFESSOR' && this.props.contexto !== 'APPPROVA - ADMIN')){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }
    }

    componentDidMount() {
        this.handleGetConteudos()
        this.handleGetAreasDeConhecimento()
    }

    componentWillUpdate(nextProps, nextState) {
        // Atualização da table
        if(nextProps.conteudos.length && nextProps.conteudos !== this.props.conteudos){
            this.setState({tableLoading: false})
        }

        // Tratando response da requisição createUpdateConteudo
		if(nextProps.createUpdateConteudoResponse && nextProps.createUpdateConteudoResponse !== this.props.createUpdateConteudoResponse){
			if(nextProps.createUpdateConteudoResponse.success){
				this.resetInputStates()
				this.hideConteudosModal()
				this.handleGetConteudos()
			}
			else{
                this.openNotificationError(nextProps.createUpdateConteudoResponse.message)
				this.resetInputStates();
				this.hideConteudosModal()
			}
        }
        
        
        // Tratando response da requisição deleteConteudo
        if(nextProps.deleteConteudoResponse && nextProps.deleteConteudoResponse !== this.props.deleteConteudoResponse){
			if(nextProps.deleteConteudoResponse.success){
				this.handleGetConteudos()
            }
            else{
                this.openNotificationError(nextProps.deleteConteudoResponse.message)
            }
		}
    }

    openNotificationError = (message) => {
        console.log('message', message)
        const args = {
            message: message,
            icon: <Icon type="stop" style={{color: '#f5222d', fontWeight: '800'}} />,
            duration: 0
        }
        notification.open(args)
    }

    render(){
        const { classes } = this.props;
        const { visible, buttonConfirmConteudoState } = this.state;

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
        }, {
            title: 'Descrição',
            dataIndex: 'description',
            sorter: (a, b) => { return a.description.localeCompare(b.description)},
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className={classes.customFilterDropdown}>
                    <Input
                        className={classes.customFilterDropdownInput}
                        ref={ele => this.searchInput = ele}
                        placeholder="Buscar"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={this.handleSearch(selectedKeys, confirm)}
                    />
                    <Button className={classes.customFilterDropdownButton} type="primary" onClick={this.handleSearch(selectedKeys, confirm)}>Buscar</Button>
                    <Button className={classes.customFilterDropdownButton} onClick={this.handleReset(clearFilters)}>Limpar</Button>
                </div>
            ),
            filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
            onFilter: (value, record) => record.description.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
                if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    });
                }
            },
            render: (text) => {
                const { searchText } = this.state;
                return searchText ? (
                    <span>
                        {text.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((fragment, i) => (
                            fragment.toLowerCase() === searchText.toLowerCase()
                            ? <span key={i} className="highlight">{fragment}</span> : fragment // eslint-disable-line
                        ))}
                    </span>
                ) : text;
            }
        }, {
            title: 'Status',
            dataIndex: 'labelStatus',
            align: 'center',
            width: 150,
            filters: [{
                text: 'Ativo',
                value: 'Ativo',
            }, {
                text: 'Inativo',
                value: 'Inativo',
            }],
            filterMultiple: false,
            onFilter: (value, record) => record.labelStatus.indexOf(value) === 0,
            sorter: (a, b) => { return a.labelStatus.localeCompare(b.labelStatus)}
        }, {
            title: 'Operação',
            colSpan: 2,
            dataIndex: 'operacao',
            align: 'center',
            width: 150,
            render: (text, record) => {
                return(
                    <React.Fragment>
                        <Icon type="edit" style={{cursor: 'pointer'}}onClick={() => this.showConteudosModal(record.key)} />
                        <Popconfirm title="Confirmar remoção?" onConfirm={() => this.handleDeleteConteudo(record.id)}>
                            <a href="/admin/cadastros/conteudos" style={{marginLeft: 20}}><Icon type="delete" style={{color: 'red'}} /></a>
                        </Popconfirm>
                    </React.Fragment>
                );
            }
        }];

        return(
            <Content
                style={{
                margin: "24px 16px",
                padding: 24,
                background: "#fff",
                minHeight: 280
                }}
            >
                <Row>
					<Col span={24} align="end" style={{marginTop: '10px', marginBottom: '10px'}}>
						<Button className="actionButton buttonGreen" title="Novo conteúdo" onClick={() => this.showConteudosModal()}><Icon type="plus" /> Novo Conteúdo</Button>
					</Col>
				</Row>
                
                <Table
                    columns={columns}
                    dataSource={this.props.conteudos}
                    loading={this.state.tableLoading}
                />
                <Modal
                    title="Conteúdo"
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}><Icon type="close" />Cancelar</Button>,
                        <Button key="submit" type="primary" loading={buttonConfirmConteudoState} onClick={this.handleCreateUpdateConteudo}>
                            <Icon type="check" />Confirmar
                        </Button>
                    ]}
                >
                    <TextField
                        id="descricao"
                        name="inDescricao"
                        value={this.state.inDescricao}
                        label="Descrição"
                        placeholder='Descrição'
                        fullWidth={true}
                        onChange={this.handleFormInput}
                        required
                    />
                    <TextField
                        id="areaDeConhecimento"
                        select
                        label="Área de Conhecimento"
                        fullWidth={true}
                        className={classes.textField}
                        value={this.state.inAreaDeConhecimento}
                        onChange={this.handleChange('inAreaDeConhecimento')}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {
                            this.props.areasDeConhecimento.map(option => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.description}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                    <TextField
                        id="status"
                        select
                        label="Status"
                        fullWidth={true}
                        className={classes.textField}
                        value={this.state.inStatus}
                        onChange={this.handleChange('inStatus')}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        margin="normal"
                    >
                        {
                            statusOptions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                </Modal>
          </Content>
        )
    }
}

Conteudos.propTypes = {
    classes: PropTypes.object.isRequired,
};

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData,
        contexto: state.contexto,
        conteudos: state.conteudos,
        areasDeConhecimento: state.areasDeConhecimento
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(withStyles(styles)(withRouter(Conteudos))));