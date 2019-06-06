import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"
import LoginForm from './login/LoginForm'
import PersonificacaoSelecaoAluno from './login/PersonificacaoSelecaoAluno'
import SelecaoContexto from './login/SelecaoContexto'

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

	handleUserLogin = (response) => {
		var i = 0
		var contextos = []
		var gruposFiltered = response.gruposDTO.grupos.filter(grupo => {
			return (grupo.tipo === 'ALUNO' || grupo.tipo === 'PROFESSOR')
		})
		console.log('grupos filtered', gruposFiltered)

		gruposFiltered.forEach((contexto) => {
			contextos.push({
				key: i,
				description: contexto.tipo
			})
			i++
		})

		this.setState({
			userInfos: response.gruposDTO.grupos,
			step: 2,
			contextos: contextos
		})
	}

	showModal = (showModal) => {
		this.setState({ showModalBuscarUsuarios: showModal });
	};
	
	setStep = (step) => {
		this.setState({step})
	}

	handleModalOk = () => {
        this.showModal(false);
    }

    handleModalCancel = () => {
        this.showModal(false);
	}
	/*
	componentWillUpdate(nextProps, nextState) {
		if(this.state.contextos.length !== nextState.contextos.length && nextState.contextos.length > 0){
			this.setState({
				displaycontextosSelect: 'block'
			})
		}
	}
	*/
	
	render(){
		console.log('this.state.contextos', this.state.contextos)
		console.log('this.state.userInfos', this.state.userInfos)
		if(this.state.step === 1){
			console.log('step 1')
			return (
				<React.Fragment>
					<LoginForm showModal={this.showModal} setStep={this.setStep} handleUserLogin={this.handleUserLogin} />
					<PersonificacaoSelecaoAluno visible={this.state.showModalBuscarUsuarios} showModal={this.showModal} handleUserSelection={this.handleUserSelection} />
				</React.Fragment>
			)
		}
		else{
			console.log('step 2')
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