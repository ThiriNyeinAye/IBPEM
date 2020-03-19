import React, { Component, Fragment } from "react"
import ReactDOM from "react-dom"
import * as d3 from "d3"
import deepEqual from "deep-equal"
import { format, parse, isEqual, isBefore, startOfYear, endOfYear, addDays } from "date-fns"
import cliTruncate from 'cli-truncate';
import "../../App.css"

export default class DragTest extends Component {

    constructor(props) {
        super(props)
        this.state = {
            width: 46,
            height: props.yearlyData.length*2,
            yearlyData: props.yearlyData,
        }
        this.ref1TierGraph = React.createRef(null)
    }

    componentDidMount() {
        
    }
    
    handleClickOn8DaysData = (startDate, endDate) => {
        // alert("click on rect "+ startDate +" - "+ endDate)
        this.props.handleFirstTierDateRangeChange({ startDate, endDate })
    }

    handleChangeRangeAndFetchData = () => {
        const leftSlider = d3.select("#slide-left")
        const rightSlider = d3.select("#slide-right")
        const x1 = Math.abs( Math.round(Number(leftSlider.attr("x"))) )
        const y1 = Math.abs( Math.round(Number(leftSlider.attr("y"))) )/2
        const x2 = Math.abs( Math.round(Number(rightSlider.attr("x"))) )
        const y2 = Math.abs( Math.round(Number(rightSlider.attr("y"))) )/2

        if(this.ref1TierGraph.current!==null) {
            this.ref1TierGraph.current.calculateStartAndEndWithPoint({ x1, y1, x2, y2}, (startDate, endDate) => {
                this.props.handleFirstTierDateRangeChange({ startDate, endDate })
            })
        }
    }

    handleRestChangeRangeAndFetchData = () => {
        if(this.ref1TierGraph.current!==null) {
            this.ref1TierGraph.current.resetSelectedStartAndEnd()
        }
    }

    render() {
        const { width, height, yearlyData } = this.state
        const { firstTierDate } = this.props
        let yearSvgWidth = window.innerWidth>1200 ? 40 : 20
        if(document.getElementById("yearSvgId")!==null)
            yearSvgWidth = document.getElementById("yearSvgId").clientWidth
        
        return(
            <div className="d-flex flex-column border rounded" style={{ backgroundColor: "#aaafaa20" }}>
                <div className="p-1 d-flex flex-row">
                    <div style={{position: "relative", paddingTop: window.innerWidth>1200 ? 30 : 20, }} >
                        <svg viewBox={`0 0 ${1} ${height}`} className="" id="yearSvgId" style={{ height: "100%", }} >
                            {
                                yearlyData.map((v, k) => (
                                    <text key={k} x={0.5} y={k*2+1} fill="#637587" fontSize={0.4} dominantBaseline="middle" textAnchor="middle" >{v.year}</text>
                                ))
                            }
                        </svg>
                    </div>
                    <div className="flex-grow-1" style={{ paddingLeft: yearSvgWidth }}>
                        <div>
                            <svg viewBox={`0 0 ${width} ${1}`} className=""  >
                                <GraphTip />
                            </svg>
                        </div>
                        <div>
                            <svg viewBox={`0 0 ${width} ${height}`} className="" id="eight-day-slider-svg" className="border" style={{ /*backgroundColor: "#fefefe",*/ borderRadius: 2 }}>
                                <Background ref={this.ref1TierGraph} handleClickOn8DaysData={this.handleClickOn8DaysData} firstTierDate={firstTierDate} width={width} height={height} yearlyData={yearlyData} />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="p-1 d-flex flex-row justify-content-between align-items-center flex-wrap" style={{}}>
                    <div className="pl-2">
                        <span className="text-primary"><small>{firstTierDate.startDate}</small></span>
                        <span className="px-1 text-secondary">~</span>
                        <span className="text-primary"><small>{firstTierDate.endDate}</small></span>
                    </div>
                    <div className="d-flex">
                        <div className="px-1"><button className="btn btn-sm btn-danger" onClick={this.handleRestChangeRangeAndFetchData}>Cancel</button></div>
                        <div className="px-1"><button className="btn btn-sm btn-success" onClick={this.handleChangeRangeAndFetchData}>Apply</button></div>
                    </div>
                </div>
            </div>
        )
    }

}

