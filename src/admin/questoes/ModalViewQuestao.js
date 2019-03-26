import React, { Component } from "react"
import { Icon, Modal, Form, Button,  Row, Col, notification } from "antd"
import { connect } from 'react-redux'
import BackEndRequests from '../hocs/BackEndRequests'


class ModalViewQuestao extends Component {
    state = {
        questao: null,
        footerButtons: null
    }
    /*
    handleModalClosure = () => {
        // Resetando form
        this.props.resetQuestao()
        // Limpando state
        this.setState({
            questao: null
        })
        this.props.showModalViewQuestaoF(false)
    }
    */

    handleImprimir = () => {

    }

    handleSubmit = () => {
        this.props.createUpdateQuestao(this.props.request)
    }

    showNotification = (msg, success) => {
        var type = null
        var style = null
        if(success){
            type = 'check-circle'
            style = {color: '#4ac955', fontWeight: '800'}
        }
        else {
            type = 'exclamation-circle'
            style = {color: '#f5222d', fontWeight: '800'}
        }
        const args = {
            message: msg,
            icon:  <Icon type={type} style={style} />,
            duration: 3
        }
        notification.open(args)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.questao !== null){
            var footerButtons = null
            if(nextProps.op === 'view'){
                footerButtons = [
                    <Button
                        key="print"
                        type="primary"
                        onClick={this.handleImprimir}>
                        <Icon type="printer" />Imprimir
                    </Button>,
                    <Button
                        key="back"
                        className="buttonRed"
                        onClick={this.handleModalClosure}
                    >
                        <Icon type="close" />Fechar
                    </Button>
                ]
            }
            else if(nextProps.op === 'write'){
                footerButtons = [
                    <Button
                        key="submit"
                        className="buttonGreen"
                        onClick={this.handleSubmit}
                    >
                        <Icon type="save" />Salvar
                    </Button>
                ]
            }
            
            this.setState({questao: nextProps.questao, footerButtons})
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // Tratando response da requisição createUpdateQuestao
		if(nextProps.createUpdateQuestaoResponse && nextProps.createUpdateQuestaoResponse !== this.props.createUpdateQuestaoResponse){
			if(nextProps.createUpdateQuestaoResponse.success){
                /*
                this.handleModalClosure() // Limpa todas as variáveis e o formulário
				this.props.hideModalCadastro()
                */
                this.showNotification('Questão salva com sucesso.', true)
                this.setState({questao: null})
                this.props.showModalViewQuestaoF(false)
                this.props.hideModalCadastro()
                this.props.handleGetQuestoes()
            }
			else{
				this.openNotificationError(nextProps.createUpdateQuestaoResponse.message)
            }
        }
    }

    render(){
        var title = 'Questão'
        var description = null
        var alternativas = []
        
        
        if(this.state.questao !== null){
            if(this.state.questao.key !== null)
                title += ' '+this.state.questao.key
            description = this.state.questao.description
            alternativas = this.state.questao.alternativas
        }

        return(
            <React.Fragment>
                <Modal
                    title={title}
                    visible={this.props.showModalViewQuestao}
                    onCancel={this.handleModalClosure}
                    width={900}
                    footer={this.state.footerButtons}
                >
                <Row>
                    <Col span={24}>
                        {description}
                    </Col>
                </Row>
                <Row>
                    <ul style={{marginTop: 10, paddingLeft: 20}}>
                        {
                            alternativas.map(alternativa => {
                                var fontWeight = alternativa.correta ? 800 : 400
                                return(
                                    <li key={alternativa.id} style={{fontWeight: fontWeight}}>{alternativa.descricao}</li>
                                )
                            })
                        }
                    </ul>
                </Row>
                </Modal>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        request: state.request
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(BackEndRequests(ModalViewQuestao)))