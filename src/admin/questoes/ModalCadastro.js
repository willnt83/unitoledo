import React, { Component } from "react"
import { Icon, Modal, Form, Input, Button,  Row, Col, Select, Tooltip, notification } from "antd"
import { connect } from 'react-redux'
import ModalAlternativas from './ModalAlternativas'
import BackEndRequests from '../hocs/BackEndRequests'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import moment from 'moment'
import axios from "axios"
/*import {MegadraftEditor, editorStateFromRaw, editorStateToJSON} from "megadraft"
import "../../../node_modules/megadraft/dist/css/megadraft.css"*/

import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs';



const statusOptions = [
	{
		value: 'true',
		label: "Ativo"
	},
	{
		value: 'false',
		label: "Inativo"
	}
]

const dificuldadeOptions = [
	{
		value: 'facil',
		label: 'Fácil'
	},
	{
		value: 'medio',
		label: "Médio"
    },
    {
		value: 'dificil',
		label: "Difícil"
    }
]

const discursivaOptions = [
	{
		value: 1,
		label: "Sim"
	},
	{
		value: 0,
		label: "Não"
	}
]

const tipoOptions = [
	{
		value: 1,
		label: 'Formação geral'
	},
	{
		value: 2,
		label: 'Conhecimento específico'
	}
]

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
}
const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    maxWidth: '100%',
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
}

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
}

const img = {
    objectFit: 'cover',
    display: 'block',
    width: '100%',
    height: 'auto'
}

/*
const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 'auto',
    height: 150,
    padding: 4,
    boxSizing: 'border-box'
}

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
}

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
}
*/

class ModalCadastro extends Component {
    state = {
        alternativaCorretaDisabled: true,
        showModalAlternativas: false,
        alternativaCorreta: null,
        alternativas: [],
        anoOptions: [],
        questaoId: '',
        questaoContent: null,
        alternativasTooltipVisible: false,
        file: null,
        fileBase64: null,
        receivedFile: null,
        resetAlternativasForm : false,
        editorState: EditorState.createEmpty(),
        images: []
    }

    stringToBool = (str) => {
        return (str === 1 || str === 'true')
    }

    handleDiscursivaChange = (value) => {
        value = value === 1 ? true : false
		this.setState({
            alternativaCorretaDisabled: value,
            alternativasTooltipVisible: false
        })

        // Se alterar para Discursiva = Sim
        if(value){
            this.setState({
                alternativas: [],
                alternativaCorreta: null
            })
        }
    }

