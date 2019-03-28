import React, { Component } from 'react'
import axios from "axios"
import { connect } from 'react-redux'

function BackEndRequestsWrapper(WrappedComponent) {
	class BackEndRequests extends Component {
		state = {
			createUpdateHabilidadeResponse: null,
			deleteHabilidadeResponse: null,

			createUpdateConteudoResponse: null,
			deleteConteudoResponse: null,

			createUpdateQuestaoResponse: null,
			getQuestoesResponse: null,
			deleteQuestaoResponse: null,

			createUpdateAreaDeConhecimentoResponse: null,
			deleteAreaDeConhecimentoResponse: null
		}

		getHabilidades = (status) => {
			var ativo = status !== '' ? '/ativo' : ''
			axios
			.get('http://localhost:5000/api/getHabilidades'+ativo)
			.then(res => {
				let tempArray = []
				let key = 0
				let labelStatus = null
				let valueStatus = null
				res.data.forEach((record, index) => {
					labelStatus = record.status === true ? "Ativo" : "Inativo"
					valueStatus = record.status === false ? false : true
					tempArray.push({
						key: key,
						id: record.id,
						description: record.description,
						labelStatus: labelStatus,
						valueStatus: valueStatus
					})
					key++
				})

				this.props.setHabilidades(tempArray)
			})
			.catch(error => {
				console.log(error)
			})
		}

		createUpdateHabilidade = (request) => {
			axios.post('http://localhost:5000/api/createUpdateHabilidade', request)
			.then(res => {
				if(res.data.success){
					this.setState({
						createUpdateHabilidadeResponse: {
							success: true,
							message: 'Habilidade cadastrada / atualizada com sucesso.'
						}
					})
				}
				else{
					this.setState({
						createUpdateHabilidadeResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error =>{
				console.log(error)
				this.setState({
					createUpdateHabilidadeResponse: {
						success: false,
						message: 'Erro ao cadastrar / atualizar habilidade.'
					}
				})
			})
		}

		deleteHabilidade = (id) => {
			axios.post('http://localhost:5000/api/deleteHabilidade', { id: id })
			.then(res => {
				if(res.data.success){
					this.setState({
						deleteHabilidadeResponse: {
							success: true,
							message: 'Habilidade removida com sucesso.'
						}
					})
				}
				else{
					this.setState({
						deleteHabilidadeResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error =>{
				console.log(error)
				this.setState({
					deleteHabilidadeResponse: {
						success: false,
						message: 'Erro ao remover habilidade.'
					}
				})
			})
		}

		getConteudos = (status) => {
			var ativo = status !== '' ? '/ativo' : ''
			axios.get('http://localhost:5000/api/getConteudos'+ativo)
			.then(res => {
				let tempArray = []
				let key = 0
				let labelStatus = null
				let valueStatus = null
				res.data.forEach((record, index) => {
					labelStatus = record.status === true ? 'Ativo' : 'Inativo'
					valueStatus = record.status === false ? false : true
					tempArray.push({
						key: key,
						id: record.id,
						description: record.description,
						labelStatus: labelStatus,
						valueStatus: valueStatus
					})
					key++
				})
				this.props.setConteudos(tempArray)
			})
			.catch(error =>{
				console.log(error)
			})
		}

		createUpdateConteudo = (request) => {
			axios.post('http://localhost:5000/api/createUpdateConteudo', request)
			.then(res => {
				console.log('response conteudo', res.data)
				if(res.data.success){
					this.setState({
						createUpdateConteudoResponse: {
							success: true,
							message: 'Conteúdo cadastrado / atualizado com sucesso.'
						}
					})
				}
				else{
					this.setState({
						createUpdateConteudoResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error =>{
				console.log(error)
				this.setState({
					createUpdateConteudoResponse: {
						success: false,
						message: 'Erro ao cadastrar / atualizar habilidade.'
					}
				})
			})
		}

		deleteConteudo = (id) => {
			axios.post('http://localhost:5000/api/deleteConteudo', {id: id})
			.then(res => {
				if(res.data.success){
					this.setState({
						deleteConteudoResponse: {
							success: true,
							message: 'Conteúdo removido com sucesso.'
						}
					})
				}
				else{
					this.setState({
						deleteConteudoResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error =>{
				console.log(error)
				this.setState({
					deleteConteudoResponse: {
						success: false,
						message: 'Erro ao remover conteúdo.'
					}
				})
			})
		}


		getAreasDeConhecimento = (status) => {
			var ativo = status !== '' ? '/ativo' : ''
			axios.get('http://localhost:5000/api/getAreaConhecimento'+ativo)
			.then(res => {
				let tempArray = []
				let key = 0
				let labelStatus = null
				let valueStatus = null
				res.data.forEach((record, index) => {
					labelStatus = record.status === true ? 'Ativo' : 'Inativo'
					valueStatus = record.status === false ? false : true
					tempArray.push({
						key: key,
						id: record.id,
						description: record.description,
						labelStatus: labelStatus,
						valueStatus: valueStatus
					})
					key++
				})
		
				this.props.setAreasDeConhecimento(tempArray)
			})
			.catch(error =>{
				console.log(error)
			})
		}

		createUpdateAreaDeConhecimento = (request) => {
			axios.post('http://localhost:5000/api/createUpdateAreaConhecimento', request)
			.then(res => {
				if(res.data.success){
					this.setState({
						createUpdateAreaDeConhecimentoResponse: {
							success: true,
							message: 'Área de conhecimento cadastrada / atualizada com sucesso.'
						}
					})
				}
				else{
					this.setState({
						createUpdateAreaDeConhecimentoResponse: {
							success: false,
							message: res.data.message
						}
					})
				}

			})
			.catch(error =>{
				console.log(error)
				this.setState({
					createUpdateAreaDeConhecimentoResponse: {
						success: false,
						message: 'Erro ao cadastrar / atualizar área de conhecimento.'
					}
				})
			})
		}

		deleteAreaDeConhecimento = (id) => {
			axios.post('http://localhost:5000/api/deleteAreaConhecimento', { id: id })
			.then(res => {
				if(res.data.success){
					this.setState({
						deleteAreaDeConhecimentoResponse: {
							success: true,
							message: 'Área de conhecimento removida com sucesso.'
						}
					})
				}
				else{
					this.setState({
						deleteAreaDeConhecimentoResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error =>{
				console.log(error)
				this.setState({
					deleteAreaDeConhecimentoResponse: {
						success: false,
						message: 'Erro ao remover área de conhecimento.'
					}
				})
			})
		}

		getFontes = (status) => {
			var ativo = status !== '' ? '/ativo' : ''
			axios
			.get('http://localhost:5000/api/getFontes'+ativo)
			.then(res => {
				let tempArray = []
				let key = 0
				let labelStatus = null
				let valueStatus = null
				res.data.forEach((record, index) => {
					labelStatus = record.status === true ? "Ativo" : "Inativo"
					valueStatus = record.status === false ? false : true
					tempArray.push({
						key: key,
						id: record.id,
						description: record.description,
						labelStatus: labelStatus,
						valueStatus: valueStatus
					})
					key++
				})
				this.props.setFontes(tempArray)
			})
			.catch(error => {
				console.log(error)
			})
		}

		createUpdateFonte = (request) => {
			axios.post('http://localhost:5000/api/createUpdateFonte', request)
			.then(res => {
				if(res.data.success){
					this.setState({
						createUpdateFonteResponse: {
							success: true,
							message: 'Fonte cadastrada / atualizada com sucesso.'
						}
					})
				}
				else{
					this.setState({
						createUpdateFonteResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error =>{
				console.log(error)
				this.setState({
					createUpdateFonteResponse: {
						success: false,
						message: 'Erro ao cadastrar / atualizar fonte.'
					}
				})
			})
		}

		deleteFonte = (id) => {
			axios.post('http://localhost:5000/api/deleteFonte', { id: id })
			.then(res => {
				if(res.data.success){
					this.setState({
						deleteFonteResponse: {
							success: true,
							message: 'Fonte removida com sucesso.'
						}
					})
				}
				else{
					this.setState({
						deleteFonteResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error =>{
				console.log(error)
				this.setState({
					deleteFonteResponse: {
						success: false,
						message: 'Erro ao remover fonte.'
					}
				})
			})
		}

		getQuestoes = (request) => {
			axios.post('http://localhost:5000/api/getQuestoesSimulado/questao', request)
			.then(res => {
				var labelStatus = null
				var tempArray = res.data.map(questao => {
					labelStatus = questao.status === true ? 'Ativo' : 'Inativo'

					return ({
						key: questao.id,
						description: questao.descricao,
						labelStatus: labelStatus,
						valueStatus: questao.status,
						valueEnade: questao.enade,
						valueDiscursiva: questao.discursiva,
						fonte: parseInt(questao.fonte),
						valueAno: questao.ano,
						ano: questao.ano,
						habilidade: questao.habilidade.description,
						habilidadeId: questao.habilidade.id,
						conteudo: questao.conteudo.description,
						conteudoId: questao.conteudo.id,
						areaConhecimento: questao.areaConhecimento.description,
						areaConhecimentoId: questao.areaConhecimento.id,
						imagem: questao.imagem,
						tipoId: questao.tipo.id
					})
				})
				this.props.setQuestoes(tempArray)
				this.setState({
					getQuestoesResponse: {
						success: true,
						message: 'Questões recuperadas com sucesso'
					}
				})
			})
			.catch(error =>{
				console.log(error)
			})
		}

		createUpdateQuestao = (request) => {
			axios.post('http://localhost:5000/api/createUpdateQuestao', request)
			.then(res => {
				if(res.data.success){
					this.setState({
						createUpdateQuestaoResponse: {
							success: true,
							message: 'Questão cadastrada / atualizada com sucesso.'
						}
					})
				}
				else{
					this.setState({
						createUpdateQuestaoResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error =>{
				console.log(error)
				this.setState({
					createUpdateQuestaoResponse: {
						success: false,
						message: 'Erro ao cadastrar / atualizar questão.'
					}
				})
			})
		}

		deleteQuestao = (id) => {
			axios
			.post('http://localhost:5000/api/deleteQuestao', { id: id })
			.then(res => {
				if(res.data.success){
					this.setState({
						deleteQuestaoResponse: {
							success: true,
							message: 'Questão removida com sucesso.'
						}
					})
				}
				else{
					this.setState({
						deleteQuestaoResponse: {
							success: false,
							message: res.data.message
						}
					})
				}
			})
			.catch(error => {
				console.log(error)
				this.setState({
					deleteQuestaoResponse: {
						success: false,
						message: 'Erro ao remover questão.'
					}
				})
			})
		}

		render() {
			return(
				<WrappedComponent
					{...this.props}
					getHabilidades={ this.getHabilidades }
					createUpdateHabilidade={ this.createUpdateHabilidade }
					createUpdateHabilidadeResponse={ this.state.createUpdateHabilidadeResponse }
					deleteHabilidade={ this.deleteHabilidade }
					deleteHabilidadeResponse={ this.state.deleteHabilidadeResponse }
					
					getConteudos={ this.getConteudos }
					createUpdateConteudo={ this.createUpdateConteudo }
					createUpdateConteudoResponse={ this.state.createUpdateConteudoResponse }
					deleteConteudo={ this.deleteConteudo }
					deleteConteudoResponse={ this.state.deleteConteudoResponse }

					getAreasDeConhecimento={ this.getAreasDeConhecimento }
					createUpdateAreaDeConhecimento={ this.createUpdateAreaDeConhecimento }
					createUpdateAreaDeConhecimentoResponse={ this.state.createUpdateAreaDeConhecimentoResponse }
					deleteAreaDeConhecimento={ this.deleteAreaDeConhecimento }
					deleteAreaDeConhecimentoResponse={ this.state.deleteAreaDeConhecimentoResponse }

					getFontes={ this.getFontes }
					createUpdateFonte={ this.createUpdateFonte }
					createUpdateFonteResponse={ this.state.createUpdateFonteResponse }
					deleteFonte={ this.deleteFonte }
					deleteFonteResponse={ this.state.deleteFonteResponse }

					getQuestoes={ this.getQuestoes }
					createUpdateQuestao={ this.createUpdateQuestao }
					createUpdateQuestaoResponse={ this.state.createUpdateQuestaoResponse }
					getQuestoesResponse={ this.state.getQuestoesResponse }
					deleteQuestao={ this.deleteQuestao }
					deleteQuestaoResponse={ this.state.deleteQuestaoResponse }
				/>
			)
		}
	}

	const MapStateToProps = (state) => {
		return {
			habilidades: state.habilidades
		}
	}

	const mapDispatchToProps = (dispatch) => {
		return {
			setHabilidades: (habilidades) => { dispatch({ type: 'SET_HABILIDADES', habilidades }) },
			setConteudos: (conteudos) => { dispatch({ type: 'SET_CONTEUDOS', conteudos }) },
			setAreasDeConhecimento: (areasDeConhecimento) => { dispatch({ type: 'SET_AREAS_DE_CONHECIMENTO', areasDeConhecimento }) },
			setFontes: (fontes) => { dispatch({ type: 'SET_FONTES', fontes }) },
			setQuestoes: (questoes) => { dispatch({ type: 'SET_QUESTOES', questoes }) }
		}
	}

	return connect(MapStateToProps, mapDispatchToProps)(BackEndRequests)
}

export default BackEndRequestsWrapper