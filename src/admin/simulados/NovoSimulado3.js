import React, { Component } from "react"
import { Layout, Row, Col, Button, Form, Input, Card, Select, Icon } from "antd"
import { Link } from "react-router-dom"
import SimuladoSteps from './SimuladoSteps'
import { connect } from 'react-redux'
import SelecaoQuestoes from './SelecaoQuestoes'
import BackEndRequests from '../hocs/BackEndRequests'

const { Content } = Layout
const FormItem = Form.Item;
const Option = Select.Option;

const simNaoOptions = [
	{
		key: true,
		description: "Sim"
	},
	{
		key: false,
		description: "Não"
	}
]

const anoOptions = [
	{
		key: "2018",
		description: "2018"
	},
	{
		key: "2017",
		description: "2017"
	},
	{
		key: "2016",
		description: "2016"
	},
	{
		key: "2015",
		description: "2015"
	},
	{
		key: "2014",
		description: "2014"
	},
	{
		key: "2013",
		description: "2013"
	},
	{
		key: "2012",
		description: "2012"
	},
	{
		key: "2011",
		description: "2011"
	},
	{
		key: "2010",
		description: "2010"
	},
	{
		key: "2009",
		description: "2009"
	}
]

class NovoSimulado3 extends Component {
    constructor(props) {
        super()
        props.setPageTitle('Simulados - Seleção de Conteúdo')
        props.getHabilidades();
        props.getConteudos();
        props.getAreasDeConhecimento();
        props.getQuestoes();
    }

    state = {
        buttonLoadingBuscar: false
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    handleSearchSubmit = (event) => {
        event.preventDefault()
        this.props.getQuestoes()
    }

    render(){
        return(
            <React.Fragment>
                <SimuladoSteps step={2} />
                <Row type="flex">
                    <Col span={8}>
                        <Card
                            title="Filtros"
                            bordered={false}
                            style={{
                                margin: "4px 4px 4px 16px",
                                padding: 24,
                                background: "#fff",
                                maxHeight: '100%'
                            }}
                        >
                            <Form layout="vertical" onSubmit={this.handleSearchSubmit}>
                                <FormItem label="Código">
                                    <Input
                                        placeholder="Informe o código da questão"
                                    />
                                </FormItem>
                                <FormItem label="Habilidades">
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Selecione as Habilidades"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            this.props.habilidades.map((item) => {
                                                return (<Option key={item.key}>{item.description}</Option>)
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem label="Conteúdos">
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Selecione os Conteúdos"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            this.props.conteudos.map((item) => {
                                                return (<Option key={item.key}>{item.description}</Option>)
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem label="Áreas de Conhecimento">
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Selecione as Áreas de Conhecimento"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            this.props.areasDeConhecimento.map((item) => {
                                                return (<Option key={item.key}>{item.description}</Option>)
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem label="Padrão ENADE">
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Padrão ENADE"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            simNaoOptions.map((item) => {
                                                return (<Option key={item.key}>{item.description}</Option>)
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem label="Ano">
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Ano"
                                        onChange={this.handleChange}
                                    >
                                        {
                                            anoOptions.map((item) => {
                                                return (<Option key={item.key}>{item.description}</Option>)
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem label="Fonte">
                                    <Input
                                        placeholder="Fonte"
                                    />
                                </FormItem>
                                <FormItem label="Discursiva">
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Discursiva"
                                        defaultValue={[]}
                                        onChange={this.handleChange}
                                    >
                                        {
                                            simNaoOptions.map((item) => {
                                                return (<Option key={item.key}>{item.description}</Option>)
                                            })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={this.state.buttonLoadingBuscar}
                                    >
                                        <Icon type="search" />Buscar
                                    </Button>
                                </FormItem>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card
                            title="Questões"
                            bordered={false}
                            style={{
                                margin: "4px 16px 4px 4px",
                                padding: 24,
                                background: "#fff",
                                height: 'calc(100% - 8px)'
                            }}
                        >
                            <SelecaoQuestoes />
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Content
                            style={{
                                margin: "4px 16px",
                                padding: 24,
                                background: "#fff",
                                minHeight: 60
                            }}
                        >
                        
                            <Row>
                                <Col span={12} align="start">
                                    <Link to="/admin/simulados/novo/step-2"><Button type="default"><Icon type="left" />Anterior</Button></Link>
                                </Col>
                                <Col span={12} align="end">
                                    <Link to="/admin/simulados/novo/step-4"><Button type="primary">Próximo<Icon type="right" /></Button></Link>
                                </Col>
                            </Row>
                        </Content>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

const MapStateToProps = (state) => {
	return {
		habilidades: state.habilidades,
		conteudos: state.conteudos,
		areasDeConhecimento: state.areasDeConhecimento,
        questoes: state.questoes,
        simulado: state.simulado
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(BackEndRequests(NovoSimulado3));