import React, { Component } from "react"
import { Icon, Modal, Form, Button,  Row, Col, notification } from "antd"
import { connect } from 'react-redux'
import BackEndRequests from '../hocs/BackEndRequests'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const alternativasArray = ['A)', 'B)', 'C)', 'D)', 'E)']

class ModalViewQuestao extends Component {
    state = {
        questao: null,
        buttonLoadingSalvar: false,
        buttonLoadingGerarPDF: false,
        img: null
    }

    handleModalClosure = () => {
        this.props.showModalViewQuestaoF(false, this.props.op)
    }

    handleImprimir = () => {
        this.setState({buttonLoadingGerarPDF: true})
        const input = document.getElementById('questao');
        var HTML_Width = input.offsetWidth;
        var HTML_Height = input.offsetHeight;
        var top_left_margin = 15;
        var PDF_Width = HTML_Width+(top_left_margin*2);
        var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
        var canvas_image_width = HTML_Width;
        var canvas_image_height = HTML_Height;
        var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;

        html2canvas(input, {
            useCORS: true,
            scale: 1,
            scrollY: 0
        })
        .then((canvas) => {
            canvas.getContext('2d');

            var imgData = canvas.toDataURL('image/png');
            this.setState({img: imgData})
            var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'PNG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);

            for (var i = 1; i <= totalPDFPages; i++) { 
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'PNG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }
            pdf.save('questao-'+this.props.questao.key+'.pdf');
            this.setState({buttonLoadingGerarPDF: false})
        })
    }

    handleSubmit = () => {
        this.setState({buttonLoadingSalvar: true})
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
            duration: 5
        }
        notification.open(args)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.questao !== null){
            this.setState({questao: nextProps.questao})
        }
    }

    componentWillUpdate(nextProps, nextState) {
        // Tratando response da requisição createUpdateQuestao
		if(nextProps.createUpdateQuestaoResponse && nextProps.createUpdateQuestaoResponse !== this.props.createUpdateQuestaoResponse){
			if(nextProps.createUpdateQuestaoResponse.success){
                this.showNotification('Questão salva com sucesso.', true)
                this.setState({questao: null, buttonLoadingSalvar: false})
                this.props.showModalViewQuestaoF(false, this.props.op)
                this.props.hideModalCadastro()
                this.props.handleGetQuestoes()
            }
			else{
                this.showNotification(nextProps.createUpdateQuestaoResponse.message, false)
                this.props.showModalViewQuestaoF(false, this.props.op)
                this.setState({buttonLoadingSalvar: false})
            }
        }
    }

    dePara = (str) => {
        if(str === 'facil') return 'Fácil'
        else if(str === 'medio') return 'Médio'
        else if (str === 'dificil') return 'Difícil'
        else return '-'
    }

    render(){
        //var title = 'Questão'
        var description = null
        var alternativas = []
        var footerButtons = null

        if(this.state.questao !== null){
            /*if(this.state.questao.key !== null)
                title += ' '+this.state.questao.key*/
            description = this.state.questao.description
            alternativas = this.state.questao.alternativas
        }

        if(this.props.op === 'view'){
            footerButtons = [
                <Button
                    key="print"
                    type="primary"
                    onClick={this.handleImprimir}
                    loading={this.state.buttonLoadingGerarPDF}
                >
                    <Icon type="file-pdf" />Gerar PDF
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
        else if(this.props.op === 'write'){
            footerButtons = [
                <Button
                    key="submit"
                    className="buttonGreen"
                    onClick={this.handleSubmit}
                    loading={this.state.buttonLoadingSalvar}
                >
                    <Icon type="save" />Salvar
                </Button>
            ]
        }

        return(
            <React.Fragment>
                <Modal
                    title={'Visualização'}
                    visible={this.props.showModalViewQuestao}
                    onCancel={this.handleModalClosure}
                    width={900}
                    footer={footerButtons}
                >
                    <div id="questao" style={{fontVariant: 'normal', marginTop: 0, paddingTop: 0}}>
                        <Row>
                            <Col className="descricaoHtml2" span={24}>
                                Questão {this.state.questao ? this.state.questao.key : null}
                                {
                                    this.state.questao && this.state.questao.fonte ?
                                        <span style={{marginLeft: 15}}>Fonte: {this.state.questao.fonte}</span>
                                        :null
                                }
                                {
                                    this.state.questao && this.state.questao.ano?
                                        <span style={{marginLeft: 15}}>Ano: {this.state.questao.ano}</span>
                                        :null
                                }
                                {
                                    this.state.questao && this.state.questao.dificuldade ?
                                        <span style={{marginLeft: 15}}>Dificuldade: {this.dePara(this.state.questao.dificuldade)}</span>
                                        :null
                                }
                            </Col>
                        </Row>
                        <Row style={{marginTop: 10}}>
                            <Col className="descricaoHtml" span={24} dangerouslySetInnerHTML={{__html: description}} style={{display: 'block'}} />
                        </Row>
                        <Row>
                            {
                                alternativas.map((alternativa, index) => {
                                    return(
                                        <p key={alternativa.descricao} className="alternativa">{alternativasArray[index]} {alternativa.descricao}</p>
                                    )
                                })
                            }
                        </Row>
                    </div>
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