    handleViewQuestao = (event) => {
        event.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            var discursiva = this.stringToBool(values.discursiva)

            if(!err){
                let request = {
                    "id": this.state.questaoId,
                    "descricao": this.state.questaoContent,
                    "status": this.stringToBool(values.status),
                    "dificuldade": values.dificuldade,
                    "discursiva": discursiva,
                    "ano": values.ano,
                    "alterCorreta": this.state.alternativaCorreta,
                    "imagem": '',
                    "conteudo": {
                        "id": values.conteudo
                    },
                    "habilidade": {
                        "id": values.habilidade
                    },
                    "areaConhecimento": {
                        "id": values.areaDeConhecimento
                    },
                    "fonte": {
                        "id": values.fonte
                    },
                    "alternativas" : this.state.alternativas,
                    "tipo": {
                        "id": values.tipo
                    }
                }

                if(!this.stringToBool(values.discursiva) && this.state.alternativas.length < 1){
                    this.setState({alternativasTooltipVisible: true})
                }
                else{
                    this.setState({alternativasTooltipVisible: false})
                    this.props.setRequest(request)

                    var questao = {
                        key: this.state.questaoId,
                        alternativas: this.state.alternativas,
                        areaConhecimentoId: values.areaDeConhecimento,
                        dificuldade: values.dificuldade,
                        ano: values.ano,
                        conteudoId: values.conteudo,
                        description: this.state.questaoContent,
                        fonte: values.fonteId,
                        habilidadeId: values.habilidade,
                        imagem: null,
                        tipoId: values.tipo,
                        valueAlternativaCorreta: this.state.alternativaCorreta,
                        valueAno: values.ano,
                        valueDiscursiva: discursiva,
                        valueEnade: this.stringToBool(values.padraoEnade),
                        valueStatus: this.stringToBool(values.status),
                    }


                    this.props.setQuestao(questao)
                    this.props.showModalViewQuestaoF(true, 'write')
                    
                    //this.props.hideModalCadastro()
                    //this.props.createUpdateQuestao(request)
                }
                   
            }
            else{
                console.log('erro', err)
            }
        })
    }

    // Recebe valor de alternativaCorreta e a lista de alternativas do componente filho ModalAlternativas e atualiza state
    updateAlternativas = (alternativaCorreta, alternativas) => {
        this.setState({
            alternativaCorreta,
            alternativas
        })
    }

    handleModalClosure = () => {
        // Resetando form
        this.props.form.resetFields()
        this.props.resetQuestao()
        // Limpando state
        this.setState({
            questaoId: '',
            alternativaCorreta: null,
            alternativas: [],
            file: null,
            resetAlternativasForm: true,
            editorState: EditorState.createEmpty()
        })

        this.props.hideModalCadastro()
    }

    updateResetAlternativasFormState = (val) => {
        this.setState({resetAlternativasForm: val})
    }

    showHideModalAlternativas = (bool) => {
		this.setState({showModalAlternativas: bool})
    }


    fileToBase64 = (file, that) => {
        var reader = new FileReader()
        
        reader.readAsDataURL(file)
        reader.onload = (event) => {

            //that.setState({fileBase64: event.target.result})
        }
        reader.onerror = function (error) {
            console.log('Error: ', error)
            return false
        }
    }

    Base64ToFile = (file, filename) => {
        var arr = file.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
        while(n--){
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, {type:mime})
    }

    onDrop = (acceptedFiles, rejectedFiles) => {

        this.setState({
            file: Object.assign(acceptedFiles[0], {
                preview: URL.createObjectURL(acceptedFiles[0])
            })
        })
        var reader = new FileReader()
        reader.readAsDataURL(acceptedFiles[0])
        reader.onload = (event) => {

            var bodyFormData = new FormData()
            bodyFormData.append('files', acceptedFiles[0]) 



            axios({
                method: 'post',
                url: 'http://localhost:5000/api/upload/imgs',
                data: bodyFormData,
                config: { headers: {'Content-Type': 'multipart/form-data' }}
            })
            .then(res => {
                this.setState({
                    images: [...this.state.images, {
                        nome: res.data.nome,
                        url: res.data.url
                    }]
                })
            })
            .catch(error =>{
                console.log(error)
            })

        }
        reader.onerror = function (error) {
            console.log('Error: ', error)
            return false
        }
    }

    openImage = (image) => {
        window.open(image, '_blank')
    }

    removeImage = (index) => {

        this.setState({
            file: null,
            fileBase64: null,
            receivedFile: null
        })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
            questaoContent: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        })

        /*
        var teste = editorState
        console.log('-----------------------')
        console.log('state raw', teste)
        teste = draftToHtml(convertToRaw(teste.getCurrentContent()))
        console.log('state em html', teste)
        const blocksFromHtml = htmlToDraft(teste);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        teste = EditorState.createWithContent(contentState);
        console.log('html to raw', teste)
        */
      }

    openNotificationError = (message) => {
        const args = {
            message: message,
            icon: <Icon type="stop" style={{color: '#f5222d', fontWeight: '800'}} />,
            duration: 0
        }
        notification.open(args)
    }

    componentWillMount(){
        // Construindo opções de seleção do campo Ano
        var currDate = moment()
        var anoOptions = []
        var i = 0
        while(i < 10){
            anoOptions.push({
                key: i,
                value: currDate.format('YYYY'),
                description: currDate.format('YYYY')
                
            })
            currDate = currDate.subtract(1, 'years')
            i++
        }
        this.setState({anoOptions})
    }

    componentWillUpdate(nextProps, nextState) {
        // Reset do modal
        if(this.props.showModalCadastro === true && nextProps.showModalCadastro === false){
            this.handleModalClosure()
        }

        // Settando valor padrão para campo Status do form
        if(this.props.showModalCadastro === false && nextProps.showModalCadastro === true && nextProps.questao === null){
            this.props.form.setFieldsValue({status: 'true'})
        }

        // Populando campos do formulário
        if(nextProps.questao !== null && nextProps.questao !== this.props.questao){
            console.log('nextProps.questao', nextProps.questao)
            var status = nextProps.questao.valueStatus === true ? 'true' : 'false'
            var discursiva = null
            if(nextProps.questao.valueDiscursiva === true){
                discursiva = 1
                this.setState({alternativaCorretaDisabled: true})
            }
            else{
                discursiva = 0
                this.setState({alternativaCorretaDisabled: false})
            }

            var file = null
            this.props.form.setFieldsValue({
                habilidade: nextProps.questao.habilidadeId,
                conteudo: nextProps.questao.conteudoId,
                areaDeConhecimento: nextProps.questao.areaConhecimentoId,
                dificuldade: nextProps.questao.dificuldade,
                status: status,
                //padraoEnade: padraoEnade,
                ano: nextProps.questao.valueAno,
                //descricao: nextProps.questao.description,
                fonte: nextProps.questao.fonteId,
                discursiva: discursiva,
                tipo: nextProps.questao.tipoId
            })

            // Settando valor no campo descricao
            const blocksFromHtml = htmlToDraft(nextProps.questao.description);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

            this.setState({
                editorState: EditorState.createWithContent(contentState)
            })

            if(nextProps.questao.imagem) {
                file = this.Base64ToFile(nextProps.questao.imagem, 'imagem.png')
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            }

            this.setState({
                questaoId: nextProps.questao.key,
                alternativas: nextProps.questao.alternativas,
                alternativaCorreta: nextProps.questao.valueAlternativaCorreta,
                fileBase64: nextProps.questao.imagem,
                file
            })
        }
    }

    fallbackCopyTextToClipboard = (text) => {
        var textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
            var successful = document.execCommand("copy")
            //var msg = successful ? "successful" : "unsuccessful"
            //console.log("Fallback: Copying text command was " + msg)
        } catch (err) {
            //console.error("Fallback: Oops, unable to copy", err)
        }

        document.body.removeChild(textArea)
    }

    copyToClipboard = (text) => {
        if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text)
            return
        }
        navigator.clipboard.writeText(text).then(
            function() {
            //console.log("Async: Copying to clipboard was successful!")
            },
            function(err) {
            //console.error("Async: Could not copy text: ", err)
            }
        )
    }

    render(){
         const { editorState } = this.state
        const { getFieldDecorator } = this.props.form

        return(
            <React.Fragment>
                <Modal
                    title="Questão"
                    visible={this.props.showModalCadastro}
                    
                    onCancel={this.handleModalClosure}
                    maskClosable={false}
                    width={900}
                    footer={[
                        <Button key="back" onClick={this.handleModalClosure}>
                            <Icon type="close" />Cancelar
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.handleViewQuestao}
                        >
                            <Icon type="check" />Confirmar
                        </Button>
                    ]}
                >
                    <Form layout="vertical">
                        <Row gutter={32}>
                            <Col span={8}>
                                <Form.Item label="Habilidade">
                                    {getFieldDecorator('habilidade', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione a habilidade',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="habilidade"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione a habilidade"
                                        >
                                            {
                                                this.props.habilidades.map((item) => {
                                                    return (<Select.Option key={item.id} value={item.id}>{item.description}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Conteúdo">
                                    {getFieldDecorator('conteudo', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione o conteúdo',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="conteudo"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione o conteúdo"
                                        >
                                            {
                                                this.props.conteudos.map((item) => {
                                                    return (<Select.Option key={item.key} value={item.id}>{item.description}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Área de Conhecimento">
                                    {getFieldDecorator('areaDeConhecimento', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione a área de conhecimento',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="areaDeConhecimento"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione a área de conhecimento"
                                        >
                                            {
                                                this.props.areasDeConhecimento.map((item) => {
                                                    return (<Select.Option key={item.id} value={item.id}>{item.description}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={32}>
                            <Col span={8}>
                                <Form.Item label="Dificuldade">
                                    {getFieldDecorator('dificuldade', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione a dificuldade',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="dificuldade"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione"
                                        >
                                            {
                                                dificuldadeOptions.map((item) => {
                                                    return (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Status">
                                    {getFieldDecorator('status', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione o status',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="status"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione o status"
                                        >
                                            {
                                                statusOptions.map((item) => {
                                                    return (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Ano">
                                    {getFieldDecorator('ano')(
                                        <Select
                                            allowClear={true}
                                            name="ano"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione o ano"
                                        >
                                            {
                                                this.state.anoOptions.map((item) => {
                                                    return (<Select.Option key={item.key} value={item.value}>{item.description}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={48}>
                            <Col span={12}>
                                <Dropzone 
                                    accept="image/jpeg, image/png, image/gif"
                                    onDrop={this.onDrop}
                                >
                                    {({getRootProps, getInputProps, isDragActive}) => {
                                        return (
                                            <div
                                                {...getRootProps()}
                                                className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                                            >
                                                <input {...getInputProps()} />
                                                {
                                                    <Button><Icon type="upload" />Imagens</Button>
                                                }
                                            </div>
                                        )
                                    }}
                                </Dropzone>
                                {
                                    this.state.images.map((image, index) => {
                                        var url = "http://localhost:5000/api/getFile?name="+image.nome
                                        return(
                                            <Row style={{marginTop: 16}} key={image.nome}>
                                                <Col span={12}>
                                                    <aside style={thumbsContainer}>
                                                        <div style={thumb}>
                                                            <div style={thumbInner}>
                                                                <img
                                                                    src={url}
                                                                    style={img}
                                                                    alt=""
                                                                    onClick={() => this.openImage(url)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </aside>
                                                </Col>
                                                <Col span={12}>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Button className="buttonGreen" onClick={() => this.copyToClipboard(url)}><Icon type="copy" />Copiar Link da Imagem</Button>
                                                        </Col>
                                                    </Row>
                                                    <Row style={{marginTop: 5}}>
                                                        <Col span={24}>
                                                            <Button className="buttonRed" onClick={() => this.removeImage(index)}><Icon type="delete" />Remover Imagem</Button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </Col>
                            <Col span={12}>
                                <Tooltip
                                    placement="topLeft"
                                    title="Informar alternativas"
                                    visible={this.state.alternativasTooltipVisible}
                                    trigger="contextMenu"
                                >
                                    <Button
                                        disabled={this.state.alternativaCorretaDisabled}
                                        key="submit"
                                        type="primary"
                                        onClick={() => this.showHideModalAlternativas(true)}
                                        style={{float: "right"}}
                                    >
                                        <Icon type="ordered-list" />Alternativas
                                    </Button>
                                </Tooltip>
                            </Col>
                        </Row>


                        <Row style={{marginTop: 15}}>
                            <Col span={24} className='textEditorLabel'><span className="textEditorRequired">*</span>Descrição</Col>
                            <Col span={24} className='textEditorArea' style={{padding: '0 10px 0 10px' }}>
                                <Editor
                                    editorState={editorState}
                                    wrapperClassName="demo-wrapper"
                                    editorClassName="demo-editor"
                                    onEditorStateChange={this.onEditorStateChange}
                                    localization={{
                                        locale: 'pt',
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row gutter={32} style={{marginTop: 15}}>
                            <Col span={8}>
                                <Form.Item label="Fonte">
                                    {getFieldDecorator('fonte', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione a fonte',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="fonte"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione a fonte"
                                        >
                                            {
                                                this.props.fontes.map((item) => {
                                                    return (<Select.Option key={item.id} value={item.id}>{item.description}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Tipo">
                                    {getFieldDecorator('tipo', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione o tipo',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="tipo"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione o tipo"
                                        >
                                            {
                                                tipoOptions.map((item) => {
                                                    return (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Discursiva">
                                    {getFieldDecorator('discursiva', {
                                        rules: [
                                            {
                                                required: true, message: 'Selecione se é discursiva',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="discursiva"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione"
                                            onChange={this.handleDiscursivaChange}
                                        >
                                            {
                                                discursivaOptions.map((item) => {
                                                    return (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <ModalAlternativas
                    showModalAlternativas={this.state.showModalAlternativas}
                    showHideModalAlternativas={this.showHideModalAlternativas}
                    updateAlternativas={this.updateAlternativas}
                    alternativas={this.state.alternativas}
                    alternativaCorreta={this.state.alternativaCorreta}
                    mode={this.props.mode}
                    resetAlternativasForm={this.state.resetAlternativasForm}
                    updateResetAlternativasFormState={this.updateResetAlternativasFormState}

                />
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
		habilidades: state.habilidades,
		conteudos: state.conteudos,
        areasDeConhecimento: state.areasDeConhecimento,
        fontes: state.fontes
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setRequest: (request) => { dispatch({ type: 'SET_REQUEST', request }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(BackEndRequests(ModalCadastro)))