import React, { Component } from "react"
import { routeName } from "../../routes"
import * as Navbar from "../../components/app/Navbar.js"
import Detection from "./Detections.js"

class Solutions extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    onRouteChanged(routePath) {
        this.props.history.push(routePath)
    }

    render() {
        const { } = this.state
        
        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-12 py-5 ">
                        <Navbar.LogoNavbar />
                        <div className="border mt-5" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-10 container-fluid">
                        <div className="row">
                            <div className="col-12 py-4">
                                <div className="font-weight-bold px-3 h3 text-secondary">{"Detections"}</div>
                                <div className="px-3 pb-3 text-secondary">{"236 Alerts Pending your Review"}</div>
                            </div>
                        </div>
                        <div className="row justify-content-around align-items-stretch">
                            <Detection 
                                logo={"/detection-1.jpeg"} title={"Anomaly Detection"} info={"142 Alerts"} 
                                onAnormalyClicked={()=>this.onRouteChanged(routeName.routeAnormalies)} 
                                onHistoryClicked={()=>this.onRouteChanged(routeName.routeAnormaliesHistory)} />
                            <Detection 
                                logo={"/detection-2.jpeg"} title={"False Alarms Detection"} info={"82 Alerts"} 
                                onAnormalyClicked={()=>null/*this.onRouteChanged(routeName.routeAnormalies)*/} 
                                onHistoryClicked={()=>null/*this.onRouteChanged(routeName.routeAnormaliesHistory)*/} />
                            <Detection 
                                logo={"/detection-3.jpeg"} title={"Fault Detection -Diagnosis"} info={"14 Alerts"} 
                                onAnormalyClicked={()=>null/*this.onRouteChanged(routeName.routeAnormalies)*/} 
                                onHistoryClicked={()=>null/*this.onRouteChanged(routeName.routeAnormaliesHistory)*/} />
                            <Detection 
                                logo={"/detection-4.jpeg"} title={"CALM"} info={"4 Alerts"} 
                                onAnormalyClicked={()=>null/*this.onRouteChanged(routeName.routeAnormalies)*/} 
                                onHistoryClicked={()=>null/*this.onRouteChanged(routeName.routeAnormaliesHistory)*/} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Solutions