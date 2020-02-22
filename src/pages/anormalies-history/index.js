import React, { Component } from "react"
import CollapseHistoryTable from "../../components/app/CollapseTable.js"
import moment from "moment-timezone"
import * as Navbar from "../../components/app/Navbar.js"
import {SampleDropdown} from '../../components/app/DropDown.js'
import { withLStorage } from "../../components/hoc.js"

const HOST = {
    local: "http://192.168.100.7:3003",
    test: "https://ibpem.com/api",
    maythu: "http://192.168.100.27:3003"
}

const DataFetcher = (callback) => {
    return fetch(`${HOST.maythu}/dummy-data`)
        .then(res => res.json())
        .then(data => callback(data.error, data))
        .catch(error => callback(error, null))
}

class AnormaliesHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        DataFetcher((error, data) => {
            if(error) console.log("Error: ", error)
            else this.setState({ data: data.payload })
        })
    }

//  onChangeData = e => console.log({e})

    render() {
        const { data } = this.state
      
        const data0 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix()*1000, v.efficiency])
        const data1 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix()*1000, v.evaInput])
        const data2 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix()*1000, v.evaOutput])
        
        if(data.length===0) return <div className="text-center p-4">Loading...</div>

        return (
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-xl-10 py-5">
                        <Navbar.LogoNavbar />
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-xl-10">
                        <div className="d-flex flex-row justify-content-between py-4">
                            <div>
                                <div className="h3 text-dark">History</div>
                                <div className="text-secondary">{"1293 Anomalies have been reviewed"}</div>
                            </div>
                            <div className="" style={{cursor:'pointer'}}>
                                {/* <span className="pr-2"><i className="fas fa-list"/></span>
                                <span className="text-secondary">{"Filter"}</span> */}
                                  <SampleDropdown label={"Filter"} icon={<i className="fas fa-list"/>} 
                                  additionalValue={[ 'Mark Taiwan','lucy']} notToggle
                                //   onChangeData={(e)=>this.onChangeData(e)}
                                  />
                            </div>
                        </div>
                        <CollapseHistoryTable data={data0} />
                    </div>
                </div>
            </div>
        )
    }

}

export default withLStorage(AnormaliesHistory)