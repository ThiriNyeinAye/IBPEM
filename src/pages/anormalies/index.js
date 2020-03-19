import React, { Component, useState, useRef, useEffect, Fragment } from "react"
import { format, getUnixTime,fromUnixTime } from 'date-fns'
import { zonedTimeToUtc } from "date-fns-tz"
import Draggable from 'react-draggable'

import SingleAreaChart from "../../components/graphs/SingleAreaChart.js"
import AnormalySidebar from "../../components/app/AnormalySidebar.js"
import DropdownContainerAnormaly from "./DropdownContainerAnormaly.js"
import SimpleSingleAreaChart from "../../components/graphs/SimpleSingleAreaChart.js"
import DialogNewAnormaly from "./DialogNewAnormaly.js";

import { withLStorage } from "../../components/hoc.js"

import FirstTierGraph from "./FirstTierGraph.js"
import queryString from  "querystring"

const HOST = {
    local: "http://192.168.100.7:3003",
    test: "https://ibpem.com/api",
    // test: "http://206.189.80.23:3003",
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
            data0: [],
            data1: [],
            data2: [],
            anomalyDataByTime: [],
            anomalyDataByEquipmentOriginal: {},
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
            firstTierStartDate: "2020-02-18",
            firstTierEndDate: "2020-02-25",
            changeView:3,
            selected:3
        }
        this.singleAreaChartRef = React.createRef()
        this.sidebarRef = React.createRef()
    }

    removeSelectedAnomaly = () => {
        this.setState({
            anomalyInputData: {
                faultType: [],
                severity: [],
                sensorSignal: [],
            },
            graphShowData: [],
        })
    }

    toggle = view =>{
        if(this.state.changeView!== view){
            this.setState({
                ...this.state,
                changeView:view,
                selected: view
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
    }

    readDataFromApi = () => {
        YearlyDataFetcher((error, data) => {
            if (error) console.log("Error:YearlyDataFetcher: ", error)
            else {
                this.setState({ yearlyData: data.payload }, )
            }
        })
        this.fetchAnomalyData()
        DataFetcher((error, data) => {
            if (error) console.log("Error:DataFetcher: ", error)
            else {
                const { data0, data1, data2 } = data.payload.reduce((r, v) => {
                    const R = {...r}
                    R.data0.push([getUnixTime(zonedTimeToUtc(v.ts, "Europe/Lisbon")) * 1000, v.efficiency])
                    R.data1.push([getUnixTime(zonedTimeToUtc(v.ts, "Europe/Lisbon")) * 1000, v.evaInput])
                    R.data2.push([getUnixTime(zonedTimeToUtc(v.ts, "Europe/Lisbon")) * 1000, v.evaOutput])
                    return R
                }, { data0: [], data1: [], data2: [] })
            
                this.setState({ data0, data1, data2 }, () => {
                    this.showLoading(false)
                    const singlerAreaChart = this.singleAreaChartRef.current
                    if(singlerAreaChart!==null) singlerAreaChart.setLoading(false)
                })
            }
        }, { startDate: this.state.firstTierStartDate, endDate: this.state.firstTierEndDate })
        
    }

    showLoading = show => {
        document.getElementById("loadingDivId").style.display = show ? "block" : "none"
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
                        date: `${format(new Date(c.startDate), 'do MMM, yy')} ~ ${format(new Date(c.endDate), 'do MMM, yy')}`,
                        time: `${format(new Date(c.startDate), 'HH:mm')} ~ ${format(new Date(c.endDate), 'HH:mm')}`,
                        startTs: getUnixTime(zonedTimeToUtc(c.startDate, "Europe/Lisbon")) * 1000,
                        endTs: getUnixTime(zonedTimeToUtc(c.endDate, "Europe/Lisbon")) * 1000
                    }
                    if (R[c.deviceType] === undefined) R[c.deviceType] = [value]
                    else R[c.deviceType].push(value)
                    return R
                }, {})
                this.setState({
                    anomalyDataByTime: data.payload,
                    anomalyDataByEquipment,
                    anomalyDataByEquipmentOriginal: {...anomalyDataByEquipment},
                }, () => {
                    const areaChart = this.singleAreaChartRef.current
                    if (areaChart !== null) {
                        areaChart.removeSelectedArea()
                    }
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
    
    handleZoomIn = () => {
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
                if(this.state.temp > 0) {
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
        const offsetLeftRight = areaChart.readSelectedAreaValues()

        if (areaChart !== null && offsetLeftRight !== null) {
            const anomalyData = {
                user: byUser,
                deviceType: "Chiller 3",
                deviceId: "CH3",
                anomalyState: 1,
                faultType: anomalyInputData.faultType,
                severity: anomalyInputData.severity,
                sensorSignal: anomalyInputData.sensorSignal,
                startDate :  format(fromUnixTime(offsetLeftRight.startTs / 1000), "yyyy-MM-dd HH:mm:ss",  'Europe/Berlin' ),
                endDate :  format(fromUnixTime(offsetLeftRight.endTs / 1000), "yyyy-MM-dd HH:mm:ss",  'Europe/Berlin' ),
                additionalGraphs: graphShowData.filter(v => v.selected).map(v => v.name),
                remark: message,
            }

            return CreateAnomalyData(anomalyData, (error, data) => {
                if (error === null) {
                    this.readDataFromApi()
                    callback()
                } else console.log("Anomaly Create: ERROR: ", error)
            })
        } else {
            alert("Please required input!")
        }
    }

    handleAnomalyTimeClicked = value => {
        
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
        const areaChart = this.singleAreaChartRef.current
        const startTs = getUnixTime(zonedTimeToUtc(value.startDate, "Europe/Lisbon")) * 1000
        const endTs = getUnixTime(zonedTimeToUtc(value.endDate, "Europe/Lisbon")) * 1000

        areaChart.setZoom(startTs, endTs)
        areaChart.createSelecedArea({ startTs, endTs, history: value })

        return this.setState({
            anomalyDataByEquipment,
            anomalyInputData,
            graphShowData,
        })
    }

    handleFirstTierDateRangeChange = ({ startDate, endDate }) => {
        this.showLoading(true)
        this.setState(prev => ({ 
            firstTierStartDate: startDate!==undefined ? startDate : prev.firstTierStartDate ,
            firstTierEndDate: endDate!==undefined ? endDate : prev.firstTierEndDate
        }), () => {
            const singlerAreaChart = this.singleAreaChartRef.current
            if(singlerAreaChart!==null) singlerAreaChart.setLoading(true)
            this.readDataFromApi()
        })

    }
    
    handleFilterAnomalyData = (startDate, endDate) =>{
        const selectedAnomaly = Object.keys(this.state.anomalyDataByEquipment).reduce((r, d) => {
            if(r!==null) return r
            else {
                const i = this.state.anomalyDataByEquipment[d].findIndex(v => v.selected)
                if(i!==-1) return this.state.anomalyDataByEquipment[d][i]
                else return r
            }
        }, null)
        // new Added by @nayhtet
        const anomalyDataByEquipmentFiltered = Object.keys(this.state.anomalyDataByEquipmentOriginal).reduce((r, device) => {
            const R = {...r}
            const filteredData = this.state.anomalyDataByEquipmentOriginal[device]
                .filter(v => v.startTs>=startDate && v.endTs<=endDate)
                .map(v => (selectedAnomaly!==null && v.id===selectedAnomaly.id) ? ({ ...v, selected: true }) : v)
            
            R[device] = filteredData
            return R
        }, {})
        if(selectedAnomaly===null) {
            const singlerAreaChart = this.singleAreaChartRef.current
            if(singlerAreaChart!==null) singlerAreaChart.removeSelectedArea()
        }
        this.setState({anomalyDataByEquipment: anomalyDataByEquipmentFiltered})
    }

    render() {
        const { 
            yearlyData, data0, data1, data2, firstTierStartDate, firstTierEndDate,
            graphShowData, 
            anomalyInputData, 
            anomalyDataByTime, 
            anomalyDataByEquipment
        } = this.state;
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
                            handleAnomalyTimeClicked={this.handleAnomalyTimeClicked}
                        />
                    </div>

                    <DialogNewAnormaly onSubmitAnomaly={this.onSubmitAnomaly} />
                    
                    <div id="anomalyDivContainer" className="container-fluid ">
                        <div className="row ">
                            <div className="py-2 col-lg-12 col-12">
                            <DropdownContainerAnormaly
                                    handleGraphDataChart={this.handleGraphDataChart}
                                    anomalyInputData={anomalyInputData}
                                    onAnormalyInputChanged={this.onAnormalyInputChanged}
                                    toggle={this.toggle}
                                    changeView={this.state.changeView}
                                    selected={this.state.selected}
                                />
                            </div>

                            <div className="py-2 col-lg-12 col-12 " style={{ width: window.innerWidth<=1200 ? window.innerWidth : window.innerWidth-350 }}>
                                <div className='p-1'>
                                    <div className='bg-white rounded p-4'>
                                        <AnormalyControlPanel handleZoomIn={this.handleZoomIn} handleZoomOut={this.handleZoomOut} />
                                        <div className='p-2 bg-white rounded'>
                                            {yearlyData!==null && <FirstTierGraph  firstTierDate={{ startDate: firstTierStartDate, endDate: firstTierEndDate }} handleFirstTierDateRangeChange={this.handleFirstTierDateRangeChange} yearlyData={yearlyData}  />}
                                        </div>
                                        {(this.state.changeView===1 || this.state.changeView===2 || this.state.changeView===3) && (
                                            <SingleAreaChart 
                                                removeSelectedAnomaly={this.removeSelectedAnomaly} 
                                                anomalyDataByTime={anomalyDataByTime} 
                                                ref={this.singleAreaChartRef} 
                                                data={data0} 
                                                datum={this.state.changeView===2 ? [ data0, data2 ] : []} 
                                                handleFilterAnomalyData={this.handleFilterAnomalyData} />
                                          
                                       )}
                                    </div>
                                </div>       
                                 {this.state.changeView===1&&(
                                  <Fragment>
                                      <div className='d-flex flex-wrap' >
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
                                  {this.state.changeView===3&&(
                                      <Fragment>
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
                <div className='py-0 ' style={{cursor:'pointer'}}>
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
                        <span onClick={props.handleZoomIn}>
                            <Icon icon="fa fa-plus" />
                        </span>
                        <span onClick={props.handleZoomOut}>
                            <Icon icon="fa fa-minus" />
                        </span>
                        <div className='text-secondary'>Zoom</div>
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
            <div className="btn btn-sm px-1 py-0" style={{ backgroundColor: '#DDF5E9', cursor: "pointer" }}>
                <i className={icon} style={{ color: '#23c49e' }}></i>
            </div>
        </div>
    )
}
