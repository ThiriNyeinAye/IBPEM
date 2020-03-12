import React, { Component, useState, useRef, useEffect, Fragment } from "react"
import moment from "moment-timezone"
import Draggable from 'react-draggable'

import SingleAreaChart from "../../components/graphs/SingleAreaChart.js"
import MultiAreaChart from "../../components/graphs/MultiAreaChart.js"
import AnormalySidebar from "../../components/app/AnormalySidebar.js"
import DropdownContainerAnormaly from "./DropdownContainerAnormaly.js"
import SimpleSingleAreaChart from "../../components/graphs/SimpleSingleAreaChart.js"
import * as Navbar from "../../components/app/Navbar.js"
import DialogNewAnormaly from "./DialogNewAnormaly.js";
import { SampleDropdown } from '../../components/app/DropDown'

import { withLStorage } from "../../components/hoc.js"

import TestComponent from "./FirstTierGraph"
import queryString from  "querystring"
import Loading from "./Loading.js"

const HOST = {
    local: "http://192.168.100.7:3003",
    test: "https://ibpem.com/api",
    maythu: "http://192.168.100.27:3003"
}

// const DataFetcher = (callback) => {
//     return fetch(`${HOST.test}/dummy-data?startDate=2020-01-10&endDate=2020-01-11`)

const DataFetcher = (callback, queryParams) => {
    const queryParamString = queryString.stringify(queryParams)
    // console.log("queryParams: ", queryParamString)
    return fetch(`${HOST.test}/dummy-data?${queryParamString}`)

        .then(res => res.json())
        .then(data => callback(data.error, data))
        .catch(error => callback(error, null))
}

const YearlyDataFetcher = (callback) => {
    return fetch(`${HOST.test}/eight-days`)
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
        .catch(error => callback(error, null))
}

const ReadAnomalyData = (callback, queryParams) => {
    const queryParamString = queryString.stringify(queryParams)
    return fetch(`${HOST.test}/anomalies?${queryParamString}`)
        .then(res => res.json())
        .then(data => callback(null, data))
        .catch(error => callback(error, null))
}

class Anormalies extends Component {

