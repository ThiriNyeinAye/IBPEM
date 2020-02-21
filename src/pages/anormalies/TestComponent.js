import React, { Component } from "react"
import "../../App.css"

export default class TestComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    componentDidMount() {

    }

    handleHoverOnSvgRect = e => {
        e.preventDefault()
        // console.log("hover : ", e)
        alert("clicked")
    }

    handleHoverOnSvgRect = e => {

    }

    render() {
        const h = data.length>0 ? data.length : 60
        const w = data[0]!==undefined ? data[0].length : 100
        const rects = data.map((v1,k1) => v1.map((v2, k2) => {
            return (
                <rect  
                    key={`${k1}${k2}`}
                    onClick={this.handleHoverOnSvgRect}
                    // onMouseLeave={this.handleLeaveOnSvgRect}
                    className="rect-22" 
                    x={k2} y={k1} width={1} height={1} fill={ v2.value===2 ? "#e74c3c" : "#ecf0f1" } 
                    style={{ stroke: "#c5c5cd", strokeWidth: 1/100, opacity: 0.9 }}></rect>
            )
        }))
     
        return(
            <div className="bg-white p-0 border" style={{}}>
               <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", overflow: "visible"}}>
                    { rects }
                </svg>
            </div>
        )
    }
}

const data = [
    [
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
    ],
    [
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
    ],
    [
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},
        {startDate: "d/m/y", endDate: "d/m/y", value: 2},   
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
        {startDate: "d/m/y", endDate: "d/m/y", value: 1},
    ],
]