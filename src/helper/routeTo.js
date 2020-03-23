import { routeName } from "../routes"
import queryString from "query-string"

const  login=(props)=> {
    props.history.push(routeName.routeLogin)
}

const solutions=(props)=> {
    return props.history.push(routeName.routeSolutions)
}

const  anomalies=(props, query=null)=> {
    props.history.push({
        pathname: routeName.routeAnormalies,
        search: queryString.stringify(query)
    })
}

const  anomaliesWithoutRouter=(window, query=null)=> {
    // window.location.search = queryString.stringify(query)
    console.log(routeName.routeAnormalies + "?" + queryString.stringify(query))
    window.location.pathname = routeName.routeAnormalies// + "?" + queryString.stringify(query)
    // props.history.push({
    //     pathname: routeName.routeAnormalies,
    //     search: queryString.stringify(query)
    // })
}

const  anomaliesHistory=(props)=> {
    props.history.push(routeName.routeAnormaliesHistory)
}

const  anomaliesDevices=(props)=> {
    props.history.push(routeName.routeAnormaliesDevice)
}

export default {
    login,
    solutions,
    anomalies,
    anomaliesHistory,
    anomaliesDevices,
    anomaliesWithoutRouter
}