import React from 'react'
import OutsideClickHandler from 'react-outside-click-handler';

const AddGraphView = props =>{
    const {
        dropdownHandler,
        setdropdownHandler,
        graphs,
        setGraphs,
        showGraphClick,
    }=props
    return(
        <OutsideClickHandler
        onOutsideClick={() => setdropdownHandler(false)  }
      >
<div className={`dropdown rounded ${dropdownHandler ? 'none' : 'show'}`}>
                        <div className="d-flex flex-column border rounded bg-light">
                            <div className="btn dropdown-toggle px-3 " onClick={e => setdropdownHandler(!dropdownHandler)}>Add Graph</div>
                        </div>
                        <div className={`dropdown-menu px-1 ${dropdownHandler && 'show'}`} /*onChange={(e) => handleChecked(e)}*/>
                            {
                                graphs.map((v, i) => (
                                    <div className="dropdown-item px-0" key={i}>
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
                    </div>
             </OutsideClickHandler>
    )
}
export default AddGraphView;