class GraphTip extends Component {
    constructor(props) {
        super(props)
        this.state = {
            months: []
        }
    }
    componentDidMount() {
        let startDate = startOfYear(new Date())
        let endDate = endOfYear(new Date())
        const months = []
        while(isBefore( new Date(startDate), new Date(endDate) )) {
            const mname =format(new Date(startDate), "MMM")
            if(months.findIndex(v => v===mname)===-1) months.push(mname)
            else months.push(null)
            startDate = addDays(new Date(startDate), 8)
        }
        this.setState({ months: months })
    }
    render() {
        const tips = this.state.months.map((v, k, a) => {
            if(v!==null) {
                return (
                    <g key={k}>
                        {/* Base Line */}
                        <line x1={k} y1={0.8} x2={k+1} y2={0.8} style={{ strokeWidth: 0.03, stroke: "#8395a766" }}></line> 
                        {/* Tip vertical line */}
                        <line x1={k} y1={0.6} x2={k} y2={0.8} style={{ strokeWidth: 0.04, stroke: "#8395a766" }}></line>
                        {/* Tip label */}
                        <text x={k} y={0.5} fill="#8395a7" fontSize={0.4} textAnchor={k===0 ? "start" : k===a.length-1 ? "end" : "middle"} >{v}</text>
                    </g>
                )
            } else {
                return <line key={k} x1={k} y1={0.8} x2={k+1} y2={0.8} style={{ strokeWidth: 0.03, stroke: "#8395a766" }}></line>
            }
        }) 
        return tips
    }
}

