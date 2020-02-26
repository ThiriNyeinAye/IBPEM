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

    handleClickOnSvgRect = value => {
        const value1 = {
            startDate: value.startDate,
            endDate: value.endDate,
            dataState: value.value,
            dataCount: value.count,
        }
        alert(JSON.stringify(value1, null, 2))
    }

    render() {
        // const h = data.length>0 ? data.length : 60
        // const w = data[0]!==undefined ? data[0].length : 100

        const rows = data.map((v1,k1) => {
            return (
                <div className="py-2 d-flex " id="gContainer" style={{ overflowX: "auto"}}>
                    <div className="pr-1 my-auto">
                        {v1.year}
                    </div>
                    <div style={{ overflowX: "auto"}}>
                        <Row5 dataRow={v1.data} rowNo={k1} handleClickOnSvgRect={this.handleClickOnSvgRect} />
                    </div>
                </div>
            )
        })

        return (
            <div className="rounded" style={{ overflowX: "auto"}}>
                {rows}
                {/* <svg viewBox="0 0 600 60" style={{ height: 20, width: 200 }} >
                    <rect x="0" y="0" width="60" height="60" fill="#e5e5e5" style={{ stroke: "#c5c5d5", strokeWidth: 0.04 }}></rect>
                    <rect x="1" y="0" width="60" height="60" fill="#e5e5e5" style={{ stroke: "#c5c5d5", strokeWidth: 0.04 }}></rect>
                    <rect x="2" y="0" width="60" height="60" fill="#e5e5e5" style={{ stroke: "#c5c5d5", strokeWidth: 0.04 }}></rect>
                </svg> */}
            </div>
        )
    }
}

const Row5 = ({ dataRow, rowNo, handleClickOnSvgRect }) => {
    const rects = dataRow.map((v2, k2) => {
            if(v2.count>0) 
                return (
                    <g>
                        <rect  
                            key={`${rowNo}${k2}`}
                            onClick={e => handleClickOnSvgRect(v2)}
                            // onMouseLeave={this.handleLeaveOnSvgRect}
                            className="rect-22" 
                            x={k2} y={0} width={1} height={1} fill={ v2.value===2 ? "#ff4d4dee" : "#2b916933" } 
                            style={{ stroke: "#10ac8455", strokeWidth: 0.05, opacity: 0.9, }}>
                            <title>
                                {v2.startDate} ~ {v2.endDate}
                            </title>
                        </rect>
                        <text x={k2+0.3} y={0.7} fill="white" font-size={0.6} >{ v2.value===2 ? v2.count : "" }</text>
                    </g> 
                )  
            else 
                return (
                    <rect  
                        key={`${rowNo}${k2}`}
                        className="rect-22" 
                        x={k2} y={0.5} width={1} height={0.01}
                        style={{ stroke: "#8395a711", strokeWidth: 0.05, opacity: 0.9 }}
                        >
                    </rect>
                )
    })
    let cWidth = 1000
    if(document.getElementById("gContainer")!==null)

        cWidth = document.getElementById("gContainer").offsetWidth-40
    return(
        <svg viewBox={`0 0 ${46} ${1}`} style={{ width: cWidth, height: cWidth/46, cursor: "default" }}>
            { rects }
        </svg>
    )
}

const data = [
    {
        year: "2019",
        data: [
            {startDate: "01/01/2019", endDate: "08/01/2019", count: 5, value: 1},
            {startDate: "09/01/2019", endDate: "17/01/2019", count: 5, value: 1},
            {startDate: "18/01/2019", endDate: "26/01/2019", count: 4, value: 2},
            {startDate: "27/01/2019", endDate: "03/02/2019", count: 3, value: 1},
            {startDate: "04/02/2019", endDate: "01/02/2019", count: 4, value: 1},   
            {startDate: "13/02/2019", endDate: "21/02/2019", count: 5, value: 1},
            {startDate: "22/02/2019", endDate: "31/02/2019", count: 0, value: 1},
            {startDate: "01/03/2019", endDate: "09/03/2019", count: 0, value: 1},
            {startDate: "10/03/2019", endDate: "18/03/2019", count: 0, value: 1},
            {startDate: "19/03/2019", endDate: "27/03/2019", count: 0, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 3, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 7, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 2, value: 2},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 8, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 8, value: 1},   
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 9, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 9, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 8, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 7, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 4, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 3, value: 1},   
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 2, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 5, value: 2},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 5, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 5, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 5, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 5, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 5, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 5, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 5, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 4, value: 1},   
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 4, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 2, value: 2},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 2, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 0, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 9, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 8, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 7, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 7, value: 2},   
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 3, value: 1},
            {startDate: "01/01/2019", endDate: "01/01/2019", count: 4, value: 1},
        ],
    } ,
    {
        year: "2020",
        data: [
            {startDate: "01/01/2020", endDate: "08/01/2020", count: 0, value: 1},
            {startDate: "09/01/2020", endDate: "17/01/2020", count: 0, value: 1},
            {startDate: "18/01/2020", endDate: "26/01/2020", count: 0, value: 2},
            {startDate: "27/01/2020", endDate: "03/02/2020", count: 0, value: 1},
            {startDate: "04/02/2020", endDate: "01/02/2020", count: 0, value: 1},   
            {startDate: "13/02/2020", endDate: "21/02/2020", count: 5, value: 1},
            {startDate: "22/02/2020", endDate: "31/02/2020", count: 4, value: 1},
            {startDate: "01/03/2020", endDate: "09/03/2020", count: 6, value: 2},
            {startDate: "10/03/2020", endDate: "18/03/2020", count: 7, value: 1},
            {startDate: "19/03/2020", endDate: "27/03/2020", count: 9, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 3, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 7, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 2, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 8, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 8, value: 1},   
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 9, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 9, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 8, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 7, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 6, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 7, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 3, value: 2},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 4, value: 2},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 4, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 3, value: 1},   
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 2, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 5, value: 2},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 5, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 5, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 5, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 5, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 5, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 5, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 5, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 4, value: 1},   
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 4, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 2, value: 2},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 2, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},   
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},
            {startDate: "01/01/2020", endDate: "01/01/2020", count: 0, value: 1},
        ],
    }    
]