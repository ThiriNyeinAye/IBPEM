import React, { Component, Fragment } from "react"
import ReactDOM from "react-dom"
import "../../App.css"
import moment from "moment-timezone"
import cliTruncate from 'cli-truncate';
import deepEqual from "deep-equal"

import * as d3 from "d3";
import { format, isBefore, startOfYear, endOfYear, addDays } from "date-fns"

export default class TestComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    componentDidMount() {

    }

    handleClickOnSvgRect = value => {
    //     const value1 = {
    //         startDate: value.startDate,
    //         endDate: value.endDate,
    //         dataState: value.value,
    //         dataCount: value.count,
    //     }
    //     // alert(JSON.stringify(value1, null, 2))
    //     this.props.handleFirstTierDateRangeChange({ startDate: value1.startDate, endDate: value1.endDate })
    }

    handleFirstTierDateRangeChangeIndex = (startIndex, endIndex, rowNo) => {
        const { yearlyData, firstTierDate } = this.props
        const year = [...yearlyData[rowNo].data]
        if(startIndex!==null) {
            const start = year[startIndex]
            if(!deepEqual(start.startDate, firstTierDate.startDate))
                this.props.handleFirstTierDateRangeChange({ startDate: start.startDate, endDate: firstTierDate.endDate })
        } else if(endIndex!==null) {
            const end = year[endIndex]
            if(!deepEqual(end.endDate, firstTierDate.endDate))
                this.props.handleFirstTierDateRangeChange({ startDate: firstTierDate.startDate, endDate: end.endDate })
        } else if(startIndex!==null && endIndex!==null) {
            const start = year[startIndex]
            const end = year[endIndex]
            if(!deepEqual(start.startDate, firstTierDate.startDate) || !deepEqual(end.endDate, firstTierDate.endDate))
                this.props.handleFirstTierDateRangeChange({ startDate: start.startDate, endDate: end.endDate })
        }
        // console.log("index:: ", startIndex, endIndex, rowNo, firstTierDate )
    }

    render() {
        const { yearlyData, firstTierDate } = this.props
        // calcuate months
        let startDate = startOfYear(new Date())
        let endDate = endOfYear(new Date())

        const months = []
        while(isBefore( new Date(startDate), new Date(endDate) )) {
            const mname = format(new Date(startDate), "MMM")
            if(months.findIndex(v => v===mname)===-1) months.push(mname)
            else months.push(null)
            startDate = addDays(new Date(startDate), 8)

        }
        
        const rows = yearlyData.map((v1,k1) => {
            return (
                <div key={k1} className="py-2 d-flex " style={{ overflowX: "hide", }}>
                    <div style={{ width: 40}} className="my-auto">
                        <div className="font-weight-bold text-secondary" style={{ fontSize: 12 }}>{v1.year}</div>
                    </div>
                    <div>
                        <Row5 
                            handleFirstTierDateRangeChangeIndex={this.handleFirstTierDateRangeChangeIndex} 
                            firstTierDate={firstTierDate} 
                            dataRow={v1.data} rowNo={k1} 
                            handleClickOnSvgRect={this.handleClickOnSvgRect} />
                    </div>
                </div>
            )
        })

        return (
            <div className="rounded border p-2 shadow py-3" id="gContainer" style={{ overflowX: "hide" }}>
                <Row5Tip months={months} />
                <div>
                    {rows}
                </div>
                {/* <svg style={{ border: '1px solid' }} width={300} height={300}>
                    <Rect x={20} y={20} width={50} height={50} />
                </svg> */}
            </div>
        )
    }
}

