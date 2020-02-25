import React, { useState } from 'react'
import AllDropdownBlockView from './AllDropDownBlockView.js';
import NormalDropDownView from './NormalDropDownView'

const DropdownContainerAnormaly = props => {
    const {isClicked, isSquareClicked, isContentClicked} = props
    const { handleGraphDataChart } = props
    const [showEditAllDropdown, setShowEditAllDropdown] = useState(false)
    const [graphs, setGraphs] = useState([{ name: "Input Temperature", selected: false }, { name: "Output Temperature", selected: false }])
    const [dropdownHandler, setdropdownHandler] = useState(false)
    const { anomalyInputData, onAnormalyInputChanged } = props
    const {inputData} = props

    //  DropdownContainerAnormaly.handleClickOutside = () => {  setShowEditAllDropdown(false)  }/*setShowEditAllDropdown(false)*/

    const showGraphClick = (e, g) => {
        setdropdownHandler(false)
        handleGraphDataChart(g)
    }
    return (
        <div className='d-flex flex-row flex-wrap p-1 justify-content-between ' /*onClick={e => setShowEditAllDropdown(false)}*/  >

            <div className="d-flex flex-column" style={{ position: "relative" }}>
                <NormalDropDownView anomalyInputData={anomalyInputData} onAnormalyInputChanged={onAnormalyInputChanged} setShowEditAllDropdown={setShowEditAllDropdown} />
               
     {showEditAllDropdown &&
                        <div className="" style={{ position: "absolute", left: 0, right: 0, top: 0, zIndex: 20, }} onClick={e => {e.stopPropagation()}}>
                       <AllDropdownBlockView anomalyInputData={anomalyInputData} onAnormalyInputChanged={onAnormalyInputChanged} showEditAllDropdown={showEditAllDropdown} setShowEditAllDropdown={setShowEditAllDropdown}/>
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
                        <div className={`dropdown-menu px-1  ${dropdownHandler && 'show'}`} /*onChange={(e) => handleChecked(e)}*/>
                            {
                                graphs.map((v, i) => (
                                    <div key={i} className="px-2 d-flex flex-row align-items-center dropdown-item" data-value="option1" tabIndex="-1" onClick={e => setGraphs(graphs.map(c => ({ name: c.name, selected: c.name === v.name ? !c.selected : c.selected })))}>
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
                                <div className="btn btn-sm" value='text' onClick={props.changeContentView}>
                                     {/* <i className="fa fa-th-large" style={{ color: '#d0d0d0', fontSize: 26 }}></i> */}
                                    {isContentClicked? 
                                        <i className="fa fa-th-large" style={{ color: '#23c49e', fontSize: 26 }}></i> : 
                                        <i className="fa fa-th-large" style={{ color: '#d0d0d0', fontSize: 26 }}></i>
                                    }   
                                </div>
                            </div>
                            <div className=''>
                                <div className="btn btn-sm" value='text' onClick={props.changeSquareView}>
                                    {/* <i className="fa fa-square" style={{ color: '#d0d0d0', fontSize: 26 }}></i> */}
                                    {isSquareClicked?
                                        <i className="fa fa-square" style={{ color: '#23c49e', fontSize: 26 }}></i> :
                                        <i className="fa fa-square" style={{ color: '#d0d0d0', fontSize: 26 }}></i>
                                    }
                                </div>
                            </div>
                            <div className=''>
                                <div className="btn btn-sm" value='text' onClick={props.changeBurgerView}>
                                    {/* <i className="fa fa-bars" style={{ color: '#23c49e', fontSize: 26 }}></i> */}
                                    {isClicked?
                                        <i className="fa fa-bars" style={{ color: '#23c49e', fontSize: 26 }}></i> :
                                        <i className="fa fa-bars" style={{ color: '#d0d0d0', fontSize: 26 }}></i>
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






