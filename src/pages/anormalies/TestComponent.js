import React, { Component, Fragment } from "react"
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
        alert("Clicked")
    }

    render() {
        const h = data.length>0 ? data.length : 60
        const w = data[0]!==undefined ? data[0].length : 100

        const rows = data.map((v1,k1) => {
            return (
                <div className="py-1 d-flex " id="gContainer">
                    <div className="pr-1 my-auto">
                        2019
                    </div>
                    <div>
                        <Row5 dataRow={v1} rowNo={k1} handleHoverOnSvgRect={this.handleHoverOnSvgRect} />
                    </div>
                </div>
            )
        })

        return (
            <div className="rounded" style={{ overflow: "visible"}}>
                {rows}
                {/* <svg viewBox="0 0 600 60" style={{ height: 20, width: 200 }} >
                    <rect x="0" y="0" width="60" height="60" fill="#e5e5e5" style={{ stroke: "#c5c5d5", strokeWidth: 0.04 }}></rect>
                    <rect x="1" y="0" width="60" height="60" fill="#e5e5e5" style={{ stroke: "#c5c5d5", strokeWidth: 0.04 }}></rect>
                    <rect x="2" y="0" width="60" height="60" fill="#e5e5e5" style={{ stroke: "#c5c5d5", strokeWidth: 0.04 }}></rect>
                </svg> */}
            </div>
        )
        // const rects = data.map((v1,k1) => v1.map((v2, k2) => {
        //     return (
        //         <rect  
        //             key={`${k1}${k2}`}
        //             onClick={this.handleHoverOnSvgRect}
        //             // onMouseLeave={this.handleLeaveOnSvgRect}
        //             className="rect-22" 
        //             x={k2} y={k1} width={1} height={1} fill={ v2.value===2 ? "#e74c3c" : "#ecf0f1" } 
        //             style={{ stroke: "#c5c5cd", strokeWidth: 1/100, opacity: 0.9 }}>
        //             <title>
        //                 2020-02-20~2020-02-25
        //             </title>
        //         </rect>
        //     )
        // }))
        // return(
        //     <div className="bg-white p-0 border" style={{}}>
        //        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", overflow: "visible"}}>
        //             { rects }
        //         </svg>
        //     </div>
        // )
    }
}

const Row5 = ({ dataRow, rowNo, handleHoverOnSvgRect }) => {
    const rects = dataRow.map((v2, k2) => {
        return (
            <g>
                <rect  
                    key={`${rowNo}${k2}`}
                    onClick={handleHoverOnSvgRect}
                    // onMouseLeave={this.handleLeaveOnSvgRect}
                    className="rect-22" 
                    x={k2} y={0} width={1} height={1} fill={ v2.value===2 ? "#e74c4cee" : "#ccf0d1aa" } 
                    style={{ stroke: "#c5c5cd", strokeWidth: 0.05, opacity: 0.9 }}>
                    <title>
                        {v2.startDate} ~ {v2.endDate}
                    </title>
                </rect>
                <text x={k2+0.3} y={0.7} fill="white" font-size={0.6}>{ v2.count>0 ? v2.count : "" }</text>
            </g>        
        )
    })
    let cWidth = 1000
    if(document.getElementById("gContainer")!==null)

        cWidth = document.getElementById("gContainer").offsetWidth-40
    return(
        // <Fragment>
        //     <div>Width: {cWidth}</div>
            <svg viewBox={`0 0 ${46} ${1}`} style={{ width: cWidth, height: cWidth/46 }}>
                { rects }
            </svg>
        // </Fragment>
    )
}

const data = [
    [
        {startDate: "01/01/2019", endDate: "08/01/2019", count: 0, value: 1},
        {startDate: "09/01/2019", endDate: "17/01/2019", count: 0, value: 1},
        {startDate: "18/01/2019", endDate: "26/01/2019", count: 4, value: 2},
        {startDate: "27/01/2019", endDate: "03/02/2019", count: 0, value: 1},
        {startDate: "04/02/2019", endDate: "01/02/2019", count: 0, value: 1},   
        {startDate: "13/02/2019", endDate: "21/02/2019", count: 0, value: 1},
        {startDate: "22/02/2019", endDate: "31/02/2019", count: 0, value: 1},
        {startDate: "01/03/2019", endDate: "09/03/2019", count: 0, value: 1},
        {startDate: "10/03/2019", endDate: "18/03/2019", count: 0, value: 1},
        {startDate: "19/03/2019", endDate: "27/03/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 3, value: 2},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},   
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 3, value: 2},   
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},   
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 2, value: 2},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 7, value: 2},   
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},   
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},   
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
        // {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
    ],
    
]