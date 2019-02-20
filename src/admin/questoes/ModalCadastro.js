import React, { Component } from "react"
import { Icon, Modal, Form, Input, Button,  Row, Col, Select, Tooltip } from "antd"
import { connect } from 'react-redux'
import ModalAlternativas from './ModalAlternativas'
import BackEndRequests from '../hocs/BackEndRequests'
import classNames from 'classnames'
import Dropzone from 'react-dropzone'
import moment from 'moment'

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

const enadeOptions = [
	{
		value: 'true',
		label: "Sim"
	},
	{
		value: 'false',
		label: "Não"
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

class ModalCadastro extends Component {
    state = {
        alternativaCorretaDisabled: true,
        showModalAlternativas: false,
        alternativaCorreta: null,
        alternativas: [],
        buttonConfirmarLoading: false,
        anoOptions: [],
        questaoId: '',
        alternativasTooltipVisible: false
    }

    stringToBool = (str) => {
        return (str === 1 || str === 'true')
    }

    handleDiscursivaChange = (value) => {
        value = value === 1 ? true : false
		this.setState({alternativaCorretaDisabled: value, alternativasTooltipVisible: false})
    }

    handleSubmitCadastro = (event) => {
        event.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                let request = {
                    "id": this.state.questaoId,
                    "descricao": values.descricao,
                    "status": this.stringToBool(values.status),
                    "enade": this.stringToBool(values.padraoEnade),
                    "discursiva": this.stringToBool(values.discursiva),
                    "fonte": values.fonte,
                    "ano": values.ano,
                    "alterCorreta": this.state.alternativaCorreta,
                    "imagem": "caminho da imagem",
                    "conteudo": {
                        "id": values.conteudo
                    },
                    "habilidade": {
                        "id": values.habilidade
                    },
                    "areaConhecimento": {
                        "id": values.areaDeConhecimento
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
                    this.setState({buttonConfirmarLoading: true, alternativasTooltipVisible: false})
                    this.props.createUpdateQuestao(request)
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
            alternativas: []
        })

        this.props.hideModalCadastro()
    }

    showHideModalAlternativas = (bool) => {
		this.setState({showModalAlternativas: bool})
    }

    onDrop = (acceptedFiles, rejectedFiles) => {
        // Do something with files
        console.log('onDrop')
        console.log('acceptedFiles', acceptedFiles)

        //this.getBase64(acceptedFiles)
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
        // Tratando response da requisição createUpdateQuestao
		if(nextProps.createUpdateQuestaoResponse && nextProps.createUpdateQuestaoResponse !== this.props.createUpdateQuestaoResponse){
			if(nextProps.createUpdateQuestaoResponse.success){
                //this.resetInputStates()
                this.handleModalClosure() // Limpa todas as variáveis e o formulário
				this.props.hideModalCadastro()
				this.props.handleGetQuestoes()
			}
			else{
				//this.resetInputStates()
				this.props.hideModalCadastro()
            }
            this.setState({buttonConfirmarLoading: false})
        }

        // Populando campos do formulário
        if(nextProps.questao !== null && nextProps.questao !== this.props.questao){
            var padraoEnade = nextProps.valueEnade === true ? 'Sim' : 'Não'
            var discursiva = nextProps.valueDiscursiva === true ? 'Sim' : 'Não'
            this.props.form.setFieldsValue({
                habilidade: nextProps.questao.habilidadeId,
                conteudo: nextProps.questao.conteudoId,
                areaDeConhecimento: nextProps.questao.areaConhecimentoId,
                status: nextProps.questao.labelStatus,
                padraoEnade: padraoEnade,
                ano: nextProps.questao.valueAno,
                descricao: nextProps.questao.description,
                fonte: nextProps.questao.fonte,
                discursiva: discursiva,
                tipo: nextProps.questao.tipoId
            })
            this.setState({
                questaoId: nextProps.questao.key,
                alternativas: nextProps.questao.alternativas,
                alternativaCorreta: nextProps.questao.valueAlternativaCorreta
            })
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form
        return(
            <React.Fragment>
                <Modal
                    title="Questão"
                    visible={this.props.showModalCadastro}
                    
                    onCancel={this.handleModalClosure}
                    width={900}
                    footer={[
                        <Button key="back" onClick={this.handleModalClosure}>
                            <Icon type="close" />Cancelar
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.handleSubmitCadastro}
                            loading={this.state.buttonConfirmarLoading}
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
                                <Form.Item label="Padrão ENADE">
                                    {getFieldDecorator('padraoEnade', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione se é padrão ENADE',
                                            }
                                        ]
                                    })(
                                        <Select
                                            name="padraoEnade"
                                            style={{ width: '100%' }}
                                            placeholder="Selecione"
                                        >
                                            {
                                                enadeOptions.map((item) => {
                                                    return (<Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)
                                                })
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Ano">
                                    {getFieldDecorator('ano', {
                                        rules: [
                                            {
                                                required: true, message: 'Por favor selecione o ano',
                                            }
                                        ]
                                    })(
                                        <Select
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
                        
                        <Form.Item label="Descrição">
                            {getFieldDecorator('descricao', {
                                rules: [
                                    {
                                        required: true, message: 'Informe a descrição',
                                    }
                                ]
                            })(
                                <Input.TextArea
                                    name="descricao"
                                    autosize={{ minRows: 3}}
                                />
                            )}
                        </Form.Item>
                        <Row gutter={32}>
                            <Col span={8}>
                                <Form.Item label="Fonte">
                                    {getFieldDecorator('fonte', {
                                        rules: [
                                            {
                                                required: true, message: 'Informe a fonte',
                                            }
                                        ]
                                    })(
                                        <Input
                                            name="fonte"
                                        />
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
                        <Row gutter={48}>
                        <Col span={12}>
                            <Dropzone onDrop={this.onDrop}>
                                {({getRootProps, getInputProps, isDragActive}) => {
                                    return (
                                        <div
                                            {...getRootProps()}
                                            className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                                            >
                                            <input {...getInputProps()} />
                                            {
                                                isDragActive ?
                                                <p>Drop files here...</p> :
                                                <p>Try dropping some files here, or click to select files to upload.</p>
                                            }
                                        </div>
                                    )
                                }}
                            </Dropzone>
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
                    </Form>
                </Modal>
                <ModalAlternativas
                    showModalAlternativas={this.state.showModalAlternativas}
                    showHideModalAlternativas={this.showHideModalAlternativas}
                    updateAlternativas={this.updateAlternativas}
                    alternativas={this.state.alternativas}
                    alternativaCorreta={this.state.alternativaCorreta}
                    mode={this.props.mode}
                />
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
		habilidades: state.habilidades,
		conteudos: state.conteudos,
		areasDeConhecimento: state.areasDeConhecimento
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Form.create()(BackEndRequests(ModalCadastro)))