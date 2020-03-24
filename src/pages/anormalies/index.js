import React, { Component, useState, useRef, useEffect, Fragment } from "react"
import { format, getUnixTime,fromUnixTime, isBefore, isEqual } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz"
import Draggable from 'react-draggable'

import SingleAreaChart from "../../components/graphs/SingleAreaChart.js"
import AnormalySidebar from "../../components/app/AnormalySidebar.js"
import DropdownContainerAnormaly from "./DropdownContainerAnormaly.js"
import SimpleSingleAreaChart from "../../components/graphs/SimpleSingleAreaChart.js"
import DialogNewAnormaly from "./DialogNewAnormaly.js";

import { withLStorage } from "../../components/hoc.js"
import { withRouter } from "react-router-dom"

import FirstTierGraph from "./FirstTierGraph.js"
import queryString from  "query-string"
import routeTo from "../../helper/routeTo.js"
import { routeName } from "../../routes"

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
const UpdateAnormalyData = (anomalyData, callback) => {
    
    // const queryParamString=queryString.stringify(queryParams)
        return fetch(`${HOST.test}/anomalies/${anomalyData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(anomalyData)
        }) 
            .then(res => res.json())
            .then(anomalyData => callback(null, anomalyData))
            .catch(error => callback(error, null))
            // fc216f10-6cc8-11ea-8c24-bff5fefca19b
           
    
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
            anomalyInputData: {
                faultType: [],
                severity: [],
                sensorSignal: [],
            },
            graphShowData: [{ name: "Input Temperature", selected: false }, { name: "Output Temperature", selected: false }],
            dimensions: null,
            yearlyData: null,
            firstTierStartDate: "2020-02-18",
            firstTierEndDate: "2020-02-25",
            changeView: 1,
            // anomalyData:[],
            showCancelBtn:false
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
            graphShowData: [{ name: "Input Temperature", selected: false }, { name: "Output Temperature", selected: false }],
        })
    }

    toggle = view =>{
        if(this.state.changeView!== view){
            this.setState({
                ...this.state,
                changeView:view,
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
        // console.log("chart: ", singlerAreaChart)

        YearlyDataFetcher((error, data) => {
            if (error) console.log("Error:YearlyDataFetcher: ", error)
            else {
                const anoData = queryString.parse(this.props.history.location.search)
                if(anoData.aid) {
                    const sd = format(new Date(anoData.sd), "yyyy-MM-dd")
                    const ed = format(new Date(anoData.ed), "yyyy-MM-dd")
                    const firstTierDate = data.payload.reduce( (rd, yd) => {
                        const R = {...rd}
                        if(R.firstTierStartDate===null && R.firstTierEndDate===null) {
                            const index = yd.data.findIndex(v => {
                                return (
                                    (isEqual(new Date(v.startDate), new Date(sd)) || isBefore(new Date(v.startDate), new Date(sd))) &&
                                    (isEqual(new Date(v.endDate), new Date(ed)) || isBefore(new Date(ed), new Date(v.endDate)))
                                )
                            })
                            if(index!==-1) {
                                R.firstTierStartDate = yd.data[index].startDate
                                R.firstTierEndDate = yd.data[index].endDate
                            }
                        }
                        return R
                    }, { firstTierStartDate: null, firstTierEndDate: null } )

                    this.setState({ yearlyData: data.payload, ...firstTierDate }, () => {
                        this.readDataFromApi()  
                    })
                } else if(anoData.fsd && anoData.fed) {
                    this.setState({ yearlyData: data.payload, firstTierStartDate: anoData.fsd, firstTierEndDate: anoData.fed }, () => {
                        this.readDataFromApi()  
                    })
                } else {
                    this.setState({ yearlyData: data.payload }, () => {
                        this.readDataFromApi()  
                    }) 
                } 
            }
        }) 
        this.readDataFromApi()  

    }

    readDataFromApi = () => {
        // YearlyDataFetcher((error, data) => {
        //     if (error) console.log("Error:YearlyDataFetcher: ", error)
        //     else {
        //         this.setState({ yearlyData: data.payload }, () => {
                    
        //         }) 
        //     }
        // })

        this.fetchAnomalyData()
        DataFetcher((error, data) => {
            if (error) console.log("Error:DataFetcher: ", error)
            else {
                const { data0, data1, data2 } = data.payload.reduce((r, v) => {
                    const R = {...r}
                    R.data0.push([getUnixTime(zonedTimeToUtc(v.ts, "Asia/Singapore")) * 1000, v.efficiency])
                    R.data1.push([getUnixTime(zonedTimeToUtc(v.ts, "Asia/Singapore")) * 1000, v.evaInput])
                    R.data2.push([getUnixTime(zonedTimeToUtc(v.ts, "Asia/Singapore")) * 1000, v.evaOutput])
                    return R
                }, { data0: [], data1: [], data2: [] })
                
                const singlerAreaChart = this.singleAreaChartRef.current

                // console.log("CHARTTTTTT: : ", singlerAreaChart.chartRef.current.chart.series, "\n DDD: ", Object.keys(singlerAreaChart.chartRef.current.chart))

                if(singlerAreaChart.chartRef.current.chart!==null) {
                    
                    this.setState({ data0, data1, data2 }, () => {
                        this.showLoading(false)
                        if(singlerAreaChart.chartRef.current.chart!==null){ // create anomaly coming from history page
                            singlerAreaChart.setLoading(false)  
                        }
                        
                        // read data from History page
                        const anoData = queryString.parse(this.props.history.location.search)
                        // console.log("CHARTTTTTT: : ", singlerAreaChart.chartRef.current, "\nRouter: ", this.props, "\nAno: ", anoData, "\nBoolean: ", window.location.search.length>0)
                        if(anoData.aid && window.location.search.length>0) {
                            setTimeout(() => {
                                const anomalyValue = Object.values(this.state.anomalyDataByEquipment).reduce( (r,c) => {
                                    let R = {...r}
                                    if(r===null) {
                                        const i = c.findIndex( v=> v.id===anoData.aid)
                                        if(i!==-1) R = {...c[i]}
                                    }
                                    return R
                                }, null)
                                
                                this.handleAnomalyTimeClicked(anomalyValue, true)
                            }, 1000)
                        }
                    })
                }
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
                        // startTs: getUnixTime(zonedTimeToUtc(c.startDate, "Asia/Singapore")) * 1000,
                        // endTs: getUnixTime(zonedTimeToUtc(c.endDate, "Asia/Singapore")) * 1000
                        startTs: getUnixTime(new Date(c.startDate)) * 1000,
                        endTs: getUnixTime(new Date(c.endDate)) * 1000
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
                    // console.log("Area: ", areaChart.chartRef.current.chart)
                    if (areaChart !== null) {
                        areaChart.removeSelectedArea() //TODO::
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
            this.setState({ 
                anomalyInputData,
                showCancelBtn:true 
            })
        }
    }
    cancelAnomaly=()=>{
        const selectedAnomalData = Object.keys(this.state.anomalyDataByEquipment).reduce((r,d) => {
            if(r !== null) return r
            else {
                const i = this.state.anomalyDataByEquipment[d].findIndex(v => v.selected)
                if(i!==-1) return this.state.anomalyDataByEquipment[d][i]
                else return r
            }
        }, null)
        
        this.setState({
            showCancelBtn:false,
            anomalyInputData: {
                faultType: selectedAnomalData.faultType,
                severity: selectedAnomalData.severity,
                sensorSignal: selectedAnomalData.sensorSignal,
               
            }
        })

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
                const minMax = this.singleAreaChartRef.current.setZoomIn(chart)
                return this.handleFilterAnomalyData(minMax.min, minMax.max)
            }
        }
    }
    handleZoomOut = () => {
        const areaChart = this.singleAreaChartRef.current
        if (areaChart !== null) {
            if (areaChart.chartRef.current !== null) {
                const chart = areaChart.chartRef.current.chart
                if(this.state.temp > 0) {
                    const minMax = this.singleAreaChartRef.current.setZoomOut(chart)
                    this.handleFilterAnomalyData(minMax.min, minMax.max)
                    this.setState({temp: this.state.temp-1})
                }                
            }
        }
    }

    onSubmitAnomaly = (message, byUser, callback = () =>null) => {
        const { anomalyInputData, graphShowData } = this.state

        const areaChart = this.singleAreaChartRef.current
        const offsetLeftRight = areaChart.readSelectedAreaValues()

        const inputValid = anomalyInputData.faultType && anomalyInputData.faultType.length>0 
            && anomalyInputData.severity && anomalyInputData.severity.length>0 
            && anomalyInputData.sensorSignal && anomalyInputData.sensorSignal.length>0 
            && message && message.length>0
            && byUser && byUser.length>0
        const selectedAnomalData = Object.keys(this.state.anomalyDataByEquipment).reduce((r,d) => {
            if(r !== null) return r
            else {
                const i = this.state.anomalyDataByEquipment[d].findIndex(v => v.selected)
                if(i!==-1) return this.state.anomalyDataByEquipment[d][i]
                else return r
            }
        }, null)
    
        if (areaChart !== null && offsetLeftRight !== null && inputValid && selectedAnomalData===null) {
            const anomalyData = {
                user: byUser,
                deviceType: "Chiller 3",
                deviceId: "CH3",
                anomalyState: 1,
                faultType: anomalyInputData.faultType,
                severity: anomalyInputData.severity,
                sensorSignal: anomalyInputData.sensorSignal,
                startDate :  format(utcToZonedTime(fromUnixTime(offsetLeftRight.startTs / 1000), "Asia/Singapore"), "yyyy-MM-dd HH:mm:ss" ),//format(fromUnixTime(offsetLeftRight.startTs / 1000), "yyyy-MM-dd HH:mm:ss",  'Asia/Singapore' ),
                endDate :  format(utcToZonedTime(fromUnixTime(offsetLeftRight.endTs / 1000), "Asia/Singapore"), "yyyy-MM-dd HH:mm:ss" ),//format(fromUnixTime(offsetLeftRight.endTs / 1000), "yyyy-MM-dd HH:mm:ss",  'Asia/Singapore' ),
                additionalGraphs: graphShowData.filter(v => v.selected).map(v => v.name),
                remark: message,
            }
            
            return CreateAnomalyData(anomalyData, (error, data) => {
                if (error === null) {
                    return window.location.reload()
                } else console.log("Anomaly Create: ERROR: ", error)
            })
        } else if(areaChart !== null && offsetLeftRight !== null && inputValid && selectedAnomalData!==null && selectedAnomalData.selected===true){
            const id=selectedAnomalData.id;
            const anomalyData = {
             id:id,
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
             createdTs: anomalyInputData.createdTs,
             building: "star vista"
         }
         
         return UpdateAnormalyData(anomalyData,(error,data)=>{
            if (error === null) {
                return window.location.reload()
            } else console.log("Anomaly Create: ERROR: ", error)
         })
        }
        else {
            alert("Please required input!")
        }
    }

    
    handleAnomalyTimeClicked = (value, fromHistory) => {
        
        if(Object.keys(value).length===0) {
            routeTo.anomalies(this.props)
            return window.location.reload()
        }
        if(!fromHistory) {
            routeTo.anomalies({history: this.props.history},{ aid: value.id, sd: value.startDate, ed: value.endDate })
        }
        const { anomalyDataByEquipmentOriginal } = this.state
        const anomalyDataByEquipment = Object.keys(anomalyDataByEquipmentOriginal).reduce((r, c) => {
            const R = { ...r }
            const data = anomalyDataByEquipmentOriginal[c].map(v => v.id === value.id ? { ...v, selected: true } : { ...v, selected: false })
            R[c] = data            
            return R
        }, {})
        const graphShowData = this.state.graphShowData.map(v1 => {
                if(!value.additionalGraphs) return ({ ...v1, selected: false })
                else return value.additionalGraphs.findIndex(n => n===v1.name)!==-1 ? ({ ...v1, selected: true }) : ({ ...v1, selected: false })
        })
        const anomalyInputData = {
            faultType: value.faultType,
            severity: value.severity,
            sensorSignal: value.sensorSignal,
        }
        const areaChart = this.singleAreaChartRef.current
        const startTs = getUnixTime(zonedTimeToUtc(value.startDate, "Asia/Singapore")) * 1000
        const endTs = getUnixTime(zonedTimeToUtc(value.endDate, "Asia/Singapore")) * 1000

        let minMax = {}
        if(areaChart!==null) {
            minMax = areaChart.setZoom(startTs, endTs)
            areaChart.createSelecedArea({ startTs, endTs, anoHistory: value })
        } else {
            // console.log(areaChart)
        }

        return this.setState({
            anomalyDataByEquipment,
            anomalyInputData,
            graphShowData,
        }, () => {
            this.handleFilterAnomalyData(minMax.min, minMax.max)
        })
    }

    handleFirstTierDateRangeChange = ({ startDate, endDate }) => {
        routeTo.anomalies(this.props, { fsd: startDate, fed: endDate })
        // console.log(this.props)
        // this.props.location.reload()
        return window.location.reload()
        /*const singlerAreaChart = this.singleAreaChartRef.current
        
        this.showLoading(true)
        
        this.setState(prev => ({ 
            firstTierStartDate: startDate!==undefined ? startDate : prev.firstTierStartDate ,
            firstTierEndDate: endDate!==undefined ? endDate : prev.firstTierEndDate
        }), () => {
            if(singlerAreaChart!==null) {
                // singlerAreaChart.setLoading(true)
                // singlerAreaChart.removeSelectedArea()
                // window.history.pushState({}, document.title, routeName.routeAnormalies); 
                this.readDataFromApi()
            }                     
        })
        */
    }
    
    handleFilterAnomalyData = (startDate, endDate) => {
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
                .map(v => (selectedAnomaly!==null && v.id===selectedAnomaly.id) ? ({ ...v, selected: true }) : ({ ...v, selected: false }))
            
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
        const anoData = queryString.parse(this.props.history.location.search)
        const startTs = anoData.aid ? getUnixTime(zonedTimeToUtc(anoData.sd, "Asia/Singapore")) * 1000 : undefined
        const endTs = anoData.aid ? getUnixTime(zonedTimeToUtc(anoData.ed, "Asia/Singapore")) * 1000 : undefined
        // console.log("this.props.history:", this.props.history)
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
                                selected={this.state.changeView}
                                graphShowData={this.state.graphShowData}
                                cancelAnomaly={this.cancelAnomaly}
                                showCancelBtn={this.state.showCancelBtn}
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
                                                handleFilterAnomalyData={this.handleFilterAnomalyData} 
                                                // selectedStartTs={startTs}
                                                // selectedEndTs={endTs}
                                                // historyNaviation={{...this.props.history}}
                                            />
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
export default withRouter(withLStorage(Anormalies))

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
                                <div className='py-1 px-2 rounded' style={{backgroundColor:'#DDF5E9'}} onClick={()=>{setOpen(false); document.getElementById('dialog').style.display='none'}}>
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
