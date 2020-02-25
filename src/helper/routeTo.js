import { routeName } from "../routes"

const  login=(props)=> {
    props.history.push(routeName.routeLogin)
}

const solutions=(props)=> {
    return props.history.push(routeName.routeSolutions)
}

const  anomalies=(props)=> {
    props.history.push(routeName.routeAnormalies)
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
    anomaliesDevices
}