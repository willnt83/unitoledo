import React, { Component } from "react"
import { Icon, Modal, Form, Input, Button, Select } from "antd"
import { connect } from 'react-redux'

const alternativaOptions = [
	{
		value: "A",
		label: "A"
	},
	{
		value: "B",
		label: "B"
	},
	{
		value: "C",
		label: "C"
	},
	{
		value: "D",
		label: "D"
	},
	{
		value: "E",
		label: "E"
	}
]

class ModalAlternativas extends Component {
    componentWillUpdate(nextProps, nextState){
        // Reset nos fields na criação da questão
        if(this.props.mode !== nextProps.mode && nextProps.mode === 'create'){
            this.props.form.resetFields()
        }

        if(this.props.alternativaCorreta !== nextProps.alternativaCorreta && nextProps.alternativas.length > 0){
            this.props.form.setFieldsValue({
                alternativaCorreta: nextProps.alternativaCorreta,
                alternativaA: nextProps.alternativas[0].descricao,
                alternativaB: nextProps.alternativas[1].descricao,
                alternativaC: nextProps.alternativas[2].descricao,
                alternativaD: nextProps.alternativas[3].descricao,
                alternativaE: nextProps.alternativas[4].descricao
            })
        }
    }

    submitAlternativasForm = (event) => {
        event.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                var alternativas = []
                var alternativaIds = []
                var corretaA = false, corretaB = false, corretaC = false, corretaD = false, corretaE = false
                switch(values.alternativaCorreta){
                    case 'A': {
                        corretaA = true
                        break
                    }
                    case 'B': {
                        corretaB = true
                        break
                    }
                    case 'C': {
                        corretaC = true
                        break
                    }
                    case 'D': {
                        corretaD = true
                        break
                    }
                    case 'E': {
                        corretaE = true
                        break
                    }
                    default:
                        break
                }
                if(this.props.alternativas.length === 0){
                    alternativaIds = ['', '', '', '', '']
                }
                else{
                    this.props.alternativas.forEach(alternativa => {
                        alternativaIds.push(alternativa.id)
                    })
                }

                alternativas.push({id: alternativaIds[0], descricao: values.alternativaA, correta: corretaA})
                alternativas.push({id: alternativaIds[1], descricao: values.alternativaB, correta: corretaB})
                alternativas.push({id: alternativaIds[2], descricao: values.alternativaC, correta: corretaC})
                alternativas.push({id: alternativaIds[3], descricao: values.alternativaD, correta: corretaD})
                alternativas.push({id: alternativaIds[4], descricao: values.alternativaE, correta: corretaE})
                this.props.updateAlternativas(values.alternativaCorreta, alternativas)
                this.props.showHideModalAlternativas(false)
            }
            else{
                console.log('erro', err)
            }
        })
    }


    render(){
        const { getFieldDecorator } = this.props.form

        return(
            <Modal
                title="Alternativas"
                visible={this.props.showModalAlternativas}
                onCancel={() => this.props.showHideModalAlternativas(false)}
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
                                alternativaOptions.map((item) => {
                                    return (<Select.Option key={item.value}>{item.label}</Select.Option>)
                                })
                            }
                        </Select>
                    )}
                </Form.Item>


                <Form.Item label="Alternativa A">
                    {getFieldDecorator('alternativaA', {
                        rules: [
                            {
                                required: true, message: 'Informe a alternativa A',
                            }
                        ]
                    })(
                        <Input
                            name="alternativaA"
                        />
                    )}
                </Form.Item>
                <Form.Item label="Alternativa B">
                    {getFieldDecorator('alternativaB', {
                        rules: [
                            {
                                required: true, message: 'Informe a alternativa B',
                            }
                        ]
                    })(
                        <Input
                            name="alternativaB"
                        />
                    )}
                </Form.Item>
                <Form.Item label="Alternativa C">
                    {getFieldDecorator('alternativaC', {
                        rules: [
                            {
                                required: true, message: 'Informe a alternativa C',
                            }
                        ]
                    })(
                        <Input
                            name="alternativaC"
                        />
                    )}
                </Form.Item>
                <Form.Item label="Alternativa D">
                    {getFieldDecorator('alternativaD', {
                        rules: [
                            {
                                required: true, message: 'Informe a alternativa D',
                            }
                        ]
                    })(
                        <Input
                            name="alternativaD"
                        />
                    )}
                </Form.Item>
                <Form.Item label="Alternativa E">
                    {getFieldDecorator('alternativaE', {
                        rules: [
                            {
                                required: true, message: 'Informe a alternativa E',
                            }
                        ]
                    })(
                        <Input
                            name="alternativaE"
                        />
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