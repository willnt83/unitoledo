import React, { Component } from "react"
import { Layout, Row, Col, Form, Input, Button, Card, Icon, Checkbox } from "antd"
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
            console.log('values', values)
            if (!err) {
                var enade = values.enade ? true : false
                this.props.setSimuladoNome(values.nome, enade)
                this.props.history.push('/app-prova/admin/simulados/novo/step-2')
            }
            else{

            }
        })
    }

    componentWillMount(){
        if(this.props.mainData === null || (this.props.contexto !== 'COORDENADOR' && this.props.contexto !== 'PROFESSOR')){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }
    }

    componentDidMount(){
        if(this.props.simulado.nome !== null || this.props.simulado.nome !== ''){
            this.props.form.setFieldsValue({
                nome: this.props.simulado.nome,
                enade: this.props.simulado.enade
            })
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
                        <Col span={24}>
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
                                            autoFocus={true}
                                        />
                                    )}
                                </FormItem>
                            </Form>
                        </Col>
                        <Col span={24}>
                            <Form.Item layout="vertical">
                                {getFieldDecorator('enade', {
                                    valuePropName: 'checked',
                                })(
                                    <Checkbox>
                                        ENADE
                                    </Checkbox>,
                                )}
                            </Form.Item>
                        </Col>
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
                        <Col span={12}>
                            <Link to="app-prova/admin/simulados/"><Button type="default"><Icon type="left" />Cancelar</Button></Link>
                        </Col>
                        <Col span={12} align="end">
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
        mainData: state.mainData,
        contexto: state.contexto,
        simulado: state.simulado,
        periodoLetivo: state.periodoLetivo
	}
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) },
        setSimuladoNome: (simuladoNome, enade) => { dispatch({ type: 'SET_SIMULADO_NOME', simuladoNome, enade }) },
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Form.create()(NovoSimulado1)))