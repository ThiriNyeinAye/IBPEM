import React, { useState, Fragment } from 'react'
import {routeName} from '../../routes/index.js'
import {Link} from 'react-router-dom'
import { Progress } from 'reactstrap';
import { ItemNavbar } from './Navbar.js';

const AnormalySidebar = props => {
    const { 
        anomalyDataByEquipment,
        handleAnomalyTimeClicked
    } = props

    const [anormalyBy, setAnormalyBy] = useState(1)
    const anormalyByEquipmentList = Object.keys(anomalyDataByEquipment).map((v, key) => (
        <AnormalyByEquipmentItem 
            key={key} 
            deviceName={v} 
            anormalyData={anomalyDataByEquipment[v]}
            onClick={handleAnomalyTimeClicked} />
    ))
    const AnormalyByTimeFrameList = Object.values(anomalyDataByEquipment).reduce((r, c) => [...r, ...c], []).map((v, key) => (
        <AnormalyByTimeFrameItem 
            key={key} 
            date={v.date} 
            time={v.time} 
            selected={v.selected} 
            deletedIconShowed={v.selected}
            onClick={() => handleAnomalyTimeClicked(v)} />
    ))

    const AnormalyView = anormalyBy === 2 ? anormalyByEquipmentList : AnormalyByTimeFrameList

    return (
        <div className='bg-white shadow-lg py-3 rounded h-100 d-flex flex-column justify-content-between' >
            <div className="">
                <div className="pl-3 pr-2 pb-3 d-flex flex-row flex-wrap justify-content-between">
                    <div>
                        <Link to="/" > <img src={"/ecomlogo.jpeg"} alt='LoGo' className='img-fluid' style={{cursor:'pointer'}} /> </Link>
                        <ItemNavbar />
                    </div>
                    <div id="sidebarMenuIcon" style={{ cursor: "pointer", }}>
                        <div className="px-1" >
                            <i id="sidebarMenuIconI" className="fa fa-bars fa-2x" style={{ color: "#0087b5" }} />
                        </div>
                    </div>
                </div>
                <div className='px-3 px-1 text-dark' style={{ fontSize: 24 }}>Anomalies</div>

                <AnormalyViewSelector selectedAnormalyView={anormalyBy} onSelectChanged={setAnormalyBy} />

                {/* <div className="pb-3" data-toggle="collapse" href="#SortBy" role="button" aria-expanded="false" aria-controls="SortBy">
                    Sort By Equipment
                    <i className="fa fa-sort-down px-1"></i>
                </div>
                <div className="d-flex flex-row pb-4 ">
                    <div className="col" style={{backgroundColor:'#EDEFEE'}}>
                        <div className="collapse multi-collapse border border-right-0 border-left-0 py-3 w-100" id="SortBy">
                            TimeFrame
                        </div>
                        <div className="collapse multi-collapse border border-top-0 border-right-0 border-left-0 py-3 w-100" id="SortBy">
                            Equipment
                        </div>
                        <div className="collapse multi-collapse border border-top-0 border-right-0 border-left-0 py-3" id="SortBy">
                            Severity
                        </div>
                    </div>
                </div> */}

                <div className="p-3">
                    <div className='p-2 d-flex flex-column shadow-lg rounded' style={{ backgroundColor: '#23c49e', lineHeight: 0 }}>
                        <div className='px-2 py-3 text-white font-weight-bold' >
                            34 of 123 <span style={{ color: "#e0e5e0", fontWeight: 'normal' }}>Detections</span>
                        </div>
                        <div className='px-2 py-2'>
                            <Progress color='success' value='34' style={{ height: 8 }} />
                        </div>
                    </div> 
                </div>

                { AnormalyView }

                <div className='px-3 d-flex py-3 pt-4 justify-content-between'>
                    <div className=''>New Detection</div>
                    <div className="px-1 rounded" value='text'>
                        <i className="fa fa-plus-square" style={{ color: '#23c49e', fontSize: 16 }}></i>
                    </div>
                </div>
            </div>
            <div className='py-4'>
                <div className="pt-4 border border-bottom-0 border-left-0 border-right-0 text-secondary text-center " style={{ cursor: "pointer", }}>
                    <Link className="text-secondary" to={routeName.routeAnormaliesHistory} style={{textDecoration:"none" }}> View History</Link> 
                </div>
            </div>
        </div>

    )
}

