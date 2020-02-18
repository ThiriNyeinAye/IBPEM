import React, { useState, Fragment } from 'react'
import {routeName} from '../../routes/index.js'
import {Link} from 'react-router-dom'
import { Progress } from 'reactstrap';
import CardBody from 'reactstrap/lib/CardBody';

const AnormalySidebar = props => {
    console.log(props)
    const [anormalyBy, setAnormalyBy] = useState(1)
    const anormalyByEquipmentList = Object.keys(sidebarData).map((v, key) => <AnormalyByEquipmentItem key={key} deviceName={v} anormalyData={sidebarData[v]} />)
    const AnormalyByTimeFrameList = Object.values(sidebarData).reduce((r, c) => [...r, ...c], []).map((v, key) => <AnormalyByTimeFrameItem key={key} date={v.date} time={v.time} selected={v.selected} deletedIconShowed={v.selected} />)

    const AnormalyView = anormalyBy === 2 ? anormalyByEquipmentList : AnormalyByTimeFrameList

    return (
        <div className='bg-white p-3 rounded h-100 d-flex flex-column justify-content-between' >
            <div className="">
                <div className="pt-3 pb-5 ">
                   <Link to={routeName.anormalies}> <img src={"/ecomlogo.jpeg"} alt='LoGo' className='img-fluid' style={{cursor:'pointer'}} /> </Link>
                </div>
                <div className='h4 px-1' style={{ lineHeight: 0.4 }}>Anomalies</div>

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

                {/* <div className='dropdown pb-4'>
                    <a className="btn dropdown-toggle px-1" href='#' role='button' id='dropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        Sort By TimeFrame
                    </a>
                    <div className='dropdown-menu' aria-labelledby='dropdownMenuLink'>
                        <a className='dropdown-item' href='#'>Other</a>
                        <a className='dropdown-item' href='#'>Other Action</a>
                    </div>
                </div>
                <div className=' shadow-lg pt-0 mb-4 bg-white-rounded rounded-sm' style={{ backgroundColor: '#23c49e', lineHeight: 0 }}>
                    <div className='p-4 text-white' >
                        <p> 34 of 123 Detections</p>
                        <Progress color='success' value='34' style={{ height: 6 }} />
                    </div>
                </div> */}

                {AnormalyView}

                <div className='d-flex py-3 justify-content-between'>
                    <div className=''>New Detection</div>
                    <div className="px-1 rounded" value='text'>
                        <i className="fa fa-plus-square" style={{ color: '#23c49e', fontSize: 16 }}></i>
                    </div>
                </div>
            </div>
            <div className='py-2'>
                <div className="my-3 border"></div>
                <div className="h6 text-secondary text-center" style={{ cursor: "pointer", }}>
                 <Link to={routeName.routeAnormaliesHistory} style={{textDecoration:"none",color:'black'}}> View History</Link> 
                </div>
            </div>
        </div>

    )
}

export default AnormalySidebar

const AnormalyByTimeFrameItem = ({ selected = false, date = "", time = "", deletedIconShowed = false }) => {
    return (
        <div className='d-flex border border-top-0 border-left-0 border-right-0 justify-content-between py-2' style={{ cursor: "pointer" }}>
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
    const { deviceName, anormalyData } = props
    const deviceNameWithoutSpace = deviceName.replace(" ", "")
    return (
        <Fragment>
            <div className='d-flex justify-content-between border border-right-0 border-left-0 py-3' style={{ backgroundColor: '#EDEFEE00', cursor: "pointer" }}>
                <div className="w-100" data-toggle="collapse" role="button" href={`#${deviceNameWithoutSpace}`} aria-expanded="false" aria-controls={deviceNameWithoutSpace} >
                    {deviceNameWithoutSpace}
                </div>
                <div className=''>
                    <i className="fa fa-sort-down"></i>
                </div>
            </div>
            <div className="w-100 collapse multi-collapse" id={deviceNameWithoutSpace}>
                {
                    anormalyData.map((v, key) => <AnormalyByTimeFrameItem key={key} date={v.date} time={v.time} selected={v.selected} deletedIconShowed={v.selected} />)
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
            <div className="pb-3 text-secondary" data-toggle="collapse" href="#SortBy" role="button" aria-expanded="false" aria-controls="SortBy" style={{ cursor: "pointer" }}>
                Sort By {selectedAnormaly}
                <i className="fa fa-sort-down px-1"></i>
            </div>
            <div className="d-flex flex-row pb-4">
                <div className="w-100 collapse multi-collapse" id="SortBy" style={{ backgroundColor: '#EDEFEE20', cursor: "pointer" }}>
                    {
                        anormalyViewList.map((v, k) => (
                            v === selectedAnormaly ? null :
                                <div key={k} onClick={e => onSelectChanged(k + 1)} className="border border-right-0 border-left-0 py-3 w-100">
                                    {v}
                                </div>
                        ))
                    }
                </div> 
            </div>
        </Fragment>
    )
}

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