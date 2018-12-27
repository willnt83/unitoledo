import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout, Table, Icon, Popconfirm, Modal, Input, Button } from 'antd'
import { TextField, MenuItem, Tooltip } from '@material-ui/core/'
import ButtonUI from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import { withStyles } from '@material-ui/core/styles'
import BackEndRequests from '../hocs/BackEndRequests'
import { connect } from 'react-redux'

const { Content } = Layout
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

class Habilidades extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Habilidades')
    }

    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        visible: false,
        buttonConfirmHabilidadeState: false,
        tableLoading: false,
        inId: '',
        inDescricao: '',
        inStatus: true,
        searchText: ''
    }

    resetInputStates = () => {
		this.setState({
			inId: "",
			inDescricao: "",
            inStatus: true,
            buttonConfirmHabilidadeState: false
		})
	}

    showHabilidadesModal = (rowId) => {
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
                inId: this.props.habilidades[rowId].id,
                inDescricao: this.props.habilidades[rowId].description,
                inStatus: this.props.habilidades[rowId].valueStatus
            })
        }

        this.setState({
            visible: true
        });
    }

    hideHabilidadesModal = () => {
		this.setState({
			visible: false
		});
    }
    
    handleGetHabilidades = () => {
        this.setState({tableLoading: true})
        this.props.getHabilidades()
    }
    
    handleCreateUpdateHabilidade = () => {
        this.setState({ buttonConfirmHabilidadeState: true })
        
        let request = {
            id: this.state.inId,
            description: this.state.inDescricao,
            status: this.state.inStatus
        }
        this.props.createUpdateHabilidade(request)
    }

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    handleFormInput = (event) => {
		const target = event.target;
		
		this.setState({
			[target.name]: target.value
        });
    }
    
    handleDeleteHabilidade = (id) => {
        this.props.deleteHabilidade(id)
    }

    compareByAlph = (a, b) => {
        if (a > b)
            return -1;
        if (a < b)
            return 1;
        return 0;
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

    componentDidMount() {
        this.handleGetHabilidades()
    }

    componentWillUpdate(nextProps) {
        // Atualização da table
        if(nextProps.habilidades.length && nextProps.habilidades !== this.props.habilidades){
            this.setState({tableLoading: false})
        }

        // Tratando response da requisição createUpdateHabilidades
		if(nextProps.createUpdateHabilidadeResponse && nextProps.createUpdateHabilidadeResponse !== this.props.createUpdateHabilidadeResponse){
            this.setState({
                buttonConfirmHabilidadeState: false
            })

			if(nextProps.createUpdateHabilidadeResponse.success){
				this.resetInputStates()
				this.hideHabilidadesModal()
				this.handleGetHabilidades()
			}
			else{
				this.resetInputStates();
				this.hideHabilidadesModal()
			}
        }
        
        // Tratando response da requisição deleteHabilidade
        if(nextProps.deleteHabilidadeResponse && nextProps.deleteHabilidadeResponse !== this.props.deleteHabilidadeResponse){
			if(nextProps.deleteHabilidadeResponse.success){
				this.handleGetHabilidades()
			}
        }
    }

    render(){
        const { classes } = this.props;
        const {selectedRowKeys, visible, buttonConfirmHabilidadeState } = this.state;
        const hasSelected = selectedRowKeys.length > 0;

        const columns = [{
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
        }, {
            title: 'Descrição',
            dataIndex: 'description',
            sorter: (a, b) => this.compareByAlph(a.description, b.description),
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
            onFilter: (value, record) => record.labelStatus.indexOf(value) === 0
        }, {
            title: 'Operação',
            colSpan: 2,
            dataIndex: 'operacao',
            align: 'center',
            width: 150,
            render: (text, record) => {
                return(
                    <React.Fragment>
                        <Icon type="edit" style={{cursor: 'pointer'}}onClick={() => this.showHabilidadesModal(record.key)} />
                        <Popconfirm title="Confirmar remoção?" onConfirm={() => this.handleDeleteHabilidade(record.id)}>
                            <a href="/admin/cadastros/habilidades" style={{marginLeft: 20}}><Icon type="delete" style={{color: 'red'}} /></a>
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
                <div style={{ marginBottom: 16 }}>
                <Tooltip title="Adicionar Habilidade" placement="right">
                    <ButtonUI 
                        variant="fab" 
                        aria-label="Add" 
                        onClick={() => this.showHabilidadesModal()}
                        style={{backgroundColor: '#228B22', color: '#fff'}}>
                        <AddIcon />
                    </ButtonUI>
                    </Tooltip>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
                    </span>
                </div>
                
                <Table
                    columns={columns}
                    dataSource={this.props.habilidades}
                    loading={this.state.tableLoading}
                />
                <Modal
                    title="Habilidade"
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Cancelar</Button>,
                        <Button key="submit" type="primary" loading={buttonConfirmHabilidadeState} onClick={this.handleCreateUpdateHabilidade}>
                            Confirmar
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

Habilidades.propTypes = {
    classes: PropTypes.object.isRequired,
};

const MapStateToProps = (state) => {
	return {
        habilidades: state.habilidades
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(withStyles(styles)(Habilidades)));