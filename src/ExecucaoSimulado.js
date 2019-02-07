import React, { Component } from 'react'
import { Layout, Row, Col, Radio, Button, Icon } from 'antd'
import Countdown from 'react-countdown-now';
import "./static/style.css"

const { Content } = Layout
const RadioGroup = Radio.Group


class ExecucaoSimulado extends Component {
    state = {
        value: null,
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }
    render() {
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <Layout className="layout">
                <Content style={{
                    margin: "0",
                    padding: "0 30px 0 24px",
                    background: "#13a54b",
                    color: '#fff'
                }}>
                    <Row>
                        <Col span={24} align="end" style={{fontWeight: 500}}>
                            <Icon type="clock-circle"  style={{ marginRight: 10 }}/>
                            <span style={{ marginRight: 10 }}>Tempo restante:</span>
                            <Countdown date={Date.now() + 90 * 60000} />
                        </Col>
                    </Row>
                </Content>
                <Content style={{
                    margin: "20px 25px 0 25px",
                    padding: 24,
                    background: "#fff"
                }}>
                    <Row>
                        <Col span={24}>Turma / Disciplina: Matemática</Col>
                    </Row>
                    <Row>
                        <Col span={24}>Tempo total: 90 minutos</Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Col span={24}>
                            <h4>Questão X</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            Dividindo o polinômio p(x) por d(x) = x² + 1, encontram-se o quociente q(x) = x + 3 e o resto r(x) = -7x - 11. Então a soma de todas as soluções da equação p(x) = 0 é igual a:
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <RadioGroup size={'large'} onChange={this.onChange} value={this.state.value}>
                                <Radio style={radioStyle} value={1}>A) -3</Radio>
                                <Radio style={radioStyle} value={2}>B) 2</Radio>
                                <Radio style={radioStyle} value={3}>C) 1</Radio>
                                <Radio style={radioStyle} value={4}>D) 5</Radio>
                                <Radio style={radioStyle} value={5}>E) 109</Radio>
                            </RadioGroup>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 30 }}>
                        <Col span={8} align="begining"><Button type="primary"><Icon type="left" />Anterior</Button></Col>
                        <Col span={8} align="center"><Button type="primary"><Icon type="save" />Responder</Button></Col>
                        <Col span={8} align="end"><Button type="success" style={{color: '#fff', backgroundColor: '#73d13d', borderColor: '#73d13d'}}>Próximo<Icon type="right" /></Button></Col>
                    </Row>
                </Content>

            </Layout>
        );
    }
}
 
export default ExecucaoSimulado;