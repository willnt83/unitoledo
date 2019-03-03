import React, { Component } from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'


const { Content } = Layout

class Dashboard extends Component {
    render(){
        console.log('this.props.mainData', this.props.mainData)
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
        mainData: state.mainData
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
        setPageTitle: (pageTitle) => { dispatch({ type: 'SET_PAGETITLE', pageTitle }) }
    }
}

export default connect(MapStateToProps, mapDispatchToProps)(Dashboard)