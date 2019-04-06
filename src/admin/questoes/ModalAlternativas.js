import React, { Component } from "react"
import { Icon, Input, Modal, Form, Button, Select, Row, Col } from "antd"
import { connect } from 'react-redux'

const {TextArea} = Input
const letrasAlternativas = ['A', 'B', 'C', 'D', 'E']

let id = 2

class ModalAlternativas extends Component {
    componentWillUpdate(nextProps, nextState){
        // Reset nos fields na criação da questão
        /*
        if(this.props.mode !== nextProps.mode && nextProps.mode === 'create'){
            this.props.form.resetFields()
        }
        */
        if(nextProps.resetAlternativasForm){
            this.props.form.resetFields()
            this.props.updateResetAlternativasFormState(false)
        }

        if(this.props.alternativaCorreta !== nextProps.alternativaCorreta && nextProps.alternativas.length > 0){
            var alternativasDescricao = nextProps.alternativas.map(alternativa => {
                return(
                    alternativa.descricao
                )
            })
            this.props.form.setFieldsValue({
                alternativaCorreta: nextProps.alternativaCorreta,
                alternativas: alternativasDescricao
            })
        }
    }

    submitAlternativasForm = (event) => {
        event.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {

            if(!err){
                var id = null
                var corretaIndex = null, correta = false
                var alternativas = values.alternativas.map((alternativa, index) => {
                    if(this.props.alternativas.length === 0){
                        id = ''
                    }
                    else{
                        id = this.props.alternativas[0].id
                    }

                    corretaIndex = letrasAlternativas.indexOf(values.alternativaCorreta)
                    correta = corretaIndex === index ? true : false

                    return({
                        id: id,
                        descricao: alternativa,
                        correta: correta
                    })
                })

                alternativas = alternativas.filter(Boolean);

                this.props.updateAlternativas(values.alternativaCorreta, alternativas)
                this.props.showHideModalAlternativas(false)
            }
            else{
                console.log('erro', err)
            }
        })
    }

    addComposicaoRow = () => {
        const { form } = this.props
        const keys = form.getFieldValue('keys')
        const nextKeys = keys.concat(id++)

        form.setFieldsValue({
            keys: nextKeys,
        })
    }

    removeComposicaoRow = (k) => {
        const { form } = this.props
        const keys = form.getFieldValue('keys')

        if (keys.length === 1){
            return
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        })

        this.props.limpaAlternativaCorreta()
        this.props.form.setFieldsValue({alternativaCorreta: null})
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
                onCancel={() => this.props.showHideModalAlternativas(false)}
                maskClosable={false}
                footer={[
                    <Button
                        key="back"
                        onClick={() => this.props.showHideModalAlternativas(false)}
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
                        >
                            {
                                alternativaCorretaOptions.map((item) => {
                                    return (<Select.Option key={item.value}>{item.label}</Select.Option>)
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
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