class Background extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vectors: Array(props.height).fill(Array(props.width).fill(0)),
            vectorsSelected:null,// [[0,5], [0,6], [0,7], [0,8]],
            yearlyData: props.yearlyData,
            months: []
        }
    }

    componentDidMount() {        
        let startDate = startOfYear(new Date())
        let endDate = endOfYear(new Date())
        const months = []
        while(isBefore( new Date(startDate), new Date(endDate) )) {
            const mname = format(new Date(startDate),"MMM")
            if(months.findIndex(v => v===mname)===-1) months.push(mname)
            else months.push(null)
            startDate = addDays(new Date(startDate), 8)
        }
        this.setState({ months: months })
        this.calculateStartAndEnd()
    }

    componentDidUpdate(pprops) {
        if(!deepEqual(pprops.firstTierDate, this.props.firstTierDate)) {
            this.setState({ vectorsSelected: null }, () => this.calculateStartAndEnd())
        }
    }

    calculateStartAndEnd = () => {
        const startYear = format(new Date(this.props.firstTierDate.startDate), "yyyy")
        const endYear = format(new Date(this.props.firstTierDate.endDate), "yyyy")
        
        const startDate = new Date(this.props.firstTierDate.startDate)
        const endDate = new Date(this.props.firstTierDate.endDate)

        const vectorsSelected = []
        this.state.yearlyData.map((yd, k1) => {
            if(startYear===yd.year || endYear===yd.year) {
                yd.data.forEach((d, k2) => {
                    if((isEqual(startDate, new Date(d.startDate)) || isBefore(startDate, new Date(d.startDate)) ) &&
                        (isEqual(new Date(d.endDate), endDate) || isBefore(new Date(d.endDate), endDate)) ) {
                            vectorsSelected.push([k1, k2])
                        } 
                })
            }
        } )
        this.setState({ vectorsSelected: vectorsSelected })
    }

    resetSelectedStartAndEnd = () => {
        const vectorsSelected = [...this.state.vectorsSelected]
        this.setState({ vectorsSelected: null}, () => this.setState({ vectorsSelected: vectorsSelected }))
    }

    calculateStartAndEndWithPoint = ({ x1, y1, x2, y2 }, callback) => {        
        let startDate = this.state.yearlyData[y1].data[x1].startDate
        let endDate = this.state.yearlyData[y2].data[x2-1].endDate
        callback(startDate, endDate)
    }

    render() {
        if(this.state.vectorsSelected===null || this.state.vectorsSelected.length===0) return null;
        const rects = this.state.months.map((v, k, a) => {
            if(v!==null) {
                return <line key={k} x1={k} y1={0} x2={k} y2={this.props.height} stroke={"#000000"} opacity={0.3} strokeWidth={0.008} />
            } else return null
        })
        const rectsSelected = this.state.vectorsSelected.map( (v, k) => (
            <Rect  
                key={k}
                id={`selected${k}`} 
                x={v[1]} y={v[0]*2+0.1} 
                width={1} height={1.8} 
                // stroke={"#000000"} strokeWidth={0.05} 
                fill={"#44aa4440"} 
                vectorsSelected={this.state.vectorsSelected} vectors={this.state.vectors} />             
        ))
        const yearlyData = this.state.yearlyData.map((v1, k1) => {
            return v1.data.map((v2, k2) => {
                const dataState = v2.dataState[1]
                if(v2.count>0) {
                    return (
                        <g key={`${v1.year}${k2}`} 
                            id="rec8day"
                            className="rec8day"
                            onClick={e => this.props.handleClickOn8DaysData(v2.startDate, v2.endDate, e)} 
                            style={{ cursor: "default" }}>
                            <title>
                                { 
                                    JSON.stringify({ 
                                        "Start Date": v2.startDate,
                                        "End  Date": v2.endDate
                                    }, null, '\n\t') 
                                    .replace(/\":/g, ":\t")
                                    .replace(/\"/g, "")
                                    .replace(/\"/g, "")
                                    .replace(/,/g, "")
                                }
                                {/* {v2.startDate} ~ {v2.endDate} */}
                            </title>
                            <rect 
                                sd={v2.startDate}
                                ed={v2.endDate}
                                stroke={"#e5e5e5"}
                                strokeWidth={0.01}
                                x={k2} y={k1*2+0.3} width={1} height={1.4} fill={ dataState.dataCount>0 ? "#ee5253cc" : "#1abc9cbb" }
                            />
                            <text 
                                x={k2+0.5}/* y={0.7}*/ fill="white" fontSize={0.4} 
                                y={k1*2+1} dominantBaseline="middle" textAnchor="middle" >
                                { cliTruncate((dataState.dataCount>0 ? `${dataState.dataCount}` : ""), 4) }
                            </text>
                            {/* <g className="tooltip" transform={`translate(${k2},${k1})`} opacity="0.8" >
                                <rect rx="0.02" width="1" height="1.4" ></rect>
                                <text x="0.5" y="1" dominantBaseline="middle" textAnchor="middle" fontSize={0.3} fill="blue">Hello</text>
                            </g> */}
                        </g>
                    )
                } else {
                    return (
                        <line key={`${v1.year}${k2}`} x1={k2} y1={k1*2+1} x2={k2+1} y2={k1*2+1} style={{ strokeWidth: 0.05, stroke: "#23232333", strokeDasharray: "0.3 0.2" }} />
                    )
                }
            })
        })
        const { vectorsSelected } = this.state
        return (
            <g>
                { rects }
                { yearlyData }
                <g id="selected-group">
                    { rectsSelected }
                </g>
                <Slider  
                    x1={vectorsSelected[0][1]} y1={vectorsSelected[0][0]*2+0.3} 
                    x2={vectorsSelected[vectorsSelected.length-1][1]} y2={vectorsSelected[vectorsSelected.length-1][0]*2+0.3} 
                    width={0.4} height={1.4} 
                    // stroke={"#000000"} strokeWidth={0.05} 
                    fill={"#888888aa"} 
                    vectorsSelected={this.state.vectorsSelected} vectors={this.state.vectors} />
            </g>
        )
    }
}

const handleDrag = (props) => {
    return d3.drag()
    .subject(function () {
        const me = d3.select(this);
        return { x: me.attr('x'), y: me.attr('y') }
    })
    .on("start", function() {
    })
    .on('drag', function () {            
        const e = d3.event
        // if(e.dx>0.3) e.dx=0.3
        if(e.dx!==0) {
            const maxX = props.vectors[0].length
            let altIndexAsc= -1;
            let altIndexDesc = maxX+1;
            const vectorsSelectedNodes = d3.selectAll("#selected-group > rect").nodes()
            // console.log("vectorSelected: ", vectorsSelectedNodes)
            const vectorsSelected = vectorsSelectedNodes.map((v,k) => {
                const me = d3.select(v);
                const x = Number(me.attr("x"))
                const y = Number(me.attr("y"))
                const newX = x+e.dx;

                if(newX>maxX && y<props.vectors.length-2) {
                    return [y+2, ++altIndexAsc]
                } else if(newX<0 && y>2) {
                    return [y-2, --altIndexDesc]
                } else if(y>2 && y<props.vectors.length-2) {
                    return [y, newX]
                } else if(Math.floor(y)===0 && newX-k>0) {
                    return [y, newX]
                } else if(Math.floor(y)===props.vectors.length-2 && newX-k+props.vectorsSelected.length<=maxX+0.1) {
                    return [y, newX]
                } else {
                    return null
                }
            });
            vectorsSelected.forEach((v,k, a) => {
                if(v) {
                    const me = d3.select(vectorsSelectedNodes[k]);
                    me.attr("x", v[1])
                    me.attr("y", v[0])
                    if(k===0) {
                        const leftSlider = d3.select("#slide-left")
                        leftSlider.attr("x", v[1]-Number(leftSlider.attr("width"))/2)
                        leftSlider.attr("y", v[0]+0.2)
                    }
                    if(k===a.length-1) {
                        const rightSlider = d3.select("#slide-right")
                        rightSlider.attr("x", v[1]+Number(me.attr("width"))-Number(rightSlider.attr("width"))/2)
                        rightSlider.attr("y", v[0]+0.2)
                    }
                }
            });
            // console.log("----------------------------\n")
        }
    })
    .on("end", function() {
        const e = d3.event
        let latestX = -1
        let latestY = -1
        const vectorsSelectedNodes = d3.selectAll("#selected-group > rect").nodes()
        vectorsSelectedNodes.forEach((v,k, a) => {
            const me = d3.select(v);
            if(latestX===-1 || latestY===-1) {
                if(latestX===-1) {
                    const x = Math.floor(Number(me.attr("x")))
                    me.attr("x", x)
                    latestX=x
                } 
                if(latestY===-1) {
                    const y = Number(me.attr("y"))
                    latestY = y
                }
            }
            else {
                const y = Number(me.attr("y"))
                if(y!==latestY) {
                    const x = Math.floor(Number(me.attr("x")))
                    me.attr("x", x)
                    latestX=x
                    latestY=y
                } else {
                    const x = latestX+1
                    me.attr("x", x)
                    latestX=x
                }
            }

            if(k===0) {
                const leftSlider = d3.select("#slide-left")
                leftSlider.attr("x", Number(me.attr("x"))-Number(leftSlider.attr("width"))/2)
            }
            if(k===a.length-1) {
                const rightSlider = d3.select("#slide-right")
                rightSlider.attr("x", Number(me.attr("x"))+Number(me.attr("width"))-Number(rightSlider.attr("width"))/2)
            }

        });
    })
}

class Rect extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const props = this.props
        const node = ReactDOM.findDOMNode(this);
        handleDrag(props)(d3.select(node)); 
    }

    render() {
        const { leftRightSilder = -1 } = this.props
        return (
            <rect 
                // key={`${this.props.x}${this.props.y}`} 
                id={this.props.id} 
                x={this.props.x} 
                y={this.props.y} 
                width={this.props.width} 
                height={this.props.height}
                stroke={this.props.stroke}
                strokeWidth={this.props.strokeWidth}
                strokeDasharray={this.props.strokeDashArray}
                fill={this.props.fill}   
            />
        )
    }
}

