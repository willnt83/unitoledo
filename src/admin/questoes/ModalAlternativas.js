import React, { Component } from "react"
import { Icon, Input, Modal, Form, Button, Select, Row, Col } from "antd"
import { connect } from 'react-redux'

const {TextArea} = Input
const letrasAlternativas = ['A', 'B', 'C', 'D', 'E']

class ModalAlternativas extends Component {
    state = {
        fieldsLoaded: false
    }

    submitAlternativasForm = (event) => {
        event.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {

            if(!err){
                var corretaIndex = null, correta = false
                var alternativas = values.alternativas.map((alternativa, index) => {
                    corretaIndex = letrasAlternativas.indexOf(values.alternativaCorreta)
                    correta = corretaIndex === index ? true : false

                    return({
                        id: '',
                        descricao: alternativa,
                        correta: correta
                    })
                })

                alternativas = alternativas.filter(Boolean);

                this.props.updateAlternativas(values.alternativaCorreta, alternativas)
                this.handleModalClosure()
            }
            else{
                console.log('erro', err)
            }
        })
    }

    addComposicaoRow = () => {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        var lastIndex = keys.length
        const nextKeys = keys.concat(lastIndex)

        form.setFieldsValue({
            keys: nextKeys,
        })
    }

    removeComposicaoRow = (k) => {
        const keys = this.props.form.getFieldValue('keys')
        if(keys.length === 1){
            return
        }

        var newKeys = keys.filter(key => key !== k)
        this.props.form.setFieldsValue({
            keys: newKeys
        })

        this.props.limpaAlternativaCorreta()
        this.props.form.setFieldsValue({alternativaCorreta: null})
    }

    handleModalClosure = () => {
        this.props.showHideModalAlternativas(false)
    }

    componentWillUpdate(nextProps, nextState){
        if(nextProps.resetAlternativasForm){
            this.props.form.resetFields()
            this.setState({
                fieldsLoaded: false
            })
            this.props.updateResetAlternativasFormState(false)
        }

        //if(this.props.alternativaCorreta !== nextProps.alternativaCorreta && nextProps.alternativaCorreta !== null && nextProps.alternativas.length > 0){
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

            
            this.props.form.setFieldsValue({
                keys,
                /*alternativaCorreta: nextProps.alternativaCorreta,
                alternativas: alternativasDescricao*/
            })
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.fieldsLoaded === false && this.state.fieldsLoaded === true){
            var alternativasDescricao = this.props.alternativas.map(alternativa => {
                return(
                    alternativa.descricao
                )
            })

            this.props.form.setFieldsValue({
                alternativaCorreta: this.props.alternativaCorreta,
                alternativas: alternativasDescricao
            })
        }
    }

    render(){
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
                <Form.Item label={label} key={i}>
                    {getFieldDecorator(`alternativas[${k}]`, {
                    rules: [
                            {
                                required: true, message: 'Campo obrigatório',
                            }
                        ]
                    })(
                        <TextArea
                            style={{width: '90%'}}
                            rows={4}
                        />
                    )}
                    {keys.length >= 3 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.removeComposicaoRow(k)}
                            style={{marginLeft: 10}}
                        />
                    ) : null}
                </Form.Item>
            )
        })

        return(
            <Modal
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