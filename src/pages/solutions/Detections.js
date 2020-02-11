import React from 'react'

const Detection = ({ logo, title, info, onHistoryClicked, onAnormalyClicked }) => {
    return (
        <div className="col-lg-3 col-md-6 col-12 p-3 rounded">
            <div className="card text-center h-100" style={{ background: '#F7F8FA' }}>
                <div className="flex-fill bg-white " onClick={onAnormalyClicked} style={{ cursor: "pointer" }}>
                    <div className="py-5" style={{ background: '#F2F2F2', }} >
                        <img src={logo} alt="logo1" />
                    </div>
                    <div className="card-body text-left  py-4">
                        <div className="h5 text-secondary">{title}</div>
                        <div className="py-2 text-secondary">{info}</div>
                    </div>
                </div>
                <div className="dropdown-divider my-0" />
                <div className="py-3 text-secondary " onClick={onHistoryClicked} style={{ cursor: 'pointer' }}>
                    {"View History"}
                </div>
            </div>
        </div>
    )
}

export default Detection;