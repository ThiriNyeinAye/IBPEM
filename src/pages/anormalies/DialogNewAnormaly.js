import React, { useState, useEffect } from 'react'
import '../../App.css'

const DialogBox = props => {
    const { 
        byUser="Nathan Ng",
        onSubmitAnomaly=()=>null,
    } = props
    const [message, setMessage] = useState("")

    return(
        <div className="modal fade" id="dialogAddAsAnomaly">
            <div className="modal-dialog modal-lg">
                <div className="modal-content py-4 px-5">

                    <div className="d-flex flex-row h-100 align-items-stretch justify-content-between  py-3">
                        <img src={"/detection-1.jpeg"} />
                        <div className="d-flex flex-column p-2 justify-content-around  flex-fill">
                            <div className="h5">Anomaly 2938</div>
                            <div className="text-secondary">Please leave your remark before submit</div>
                        </div>                        
                        <div className="d-flex" data-dismiss="modal"><i className="fa fa-times fa-2x" style={{ cursor: "pointer", color: "lightgray" }} /></div>
                    </div>
                    <div className="py-2">
                        <textarea className="form-control" 
                            value={message} onChange={e=> setMessage(e.target.value)} 
                            placeholder="Add your remark" rows='6' ></textarea>
                        <div className="text-secondary py-3" >Remark by {byUser}</div> 
                    </div>
                    <div className="py-2 d-flex flex-row justify-content-end">
                        <div className="">
                            <div className="btn btn-light border mx-1" data-dismiss="modal" onClick={e=>setMessage("")}>Cancel</div>
                            <div className="btn btn-success mx-1" onClick={e => onSubmitAnomaly(message, byUser)}>Submit Anomaly</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DialogBox