import React, { Component } from "react"
import { Icon, Modal, Form, Button,  Row, Col, Select, Tooltip, notification } from "antd"
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

const tipoRespostaOptions = [
	{
		value: 1,
		label: 'Alternativas'
	},
	{
		value: 2,
		label: 'Discursiva'
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

class ModalCadastro extends Component {
    state = {
        habilidadeField: {
            disabled: true,
            loading: false
        },
        conteudoField: {
            disabled: true,
            loading: false
        },
        buttonAlternativas: true,
        showModalAlternativas: false,
        alternativaCorreta: null,
        alternativas: [],
        anoOptions: [],
        questaoId: '',
        questaoContent: null,
        alternativasTooltipVisible: false,
        descricaoTooltip: false,
        resetAlternativasForm : false,
        editorState: EditorState.createEmpty(),
        images: [],
        habilidadesOptions: [],
        conteudosOptions: []
    }

    stringToBool = (str) => {
        return (str === 1 || str === 'true')
    }

    limpaAlternativaCorreta = () => {
        this.setState({alternativaCorreta: null})
    }

    handleTipoRespostaChange = (value) => {
        // Se alterar para tipoResposta = Discursiva
        if(value === 2){
            this.setState({
                alternativas: [],
                alternativaCorreta: null,
                resetAlternativasForm: true,
                buttonAlternativas: true
            })
        }
        
        value = value === 2 ? true : false
		this.setState({
            buttonAlternativas: value,
            alternativasTooltipVisible: false
        })
    }

    handleViewQuestao = (event) => {
        event.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                let request = {
                    "id": this.state.questaoId,
                    "descricao": this.state.questaoContent,
                    "status": this.stringToBool(values.status),
                    "dificuldade": values.dificuldade,
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
                    "tipo": {
                        "id": values.tipo
                    },
                    "tipoResposta": {
                        "id": values.tipoResposta
                    },
                    "alternativas" : this.state.alternativas
                }

                var validation = true

                // Validação Descrição
                if(!this.state.editorState.getCurrentContent().hasText()){
                    this.setState({descricaoTooltip: true})
                    validation = false
                }

                // Validação alternativas
                if(values.tipoResposta !== 2 && this.state.alternativas.length < 1){
                    this.setState({alternativasTooltipVisible: true})
                    validation = false
                }

                if(validation){
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
                        fonteId: values.fonte,
                        habilidadeId: values.habilidade,
                        imagem: null,
                        tipoId: values.tipo,
                        valueAlternativaCorreta: this.state.alternativaCorreta,
                        valueAno: values.ano,
                        //valueDiscursiva: discursiva,
                        valueEnade: this.stringToBool(values.padraoEnade),
                        valueStatus: this.stringToBool(values.status),
                        tipoRespostaId: values.tipoResposta //aaaqui
                    }
                    this.props.setQuestao(questao)
                    this.props.showModalViewQuestaoF(true, 'write')
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
            resetAlternativasForm: true,
            editorState: EditorState.createEmpty(),
            images: []
        })

        this.props.hideModalCadastro()
    }

    updateResetAlternativasFormState = (val) => {
        this.setState({resetAlternativasForm: val})
    }

    showHideModalAlternativas = (bool) => {
		this.setState({showModalAlternativas: bool})
    }

    changeAreaDeConhecimento = (value) => {
        this.props.form.setFieldsValue({
            habilidade: null,
            conteudo: null
        })

        this.setState({
            habilidadeField: {
                disabled: true,
                loading: true
            },
            conteudoField: {
                disabled: true,
                loading: true
            }
        })

        // Recuperando habilidades da área de conhecimento
        axios.get(this.props.backEndPoint+'/api/getHabilidades/'+value)
		.then(res => {
			this.setState({
                habilidadesOptions: res.data.map(habilidade => {
                    return({
                        id: habilidade.id,
                        description: habilidade.description
                    })
                }),
                habilidadeField: {
                    disabled: false,
                    loading: false
                }
            })
		})
		.catch(error =>{
			console.log(error)
        })
        
        // Recuperando conteúdos da área de conhecimento
        axios.get(this.props.backEndPoint+'/api/getConteudos/'+value)
		.then(res => {
			this.setState({
                conteudosOptions: res.data.map(conteudo => {
                    return({
                        id: conteudo.id,
                        description: conteudo.description
                    })
                }),
                conteudoField: {
                    disabled: false,
                    loading: false
                }
            })
		})
		.catch(error =>{
			console.log(error)
		})
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
                url: this.props.backEndPoint+'/api/upload/imgs',
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

    removeImage = (index) => {
        var images = this.state.images
        images.splice(index, 1)
        this.setState({images})
    }

    openImage = (image) => {
        window.open(image, '_blank')
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
            questaoContent: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            descricaoTooltip: false
        })
    }

    openNotificationError = (message) => {
        const args = {
            message: message,
            icon: <Icon type="stop" style={{color: '#f5222d', fontWeight: '800'}} />,
            duration: 0
        }
        notification.open(args)
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.questao && (nextProps.questao.tipoRespostaId === 1 || nextProps.questao.tipoRespostaId === 3)){
            this.setState({buttonAlternativas: false})
        }

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
        if(this.props.showModalViewQuestao === true && nextProps.showModalViewQuestao === false && nextProps.op === 'view'){
            this.handleModalClosure()
        }

        // Settando valor padrão para campo Status do form
        if(this.props.showModalCadastro === false && nextProps.showModalCadastro === true && nextProps.questao === null){
            this.props.form.setFieldsValue({status: 'true'})
        }

        // Populando campos do formulário
        if(nextProps.questao !== null && nextProps.questao !== this.props.questao){
            var status = nextProps.questao.valueStatus === true ? 'true' : 'false'
            this.changeAreaDeConhecimento(nextProps.questao.areaConhecimentoId)

            this.props.form.setFieldsValue({
                habilidade: nextProps.questao.habilidadeId,
                conteudo: nextProps.questao.conteudoId,
                areaDeConhecimento: nextProps.questao.areaConhecimentoId,
                dificuldade: nextProps.questao.dificuldade,
                status: status,
                ano: nextProps.questao.valueAno,
                fonte: nextProps.questao.fonteId,
                tipo: nextProps.questao.tipoId,
                tipoResposta: nextProps.questao.tipoRespostaId
            })

            // Settando valor no campo descricao
            const blocksFromHtml = htmlToDraft(nextProps.questao.description);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

            var buttonAlternativas = nextProps.questao.tipoRespostaId === 2 ? true : false

            this.setState({
                questaoId: nextProps.questao.key,
                alternativas: nextProps.questao.alternativas,
                alternativaCorreta: nextProps.questao.valueAlternativaCorreta,
                questaoContent: nextProps.questao.description,
                editorState: EditorState.createWithContent(contentState),
                buttonAlternativas
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
            //var successful = document.execCommand("copy")
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
                                            onChange={this.changeAreaDeConhecimento}
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
                                            //placeholder={this.state.habilidadeField.placeholder}
                                            disabled={this.state.habilidadeField.disabled}
                                            loading={this.state.habilidadeField.loading}
                                        >
                                            {
                                                this.state.habilidadesOptions.map((item) => {
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
                                            //placeholder={this.state.conteudoField.placeholder}
                                            disabled={this.state.conteudoField.disabled}
                                            loading={this.state.conteudoField.loading}
                                        >
                                            {
                                                this.state.conteudosOptions.map((item) => {
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
                                        var url = this.props.backEndPoint+"/api/getFile?name="+image.nome
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
                        </Row>
                        <Row style={{marginTop: 15}}>
                            <Col span={24} className='textEditorLabel'><span className="textEditorRequired">*</span>Descrição</Col>
                            <Col span={24} id="textEditor" className='textEditorArea' style={{padding: '0 10px 0 10px' }}>
                                <Tooltip
                                        overlayClassName="tooltipError"
                                        placement="topRight"
                                        title="Informar a descrição da questão"
                                        visible={this.state.descricaoTooltip}
                                        trigger="contextMenu"
                                        getPopupContainer={() => document.getElementById('textEditor')}
                                >
                                    <Editor
                                        editorState={editorState}
                                        wrapperClassName="demo-wrapper"
                                        editorClassName="demo-editor"
                                        onEditorStateChange={this.onEditorStateChange}
                                        localization={{
                                            locale: 'pt',
                                        }}
                                    />
                                </Tooltip>
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
                                <Form.Item label="Tipo de Resposta">
                                    {getFieldDecorator('tipoResposta', {
                                        rules: [
                                            {
                                                required: true, message: 'Selecione o tipo de resposta',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="tipoResposta"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione"
                                            onChange={this.handleTipoRespostaChange}
                                        >
                                            {
                                                tipoRespostaOptions.map((item) => {
                                                    return (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col id="colAlternativas" span={24}>
                                <Tooltip
                                    overlayClassName="tooltipError"
                                    placement="topLeft"
                                    title="Informar alternativas"
                                    visible={this.state.alternativasTooltipVisible}
                                    trigger="contextMenu"
                                    getPopupContainer={() => document.getElementById('colAlternativas')}
                                >
                                    <Button
                                        disabled={this.state.buttonAlternativas}
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
                    limpaAlternativaCorreta={this.limpaAlternativaCorreta}

                />
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        backEndPoint: state.backEndPoint,
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