import React, { Component } from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom"


const { Content } = Layout

class Dashboard extends Component {
    componentWillMount(){
        console.log('this.props.mainData', this.props.mainData)
        console.log('this.props.contexto', this.props.contexto)
        if(this.props.mainData === null || (this.props.contexto !== 'COORDENADOR' && this.props.contexto !== 'PROFESSOR' && this.props.contexto !== 'APPPROVA - ADMIN')){
            this.props.resetAll()
            window.location.replace("/app-prova")
        }
    }
    render(){
        return(
            <Content
                style={{
                    margin: "24px 16px",
                    padding: 24,
                    background: "#fff",
                    minHeight: 280
                }}
            >
            Dashboard
          </Content>
        )
    }
}

const MapStateToProps = (state) => {
	return {
        mainData: state.mainData,
        contexto: state.contexto
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        resetAll: () => { dispatch({ type: 'RESET_ALL' }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(withRouter(Dashboard))