const Row5Tip = ({ months }) => {
    const tips = months.map((v, k) => {
        if(v!==null) {
            return (
                <g key={k}>
                    {/* Grid Line (vertical) */}
                    {/* <line x1={k} y1={0.8} x2={k} y2={6} style={{ strokeWidth: 0.01, stroke: "#8395a7" }}></line> */}
                    {/* Base Line */}
                    <line x1={k} y1={0.8} x2={k+1} y2={0.8} style={{ strokeWidth: 0.03, stroke: "#8395a766" }}></line> 
                    {/* Tip vertical line */}
                    <line x1={k} y1={0.6} x2={k} y2={0.8} style={{ strokeWidth: 0.04, stroke: "#8395a766" }}></line>
                    {/* Tip label */}
                    <text x={k} y={0.5} fill="#8395a7" fontSize={0.4} >{v}</text>
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
        <div className="d-flex " style={{ overflowX: "hide" }}>
            <div className="" style={{ width: 40}}>
            </div>
            <div>
                <svg viewBox={`0 0 ${46} ${1}`} style={{ width: cWidth, height: cWidth/(46/1), cursor: "default", /*position: 'absolute', left: 40, right: 0, top: 0, bottom: 0*/ }}>
                    { tips }
                </svg>
            </div>
        </div>
        // <div className="d-flex p-0 m-0" >
        //     <div className="" style={{ height: 24 }}></div>
        //     <svg viewBox={`0 0 ${46} ${1}`} style={{ width: cWidth, height: cWidth/(46/1), cursor: "default", /*position: 'absolute', left: 40, right: 0, top: 0, bottom: 0*/ }}>
        //         { tips }
        //     </svg>
        // </div>
    )
}

const Row5 = ({ firstTierDate, dataRow, rowNo, handleClickOnSvgRect, handleFirstTierDateRangeChangeIndex }) => {
    const selectedDateStart = dataRow.findIndex(v => v.startDate===firstTierDate.startDate );
    const selectedDateEnd = dataRow.findIndex(v => v.endDate===firstTierDate.endDate );

    const rects = dataRow.map((v2, k2) => {
        const dataState = v2.dataState[1] // stateId=1 for Anomaly Data
        if(v2.count>0) 
            return (
                <g key={`$row5-{rowNo}${k2}`}>
                    <rect  
                        key={`${rowNo}${k2}`}
                        onClick={e => handleClickOnSvgRect(v2)}
                        className="rect-22" 
                        x={k2} y={0.1} width={1} height={1} fill={ dataState.dataCount>0 ? "#ff4d4dee" : "#2b916933" } 
                        style={{ stroke: "#10ac8455", strokeWidth: 0.05, opacity: 0.9, }}>
                        <title>
                            {v2.startDate} ~ {v2.endDate}
                        </title>
                    </rect>
                    <text 
                        onClick={e => handleClickOnSvgRect(v2)}
                        x={k2+0.5}/* y={0.7}*/ fill="white" fontSize={0.4} 
                        y="50%" dominantBaseline="middle" textAnchor="middle" >
                        { cliTruncate((dataState.dataCount>0 ? `${dataState.dataCount}` : ""), 4) }
                    </text>
                    {
                        // selectedDate = firstTierDate.startDate===v2.startDate ? k2 : selectedDate
                        // firstTierDate.startDate===v2.startDate && <line x1={k2} y1={0} x2={k2} y2={1} style={{ strokeWidth: 0.2, stroke: "#232323" }} />
                    }
                    {
                        // firstTierDate.endDate===v2.endDate && <line x1={k2+1} y1={0} x2={k2+1} y2={1} style={{ strokeWidth: 0.2, stroke: "#232323" }} />
                    }
                    {/* <text 
                        onClick={e => handleClickOnSvgRect(v2)}
                        x={k2+0.3} y={0.7} fill="white" fontSize={0.6} >
                        { dataState.dataCount>0 ? dataState.dataCount: "" }</text> */}
                </g> 
            )  
        else 
            return (
                <line key={`${rowNo}${k2}`} x1={k2} y1={0.5} x2={k2+1} y2={0.5} style={{ strokeWidth: 0.05, stroke: "#23232333", strokeDasharray: "0.2 0.2" }} />
            )
    })

    let cWidth = 1000
    if(document.getElementById("gContainer")!==null)
        cWidth = document.getElementById("gContainer").offsetWidth-50
    return(
        <svg viewBox={`0 0 ${46} ${1.2}`} style={{ width: cWidth, height: cWidth/(46/1.2), cursor: "default", }}>
            { rects }
            <RectRange  
                rowNo={rowNo} 
                handleFirstTierDateRangeChangeIndex={handleFirstTierDateRangeChangeIndex}
                selectedDateStart = {selectedDateStart} selectedDateEnd = {selectedDateEnd} 
                x1={selectedDateStart} y1={0} x2={selectedDateEnd+0.99} y2={0} 
                width={0.3} height={1.2} 
            />
        </svg>
    )
}

export class RectRange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leftHandlePos: props.x1,
            rightHandlePos: props.x2,
        }
    }
    onUpdateLeftHandle = (value, drageEnd) => {
        this.setState({ leftHandlePos: value })
        if(drageEnd)
            this.props.handleFirstTierDateRangeChangeIndex(value, null, this.props.rowNo)
    }
    onUpdateRightHandle = (value, drageEnd) => {
        this.setState({ rightHandlePos: value })
        if(drageEnd)
            this.props.handleFirstTierDateRangeChangeIndex(null, value, this.props.rowNo)
    }
    render() {
        const { 
            x1, y1, x2, y2, width, height, 
            rowNo, selectedDateStart, selectedDateEnd,
            handleFirstTierDateRangeChangeIndex,
        } = this.props
        const { leftHandlePos, rightHandlePos } = this.state
        const connectorWidth = rightHandlePos-leftHandlePos
        if(selectedDateStart>-1 && selectedDateEnd>-1) {
            return (
                <g>
                    {/* <Rect rowNo={rowNo} handleFirstTierDateRangeChangeIndex={handleFirstTierDateRangeChangeIndex} x={leftHandlePos} y={y1+0.05} width={connectorWidth} height={height-0.1} onUpdateLeftHandle={this.onUpdateLeftHandle} onUpdateRightHandle={this.onUpdateRightHandle} value2={rightHandlePos} connector style={{ cursor: 'grab'}} /> */}
                    <Rect rowNo={rowNo} handleFirstTierDateRangeChangeIndex={handleFirstTierDateRangeChangeIndex} x={leftHandlePos} y={y1} width={width} height={height} onUpdateHandle={this.onUpdateLeftHandle} value2={rightHandlePos} conditionFunction = { (value1, value2) => value1<value2 } style={{ cursor: 'col-resize'}}/>
                    <Rect rowNo={rowNo} handleFirstTierDateRangeChangeIndex={handleFirstTierDateRangeChangeIndex} x={rightHandlePos} y={y2} width={width} height={height} onUpdateHandle={this.onUpdateRightHandle} value2={leftHandlePos} conditionFunction = { (value1, value2) => value1>value2 } style={{ cursor: 'col-resize'}}/>
                </g>
            )
        } else {
            return null
        }
    }
}

