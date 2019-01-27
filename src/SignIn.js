import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import LoginForm from './components/login/LoginForm'
import PersonificacaoSelecaoAluno from './components/login/PersonificacaoSelecaoAluno'
import SelecaoContexto from './components/login/SelecaoContexto'

class SignIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 1,
			invalidLogin: null,
			selectedUser: null,
			userInfos: [],
			contextos: [],
			buscarButtonLoading: false,
			buscarUsuarioLoading: false,
			responseUserLogin: null,
			showModalBuscarUsuarios: false
		};
	}

	handleUserSelection = (response) => {
		console.log('handleUserSelection input', response)
		this.showModal(false)
		var contextos = []
		var i = 0
		response.grupos.forEach((contexto) => {
			contextos.push({
				key: i,
				description: contexto.tipo
			})
			i++
		})
		this.setState({
			userInfos: response.grupos,
			contextos: contextos,
			step: 2
		})
	}

	showModal = (showModal) => {
		this.setState({ showModalBuscarUsuarios: showModal });
    };

	handleModalOk = () => {
        this.showModal(false);
    }

    handleModalCancel = () => {
        this.showModal(false);
	}

	componentWillUpdate(nextProps, nextState) {
		if(this.state.contextos.length !== nextState.contextos.length && nextState.contextos.length > 0){
			this.setState({
				displaycontextosSelect: 'block'
			})
		}
	}
	
	render () {
		if(this.state.step === 1) {
			return (
				<React.Fragment>
					<LoginForm showModal={this.showModal} />
					<PersonificacaoSelecaoAluno visible={this.state.showModalBuscarUsuarios} showModal={this.showModal} handleUserSelection={this.handleUserSelection} />
				</React.Fragment>
			)
		}
		else{
			return (
				<SelecaoContexto contextos={this.state.contextos} userInfos={this.state.userInfos} />
			)
		}
	}
}

const MapStateToProps = (state) => {
	return {
		logged: state.logged,
		token: state.token,
		cookie: state.cookie
	}
}

export default connect(MapStateToProps, null)(withRouter(SignIn))