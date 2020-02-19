import React, { Component, useState, useRef, useEffect } from "react"
import moment from "moment-timezone"

import SingleAreaChart from "../../components/graphs/SingleAreaChart.js"
import MultiAreaChart from "../../components/graphs/MultiAreaChart.js"
import AnormalySidebar from "../../components/app/AnormalySidebar.js"
import DropdownContainerAnormaly from "./DropdownContainerAnormaly.js"
import SimpleSingleAreaChart from "../../components/graphs/SimpleSingleAreaChart.js"
import * as Navbar from "../../components/app/Navbar.js"
import DialogNewAnormaly from "./DialogNewAnormaly.js";
import { SampleDropdown } from '../../components/app/DropDown'

const HOST = {
    local: "http://192.168.100.7:3003",
    test: "https://ibpem.com/api",
    maythu: "http://192.168.100.27:3003"
}

const DataFetcher = (callback) => {
    return fetch(`${HOST.maythu}/dummy-data`)
        .then(res => res.json())
        .then(data => callback(data.error, data))
        .catch(error => callback(error, null))
}

const CreateAnomalyData = (data, callback) => {
    // console.log("data: ", data)
    return fetch(`${HOST.maythu}/anomalies`, { 
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
    return fetch(`${HOST.maythu}/anomalies`)
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
            anomalyInputData: {
                faultType: [],
                severity: [],
                sensorSignal: [],
            },
            graphShowData: []
        }
        this.singleAreaChartRef = React.createRef()
    }

    componentDidMount() {
        DataFetcher((error, data) => {
            if (error) console.log("Error: ", error)
            else {
                this.setState({ data: data.payload/*.filter((v,i)=> i<200)*/ }, () => {
                    return this.fetchAnomalyData()
                })
            }
        })
    }

    fetchAnomalyData = () => {
        return ReadAnomalyData((error, data) => {
            if(error===null && data.payload!==null) {
                // const tmp = {...this.state.anomalyDataByEquipment}
                const anomalyDataByEquipment = data.payload.reduce((r,c) => {
                    const R = {...r}
                    const value = {
                        ...c,
                        selected: false, 
                        date: moment(c.startDate).format("MMM Do YY"),
                        time: `${moment(c.startDate).format("HH:mm:ss")}-${moment(c.endDate).format("HH:mm:ss")}`
                    }
                    // if(tmp[c.deviceType]!==null && tmp[c.deviceType]!==undefined) {
                    //     if(tmp[c.deviceType].findIndex(v => v.id===value.id && v.selected)!==-1) 
                    //         value.selected = true;
                    // }
                    if(R[c.deviceType]===undefined) R[c.deviceType] = [value]
                    else R[c.deviceType].push(value)
                    return R
                }, {})
                this.setState({ 
                    anomalyDataByTime: data.payload,
                    anomalyDataByEquipment
                }, () => {
                    const areaChart = this.singleAreaChartRef.current
                    if(areaChart!==null) {
                        areaChart.removeSelectedRange()
                    }
                })
            } else {
                console.log("Error:123: ", error)
            }
        })
    }

    onAnormalyInputChanged = (value, dataType) => {
        const anomalyInputData = {...this.state.anomalyInputData}
        if(anomalyInputData[dataType].findIndex(v=>v===value)>-1) {
            anomalyInputData[dataType] = anomalyInputData[dataType].filter(v => v!==value)
            this.setState({ anomalyInputData })
        } else if(value.trim()!=="") {
            anomalyInputData[dataType] = [value]
            this.setState({ anomalyInputData })
        }
    }

    handleGraphDataChart = (g) => {
        this.setState({ graphShowData: g })
    }
    //Charts
    handleZoomIn = () => {
        // console.log("singleAreaChartRef: ", this.singleAreaChartRef)
        const areaChart = this.singleAreaChartRef.current
        if(areaChart!==null) {
            if(areaChart.chartRef.current!==null) {
                const chart = areaChart.chartRef.current.chart
                this.singleAreaChartRef.current.setZoomIn(chart)
            }
        }
    }
    handleZoomOut = () => {
        const areaChart = this.singleAreaChartRef.current
        if(areaChart!==null) {
            if(areaChart.chartRef.current!==null) {
                const chart = areaChart.chartRef.current.chart
                this.singleAreaChartRef.current.setZoomOut(chart)
            }
        }
    }
    //Anomaly Dialog
    onSubmitAnomaly = (message, byUser, callback=()=>null) => {
        const { anomalyInputData, graphShowData } = this.state

        const areaChart = this.singleAreaChartRef.current
        const leftLine = areaChart.state.leftLine
        const rightLine = areaChart.state.rightLine
        if(areaChart!==null && leftLine!==null && rightLine!==null) {
            const anomalyData = {
                user: byUser,
                deviceType: "Chiller 3",
                deviceId: "CH3",
                anomalyState: 1,
                faultType: anomalyInputData.faultType,
                severity: anomalyInputData.severity,
                sensorSignal: anomalyInputData.sensorSignal,
                startDate: moment.unix(leftLine.xValue/1000).tz("Europe/Lisbon").format("YYYY-MM-DD HH:mm:ss"),
                endDate: moment.unix(rightLine.xValue/1000).tz("Europe/Lisbon").format("YYYY-MM-DD HH:mm:ss"),
                additionalGraphs: graphShowData.filter(v=>v.selected).map(v => v.name),
                remark: message,
            }

            return CreateAnomalyData(anomalyData, (error, data) => {
                if(error===null) {
                    this.fetchAnomalyData()
                    callback()
                } else console.log("Anomaly Create: ERROR: ", error)
            })
        } else {
            alert("Please required input!")
        }
    }

    handleAnomalyTimeClicked = value => {
        const anomalyDataByEquipment1 = {...this.state.anomalyDataByEquipment}
        const anomalyDataByEquipment = Object.keys(anomalyDataByEquipment1).reduce((r,c) => {
            const R = {...r}
            const data = anomalyDataByEquipment1[c].map( v => v.id===value.id ? {...v, selected: true } : {...v, selected: false })
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
            graphShowData: value.additionalGraphs.map(v => ({ selected: true, name: v}))
        }, () => {
            const areaChart = this.singleAreaChartRef.current
            const startTs = moment.tz(value.startDate, "Europe/Lisbon").unix() * 1000
            const endTs = moment.tz(value.endDate, "Europe/Lisbon").unix() * 1000
            areaChart.addSelectedRange({ leftX: areaChart.tsToPixels(startTs), rightX: areaChart.tsToPixels(endTs) })
        })
    }

    render() {
        const { data, graphShowData, anomalyInputData, anomalyDataByTime, anomalyDataByEquipment } = this.state;
        const data0 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.efficiency])
        const data1 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaInput])
        const data2 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaOutput])
        const minorChartData = [data1, data2]

        return (
            <div className="" style={{ overflow: 'hidden' }}>
                <div className="d-flex flex-row flex-wrap flex-md-nowrap" >

                    <div className="d-flex flex-column flex-fill p-2" style={{ minWidth: 300 }}>
                        <AnormalySidebar 
                            anomalyDataByEquipment={anomalyDataByEquipment}
                            handleAnomalyTimeClicked={this.handleAnomalyTimeClicked} />
                    </div>

                    <DialogNewAnormaly onSubmitAnomaly={this.onSubmitAnomaly}  />

                    <div className="container-fluid ">
                        <div className="row ">
                            <div className="col-lg-12 py-4">
                                <Navbar.ItemNavbar />
                            </div>
                            <div className="py-2 col-lg-12 col-12">
                                <DropdownContainerAnormaly 
                                    handleGraphDataChart={this.handleGraphDataChart}
                                    anomalyInputData={anomalyInputData} 
                                    onAnormalyInputChanged={this.onAnormalyInputChanged} />
                            </div>
                            <div className="py-2 col-lg-12 col-12">
                                <div className="bg-white rounded p-4">
                                    <AnormalyControlPanel handleZoomIn={this.handleZoomIn} handleZoomOut={this.handleZoomOut} />
                                </div>
                                <div className="bg-white rounded p-4">
                                    { 
                                        data.length>0 ? 
                                            <SingleAreaChart ref={this.singleAreaChartRef} data={data0} />
                                            /* <MultiAreaChart data1={data0} data2={data2} /> */
                                        : <div className="p-4 text-secondary text-center">Loading...</div>
                                    }
                                </div>
                            </div>
                            {/* ===old version of graph ====
                            <div className="py-2 col-lg-12 col-12">
                                    <div className="bg-white rounded p-4">
                                        <SimpleSingleAreaChart title="Temperature Input" data={data1} />
                                    </div>
                                </div>
                                <div className="py-2 col-lg-12 col-12">
                                    <div className="bg-white rounded p-4 bg-dark">
                                        <SimpleSingleAreaChart title="Temperature Output" data={data2} />
                                    </div>
                                </div> */}
                            { 
                                graphShowData.map((v, i) =>
                                    <div key={i} className="py-2 col-lg-12 col-12">
                                        {v.selected &&
                                            <div className="bg-white rounded p-4">
                                                <SimpleSingleAreaChart title={v.name} data={minorChartData[i]} />
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    {/* <div className="d-flex flex-column flex-wrap flex-grow-1 p-2">
                        <div className="py-4 ">
                            <Navbar.ItemNavbar />
                        </div>
                        <div className="py-2">
                            <DropdownContainerAnormaly />
                        </div>
                        <div className="py-2">
                            <div className="bg-white rounded p-4">
                                <AnormalyControlPanel />
                                <SingleAreaChart data={data0} />
                            </div>
                        </div> */}
                    {/* <div className="py-2">
                            <div className="bg-white rounded p-4">
                                <MultiAreaChart data1={data0} data2={data2} />
                            </div>
                        </div> */}
                    {/* <div className="py-2">
                            <div className="bg-white rounded p-4">
                                <SimpleSingleAreaChart title="Temperature Input" data={data1} />
                            </div>
                        </div>
                        <div className="py-2">
                            <div className="bg-white rounded p-4 bg-dark">
                                <SimpleSingleAreaChart title="Temperature Output" data={data2} />
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}
export default Anormalies


const AnormalyControlPanel = props => {
    return (
        <div className='d-flex justify-content-between'>
            <div className=''>
                <div className="py-1"></div>
                <div className='dropup'>
                    <div className='btn dropdown-toggle px-1' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className='h5 p-2 text-secondary'>CH-3</span>
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
                    <span onClick={props.handleZoomIn}>
                        <Icon icon="fa fa-plus" />
                    </span>
                    <span onClick={props.handleZoomOut}>
                        <Icon icon="fa fa-minus" />
                    </span>
                    <div className='px-2 font-weight-bold text-secondary'>Zoom</div>
                    <SampleDropdown label={"Today"} icon={<Icon icon="fa fa-calendar" />}
                        additionalValue={["7 days ", "1 month", "6 month", "1 year"]}/>
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