export default AnormalySidebar

const AnormalyByTimeFrameItem = ({ selected = false, date = "", time = "", deletedIconShowed = false, onClick }) => {
    return (
        <div className='px-3 d-flex border border-top-0 border-left-0 border-right-0 justify-content-between py-2' onClick={onClick} style={{ cursor: "pointer" }}>
            <div className="d-flex">
                <div className="">
                    {selected
                        ? <i className="fa fa-circle" style={{ color: '#23c49e', fontSize: 13 }}></i>
                        : <img src={"/dot.png"} alt='dot' style={{ width: 10 }} />
                    }
                </div>
                <div className='d-flex flex-column pl-2'>
                    <div className='py-2 text-secondary' style={{ fontSize: 13, lineHeight: 0 }}>{date}</div>
                    <div style={{ color: selected ? '#23c49e' : undefined }}>{time}</div>
                </div>
            </div>
            <div className=''>
                {deletedIconShowed && <i className="fa fa-trash" style={{ color: '#23c49e', fontSize: 16 }}></i>}
            </div>
        </div>
    )
}

const AnormalyByEquipmentItem = props => {
    const { deviceName, anormalyData, onClick } = props
    const deviceNameWithoutSpace = deviceName.replace(" ", "")

    return (
        <Fragment>
            <div className='px-3 d-flex justify-content-between border border-right-0 border-left-0 py-3' style={{ backgroundColor: '#00111109', cursor: "pointer" }}>
                <div className="w-100" data-toggle="collapse" role="button" href={`#${deviceNameWithoutSpace}`} aria-expanded="false" aria-controls={deviceNameWithoutSpace} >
                    {deviceNameWithoutSpace}
                </div>
                <div className=''>
                    <i className="fa fa-sort-down text-secondary"></i>
                </div>
            </div>
            <div className="w-100 collapse multi-collapse" id={deviceNameWithoutSpace}>
                {
                    anormalyData.map((v, key) => (
                        <AnormalyByTimeFrameItem 
                            key={key} 
                            date={v.date} 
                            time={v.time} 
                            selected={v.selected} 
                            deletedIconShowed={v.selected} 
                            onClick={e => onClick(v)} />
                    ))
                }
            </div>
        </Fragment>
    )
}

const AnormalyViewSelector = ({ selectedAnormalyView, onSelectChanged }) => {

    const anormalyViewList = ["Time Frame", "Equipment"]
    const selectedAnormaly = anormalyViewList[selectedAnormalyView - 1]

    return (
        <Fragment>
            <div className="px-3 pb-2 text-secondary" data-toggle="collapse" href="#SortBy" role="button" aria-expanded="false" aria-controls="SortBy" style={{ cursor: "pointer" }}>
                Sort By {selectedAnormaly}
                <i className="fa fa-sort-down px-1" style={{ color: "lightgray"}}></i>
            </div>
            <div className="d-flex flex-row pb-2">
                <div className="w-100 collapse multi-collapse" id="SortBy" style={{ backgroundColor: '#00111109', cursor: "pointer" }}>
                    {
                        anormalyViewList.map((v, k) => (
                            v === selectedAnormaly ? null :
                                <div key={k} onClick={e => onSelectChanged(k + 1)} className="px-3 border border-right-0 border-left-0 py-3 w-100">
                                    {v}
                                </div>
                        ))
                    }
                </div> 
            </div>
        </Fragment>
    )
}

/*
const sidebarData = {
    "Chiller 1": [
        {
            date: "Mon 23, Ja",
            time: "10:47.45-16:00",
            selected: true
        },
        {
            date: "Mon 23, Ja",
            time: "10:47.45-16:00",
            selected: false
        }
    ],
    "Chiller 2": [
        {
            date: "Mon 23, Ja",
            time: "10:47.45-16:00",
            selected: false
        },
        {
            date: "Mon 23, Ja",
            time: "10:47.45-16:00",
            selected: false
        }
    ],
}
*/