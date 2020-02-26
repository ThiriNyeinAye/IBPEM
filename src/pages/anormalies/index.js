import React, { Component, useState, useRef, useEffect, Fragment } from "react"
import moment from "moment-timezone"

import SingleAreaChart from "../../components/graphs/SingleAreaChart.js"
import MultiAreaChart from "../../components/graphs/MultiAreaChart.js"
import AnormalySidebar from "../../components/app/AnormalySidebar.js"
import DropdownContainerAnormaly from "./DropdownContainerAnormaly.js"
import SimpleSingleAreaChart from "../../components/graphs/SimpleSingleAreaChart.js"
import * as Navbar from "../../components/app/Navbar.js"
import DialogNewAnormaly from "./DialogNewAnormaly.js";
import { SampleDropdown } from '../../components/app/DropDown'

import { withLStorage } from "../../components/hoc.js"

import TestComponent from "./TestComponent"
import { Fade } from "reactstrap"

const HOST = {
    local: "http://192.168.100.7:3003",
    test: "https://ibpem.com/api",
    maythu: "http://192.168.100.27:3003"
}

const DataFetcher = (callback) => {
    return fetch(`${HOST.test}/dummy-data`)
        .then(res => res.json())
        .then(data => callback(data.error, data))
        .catch(error => callback(error, null))
}

const CreateAnomalyData = (data, callback) => {
    // console.log("data: ", data)
    return fetch(`${HOST.test}/anomalies`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => callback(null, data))
        .then(error => callback(error, null))
}

const ReadAnomalyData = (callback) => {
    return fetch(`${HOST.test}/anomalies`)
        .then(res => res.json())
        .then(data => callback(null, data))
        .then(error => callback(error, null))
}

