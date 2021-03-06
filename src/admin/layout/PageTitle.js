import React from "react"

const style = {
    fontWeight: 700,
    fontSize: 20
}
const PageTitle = (props) => {
    return(
        <span className="pageTitle" style={style}>{props.pageTitle}</span>
    )
}

export default PageTitle;