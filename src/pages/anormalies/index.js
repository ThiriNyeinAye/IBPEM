import React, { Component } from "react"
import moment from "moment-timezone"

import SingleAreaChart from "../../components/graphs/SingleAreaChart.js"
import MultiAreaChart from "../../components/graphs/MultiAreaChart.js"
import AnormalySidebar from "../../components/app/AnormalySidebar.js"
import DropdownContainerAnormaly from "./DropdownContainerAnormaly.js"
import SimpleSingleAreaChart from "../../components/graphs/SimpleSingleAreaChart.js"
import * as Navbar from "../../components/app/Navbar.js"
import DialogNewAnormaly from "./DialogNewAnormaly.js";
import { SampleDropdown } from '../../components/app/DropDown'

const DataFetcher = (callback) => {
    return fetch("http://192.168.100.7:3003/dummy-data")
        .then(res => res.json())
        .then(data => callback(data.error, data))
        .catch(error => callback(error, null))
}

class Anormalies extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        DataFetcher((error, data) => {
            if (error) console.log("Error: ", error)
            else this.setState({ data: data.payload })
        })
    }

    render() {
        const { data } = this.state

        const data0 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.efficiency])
        const data1 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaInput])
        const data2 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix() * 1000, v.evaOutput])

        return (
            <div className="" style={{ overflow: 'hidden' }}>
                <div className="d-flex flex-row flex-wrap flex-md-nowrap" >
                    <div className="d-flex flex-column flex-fill p-2" style={{ minWidth: 300 }}>
                        <AnormalySidebar />
                    </div>

                    <DialogNewAnormaly />
                    
                    <div className="container-fluid ">
                        <div className="row ">
                            <div className="col-lg-12 py-4">
                                <Navbar.ItemNavbar />
                            </div>
                            <div className="py-2 col-lg-12 col-12">
                                <DropdownContainerAnormaly />
                            </div>
                            <div className="py-2 col-lg-12 col-12">
                                <div className="bg-white rounded p-4">
                                    <AnormalyControlPanel />
                                    <SingleAreaChart data={data0} />
                                    {/* <MultiAreaChart data1={data0} data2={data2} /> */}
                                </div>
                            </div>
                            <div className="py-2 col-lg-12 col-12">
                                <div className="bg-white rounded p-4">
                                    <SimpleSingleAreaChart title="Temperature Input" data={data1} />
                                </div>
                            </div>
                            <div className="py-2 col-lg-12 col-12">
                                <div className="bg-white rounded p-4 bg-dark">
                                    <SimpleSingleAreaChart title="Temperature Output" data={data2} />
                                </div>
                            </div>
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
                        <div className='dropdown-item py-3 text-center' style={{ cursor: "pointer" }}>
                            View History
                        </div>
                    </div>
                </div>
            </div>
            <div className='pr-5'>
                <div className='d-flex align-items-center'>
                    <Icon icon="fa fa-plus" />
                    <Icon icon="fa fa-minus" />
                    <div className='px-2 pr-4 font-weight-bold text-secondary'>Zoom</div>
                    <SampleDropdown label={"Today"} icon={<Icon icon="fa fa-calendar" />}
                        additionalValue={["12.1.2020 ", "12.1.2020", "12.1.2020",]}
                    />
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
            <button className="btn btn-sm px-1 py-0" style={{ backgroundColor: '#dfd8f0', cursor: "pointer" }}>
                <i className={icon} style={{ color: '#5b3da1' }}></i>
            </button>
        </div>
    )
}