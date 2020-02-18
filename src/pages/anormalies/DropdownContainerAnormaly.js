import React, { useState } from 'react'
import { DropDown, DropDownBlock } from '../../components/app/DropDown.js'
import onClickOutside from "react-onclickoutside";

const DropdownContainerAnormaly = props => {
    const { handleGraphDataChart } = props
    const [showEditAllDropdown, setShowEditAllDropdown] = useState(false)
    const [graphs, setGraphs] = useState([{ name: "Input Temperature", selected: false }, { name: "Output Temperature", selected: false }])
    const [dropdownHandler, setdropdownHandler] = useState(false)
    const { anomalyInputData, onAnormalyInputChanged } = props

    DropdownContainerAnormaly.handleClickOutside = () => setShowEditAllDropdown(false)

    const showGraphClick = (e, g) => {
        setdropdownHandler(false)
        handleGraphDataChart(g)
    }

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
                <div className='d-flex flex-lg-nowrap flex-wrap '>
                    <div className={`dropdown rounded ${dropdownHandler ? 'none' : 'show'}`}>
                        {/* <div className="dropdown" data-toggle="dropdown" aria-expanded='true'> */}
                        <div className="d-flex flex-column border rounded bg-light">
                            <div className="btn dropdown-toggle px-3 " onClick={e => setdropdownHandler(!dropdownHandler)}>Add Graph</div>
                        </div>
                        <div className={`dropdown-menu px-1 ${dropdownHandler && 'show'}`} /*onChange={(e) => handleChecked(e)}*/>
                            {
                                graphs.map((v, i) => (
                                    <div key={i} className="px-2 d-flex flex-row align-items-center" data-value="option1" tabIndex="-1" onClick={e => setGraphs(graphs.map(c => ({ name: c.name, selected: c.name === v.name ? !c.selected : c.selected })))}>
                                        <input type="checkbox" checked={v.selected} onChange={e => null} />
                                        <div className="pl-2">{v.name}</div>
                                    </div>
                                ))
                            }
                            <div className=" d-flex flex-row justify-content-center pt-3">
                                <div className="btn text-white px-3" type="button" style={{ backgroundColor: '#23c49e' }} onClick={(e) => showGraphClick(e, graphs)}>
                                    Show Graph
                                 </div>
                            </div>
                        </div>
                        {/* </div> */}
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




