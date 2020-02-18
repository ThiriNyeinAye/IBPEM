import React, { useState } from 'react'
import { DropDown, DropDownBlock } from '../../components/app/DropDown.js'
import onClickOutside from "react-onclickoutside";

const DropdownContainerAnormaly = (props) => {
    const [showEditAllDropdown, setShowEditAllDropdown] = useState(false)
    const { anomalyInputData, onAnormalyInputChanged } = props

    DropdownContainerAnormaly.handleClickOutside = () => setShowEditAllDropdown(false)

    return (
        <div className='d-flex flex-row flex-wrap p-1 justify-content-between' onClick={e => setShowEditAllDropdown(false)}>

            <div className="d-flex flex-column " style={{ position: "relative" }}>
                <div className='d-flex flex-wrap flex-md-wrap flex-sm-wrap justify-content-start '>
                    <DropDown
                        onDropDownItemClicked={onAnormalyInputChanged}
                        label={"FAULT TYPE"}
                        dataType={"faultType"}
                        defaultValue={anomalyInputData/*"Refregerant Lean"*/}
                        additionalValue={["Condenser Fouling", "Excess Oil", "Low Condenser Water Flow", "Non-Condensable", "Normal", "Reduced Condenser Flow", "Refrigerant Leak", "Refrigerant Overcharge", "Add custom"]} />
                    <DropDown
                        onDropDownItemClicked={onAnormalyInputChanged}
                        label={"SEVERITY"}
                        dataType={"severity"}
                        defaultValue={anomalyInputData/*"Low"*/}
                        additionalValue={["1-Low", "2-Medium", "3-High"]} />
                    <DropDown
                        onDropDownItemClicked={onAnormalyInputChanged}
                        label={"SENSOR SIGNAL"}
                        dataType={"sensorSignal"}
                        defaultValue={anomalyInputData/*"Plant EMG"*/}
                        additionalValue={["Chiller KW", "Chiller Running Count", "CHW DP STPT", "CHW DP", "CHW KW", "CHW MIN", "CHW RL", "CHWP-VSD-OP", "CHWP-StageDNSP", "CHWP-StageINSP"]} />
                    <div className='d-flex flex-column justify-content-center'>
                        <div className="btn" onClick={e => { e.stopPropagation(); return setShowEditAllDropdown(true) }}>Edit All <i className="fa fa-caret-down" /></div>
                    </div>
                </div>
                {showEditAllDropdown &&
                    // d-flex flex-lg-nowrap flex-wrap row 
                    <div className="" style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: 20, }} onClick={e => e.stopPropagation()}>
                        <div className="d-flex flex-lg-nowrap flex-wrap justify-content-start bg-white border bg-white rounded">
                            <div className="bg-white ">
                                <DropDownBlock
                                    onDropDownItemClicked={onAnormalyInputChanged}
                                    label={"FAULT TYPE"}
                                    dataType={"faultType"}
                                    defaultValue={anomalyInputData/*"Refregerant Lean"*/}
                                    additionalValue={["Condenser Fouling", "Excess Oil", "Low Condenser Water Flow", "Non-Condensable", "Normal", "Reduced Condenser Flow", "Refrigerant Leak", "Refrigerant Overcharge", "Add custom"]}
                                    showEditAllDropdown={showEditAllDropdown} />
                            </div>
                            <div className="bg-white border border-top-0 border-bottom-0 ">
                                <DropDownBlock
                                    onDropDownItemClicked={onAnormalyInputChanged}
                                    label={"SEVRITY"}
                                    dataType={"severity"}
                                    defaultValue={anomalyInputData/*"Low"*/}
                                    additionalValue={["1-Low", "2-Medium", "3-High"]}
                                    showEditAllDropdown={showEditAllDropdown} />
                            </div>
                            <div className="bg-white ">
                                <DropDownBlock
                                    onDropDownItemClicked={onAnormalyInputChanged}
                                    label={"SENSOR SIGNAL"}
                                    dataType={"sensorSignal"}
                                    defaultValue={anomalyInputData/*"Plant EMG"*/}
                                    additionalValue={["Chiller KW", "Chiller Running Count", "CHW DP STPT", "CHW DP", "CHW KW", "CHW MIN", "CHW RL", "CHWP-VSD-OP", "CHWP-StageDNSP", "CHWP-StageINSP"]}
                                    showEditAllDropdown={showEditAllDropdown} />
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className='d-flex flex-column justify-content-center'>
                <div className='d-flex flex-lg-nowrap flex-wrap'>
                    <div className='dropdown rounded '>
                        <div className="dropdown" data-toggle="dropdown">
                            <div className="d-flex flex-column border rounded bg-light">
                                <div className="btn dropdown-toggle px-3">Add Graph</div>
                            </div>
                            <div className='dropdown-menu px-1'>
                                <div className="px-2 d-flex flex-row align-items-center" data-value="option1" tabIndex="-1">
                                    <input type="checkbox" />
                                    <div className="pl-2">Option A</div>
                                </div>
                                <div className="px-2 d-flex flex-row align-items-center" data-value="option1" tabIndex="-1">
                                    <input type="checkbox" />
                                    <div className="pl-2">Option B</div>
                                </div>
                                <div className="px-2 d-flex flex-row align-items-center" data-value="option1" tabIndex="-1">
                                    <input type="checkbox" />
                                    <div className="pl-2">Option C</div>
                                </div>
                                <div className="px-2 d-flex flex-row align-items-center" data-value="option1" tabIndex="-1">
                                    <input type="checkbox" />
                                    <div className="pl-2">Option D</div>
                                </div>
                                <div className="px-2 d-flex flex-row align-items-center" data-value="option1" tabIndex="-1">
                                    <input type="checkbox" />
                                    <div className="pl-2">Option E</div>
                                </div>
                                <div className="px-2 d-flex flex-row align-items-center" data-value="option1" tabIndex="-1">
                                    <input type="checkbox" />
                                    <div className="pl-2">Option F</div>
                                </div>
                                <div className=" d-flex flex-row justify-content-center pt-3">
                                    <div className="btn text-white px-3" style={{ backgroundColor: '#23c49e' }} >
                                        Show Graph
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='p-1 justify-content-center' >
                        <div className='d-flex justify-content-around align-items-center '>
                            <div className=''>
                                <div className="btn btn-sm" value='text' >
                                    <i className="fa fa-th-large" style={{ color: '#d0d0d0', fontSize: 26 }}></i>
                                </div>
                            </div>
                            <div className=''>
                                <div className="btn btn-sm" value='text'>
                                    <i className="fa fa-square" style={{ color: '#d0d0d0', fontSize: 26 }}></i>
                                </div>
                            </div>
                            <div className=''>
                                <div className="btn btn-sm" value='text'>
                                    <i className="fa fa-bars" style={{ color: '#23c49e', fontSize: 26 }}></i>
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

const clickOutsideConfig = {
    // hello: "Hello"
    handleClickOutside: () => DropdownContainerAnormaly.handleClickOutside
  };

export default onClickOutside(DropdownContainerAnormaly, clickOutsideConfig)




