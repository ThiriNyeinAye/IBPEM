import React, { useState,useEffect } from 'react'
import AllDropdownBlockView from './AllDropDownBlockView.js';
import NormalDropDownView from './NormalDropDownView'

const HOST = {
    local: "http://192.168.100.7:3003",
    test: "https://ibpem.com/api",
    maythu: "http://192.168.100.27:3003"
}

const DropdownContainerAnormaly = props => {
    const { isClicked, isSquareClicked, isContentClicked,isTripleSquareClicked } = props
    const { handleGraphDataChart } = props
    const [showEditAllDropdown, setShowEditAllDropdown] = useState(false)
    const [graphs, setGraphs] = useState([{ name: "Input Temperature", selected: false }, { name: "Output Temperature", selected: false }])
    const [dropdownHandler, setdropdownHandler] = useState(false)
    const { anomalyInputData, onAnormalyInputChanged } = props
    const [faultTypeLabel,setFaultTypeLabel]=useState([])
    const [severityLabel, setSeverityLabel]=useState([])
    const [sensorSignalLabel, setSensorSignalLabel] = useState([])
    const [data,setData]=useState()
    const [addCustom] =["Add custom"]

    const showGraphClick = (e, g) => {
        setdropdownHandler(false)
        handleGraphDataChart(g)
    }
    const url=`${HOST.test}/labels`
    const CustomDataFetcher=(callback)=>{
        fetch(url)
        .then(res=> res.json())
        .then(data=>callback(data.error,data.payload))
        .catch(error => callback(error, null))
      
    }

    const CustomDataFetch=()=>{
        CustomDataFetcher((error,data)=>{
            if(error) alert(error)
            else {
                
                setFaultTypeLabel(data.faultType.sort((a,b)=> {
                    if(a>b){
                        return 1;
                    }
                    if(a<b){
                        return -1
                    }
                }));
                setSeverityLabel(data.severity.sort((a,b)=> {
                    if(a>b){
                        return 1;
                    }
                    if(a<b){
                        return -1
                    }
                }));
                setSensorSignalLabel(data.sensorSignal.sort((a,b)=> {
                    if(a>b){
                        return 1
                    }
                    if(a<b){
                        return -1
                    }
                }))
            }
        })
    }
    useEffect(()=>{
        CustomDataFetch()
    },[])

    const FaultTypeLabel = faultTypeLabel.concat(addCustom)

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
                        <div className={`dropdown-menu px-1 ${dropdownHandler && 'show'}`} /*onChange={(e) => handleChecked(e)}*/>
                            {
                                graphs.map((v, i) => (
                                    <div className="dropdown-item px-0">
                                        <div key={i} className="d-flex flex-row px-2 py-2 align-items-center"  onClick={e => setGraphs(graphs.map(c => ({ name: c.name, selected: c.name === v.name ? !c.selected : c.selected })))}>
                                            <input type="checkbox" className="form-check-input" checked={v.selected} onChange={e => null} name={v.name} className=""/>
                                            <label htmlFor={v.name} className="form-check-label pl-2" >{v.name}</label>
                                        </div>
                                    </div>
                                ))
                            }
                            <div className=" py-2">
                                <div className="border border-left-0 border-right-0 border-top-0"></div>
                            </div>
                            <div className=" d-flex flex-row justify-content-center px-2">
                                <div className="btn text-white px-3 btn-block" type="button" style={{ backgroundColor: '#23c49e' }} onClick={(e) => showGraphClick(e, graphs)}>
                                    Show Graph
                                 </div>
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                    <div className='p-1 justify-content-center' >
                        <div className='d-flex justify-content-around align-items-center '>
                            <div className=''>
                                <div className="btn btn-sm" value='text' onClick={props.changeTripleSquareView}>
                                    {isTripleSquareClicked?
                                          <i className="fas fa-columns" style={{ color: '#23c49e', fontSize: 26 }} />:
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
                                    {isSquareClicked?
                                        <i className="fa fa-square" style={{ color: '#23c49e', fontSize: 26 }} />:
                                        <i className="fa fa-square" style={{ color: '#d0d0d0', fontSize: 26 }} />
                                    }
                                </div>
                            </div>
                            <div className=''>
                                <div className="btn btn-sm" value='text' onClick={props.changeBurgerView}>
                                    {isClicked?
                                        <i className="fa fa-bars" style={{ color: '#23c49e', fontSize: 26 }} />:
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






