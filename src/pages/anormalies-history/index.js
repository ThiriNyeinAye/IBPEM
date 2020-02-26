
import React, { Component } from "react";
import CollapseHistoryTable from "../../components/app/CollapseTable.js";
import moment from "moment-timezone";
import * as Navbar from "../../components/app/Navbar.js";

import { withLStorage } from "../../components/hoc.js"


const HOST = {
  local: "http://192.168.100.7:3003",
  test: "https://ibpem.com/api",
  maythu: "http://192.168.100.27:3003"
};

const DataFetcher = callback => {
  return fetch(`${HOST.test}/dummy-data`)
    .then(res => res.json())
    .then(data => callback(data.error, data))
    .catch(error => callback(error, null));
};

class AnormaliesHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      tableData: [],
      FilteronChangeValue: "",
      filter: {
        // no_filter:'',
        user: null,
        dateTime: null
      },
      HistoryTableData: [...HistoryTableDataOrignal]
    };
  }

  componentDidMount() {
    DataFetcher((error, data) => {
      if (error) console.log("Error: ", error);
      else this.setState({ data: data.payload });
    });
  }
//   changeSampleDropDown = stateData => {  return this.setState({ FilteronChangeValue: stateData }); };

  handleDoFilter = () => {
    // console.log(this.state.filter)
    const HistoryTableData = HistoryTableDataOrignal.filter( v => {
        return (this.state.filter.user===null || this.state.filter.user === "No Filter")? true : v.LabelledBy===this.state.filter.user
    })
    this.setState( prev => ({ HistoryTableData ,filter:{user:null}}))
  }

  render() {
    const { data, FilteronChangeValue, filter, HistoryTableData } = this.state;
 

    const data0 = data.map(v => [
      moment.tz(v.ts, "Europe/Lisbon").unix() * 1000,
      v.efficiency
    ]);
    const data1 = data.map(v => [
      moment.tz(v.ts, "Europe/Lisbon").unix() * 1000,
      v.evaInput
    ]);
    const data2 = data.map(v => [
      moment.tz(v.ts, "Europe/Lisbon").unix() * 1000,
      v.evaOutput
    ]);

    if (data.length === 0)
      return <div className="text-center p-4">Loading...</div>;

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
                <div className="text-secondary">
                  {"1293 Anomalies have been reviewed"}
                </div>
              </div>
      {/* ======================= */}
              <div className="" style={{ cursor: "pointer" }}  data-toggle="modal" data-target="#exampleModal">
                <span> Filter </span>  
                <span><i className="fas fa-list"></i></span>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" style={{top:180}}>
            <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
    <h5 className="modal-title" id="exampleModalLabel">{"Filter History"}</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
          {/* user-lable filter */}
      <div className="d-flex flex-row align-items-center py-2"> 
      <div className="dropdown flex-fill"  >
   
    <div className="border rounded p-2 d-flex justify-content-between align-items-center" data-toggle="dropdown"> 
    <div>User LabelledBy : {filter.user!==null ? filter.user : ""}</div>
    <div><i className="fa fa-sort-down" /></div>
    </div>
  
      <div className=" dropdown-menu w-100 ">
                    <div onClick={e => this.setState(prev => ({ filter: {...prev.filter, user: 'No Filter'} }))} className="px-2  dropdown-item" >
                        {/* <input id="no-filter" type="checkbox"
                            value={filter.user}
                            onChange={e => this.setState({ filter: { ...filter, no_filter: e.target.checked } })  }
                            />  */}
                         <label htmlFor="no-filter" style={{cursor:'pointer'}}> No Filter </label>
                    </div>
                      {HistoryTableDataOrignal.map(v => v.LabelledBy)
                        .reduce(
                          (r, c) =>
                            r.findIndex(v1 => c === v1) === -1 ? [...r, c] : r,
                          []
                        )
                        .map((v, k) => (
                          <div key={k} className="px-2 dropdown-item" onClick={e =>  this.setState({ filter: { ...filter, user: v }  })  }>
                            {/* <input
                              id={v}
                              type="checkbox"
                              name={v}
                              checked={!filter.no_filter && filter.user === v}
                              value={v}
                              onChange={e =>
                                this.setState({
                                  filter: { ...filter, user: v }
                                })
                              } />  */}
                             <label htmlFor={v} style={{cursor:'pointer'}}> {v} </label>
                          </div>
                        ))}
        </div>
  </div>
       </div>
     {/* ============================================================================ */}
     {/* <div className="d-flex flex-row justify-content-between align-items-center py-2"> 
      <div>Date and Time:</div>
      <div className="d-flex" >
                    <div onClick={e => this.setState(prev => ({ filter: {...prev.filter, user: null} }))} className="px-2" >
                        <input id="no-filter" type="checkbox"
                            //   onChange={e => this.setState({ filter: { ...filter, user: v } })  }
                            />  <label htmlFor="no-filter" style={{cursor:'pointer'}}> No Filter </label>
                    </div>     
        </div>
       </div> */}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" className="btn btn-primary" onClick={this.handleDoFilter}>Do Filter</button>
      </div>
    </div>
  </div>
            </div>
 {/* ========================================================================== */}
                {/* <div> */}
                  {/* <div className="collapse" id="filter">
                    <div>User Labeled:</div>
                    <div>
                    <div onClick={e => this.setState(prev => ({ filter: {...prev.filter, user: null} }))}>No Filter</div>
                      {HistoryTableDataOrignal.map(v => v.LabelledBy)
                        .reduce(
                          (r, c) =>
                            r.findIndex(v1 => c === v1) === -1 ? [...r, c] : r,
                          []
                        )
                        .map((v, k) => (
                          <div key={k} className="">
                            <input
                              id={v}
                              type="checkbox"
                              name={v}
                              checked={filter.user === v}
                              value={v}
                              onChange={e =>
                                this.setState({
                                  filter: { ...filter, user: v }
                                })
                              }
                            />  <label htmlFor={v}> {v} </label>
                          </div>
                        ))}
                    </div>
                    <div> <button onClick={this.handleDoFilter}>Filter</button></div>
                  </div> */}
                {/* </div> */}
            
            
            </div>
            <CollapseHistoryTable
              data={data0}
              FilteronChangeValue={FilteronChangeValue}
              HistoryTableData={HistoryTableData}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default withLStorage(AnormaliesHistory)

const HistoryTableDataOrignal = [
  {
    id: "1",
    No: "1",
    Building: "The Star Vista",
    Time: "12/03/2020 14:00-16:00",
    EquipmentType: "Chiller 3",
    LabelledBy: "Mark Taiwan"
  },
  {
    id: "2",
    No: "2",
    Building: "The Star Vista",
    Time: "12/03/2020 14:00-16:00",
    EquipmentType: "Chiller 3",
    LabelledBy: "Mark Taiwan"
  },
  {
    id: "3",
    No: "3",
    Building: "The Star Vista",
    Time: "12/03/2020 14:00-16:00",
    EquipmentType: "Chiller 3",
    LabelledBy: "Mark Taiwan"
  },
  {
    id: "4",
    No: "4",
    Building: "The Star Vista",
    Time: "12/03/2020 14:00-16:00",
    EquipmentType: "Chiller 3",
    LabelledBy: "Mark Taiwan"
  },
  {
    id: "5",
    No: "5",
    Building: "The Star Vista",
    Time: "12/03/2020 14:00-16:00",
    EquipmentType: "Chiller 3",
    LabelledBy: "Lucy"
  }
];



