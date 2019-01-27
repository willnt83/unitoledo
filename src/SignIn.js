import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import LoginForm from './components/login/LoginForm'
import PersonificacaoSelecaoAluno from './components/login/PersonificacaoSelecaoAluno'
import GruposSelection from './components/login/GruposSelection'

class SignIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			step: 1,
			invalidLogin: null,
			selectedUser: null,
			userInfos: [],
			grupos: [],
			buscarButtonLoading: false,
			buscarUsuarioLoading: false,
			responseUserLogin: null,
			showModalBuscarUsuarios: false
		};
	}

	handleUserSelection = (response) => {
		this.showModal(false)
		var grupos = []
		var i = 0
		response.grupos.forEach((grupo) => {
			grupos.push({
				key: i,
				description: grupo.tipo
			})
			i++
		})
		this.setState({
			userInfos: response.grupos,
			grupos: grupos,
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
		if(this.state.grupos.length !== nextState.grupos.length && nextState.grupos.length > 0){
			this.setState({
				displayGruposSelect: 'block'
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
				<GruposSelection grupos={this.state.grupos} userInfos={this.state.userInfos} />
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