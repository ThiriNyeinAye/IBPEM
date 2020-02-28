import React, { useState, useEffect } from 'react'
import { DropDown, DropDownBlock } from '../../components/app/DropDown.js'
import AllDropdownBlockView from './AllDropDownBlockView.js';
import NormalDropDownView from './NormalDropDownView'
import AddGraphView from './AddGraphView.js';

const HOST = {
    local: "http://192.168.100.7:3003",
    test: "https://ibpem.com/api",
    maythu: "http://192.168.100.27:3003"
}

const DropdownContainerAnormaly = props => {
    const { isClicked, isSquareClicked, isContentClicked, isTripleSquareClicked } = props
    const { handleGraphDataChart } = props
    const [showEditAllDropdown, setShowEditAllDropdown] = useState(false)
    const [graphs, setGraphs] = useState([{ name: "Input Temperature", selected: false }, { name: "Output Temperature", selected: false }])
    const [dropdownHandler, setdropdownHandler] = useState(false)
    const { anomalyInputData, onAnormalyInputChanged } = props
    const [faultTypeLabel, setFaultTypeLabel] = useState([])
    const [severityLabel, setSeverityLabel] = useState([])
    const [sensorSignalLabel, setSensorSignalLabel] = useState([])
    const [addCustom] = ["Add custom"]

    const showGraphClick = (e, g) => {
        setdropdownHandler(false)
        handleGraphDataChart(g)
    }
    
    const CustomDataFetcher = (callback) => {
        const getURL = `${HOST.maythu}/labels`
        fetch(getURL)
            .then(res => res.json())
            .then(data => callback(data.error, data.payload))
            .catch(error => callback(error, null))
    }

    const handleAddData = inputData => {
        const postURL=`${HOST.maythu}/addlabel`
        const data = {"faultType": inputData.trim() };
        fetch(postURL, {
          method: "POST",
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        console.log("Custom data>>>>", data)
        window.location.reload();
        // alert("customLabel: ", inputData)
      }

    const CustomDataFetch = () => {
        CustomDataFetcher((error, data) => {
            if (error) alert(error)
            else {
                setFaultTypeLabel(data.faultType.sort((a, b) => {
                    if (a > b) {
                        return 1;
                    }
                    if (a < b) {
                        return -1
                    }
                }));
                setSeverityLabel(data.severity.sort((a, b) => {
                    if (a > b) {
                        return 1;
                    }
                    if (a < b) {
                        return -1
                    }
                }));
                setSensorSignalLabel(data.sensorSignal.sort((a, b) => {
                    if (a > b) {
                        return 1
                    }
                    if (a < b) {
                        return -1
                    }
                }))
            }
        })
    }
    useEffect(() => {
        CustomDataFetch()
    }, [])

    const FaultTypeLabel = faultTypeLabel.concat(addCustom)


    return (
         <div className='d-flex flex-row flex-wrap p-1 justify-content-between ' /*onClick={e => setShowEditAllDropdown(false)}*/  >

            <div className="d-flex flex-column" style={{ position: "relative" }}>
                <NormalDropDownView handleAddData={handleAddData} anomalyInputData={anomalyInputData} FaultTypeLabel={FaultTypeLabel} severityLabel={severityLabel} sensorSignalLabel={sensorSignalLabel} onAnormalyInputChanged={onAnormalyInputChanged} setShowEditAllDropdown={setShowEditAllDropdown} />

                {showEditAllDropdown &&
                    <div className="" style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: 20, }} onClick={e => { e.stopPropagation() }}>
                        <AllDropdownBlockView handleAddData={handleAddData} anomalyInputData={anomalyInputData} FaultTypeLabel={FaultTypeLabel} severityLabel={severityLabel} sensorSignalLabel={sensorSignalLabel} onAnormalyInputChanged={onAnormalyInputChanged} showEditAllDropdown={showEditAllDropdown} setShowEditAllDropdown={setShowEditAllDropdown} />
                    </div>
                }
            </div>


            <div className='d-flex flex-column justify-content-center '>
                <div className='d-flex flex-lg-nowrap flex-wrap '>
                    <AddGraphView
                        dropdownHandler={dropdownHandler}
                        setdropdownHandler={setdropdownHandler}
                        graphs={graphs}
                        setGraphs={setGraphs}
                        showGraphClick={showGraphClick}
                    />
                    <div className='p-1 justify-content-center' >
                        <div className='d-flex justify-content-around align-items-center '>
                            <div className=''>
                                <div className="btn btn-sm" value='text' onClick={props.changeTripleSquareView}>
                                    {isTripleSquareClicked ?
                                        <i className="fas fa-columns" style={{ color: '#23c49e', fontSize: 26 }} /> :
                                        <i className="fas fa-columns" style={{ color: '#d0d0d0', fontSize: 26 }} />
                                    }

                                </div>
                            </div>
                            {/* <div className=''>
                                <div className="btn btn-sm" value='text' onClick={props.changeContentView}>
                                    {isContentClicked? 
                                        <i className="fa fa-th-large" style={{ color: '#23c49e', fontSize: 26 }} />: 
                                        <i className="fa fa-th-large" style={{ color: '#d0d0d0', fontSize: 26 }} />
                                    }   
                                </div>
                            </div> */}
                            <div className=''>
                                <div className="btn btn-sm" value='text' onClick={props.changeSquareView}>
                                    {isSquareClicked ?
                                        <i className="fa fa-square" style={{ color: '#23c49e', fontSize: 26 }} /> :
                                        <i className="fa fa-square" style={{ color: '#d0d0d0', fontSize: 26 }} />
                                    }
                                </div>
                            </div>
                            <div className=''>
                                <div className="btn btn-sm" value='text' onClick={props.changeBurgerView}>
                                    {isClicked ?
                                        <i className="fa fa-bars" style={{ color: '#23c49e', fontSize: 26 }} /> :
                                        <i className="fa fa-bars" style={{ color: '#d0d0d0', fontSize: 26 }} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex flex-column  justify-content-center'>
                        <div className="btn text-white px-2" style={{ backgroundColor: '#23c49e' }} data-toggle="modal" data-target="#dialogAddAsAnomaly">
                            <i className="fa fa-plus px-1 align-items-center" style={{ color: '#fff' }}></i>
                            Add as Anomaly
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default DropdownContainerAnormaly;






