import React from "react"
import localStorage from "../helper/localStorage.js"
import routeTo from "../helper/routeTo"
import { routeName } from "../routes"

export const withLStorage = Component1 => {
    const key = localStorage.readLogin()
    const isAuthorized = localStorage.checkAuthorized(key)  
    
    return props => {
        const path = props.history.location.pathname
        // console.log(props.history.goBack())
        // && path!==`/${routeName.routeLogin}`
        if(!isAuthorized && path!==`/${routeName.routeLogin}`) {
            console.log("hello, ", isAuthorized)
            routeTo.login(props)
            return null;
        }  else 
            return <Component1 {...props} />
    }
}