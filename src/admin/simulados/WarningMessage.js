import React from "react"
import { Alert } from "antd"

const WarningMessage = (props) => {
    if(props.visible){
        return(
            <Alert message={props.message} type={props.type} showIcon />
        )
    }
    else
        return null
}

export default WarningMessage;