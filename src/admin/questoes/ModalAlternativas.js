import React, { Component } from "react"
import { Icon, Modal, Form, Button, Select, Row, Col, Tooltip } from "antd"
import { connect } from 'react-redux'

import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import axios from "axios"

const letrasAlternativas = ['A', 'B', 'C', 'D', 'E']

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

class ModalAlternativas extends Component {
    state = {
        fieldsLoaded: false,
        keys: [0, 1],
        editorState: [EditorState.createEmpty(), EditorState.createEmpty(), EditorState.createEmpty(), EditorState.createEmpty(), EditorState.createEmpty()],
        descricaoTooltip: [false, false, false, false, false],
        alternativaContent: [],
        images: []
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
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

    fallbackCopyTextToClipboard = (text) => {
        var textArea = document.createElement("textarea")
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
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

    submitAlternativasForm = (event) => {
        event.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                var validation = true
                // Validação Descrição
                this.state.keys.forEach((alternativa, k) => {
                    if(!this.state.editorState[k].getCurrentContent().hasText()){
                        var descricaoTooltip = this.state.descricaoTooltip
                        descricaoTooltip.splice(k, 1, true)
                        this.setState({descricaoTooltip})
                        validation = false
                    }
                })

                if(validation){
                    var corretaIndex = null, correta = false
                    //var tempAlternativas = values.alternativas.filter(Boolean)
                    var tempAlternativas = this.state.alternativaContent
                    var alternativas = tempAlternativas.map((alternativa, index) => {
                        corretaIndex = letrasAlternativas.indexOf(values.alternativaCorreta)
                        correta = corretaIndex === index ? true : false

                        return({
                            id: '',
                            descricao: alternativa,
                            correta: correta
                        })
                    })

                    this.props.updateAlternativas(values.alternativaCorreta, alternativas)
                    this.handleModalClosure()
                }
            }
            else{
                console.log('erro', err)
            }
        })
    }

    onEditorStateChange = (inData, k) => {
        var editorState = this.state.editorState
        editorState.splice(k, 1, inData)

        var alternativaContent = this.state.alternativaContent

        var content = draftToHtml(convertToRaw(inData.getCurrentContent()))
        content = content.replace(/\n/g, '')
        content = content.replace('<p style="text-align:center;"></p><img', '<img')
        var img = content.match(/<img([\w\W]+?)\/>(?!<\/p>)/g)
        content = content.replace(/<img([\w\W]+?)\/>(?!<\/p>)/g, '<p style="text-align: center">'+img+'</p>')

        alternativaContent.splice(k, 1, content)

        this.setState({
            editorState,
            alternativaContent,
            descricaoTooltip: [false, false, false, false, false]
        })

    }

    addComposicaoRow = () => {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        var lastIndex = (Math.max.apply(null, keys) + 1)
        const nextKeys = keys.concat(lastIndex)

        this.setState({keys: nextKeys})
    }

    removeComposicaoRow = (k) => {
        const keys = this.props.form.getFieldValue('keys')
        var alternativaCorreta = this.props.form.getFieldValue('alternativaCorreta')
        console.log('alternativaCorreta', alternativaCorreta)
        if(keys.length === 1){
            return
        }

        var newKeys = keys.filter(key => key !== k)

        //removendo alternativa
        var alternativaContent = this.state.alternativaContent
        var alternativasRaw = this.props.alternativas
        alternativaContent.splice(k, 1)
        alternativasRaw.splice(k, 1)

        //console.log('tempAlternativas', tempAlternativas)

        this.setState({keys: newKeys, alternativaContent})
        this.props.updateAlternativas(alternativaCorreta, alternativasRaw)

        this.props.limpaAlternativaCorreta()
        this.props.form.setFieldsValue({alternativaCorreta: null})
    }

    handleModalClosure = () => {
        this.setState({
            fieldsLoaded: false,
            descricaoTooltip: [false, false, false, false, false]
        })
        this.props.showHideModalAlternativas(false)
    }

    componentWillUpdate(nextProps, nextState){
        if(nextProps.resetAlternativasForm){
            this.props.form.resetFields()
            this.setState({
                fieldsLoaded: false,
                editorState: [EditorState.createEmpty(), EditorState.createEmpty(), EditorState.createEmpty(), EditorState.createEmpty(), EditorState.createEmpty()],
                alternativaContent: []
            })
            this.props.updateResetAlternativasFormState(false)
        }

        if(this.props.alternativas.length === 0 && nextProps.alternativas.length > 0){
            var keys = nextProps.alternativas.map((alternativa, index) => {
                return(
                    index
                )
            })
            this.setState({
                keys,
                fieldsLoaded: true
            })

            this.props.form.setFieldsValue({keys})
        }

        if(this.state.keys.length !== nextState.keys.length){
            this.props.form.setFieldsValue({
                keys: nextState.keys,
            })
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.fieldsLoaded === false && this.state.fieldsLoaded === true){
            const contentState = []
            
            var alternativaContent = this.props.alternativas.map((alternativa) => {
                const blocksFromHtml = htmlToDraft(alternativa.descricao)
                const { contentBlocks, entityMap } = blocksFromHtml
                contentState.push(EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks, entityMap)))

                return(
                    alternativa.descricao
                )
            })

            this.props.form.setFieldsValue({
                alternativaCorreta: this.props.alternativaCorreta
            })

            this.setState({
                editorState: contentState,
                alternativaContent
            })
        }
    }

    render(){
        console.log('this.state.alternativaContent', this.state.alternativaContent)
        console.log('this.props.alternativas', this.props.alternativas)
        const { getFieldDecorator, getFieldValue } = this.props.form
        getFieldDecorator('keys', { initialValue: [0, 1] })
        const keys = getFieldValue('keys')
        var alternativaCorretaOptions = []
        keys.forEach((key, index) => {
            alternativaCorretaOptions.push({
                value: letrasAlternativas[index],
                label: letrasAlternativas[index]
            })
        })

        const alternativaItens = keys.map((k, i) => {
            var label = 'Alternativa '+letrasAlternativas[(i)]
            return(
                <Row style={{marginTop: 15}} key={k}>
                    <Col span={24} className='textEditorLabel'>
                        <span className="textEditorRequired">*</span>{label}
                        {keys.length >= 3 ? (
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.removeComposicaoRow(k)}
                                style={{marginLeft: 10}}
                            />
                        ) : null}
                    </Col>
                    <Col span={24} id={'alternativa'+k} className='textEditorArea' style={{padding: '0 10px 0 10px' }}>
                        <Tooltip
                            overlayClassName="tooltipError"
                            placement="topRight"
                            title="Informar o conteúdo da alternativa"
                            visible={this.state.descricaoTooltip[i]}
                            trigger="contextMenu"
                            getPopupContainer={() => document.getElementById('alternativa'+k)}
                        >
                            <Editor
                                editorState={this.state.editorState[k]}
                                wrapperClassName="demo-wrapper"
                                editorClassName="demo-editor"
                                onEditorStateChange={(a) => this.onEditorStateChange(a, k)}
                                //onEditorStateChange={this.onEditorStateChange}
                                localization={{
                                    locale: 'pt',
                                }}
                            />
                        </Tooltip>
                    </Col>
                </Row>
            )
        })

        return(
            <Modal
                width={900}
                title="Alternativas"
                visible={this.props.showModalAlternativas}
                onCancel={this.handleModalClosure}
                maskClosable={false}
                footer={[
                    <Button
                        key="back"
                        onClick={this.handleModalClosure}
                    >
                        <Icon type="close" />Cancelar
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.submitAlternativasForm}
                    >
                        <Icon type="check" />Confirmar
                    </Button>
                ]}
            >
                <Row>
                    <Col span={24}>
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
                <Row>
                    <Col span={24}>
                        {alternativaItens}
                        {keys.length < 5 ?
                            (
                                <Row style={{marginBottom: 10}}>
                                    <Col span={24}>
                                        <Button key="primary" title="Nova alternativa" onClick={this.addComposicaoRow}><Icon type="plus" /></Button>
                                    </Col>
                                </Row>
                            ) : null
                        }
                    </Col>
                </Row>
                <Row>
                    <Col span={24} id="colAlternativaCorreta">
                        <Form.Item label="Alternativa Correta">
                            {getFieldDecorator('alternativaCorreta', {
                                rules: [
                                    {
                                        required: true, message: 'Selecione a alterativa correta',
                                    }
                                ]
                            })(
                                <Select
                                    name="alternativaCorreta"
                                    style={{ width: '100%' }}
                                    placeholder="Selecione a alternativa correta"
                                    getPopupContainer={() => document.getElementById("colAlternativaCorreta")}
                                >
                                    {
                                        alternativaCorretaOptions.map((item) => {
                                            return (<Select.Option key={item.value}>{item.label}</Select.Option>)
                                        })
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Modal>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        backEndPoint: state.backEndPoint,
		habilidades: state.habilidades,
		conteudos: state.conteudos,
		areasDeConhecimento: state.areasDeConhecimento
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(ModalAlternativas))