class Rect extends Component {
    componentDidMount() {
        const props = {...this.props}
        const handleDrag = d3.drag()
            .subject(function () {
                const me = d3.select(this);
                return { x: me.attr('x'), y: me.attr('y') }
            })
            .on('drag', function () {
                const me = d3.select(this);
                const value2 = parseInt(me.attr("value2"))
                const width = parseInt(me.attr('width'))
                let x = d3.event.x
                if(!props.connector) {
                    if(Math.floor(x)>=0) x = Math.floor(x)
                    else if(Math.ceil(x)<=46) x = Math.ceil(x)
                    if(x>=0 && x<=46 && props!==undefined /*&& props.conditionFunction(x, value2)*/) {
                        me.attr("x", x)
                        // props.onUpdateHandle(x)
                    }
                } else {
                    if(Math.floor(x)>=0) x = Math.floor(x)
                    else if(Math.ceil(x)<=46) x = Math.ceil(x)
                    if(x>=0 && x+width<=46 && props!==undefined) {
                        me.attr("x", x)
                        // props.onUpdateLeftHandle(x)
                        // props.onUpdateRightHandle(x+width)
                    }
                }
            })
            // .on("end", function () { 
            //     const me = d3.select(this);
            //     const value2 = parseInt(me.attr("value2"))
            //     const width = parseInt(me.attr('width'))
            //     let x = d3.event.x
            //     if(!props.connector) {
            //         if(Math.floor(x)>=0) x = Math.floor(x)
            //         else if(Math.ceil(x)<=46) x = Math.ceil(x)
            //         if(x>=0 && x<=46 && props!==undefined && props.conditionFunction(x, value2)) {
            //             props.onUpdateHandle(x, "end")
            //         }
            //     } else {
            //         if(Math.floor(x)>=0) x = Math.floor(x)
            //         else if(Math.ceil(x)<=46) x = Math.ceil(x)
            //         if(x>=0 && x+width<=46 && props!==undefined) {
            //             props.onUpdateLeftHandle(x, "end")
            //             props.onUpdateRightHandle(x+width, "end")
            //         }
            //     }
            // });
        const node = ReactDOM.findDOMNode(this);
        handleDrag(d3.select(node));
    }
    render() {
        const { x, y, width, height, value2, connector, style } = this.props
        const color1 = connector ? "#00000022" : "#268163ee"
        const color2 = connector ? "#268163aa" : "#268163"
        return <rect x={x-0.15} y={y} width={width} height={height} value2={value2} fill={color1} stroke={color2} strokeWidth={0.06} style={style} />
    }
}