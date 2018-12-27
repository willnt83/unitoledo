import React from "react"
import { Layout, Steps } from "antd"

const { Content } = Layout
const Step = Steps.Step;

const SimuladoSteps = (props) => {
    return(
        <Content
            style={{
                margin: "12px 16px 4px 16px",
                padding: 24,
                background: "#fff",
                maxHeight: 80
            }}
        >
            <Steps current={props.step} style={{ marginBottom: 30 }}>
                <Step title="Dados Iniciais" />
                <Step title="Turma / Disciplina" />
                <Step title="Questões" />
                <Step title="Finalizar" />
            </Steps>
        </Content>
    )
}

export default SimuladoSteps;