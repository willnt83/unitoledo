import React, { Component } from "react"
import { Layout, Row, Col, Form, Input, Button, Card, Icon } from "antd"
import { Link, withRouter } from "react-router-dom"
import SimuladoSteps from './SimuladoSteps'
import { connect } from 'react-redux'

const { Content } = Layout
const FormItem = Form.Item

class NovoSimulado1 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Dados Iniciais')
    }

    handleProximoButton = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
              this.props.setSimuladoNome(values.nome)
              this.props.history.push('/admin/simulados/novo/step-2')
            }
            else{

            }
        })
    }

    componentDidMount(){
        if(this.props.simulado.nome !== null || this.props.simulado.nome !== ''){
            this.props.form.setFieldsValue({
                nome: this.props.simulado.nome
            });
        }
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <React.Fragment>
                <SimuladoSteps step={0} />
                <Card
                    title="Dados Iniciais"
                    bordered={false}
                    style={{
                        margin: "4px 16px 4px 16px",
                        padding: 24,
                        background: "#fff",
                        minHeight: 620
                    }}>
                    <Row style={{ marginBottom: 20 }}>
                        <Form layout="vertical">
                            <FormItem
                                label="Nome"
                            >
                                {getFieldDecorator('nome', {
                                    rules: [
                                        {
                                            required: true, message: 'Por favor informe o nome do simulado',
                                        }
                                    ]
                                })(
                                    <Input
                                        id="nome"
                                        placeholder="Digite o nome do simulado"
                                        onChange={this.handleInput}
                                    />
                                )}
                            </FormItem>
                        </Form>
                    </Row>
                </Card>
                <Content
                    style={{
                        margin: "4px 16px 0 16px",
                        padding: 24,
                        background: "#fff",
                        minHeight: 60
                    }}
                >
                    <Row>
                        <Col span="12">
                            <Link to="/admin/simulados/"><Button type="default"><Icon type="left" />Cancelar</Button></Link>
                        </Col>
                        <Col span="12" align="end">
                            <Button type="primary" onClick={this.handleProximoButton}>Próximo<Icon type="right" /></Button>
                        </Col>
                    </Row>
                </Content>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
		simulado: state.simulado
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        setSimuladoNome: (simuladoNome) => { dispatch({ type: 'SET_SIMULADO_NOME', simuladoNome }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Form.create()(NovoSimulado1)))