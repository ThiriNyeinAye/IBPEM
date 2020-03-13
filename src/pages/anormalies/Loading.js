import React, { Component } from "react"

export default class Loading extends Component {
    render() {
        return(
            <div 
                id="loadingDivId"
                style={{ 
                zIndex: 2147483647,
                position: "absolute", 
                left: 0, right: 0, top: 0, bottom: 0, 
                backgroundColor: "#00002233", 
                opacity: 1, 
                display:'none' }}>
                    <div style={{ position: "absolute", left: "50%", top: "50%" }}>
                        <div style={{ position: "relative", transform: "translate(-50%, -50%)", fontWeight: 900, opacity: 0.8, /*filter: "blur(1px)"*/  }}>
                            <img alt="LOADING" src="/loading1.gif" width="60" />
                            <div className="text-white text-center">LOADING</div>
                        </div>
                    </div>
            </div>
        )
    }
}