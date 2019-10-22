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
			showModalBuscarUsuarios: false,
			clearContexto: false
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
			step: 2,
			clearContexto: true
		})
	}

	handleUserLogin = (response) => {

		var contextos = []
		if(response.gruposDTO && response.gruposDTO.grupos){
			var gruposFiltered = response.gruposDTO.grupos.filter(grupo => {
				return (grupo.tipo === 'ALUNO' || grupo.tipo === 'PROFESSOR' || grupo.tipo === 'COORDENADOR')
			})
	
			gruposFiltered.forEach((grupo) => {
				if(grupo.tipo === 'ALUNO'){
					contextos.push({
						value: 'aluno',
						description: 'ALUNO'
					})
				}
				
				if(grupo.tipo === 'PROFESSOR'){
					contextos.push({
						value: 'professor',
						description: 'PROFESSOR'
					})
				}

				if(grupo.tipo === 'COORDENADOR'){
					contextos.push({
						value: 'coordenador',
						description: 'COORDENADOR'
					})
				}
			})
		}

		// Verificando se tem outras permissões
		response.privilegios.forEach(privilegio => {
			if(privilegio === 'appprova'){
				contextos.push({
					value: 'appProvaAdmin',
					description: 'APPPROVA - ADMIN'
				})
			}
			
			if(privilegio === 'personificacao' || privilegio === 'appprova.personificacao'){
				contextos.push({
					value: 'personificacao',
					description: 'PERSONIFICAÇÃO'
				})
			}
		})

		var userInfos = response.gruposDTO && response.gruposDTO.grupos ? response.gruposDTO.grupos : null

		this.setState({
			userInfos,
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

	setClearContexto = (bool) => {
		this.setState({clearContexto: bool})
	}

	handleModalOk = () => {
        this.showModal(false);
    }

    handleModalCancel = () => {
        this.showModal(false);
	}
	
	render(){
		if(this.state.step === 1){
			return (
				<React.Fragment>
					<LoginForm showModal={this.showModal} setStep={this.setStep} handleUserLogin={this.handleUserLogin} />
				</React.Fragment>
			)
		}
		else{
			return (
				<React.Fragment>
					<SelecaoContexto
						contextos={this.state.contextos}
						userInfos={this.state.userInfos}
						showModal={this.showModal}
						clearContexto={this.state.clearContexto}
						setClearContexto={this.setClearContexto}
					/>
					<PersonificacaoSelecaoAluno
						visible={this.state.showModalBuscarUsuarios}
						showModal={this.showModal}
						handleUserSelection={this.handleUserSelection}
					/>
				</React.Fragment>

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