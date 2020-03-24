import React from "react"

const selectedTheme = "whiteTheme"

const themes = {
    darkTheme: {
        backgroundColor: "#454545",
        primaryTextColor: "#f5f5ff"
    },
    whiteTheme: {
        backgroundColor: "#f5f5ff",
        primaryTextColor: "#454545"
    }
}

const withTheme = WrapperComponent => {

    return props => <WrapperComponent {...props} themes={themes} selectedTheme={selectedTheme} />
}

export {
    withTheme,
}