    constructor(props) {
        super(props)
        this.state = {
            // data: null,
            showLoading: false,
            data0: [],
            data1: [],
            data2: [],
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
            yearlyData: null,
            firstTierStartDate: "2020-02-10",
            firstTierEndDate: "2020-02-25"
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
        
        const singlerAreaChart = this.singleAreaChartRef.current
        if(singlerAreaChart!==null) singlerAreaChart.setLoading(true)
        this.readDataFromApi()
        // if(this.singleAreaChartRef.current!==null) 
        //     this.singleAreaChartRef.current.setChartOption()
        
    }

    readDataFromApi = () => {
        YearlyDataFetcher((error, data) => {
            if (error) console.log("Error:YearlyDataFetcher: ", error)
            else {
                this.setState({ yearlyData: data.payload }, () => { 

                 })
            }
        })
        this.fetchAnomalyData()
        DataFetcher((error, data) => {
            if (error) console.log("Error:DataFetcher: ", error)
            else {
                const { data0, data1, data2 } = data.payload.reduce((r, v) => {
                    const R = {...r}
                    R.data0.push([moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.efficiency])
                    R.data1.push([moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaInput])
                    R.data2.push([moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaOutput])
                    return R
                }, { data0: [], data1: [], data2: [] })
                this.setState({ showLoading: false, /*data: data.payload,*/ data0, data1, data2 /*.filter((v,i)=> i<200)*/ }, () => {
                    const singlerAreaChart = this.singleAreaChartRef.current
                    if(singlerAreaChart!==null) singlerAreaChart.setLoading(false)
                })
            }
        }, { startDate: this.state.firstTierStartDate, endDate: this.state.firstTierEndDate })
        
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
                        date: moment(c.startDate).format("Do MMM, YY")+ " ~ " + moment(c.endDate).format("Do MMM, YY"),
                        time: `${moment(c.startDate).format("HH:mm")} ~ ${moment(c.endDate).format("HH:mm")}`
                    }
                    if (R[c.deviceType] === undefined) R[c.deviceType] = [value]
                    else R[c.deviceType].push(value)
                    return R
                }, {})
                // console.log("anomalyDateByTime: ", data.payload)
                this.setState({
                    anomalyDataByTime: data.payload,
                    anomalyDataByEquipment
                }, () => {
                    const areaChart = this.singleAreaChartRef.current
                    if (areaChart !== null) {
                        areaChart.removeSelectedRange()
                    }
                    // this.singleAreaChartRef.current.setState(prev=>({ option: {
                    //     ...prev.option, 
                    //     navigator
                    // } }))

                    // if(this.singleAreaChartRef.current!==null)
                    //     this.singleAreaChartRef.current.setChartOption()

                    // console.log("Ref: ", this.singleAreaChartRef.current)
                    // console.log("Chartt: ", this.singleAreaChartRef.current.chartRef.current.chart)
                })
            } else {
                console.log("Error:123:ReadAnomaly : ", error, " : ", data)
            }
        }, { startDate: this.state.firstTierStartDate, endDate: this.state.firstTierEndDate })
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
                    this.readDataFromApi()
                    callback()
                    // YearlyDataFetcher((error, data) => {
                    //     if (error) console.log("Error:YearlyDataFetcher: ", error)
                    //     else {
                    //         this.setState({ yearlyData: data.payload }, () => {
                    //             this.fetchAnomalyData()
                    //             callback()
                    //         })
                    //     }
                    // })
                } else console.log("Anomaly Create: ERROR: ", error)
            })
        } else {
            alert("Please required input!")
        }
    }

    handleAnomalyTimeClicked = value => {
        const areaChart = this.singleAreaChartRef.current
        const startTs = moment.tz(value.startDate, "Europe/Lisbon").unix() * 1000
        const endTs = moment.tz(value.endDate, "Europe/Lisbon").unix() * 1000

        const { anomalyDataByEquipment : anomalyDataByEquipment1 } = this.state
        const anomalyDataByEquipment = Object.keys(anomalyDataByEquipment1).reduce((r, c) => {
            const R = { ...r }
            const data = anomalyDataByEquipment1[c].map(v => v.id === value.id ? { ...v, selected: true } : { ...v, selected: false })
            R[c] = data
            return R
        }, {})
        const graphShowData = value.additionalGraphs.map(v => ({ selected: true, name: v }))
        const anomalyInputData = {
            faultType: value.faultType,
            severity: value.severity,
            sensorSignal: value.sensorSignal,
        }
        this.setState({
            anomalyDataByEquipment,
            anomalyInputData,
            graphShowData,
        }, () => {
            areaChart.setZoom(startTs, endTs)
            // console.log("click saved")
            // const areaChart = this.singleAreaChartRef.current
            // if(areaChart!==null) {
            //     const startTs = moment.tz(value.startDate, "Europe/Lisbon").unix() * 1000
            //     const endTs = moment.tz(value.endDate, "Europe/Lisbon").unix() * 1000
            areaChart.addSelectedRange({ leftX: areaChart.tsToPixels(startTs), rightX: areaChart.tsToPixels(endTs) })
            //     areaChart.setZoom(startTs, endTs)
            //     // areaChart.addSelectedRange({ leftX: areaChart.tsToPixels(startTs), rightX: areaChart.tsToPixels(endTs) })
            // }
        })
        
        // if(areaChart!==null) {            
            // areaChart.addSelectedRange({ leftX: areaChart.tsToPixels(startTs), rightX: areaChart.tsToPixels(endTs) })
            // areaChart.setZoom(startTs, endTs)
            // areaChart.addSelectedRange({ leftX: areaChart.tsToPixels(startTs), rightX: areaChart.tsToPixels(endTs) })
        // }
    }

    handleFirstTierDateRangeChange = ({ startDate, endDate }) => {
        // alert("Hello")
        this.setState(prev => ({ 
            showLoading: true,
            firstTierStartDate: startDate!==undefined ? startDate : prev.firstTierStartDate ,
            firstTierEndDate: endDate!==undefined ? endDate : prev.firstTierEndDate
        }), () => {
            // alert(JSON.stringify({ start: this.state.firstTierStartDate, end: this.state.firstTierEndDate }, null, 2))
            // if(this.singleAreaChartRef.current!==null) {
            //     const areaChart = this.singleAreaChartRef.current
            //     // areaChart.chartRef.current.chart.destroy()
            //     console.log("const areaChart = this.singleAreaChartRef.current", this.singleAreaChartRef.current.chartRef.current.chart)
            // }
            const singlerAreaChart = this.singleAreaChartRef.current
            if(singlerAreaChart!==null) singlerAreaChart.setLoading(true)
            this.readDataFromApi()
        //     DataFetcher((error, data) => {
        //         if (error) console.log("Error:DataFetcher: ", error)
        //         else {
        //             const data0 = data.payload.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.efficiency])
        //             const data1 = data.payload.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaInput])
        //             const data2 = data.payload.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaOutput])
        //             this.setState({ data: data.payload, data0, data1, data2 /*.filter((v,i)=> i<200)*/ }, () => {
        //                 this.fetchAnomalyData()
        //                 const singlerAreaChart = this.singleAreaChartRef.current
        //                     if(singlerAreaChart!==null) singlerAreaChart.setLoading(false)
        //             })
        //         }
        //     }, { startDate: this.state.firstTierStartDate, endDate: this.state.firstTierEndDate })
        })

    }

    render() {
        const { 
            showLoading,
            yearlyData, data, data0, data1, data2, firstTierStartDate, firstTierEndDate,
            graphShowData, 
            anomalyInputData, 
            anomalyDataByTime, 
            anomalyDataByEquipment, 
            dimensions} = this.state;
        // const data0 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.efficiency])
        // const data1 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaInput])
        // const data2 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaOutput])
 
        const minorChartData = [data1, data2]
          
        return (
            <div className="" style={{ overflow: 'auto' }}>
                <Loading show={showLoading} />
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

                            <div className="py-2 col-lg-12 col-12 " style={{ width: window.innerWidth<=1200 ? window.innerWidth : window.innerWidth-350 }}>
                                {this.state.isTripleSquareState&&(
                                    <Fragment>
                                       <div className='p-1' >
                                            <div className=" bg-white rounded p-4"> 
                                                <AnormalyControlPanel handleZoomIn={this.handleZoomIn} handleZoomOut={this.handleZoomOut} />
                                                    <div className="p-2 bg-white rounded">
                                                    {yearlyData!==null && <TestComponent firstTierDate={{ startDate: firstTierStartDate, endDate: firstTierEndDate }} handleFirstTierDateRangeChange={this.handleFirstTierDateRangeChange} yearlyData={yearlyData}  />}
                                                    </div>
                                                    {
                                                        // data.length > 0 ?
                                                            <SingleAreaChart  anomalyDataByTime={anomalyDataByTime} ref={this.singleAreaChartRef} data={data0} />
                                                            // <MultiAreaChart data1={data0} data2={data2} />
                                                            // : <div className="p-4 text-secondary text-center">Please select a date range from the top graph.</div>
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
                                        <div className=" bg-white rounded p-4" >
                                            <AnormalyControlPanel handleZoomIn={this.handleZoomIn} handleZoomOut={this.handleZoomOut} />
                                            <div className="py-2 bg-white rounded">
                                                {yearlyData!==null && <TestComponent firstTierDate={{ startDate: firstTierStartDate, endDate: firstTierEndDate }} handleFirstTierDateRangeChange={this.handleFirstTierDateRangeChange} yearlyData={yearlyData}  />}
                                            </div>
                                            {
                                                // data.length > 0 ?
                                                    <SingleAreaChart anomalyDataByTime={anomalyDataByTime} ref={this.singleAreaChartRef} data={data0} />
                                                    // <MultiAreaChart data1={data0} data2={data2} />
                                                    // : <div className="p-4 text-secondary text-center">Please select a date range from the top graph.</div>
                                            }
                                        </div>
                                        {
                                            graphShowData.map((v, i) =>
                                                <div key={i} className="pt-2 ">
                                                    {v.selected &&
                                                        <div className="p-4 bg-white rounded" >
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
                                                    {yearlyData!==null && <TestComponent firstTierDate={{ startDate: firstTierStartDate, endDate: firstTierEndDate }} handleFirstTierDateRangeChange={this.handleFirstTierDateRangeChange} yearlyData={yearlyData}  />}
                                                </div>
                                                {
                                                    // data.length > 0 ?
                                                        <SingleAreaChart anomalyDataByTime={anomalyDataByTime} ref={this.singleAreaChartRef} data={data0} />
                                                        //  <MultiAreaChart data1={data0} data2={data2} /> 
                                                        // : <div className="p-4 text-secondary text-center">Please select a date range from the top graph.</div>
                                                }
                                            </div>
                                            <div className='col pl-2'>
                                                {
                                                    graphShowData.map((v, i) =>
                                                        <div key={i} className="pb-2 col-lg-12 col-12 justify-content-center pl-2 p-0">
                                                            {v.selected &&
                                                                <div className="bg-white rounded p-5" >
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
                                      <div className="col bg-white rounded p-4" >
                                                <AnormalyControlPanel handleZoomIn={this.handleMultiZoomIn} handleZoomOut={this.handleMultiZoomOut} />
                                                <div className="p-2 bg-white rounded">
                                                    {yearlyData!==null && <TestComponent firstTierDate={{ startDate: firstTierStartDate, endDate: firstTierEndDate }} handleFirstTierDateRangeChange={this.handleFirstTierDateRangeChange} yearlyData={yearlyData}  />}
                                                </div>
                                                {
                                                    // data.length > 0 ?
                                                        // <SingleAreaChart anomalyDataByTime={anomalyDataByTime} ref={this.singleAreaChartRef} data={data0} />
                                                        <MultiAreaChart ref={this.multiAreaChartRef} data1={data0} data2={data2} /> 
                                                        // : <div className="p-4 text-secondary text-center">Please select a date range from the top graph.</div>
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
    const [disabled,setDisabled]=useState(false)
    const [Open,setOpen]=useState(false)
        return (
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='py-0 '>
                    <div className='py-0' >
                        <span className='text-secondary' style={{fontSize:20}}  onClick={()=>{setOpen(!Open)}}>
                            CH-3
                            <i className='fa fa-sort-down px-1' style={{color:'#23c49e'}}></i>
                        </span>
                    </div>
                    {Open?
                    <Draggable disabled={disabled} defaultPosition={{x:-30,y:-80}} bounds={{left:window.innerWidth<=1200?-40:-330,right:window.innerWidth<=1200?window.innerWidth-350 :window.innerWidth-650,top:window.innerWidth<=1200?-130:-130,bottom:window.innerHeight<=1000?  window.innerHeight-70: window.innerHeight-500}}>
                        <div id="dialog" className="col-md-3 shadow rounded bg-white position-absolute py-3 px-0" style={{zIndex:1000,minWidth:250,maxWidth:270}}>
                            <div className='d-flex justify-content-between border border-top-0 border-right-0 border-left-0 pb-3 px-1 text-left'>
                                <div className='px-3'>
                                    Similar Detections
                                </div>
                                <div className='py-1 px-2 rounded' style={{backgroundColor:'#DDF5E9'}} onClick={()=>{setOpen(false);console.log('Open',Open); document.getElementById('dialog').style.display='none'}}>
                                    <i className='fa fa-times' style={{color:'#23c49e'}}></i>
                                </div>
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
                </Draggable>  
                :null
                }
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
                        {/* <SampleDropdown label={"Today"} icon={<Icon icon="fa fa-calendar" />}
                            additionalValue={["7 days ", "1 month", "6 month", "1 year"]} /> */}
                    </div>
                </div>
            </div>
        )
    }


// const AnormalyControlPanel = props => {
//     return (
//         <div className='d-flex justify-content-between align-items-center'>
//             <div className=''>
//                 <div className="py-0"></div>
//                 <div className='dropup'>
//                     <div className='btn dropdown-toggle px-1' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                         <span className='text-secondary' style={{ fontSize: 20 }}>CH-3</span>
//                     </div>
//                     <div className='dropdown-menu pt-3 pb-0'>
//                         <div className='px-3 border border-top-0 border-right-0 border-left-0 pb-3 text-left' >
//                             <div>Similar Detections</div>
//                         </div>
//                         <DropdownItem dateTime="29.01.2019 16:00-16:03" percentage="20%" />
//                         <DropdownItem dateTime="29.01.2019 16:00-16:03" percentage="60%" />
//                         <div className='dropdown-item py-2 text-left' style={{ cursor: "pointer" }}>
//                             Suggested Labeling
//                             <div className='d-flex flex-wrap'>
//                                 <div className='py-1'>
//                                     <div className='d-flex flex-row p-2 ' style={{ backgroundColor: '#E9F8F1', borderColor: '#E9F8F1', borderRadius: 10 }}>
//                                         <div className='text-secondary'>
//                                             SEVERITY
//                                         </div>
//                                         <div className='px-2'>
//                                             Low
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className='py-1'>
//                                     <div className='d-flex flex-row p-2  rounded-lg' style={{ backgroundColor: '#E9F8F1', borderColor: '#E9F8F1', borderRadius: 10 }}>
//                                         <div className='text-secondary'>
//                                             SENSOR SIGNAL
//                                         </div>
//                                         <div className='px-2'>
//                                             Plant EMG
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className=''>
//                 <div className='d-flex align-items-center'>
//                     <span onClick={props.multiChartRef? props.handleMultiZoomIn : props.handleZoomIn}>
//                         <Icon icon="fa fa-plus" />
//                     </span>
//                     <span onClick={props.multiChartRef? props.handleMultiZoomOut : props.handleZoomOut}>
//                         <Icon icon="fa fa-minus" />
//                     </span>
//                     <div className='text-secondary'>Zoom</div>
//                     <SampleDropdown label={"Today"} icon={<Icon icon="fa fa-calendar" />}
//                         additionalValue={["7 days ", "1 month", "6 month", "1 year"]} />
//                 </div>
//             </div>
//         </div>
//     )
// }

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
            <div className="btn btn-sm px-1 py-0" style={{ backgroundColor: '#DDF5E9', cursor: "pointer" }}>
                <i className={icon} style={{ color: '#23c49e' }}></i>
            </div>
        </div>
    )
}