class Anormalies extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            anomalyDataByTime: [],
            anomalyDataByEquipment: {},
            height: 200,
            temp: 0,
            isEmptystate: true,
            isClicked: true,
            isTripleSquareClicked:false,
            isSquareClicked: false,
            anomalyInputData: {
                faultType: [],
                severity: [],
                sensorSignal: [],
            },
            graphShowData: [],
            dimensions: null,
        }
        this.singleAreaChartRef = React.createRef()
        this.multiAreaChartRef = React.createRef()
        this.sidebarRef = React.createRef()
    }
    
    changeContentView = () => {
        if (this.state.isEmptystate === true || this.state.isContentState === false) {
            this.setState({
                ...this.state,
                height: 210,
                isEmptystate: false,
                isTripleSquareClicked:false,
                isTripleSquareState:false,
                isContentState: true,
                isSquareState: false,
                isContentClicked: true,
                isClicked: false,
                isSquareClicked: false
            })
        }
    }
    changeTripleSquareView=()=>{
        if(this.state.isEmptystate === true || this.state.isTripleSquareState === false){
          this.setState({
              ...this.state,
              height:210,
              isEmptystate:false,
              isTripleSquareState:true,
              isTripleSquareClicked:true,
              isClicked:false,
              isContentClicked:false,
              isSquareClicked:false,
              isContentState:false,
              isSquareState:false
          })
        }
    }
    changeSquareView = () => {
        if (this.state.isEmptystate === true || this.state.isSquareState === false) {
            this.setState({
                ...this.state,
                isEmptystate: false,
                isSquareState: true,
                isTripleSquareClicked:false,
                isContentState: false,
                isTripleSquareState:false,
                isSquareClicked: true,
                isContentClicked: false,
                isClicked: false
            })
        }
    }
    changeBurgerView = () => {
        if (this.state.isEmptystate === false) {
            this.setState({
                ...this.state,
                isEmptystate: true,
                isSquareState: false,
                isContentState: false,
                isTripleSquareClicked:false,
                isTripleSquareState:false,
                isClicked: true,
                // height:200,
                isSquareClicked: false,
                isContentClicked: false
            })
        }
    }
    componentDidMount() {
        window.onresize = (e) => {
            this.responsiveHandler(e.target)
        }
        this.responsiveHandler(window)
        DataFetcher((error, data) => {
            if (error) console.log("Error: ", error)
            else {
                this.setState({ data: data.payload/*.filter((v,i)=> i<200)*/ }, () => {
                    return this.fetchAnomalyData()
                })
            }
        })
    }

    responsiveHandler = (window) => {
        this.setState({ wwidth: window.innerWidth })
        if(this.sidebarRef.current!==null && window!==null && window!==undefined) {
            const windowWidth = window.innerWidth
            const sidebarStyle = this.sidebarRef.current.style
            const anoDivStyle = document.getElementById("anomalyDivContainer").style
            const sidebarMenuIcon = document.getElementById("sidebarMenuIcon")
            const sidebarRestDiv = document.getElementById("dropdown-sidebar-rest").style

            if(windowWidth <= 1200 && sidebarMenuIcon.style.display !== "block") {                
                sidebarStyle.position = "absolute"
                sidebarStyle.zIndex = 1000
                sidebarStyle.left = "-340px"
                sidebarStyle.top = "0px"
        
                anoDivStyle.paddingLeft = "60px"
                sidebarMenuIcon.style.display = "block"
                sidebarMenuIcon.onclick = e => {
                    sidebarStyle.left = sidebarStyle.left==="0px" ? "-340px" : "0px"
                    sidebarRestDiv.display = sidebarStyle.left==="0px" ? "block" : "none"
                }
            } 
            else if(windowWidth > 1200){ 
                sidebarStyle.position = "relative"
                sidebarStyle.zIndex = 1000
                sidebarStyle.left = "0px"
        
                anoDivStyle.paddingLeft = "8px"
                sidebarMenuIcon.style.display = "none"
            }
        }
    }

    fetchAnomalyData = () => {
        return ReadAnomalyData((error, data) => {
            if (error === null && data.payload !== null) {
                const tmp = data.payload.sort((l,r) => r.endDate.localeCompare(l.endDate))
                const anomalyDataByEquipment = tmp.reduce((r, c) => {
                    const R = { ...r }
                    const value = {
                        ...c,
                        selected: false,
                        date: moment(c.startDate).format("MMM Do YY"),
                        time: `${moment(c.startDate).format("HH:mm:ss")}-${moment(c.endDate).format("HH:mm:ss")}`
                    }
                    if (R[c.deviceType] === undefined) R[c.deviceType] = [value]
                    else R[c.deviceType].push(value)
                    return R
                }, {})
                this.setState({
                    anomalyDataByTime: data.payload,
                    anomalyDataByEquipment
                }, () => {
                    const areaChart = this.singleAreaChartRef.current
                    if (areaChart !== null) {
                        areaChart.removeSelectedRange()
                    }
                })
            } else {
                console.log("Error:123: ", error)
            }
        })
    }

    onAnormalyInputChanged = (value, dataType) => { 
        const anomalyInputData = { ...this.state.anomalyInputData }
        if (anomalyInputData[dataType].findIndex(v => v === value) > -1) {
            anomalyInputData[dataType] = anomalyInputData[dataType].filter(v => v !== value)
            this.setState({ anomalyInputData })
        } else if (value.trim() !== "") {
            anomalyInputData[dataType] = [value]
            this.setState({ anomalyInputData })
        }
    }

    handleGraphDataChart = (g) => {
        this.setState({ graphShowData: g })
    }
    //Charts
    handleMultiZoomIn = () => {
        this.setState({temp: this.state.temp+1})
        const multiChart = this.multiAreaChartRef.current
        if(multiChart !== null){
            if(multiChart.multiChartRef.current !== null){
                const chart1 = multiChart.multiChartRef.current.chart
                this.multiAreaChartRef.current.setMultiZoomIn(chart1)
            }
        }
    }
    handleMultiZoomOut = () => {
        const multiChart = this.multiAreaChartRef.current
        if(multiChart !== null) {
            if(multiChart.multiChartRef.current !== null){
                const chart1 = multiChart.multiChartRef.current.chart
               
                if(this.state.temp<=0) {
                    console.log()
                } else {
                    this.multiAreaChartRef.current.setMultiZoomOut(chart1)
                    this.setState({temp: this.state.temp-1})
                }
            }
        }
    }
    handleZoomIn = () => {
        // console.log("singleAreaChartRef: ", this.singleAreaChartRef)
        this.setState({temp: this.state.temp+1})
        const areaChart = this.singleAreaChartRef.current
        if (areaChart !== null) {
            if (areaChart.chartRef.current !== null) {
                const chart = areaChart.chartRef.current.chart
                this.singleAreaChartRef.current.setZoomIn(chart)
            }
        }
    }
    handleZoomOut = () => {
        const areaChart = this.singleAreaChartRef.current
        if (areaChart !== null) {
            if (areaChart.chartRef.current !== null) {
                const chart = areaChart.chartRef.current.chart

                if(this.state.temp <= 0)
                {
                    console.log()
                }else {
                    this.singleAreaChartRef.current.setZoomOut(chart)
                    this.setState({temp: this.state.temp-1})
                }
                
            }
        }
    }
    //Anomaly Dialog
    onSubmitAnomaly = (message, byUser, callback = () => null) => {
        const { anomalyInputData, graphShowData } = this.state

        const areaChart = this.singleAreaChartRef.current
        const leftLine = areaChart.state.leftLine
        const rightLine = areaChart.state.rightLine
        if (areaChart !== null && leftLine !== null && rightLine !== null) {
            const anomalyData = {
                user: byUser,
                deviceType: "Chiller 3",
                deviceId: "CH3",
                anomalyState: 1,
                faultType: anomalyInputData.faultType,
                severity: anomalyInputData.severity,
                sensorSignal: anomalyInputData.sensorSignal,
                startDate: moment.unix(leftLine.xValue / 1000).tz("Europe/Lisbon").format("YYYY-MM-DD HH:mm:ss"),
                endDate: moment.unix(rightLine.xValue / 1000).tz("Europe/Lisbon").format("YYYY-MM-DD HH:mm:ss"),
                additionalGraphs: graphShowData.filter(v => v.selected).map(v => v.name),
                remark: message,
            }

            return CreateAnomalyData(anomalyData, (error, data) => {
                if (error === null) {
                    this.fetchAnomalyData()
                    callback()
                } else console.log("Anomaly Create: ERROR: ", error)
            })
        } else {
            alert("Please required input!")
        }
    }

    handleAnomalyTimeClicked = value => {
        const anomalyDataByEquipment1 = { ...this.state.anomalyDataByEquipment }
        const anomalyDataByEquipment = Object.keys(anomalyDataByEquipment1).reduce((r, c) => {
            const R = { ...r }
            const data = anomalyDataByEquipment1[c].map(v => v.id === value.id ? { ...v, selected: true } : { ...v, selected: false })
            R[c] = data
            return R
        }, {})
        this.setState({
            anomalyDataByEquipment,
            anomalyInputData: {
                faultType: value.faultType,
                severity: value.severity,
                sensorSignal: value.sensorSignal,
            },
            graphShowData: value.additionalGraphs.map(v => ({ selected: true, name: v }))
        }, () => {
            const areaChart = this.singleAreaChartRef.current
            const startTs = moment.tz(value.startDate, "Europe/Lisbon").unix() * 1000
            const endTs = moment.tz(value.endDate, "Europe/Lisbon").unix() * 1000
            areaChart.addSelectedRange({ leftX: areaChart.tsToPixels(startTs), rightX: areaChart.tsToPixels(endTs) })
        })
    }

    render() {
        const { data, graphShowData, anomalyInputData, anomalyDataByTime, anomalyDataByEquipment,dimensions} = this.state;
        const data0 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.efficiency])
        const data1 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaInput])
        const data2 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaOutput])
        const minorChartData = [data1, data2]
          
        return (
            <div className="" style={{ overflow: 'auto' }}>
                <div 
                    onClick={e => {
                        const sidebarStyle = document.getElementById("sidebarContainer").style
                        const sidebarMenuIcon = document.getElementById("sidebarMenuIcon")
                        const sidebarRestDiv = document.getElementById("dropdown-sidebar-rest").style
                        if(sidebarMenuIcon.style.display === "block" && sidebarStyle.left==="0px") {
                            sidebarStyle.left = "-340px"
                            sidebarRestDiv.display = "none"
                        } 
                    }}
                    id="dropdown-sidebar-rest"
                    style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#00000099", zIndex: 100, display: "none" }}>

                </div>
                <div className="d-flex flex-row flex-wrap flex-md-nowrap" >
                    
                    <div className="d-flex flex-column flex-fill p-2" style={{ width: 400, zIndex: 101 }} id="sidebarContainer" ref={this.sidebarRef} >
                        <AnormalySidebar
                            anomalyDataByEquipment={anomalyDataByEquipment}
                            handleAnomalyTimeClicked={this.handleAnomalyTimeClicked} />
                    </div>

                    <DialogNewAnormaly onSubmitAnomaly={this.onSubmitAnomaly} />
                    
                    <div id="anomalyDivContainer" className="container-fluid ">
                        <div className="row ">
                            {/* <div className="col-lg-12 py-4">
                                <Navbar.ItemNavbar />
                            </div> */}
                            <div className="py-2 col-lg-12 col-12">
                                <DropdownContainerAnormaly
                                    handleGraphDataChart={this.handleGraphDataChart}
                                    anomalyInputData={anomalyInputData}
                                    onAnormalyInputChanged={this.onAnormalyInputChanged}
                                    changeBurgerView={this.changeBurgerView}
                                    changeContentView={this.changeContentView}
                                    changeSquareView={this.changeSquareView}
                                    changeTripleSquareView={this.changeTripleSquareView}
                                    isClicked={this.state.isClicked}
                                    isContentClicked={this.state.isContentClicked}
                                    isSquareClicked={this.state.isSquareClicked}
                                    isTripleSquareClicked={this.state.isTripleSquareClicked}
                                    
                                />
                            </div>

            
                            <div className="py-2 col-lg-12 col-12 ">
                                {this.state.isTripleSquareState&&(
                                    <Fragment>
                                       <div className='p-1'>
                                            <div className=" bg-white rounded p-4">
                                                <AnormalyControlPanel handleZoomIn={this.handleZoomIn} handleZoomOut={this.handleZoomOut} />
                                                    <div className="p-2 bg-white rounded">
                                                        <TestComponent />
                                                    </div>
                                                    {
                                                        data.length > 0 ?
                                                            <SingleAreaChart ref={this.singleAreaChartRef} data={data0} />
                                                            // <MultiAreaChart data1={data0} data2={data2} />
                                                            : <div className="p-4 text-secondary text-center">Loading...</div>
                                                    }
                                            </div>
                                       </div>
                                        <div className='d-flex flex-wrap'>
                                            {
                                            graphShowData.map((v, i) =>
                                                <div key={i} className="col-lg-6 p-1">
                                                    {v.selected &&
                                                        <div className="p-4 bg-white rounded">
                                                            <SimpleSingleAreaChart title={v.name} data={minorChartData[i]} height={this.state.height}/>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        }
                                            
                                        
                                        </div>
                                        
                                    </Fragment>
                                )}
                                {this.state.isEmptystate && (
                                    <Fragment>
                                        <div className=" bg-white rounded p-4">
                                            <AnormalyControlPanel handleZoomIn={this.handleZoomIn} handleZoomOut={this.handleZoomOut} />
                                            <div className="p-2 bg-white rounded">
                                                <TestComponent />
                                            </div>
                                            {
                                                data.length > 0 ?
                                                    <SingleAreaChart ref={this.singleAreaChartRef} data={data0} />
                                                    // <MultiAreaChart data1={data0} data2={data2} />
                                                    : <div className="p-4 text-secondary text-center">Loading...</div>
                                            }
                                        </div>
                                        {
                                            graphShowData.map((v, i) =>
                                                <div key={i} className="pt-2 ">
                                                    {v.selected &&
                                                        <div className="p-4 bg-white rounded">
                                                            <SimpleSingleAreaChart title={v.name} data={minorChartData[i]} />
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        }
                                    </Fragment>

                                )}
                               
                                {this.state.isContentState && (
                                    <Fragment>

                                        <div className='d-flex flex-row justify-content-between '>

                                            <div className="col bg-white rounded p-4">
                                                <AnormalyControlPanel handleZoomIn={this.handleZoomIn} handleZoomOut={this.handleZoomOut} />
                                                <div className="p-2 bg-white rounded">
                                                    <TestComponent />
                                                </div>
                                                {
                                                    data.length > 0 ?
                                                        <SingleAreaChart ref={this.singleAreaChartRef} data={data0} />
                                                        //  <MultiAreaChart data1={data0} data2={data2} /> 
                                                        : <div className="p-4 text-secondary text-center">Loading...</div>
                                                }
                                            </div>
                                            <div className='col pl-2'>
                                                {
                                                    graphShowData.map((v, i) =>
                                                        <div key={i} className="pb-2 col-lg-12 col-12 justify-content-center pl-2 p-0">
                                                            {v.selected &&
                                                                <div className="bg-white rounded p-5">
                                                                    <SimpleSingleAreaChart title={v.name} data={minorChartData[i]} height={this.state.height} />
                                                                </div>
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Fragment>
                                )}
                                
                                {this.state.isSquareState&&(
                                    <Fragment>
                                      <div className="col bg-white rounded p-4">
                                                <AnormalyControlPanel handleZoomIn={this.handleMultiZoomIn} handleZoomOut={this.handleMultiZoomOut} />
                                                <div className="p-2 bg-white rounded">
                                                    <TestComponent />
                                                </div>
                                                {
                                                    data.length > 0 ?
                                                        // <SingleAreaChart ref={this.singleAreaChartRef} data={data0} />
                                                        <MultiAreaChart ref={this.multiAreaChartRef} data1={data0} data2={data2} /> 
                                                        : <div className="p-4 text-secondary text-center">Loading...</div>
                                                }
                                            </div>
                                    </Fragment>
                                )}

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
export default withLStorage(Anormalies)


const AnormalyControlPanel = props => {
    return (
        <div className='d-flex justify-content-between align-items-center'>
            <div className=''>
                <div className="py-0"></div>
                <div className='dropup'>
                    <div className='btn dropdown-toggle px-1' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className='text-secondary' style={{ fontSize: 20 }}>CH-3</span>
                    </div>
                    <div className='dropdown-menu pt-3 pb-0'>
                        <div className='px-3 border border-top-0 border-right-0 border-left-0 pb-3 text-left' >
                            <div>Similar Detections</div>
                        </div>
                        <DropdownItem dateTime="29.01.2019 16:00-16:03" percentage="20%" />
                        <DropdownItem dateTime="29.01.2019 16:00-16:03" percentage="60%" />
                        <div className='dropdown-item py-2 text-left' style={{ cursor: "pointer" }}>
                            Suggested Labeling
                            <div className='d-flex flex-wrap'>
                                <div className='py-1'>
                                    <div className='d-flex flex-row p-2 ' style={{ backgroundColor: '#E9F8F1', borderColor: '#E9F8F1', borderRadius: 10 }}>
                                        <div className='text-secondary'>
                                            SEVERITY
                                        </div>
                                        <div className='px-2'>
                                            Low
                                        </div>
                                    </div>
                                </div>
                                <div className='py-1'>
                                    <div className='d-flex flex-row p-2  rounded-lg' style={{ backgroundColor: '#E9F8F1', borderColor: '#E9F8F1', borderRadius: 10 }}>
                                        <div className='text-secondary'>
                                            SENSOR SIGNAL
                                        </div>
                                        <div className='px-2'>
                                            Plant EMG
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='d-flex align-items-center'>
                    <span onClick={props.multiChartRef? props.handleMultiZoomIn : props.handleZoomIn}>
                        <Icon icon="fa fa-plus" />
                    </span>
                    <span onClick={props.multiChartRef? props.handleMultiZoomOut : props.handleZoomOut}>
                        <Icon icon="fa fa-minus" />
                    </span>
                    <div className='text-secondary'>Zoom</div>
                    <SampleDropdown label={"Today"} icon={<Icon icon="fa fa-calendar" />}
                        additionalValue={["7 days ", "1 month", "6 month", "1 year"]} />
                </div>
            </div>
        </div>
    )
}

const DropdownItem = ({ dateTime = '', percentage = '' }) => {
    return (
        <div className='d-flex flex-row justify-content-between border border-top-0 border-right-0 border-left-0 py-2 px-3 text-secondary' style={{ minWidth: 260 }}>
            <div className=''>
                {dateTime}
            </div>
            <div className=''>
                {percentage}
            </div>
        </div>
    )
}

const Icon = ({ icon = '' }) => {
    return (
        <div className='p-1'>
            <div className="btn btn-sm px-1 py-0" style={{ backgroundColor: '#dfd8f0', cursor: "pointer" }}>
                <i className={icon} style={{ color: '#5b3da1' }}></i>
            </div>
        </div>
    )
}
