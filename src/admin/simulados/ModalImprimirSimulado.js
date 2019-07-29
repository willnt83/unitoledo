import React, { Component } from "react"
import { Icon, Modal, Form, Button,  Row, Col, Divider, Select } from "antd"
import { connect } from 'react-redux'
import BackEndRequests from '../hocs/BackEndRequests'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const alternativasArray = ['A)', 'B)', 'C)', 'D)', 'E)']

const tipoQuestaoOptions = [
    {
        value: 0,
        description: 'Todas as questões'
    },
    {
        value: 1,
        description: 'Somente questões de alternativas'
    },
    {
        value: 2,
        description: 'Somente questões discursivas'
    }
]

class ModalImprimirSimulado extends Component {
    state = {
        footerButtons: null,
        buttonLoadingSalvar: false,
        questoes: [],
        buttonLoadingGerarPDF: false
    }

    handleModalClosure = () => {
        this.props.handleShowModalImprimir(false)
    }

    handleImprimir = () => {
        this.setState({buttonLoadingGerarPDF: true})
        const input = document.getElementById('simulado');
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
            scale: 3
        })
        .then((canvas) => {
            canvas.getContext('2d');
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
            
            for (var i = 1; i <= totalPDFPages; i++) { 
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }
            pdf.save('simulado-'+this.props.simulado.id+'.pdf');
            this.setState({buttonLoadingGerarPDF: false})
        })

    }

    changeTipoResposta = (value) => {
        var questoes = this.props.simulado.questoes
        var questoesExibidas = []
        if(value !== 0){
            questoesExibidas = questoes.filter(questao => {
                return(questao.tipoResposta.id === value)
            })
            this.setState({questoes: questoesExibidas})
        }
        else{
            this.setState({questoes})
        }
    }

    componentDidMount(){
        this.props.form.setFieldsValue({tipoResposta: 0})
    }

    componentWillReceiveProps(nextProps){
        if(this.props.simulado !== nextProps.simulado){
            this.setState({questoes: nextProps.simulado.questoes})
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form
        var title = 'Impressão do Simulado'

        return(
            <React.Fragment>
                <Modal
                    title={title}
                    visible={this.props.showModalImprimir}
                    onCancel={this.handleModalClosure}
                    width={900}
                    footer={
                        <Button
                            key="print"
                            type="primary"
                            onClick={this.handleImprimir}
                            loading={this.state.buttonLoadingGerarPDF}
                        >
                            <Icon type="file-pdf" />Gerar PDF
                        </Button>
                    }
                >
                    <Row>
                        <Col span={24}>
                            <Form layout="vertical">
                                <Form.Item label="Tipo de Questões">
                                    {getFieldDecorator('tipoResposta')(
                                        <Select
                                            name="tipoResposta"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione o tipo da questão"
                                            onChange={this.changeTipoResposta}
                                        >
                                            {
                                                tipoQuestaoOptions.map((item) => {
                                                    return (<Select.Option key={item.value} value={item.value}>{item.description}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                    <Divider />
                    <div id="simulado" style={{fontVariant: 'normal'}}>
                        <Row>
                            <Col span={24}>
                                <img src="/app-prova/img/logo_unitoledo.png" alt="Logo UNITOLEDO" style={{width: 200}} />
                            </Col>
                        </Row>
                        <Row style={{marginBottom: 0, marginTop: 10}}>
                            <Col span={24}><h4>Simulado: {this.props.simulado ? this.props.simulado.nome : null}</h4></Col>
                        </Row>
                        <Divider style={{marginTop: 10}} />
                        {
                            this.state.questoes.length > 0 ?
                            this.state.questoes.map((questao, index) => {
                                return(
                                    <React.Fragment key={questao.id}>
                                        <div className="questaoSimuladoImpressao">
                                            <Row style={{marginTop: 0, marginBottom: 0}}>
                                                <Col className="descricaoHtml2" span={24} dangerouslySetInnerHTML={{__html: 'Questao '+ (index + 1) + ' ('+ questao.fonte.description + ')' + questao.descricao}} />
                                            </Row>
                                            {
                                                questao.tipoResposta.id === 1 ?
                                                <Row>
                                                    <Col span={24}>
                                                        {
                                                            questao.alternativas ?
                                                            questao.alternativas.map((alternativa, index) => {
                                                                return(
                                                                    <p key={alternativa.descricao} className="alternativa">{alternativasArray[index]} {alternativa.descricao}</p>
                                                                )
                                                            })
                                                            :null
                                                        }
                                                    </Col>
                                                </Row>
                                                :
                                                <Row style={{marginTop: 10, marginBottom: 10}}>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                    <Col span={24} className="linhasDiscursiva"></Col>
                                                </Row>
                                            }
                                        </div>
                                    </React.Fragment>
                                )
                            })
                            : null
                        }
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

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(BackEndRequests(ModalImprimirSimulado)))