class Slider extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        const props = this.props
        
        const handleSlideLeft = d3.drag()
            .subject(function () {
                const me = d3.select(this);
                return { x: me.attr('x'), y: me.attr('y') }
            })
            .on("start", function() {
                const me = d3.select(this)
                me.attr("opacity", 1)
            })
            .on('drag', function () {  
                const e = d3.event
                const me = d3.select(this)

                // d3.event.sourceEvent.preventDefault()
                // d3.event.sourceEvent.stopPropagation()
                
                const children = d3.selectAll("#selected-group > rect").nodes()
                if(e.dx>0 && children.length>1) {
                    const x = Math.floor(e.x)
                    children.map(v => {
                        const r = d3.select(v)
                        const rx = Number(r.attr("x"))
                        if(rx<x) {
                            r.remove()
                            me.attr("x", x-Number(me.attr("width"))/2)
                        }
                    })
                } else if(e.dx<0 && e.x<Number(d3.select(children[0]).attr("x"))-1 ) {
                    const x = Math.ceil(e.x)
                    const clone = d3.select(children[0].cloneNode(true))
                    clone.attr("x", Number(clone.attr("x"))-1)
                    clone.attr("id", `selected${children.length}`)
                    handleDrag(props)(d3.select(clone.node())); 
                    d3.select("#selected-group").node().prepend(clone.node())
                    me.attr("x", x-Number(me.attr("width"))/2)
                }
            })
            .on("end", function() {
                const me = d3.select(this)
                me.attr("opacity", 0.8)
            })
        
        const handleSlideRight = d3.drag()
            .subject(function () {
                const me = d3.select(this);
                return { x: me.attr('x'), y: me.attr('y') }
            })
            .on("start", function() {
                const me = d3.select(this)
                me.attr("opacity", 1)
            })
            .on('drag', function () {  
                const e = d3.event
                const me = d3.select(this)
                
                const children = d3.selectAll("#selected-group > rect").nodes()
                if(e.dx<0 && children.length>1) {
                    const x = Math.floor(e.x)
                    children.map(v => {
                        const r = d3.select(v)
                        const rx = Number(r.attr("x"))
                        if(x<rx) {
                            r.remove()
                            me.attr("x", x+Number(r.attr("width")-Number(me.attr("width"))/2))
                            return;
                        }
                    })
                } else if(e.dx>0 && e.x>Number(d3.select(children[children.length-1]).attr("x"))+1  ) {
                    const x = Math.ceil(e.x)
                    const clone = d3.select(children[children.length-1].cloneNode(true))
                    clone.attr("x", Number(clone.attr("x"))+1)
                    clone.attr("id", `selected${children.length}`)
                    handleDrag(props)(d3.select(clone.node())); 
                    d3.select("#selected-group").node().append(clone.node())
                    me.attr("x", x-Number(me.attr("width"))/2)
                }
            })
            .on("end", function() {
                const me = d3.select(this)
                me.attr("opacity", 0.8)
            })

        handleSlideLeft(d3.select("#slide-left"))
        handleSlideRight(d3.select("#slide-right"))
    }
    render() {
        return (
            <g>
                <rect 
                    id={`slide-left`} 
                    x={this.props.x1-this.props.width/2} 
                    y={this.props.y1} 
                    width={this.props.width} 
                    height={this.props.height}
                    stroke={"#2176a3"}
                    strokeWidth={0.08}
                    strokeDasharray={this.props.strokeDashArray}
                    fill={"#2196f3"}    
                    style={{ cursor: "col-resize" }}
                    rx={0.02}
                    ry={0.02}
                    opacity={0.8}
                />
                <rect 
                    id={`slide-right`} 
                    x={this.props.x2+1-this.props.width/2} 
                    y={this.props.y2} 
                    width={this.props.width} 
                    height={this.props.height}
                    stroke={"#2176a3"}
                    strokeWidth={0.08}
                    strokeDasharray={this.props.strokeDashArray}
                    fill={"#2196f3"}    
                    style={{ cursor: "col-resize" }}
                    rx={0.02}
                    ry={0.02}
                    opacity={0.8}
                />
            </g>
        )
    }
}