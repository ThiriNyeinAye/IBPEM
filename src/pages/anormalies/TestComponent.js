import React, { Component, Fragment } from "react"
import "../../App.css"
import moment from "moment-timezone"

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
        let startDate = moment().startOf('year')
        let endDate = moment().endOf('year')
        const months = []
        while(startDate.isBefore(endDate)) {
            const mname = startDate.format("MMM")
            if(months.findIndex(v => v===mname)===-1) months.push(mname)
            else months.push(null)
            startDate = startDate.add(8, 'days')
        }
        
        const rows = data.map((v1,k1) => {
            return (
                <div className="py-2 d-flex " id="gContainer" style={{ overflowX: "hide"}}>
                    <div className="pr-2 pt-1">
                        <small className="font-weight-bold text-secondary">{v1.year}</small>
                    </div>
                    <div>
                        <Row5 dataRow={v1.data} rowNo={k1} handleClickOnSvgRect={this.handleClickOnSvgRect} />
                    </div>
                </div>
            )
        })

        return (
            <div className="rounded" style={{ overflowX: "hide"}}>
                <Row5Tip months={months} />
                {rows}
            </div>
        )
    }
}

const Row5Tip = ({ months }) => {
    const tips = months.map((v, k) => {
        if(v!==null) {
            return (
                <g>
                    {/* Grid Line (vertical) */}
                    {/* <line x1={k} y1={0.8} x2={k} y2={6} style={{ strokeWidth: 0.01, stroke: "#8395a7" }}></line> */}
                    {/* Base Line */}
                    <line key={k} x1={k} y1={0.8} x2={k+1} y2={0.8} style={{ strokeWidth: 0.03, stroke: "#8395a766" }}></line> 
                    {/* Tip vertical line */}
                    <line key={k} x1={k} y1={0.6} x2={k} y2={0.8} style={{ strokeWidth: 0.04, stroke: "#8395a766" }}></line>
                    {/* Tip label */}
                    <text x={k} y={0.5} fill="#8395a7" font-size={0.5} >{v}</text>
                </g>
            )
        } else {
            return <line key={k} x1={k} y1={0.8} x2={k+1} y2={0.8} style={{ strokeWidth: 0.03, stroke: "#8395a766" }}></line>
        }
    }) 
    let cWidth = 1000
    if(document.getElementById("gContainer")!==null)
        cWidth = document.getElementById("gContainer").offsetWidth-50
    return(
        <div className="d-flex p-0 m-0" style={{ position: "relative" }}>
            <div className="" style={{ height: 24 }}></div>
            <svg viewBox={`0 0 ${46} ${6}`} style={{ width: cWidth, height: cWidth/(46/6), cursor: "default", position: 'absolute', left: 40, right: 0, top: 0, bottom: 0 }}>
                { tips }
            </svg>
        </div>
    )
}

const Row5 = ({ dataRow, rowNo, handleClickOnSvgRect }) => {
    const rects = dataRow.map((v2, k2) => {
            if(v2.count>0) 
                return (
                    <g key={`${rowNo}${k2}`}>
                        <rect  
                            key={`${rowNo}${k2}`}
                            onClick={e => handleClickOnSvgRect(v2)}
                            className="rect-22" 
                            x={k2} y={0} width={1} height={1} fill={ v2.value===2 ? "#ff4d4dee" : "#2b916933" } 
                            style={{ stroke: "#10ac8455", strokeWidth: 0.05, opacity: 0.9, }}>
                            <title>
                                {v2.startDate} ~ {v2.endDate}
                            </title>
                        </rect>
                        <text 
                            onClick={e => handleClickOnSvgRect(v2)}
                            x={k2+0.3} y={0.7} fill="white" font-size={0.6} >
                            { v2.value===2 ? v2.count : "" }</text>
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
        cWidth = document.getElementById("gContainer").offsetWidth-50
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