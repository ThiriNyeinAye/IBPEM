import React, { Component } from "react"
import CollapseHistoryTable from "../../components/app/CollapseTable.js"
import moment from "moment-timezone"
import * as Navbar from "../../components/app/Navbar.js"

const DataFetcher = (callback) => {
    return fetch("http://192.168.100.7:3003/dummy-data")
        .then(res => res.json())
        .then(data => callback(data.error, data))
        .catch(error => callback(error, null))
}

class AnormaliesHistory extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        DataFetcher((error, data) => {
            if(error) console.log("Error: ", error)
            else this.setState({ data: data.payload })
        })
    }

    render() {
        const { data } = this.state
      
        const data0 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix()*1000, v.efficiency])
        const data1 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix()*1000, v.evaInput])
        const data2 = data.map(v => [moment.tz(v.ts, "Europe/Lisbon").unix()*1000, v.evaOutput])

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
                                <span className="pr-2"><i class="fas fa-list"/></span>
                                <span className="text-secondary">{"Filter"}</span>
                            </div>
                        </div>
                        <CollapseHistoryTable data={data0} />
                    </div>
                </div>
            </div>
        )
    }

}

export default AnormaliesHistory