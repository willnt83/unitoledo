import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout, Table, Icon, Popconfirm, Modal, Input, Button, Row, Col, notification } from 'antd'
import { TextField, MenuItem } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'
import BackEndRequests from '../hocs/BackEndRequests'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"

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

class Fontes extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Fontes')
    }

    state = {
        loading: false,
        visible: false,
        buttonConfirmFonteState: false,
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
            buttonConfirmFonteState: false
		})
	}

    showFontesModal = (rowId) => {
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
                inId: this.props.fontes[rowId].id,
                inDescricao: this.props.fontes[rowId].description,
                inStatus: this.props.fontes[rowId].valueStatus
            })
        }

        this.setState({
            visible: true
        });
    }

    hideFontesModal = () => {
		this.setState({
			visible: false
		});
    }
    
    handleGetFontes = () => {
        this.setState({tableLoading: true})
        this.props.getFontes('')
    }
    
    handleCreateUpdateFonte = () => {
        this.setState({ buttonConfirmFonteState: true })
        
        let request = {
            id: this.state.inId,
            description: this.state.inDescricao,
            status: this.state.inStatus
        }
        this.props.createUpdateFonte(request)
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
    
    handleDeleteFonte = (id) => {
        this.props.deleteFonte(id)
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
        this.handleGetFontes()
    }

    componentWillUpdate(nextProps) {
        // Atualização da table
        if(nextProps.fontes.length && nextProps.fontes !== this.props.fontes){
            this.setState({tableLoading: false})
        }

        // Tratando response da requisição createUpdateFontes
		if(nextProps.createUpdateFonteResponse && nextProps.createUpdateFonteResponse !== this.props.createUpdateFonteResponse){
            this.setState({
                buttonConfirmFonteState: false
            })

			if(nextProps.createUpdateFonteResponse.success){
				this.resetInputStates()
				this.hideFontesModal()
				this.handleGetFontes()
			}
			else{
                this.openNotificationError(nextProps.createUpdateFonteResponse.message)
				this.resetInputStates();
				this.hideFontesModal()
			}
        }
        
        
        // Tratando response da requisição deleteFonte
        if(nextProps.deleteFonteResponse && nextProps.deleteFonteResponse !== this.props.deleteFonteResponse){
			if(nextProps.deleteFonteResponse.success){
				this.handleGetFontes()
            }
            else{
                this.openNotificationError(nextProps.deleteFonteResponse.message)
            }
        }
    }

    openNotificationError = (message) => {
        const args = {
            message: message,
            icon: <Icon type="stop" style={{color: '#f5222d', fontWeight: '800'}} />,
            duration: 0
        }
        notification.open(args)
    }

    render(){
        const { classes } = this.props;
        const {visible, buttonConfirmFonteState } = this.state;

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
                        <Icon type="edit" style={{cursor: 'pointer'}}onClick={() => this.showFontesModal(record.key)} />
                        <Popconfirm title="Confirmar remoção?" onConfirm={() => this.handleDeleteFonte(record.id)}>
                            <a href="/admin/cadastros/fontes" style={{marginLeft: 20}}><Icon type="delete" style={{color: 'red'}} /></a>
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
						<Button className="actionButton buttonGreen" title="Nova fonte" onClick={() => this.showFontesModal()}><Icon type="plus" /> Nova Fonte</Button>
					</Col>
				</Row>
                <Table
                    columns={columns}
                    dataSource={this.props.fontes}
                    loading={this.state.tableLoading}
                />
                <Modal
                    title="Fonte"
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}><Icon type="close" />Cancelar</Button>,
                        <Button key="submit" type="primary" loading={buttonConfirmFonteState} onClick={this.handleCreateUpdateFonte}>
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

Fontes.propTypes = {
    classes: PropTypes.object.isRequired,
};

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData,
        contexto: state.contexto,
        fontes: state.fontes
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(withStyles(styles)(withRouter(Fontes))));