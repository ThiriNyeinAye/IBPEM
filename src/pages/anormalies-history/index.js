import React, { Component } from "react";
import ReactDOM from "react-dom"
import CollapseHistoryTable from "../../components/app/CollapseTable.js";
import * as Navbar from "../../components/app/Navbar.js";
import { format, getUnixTime,fromUnixTime } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz"
import { withLStorage } from "../../components/hoc.js";
import SingleAreaChart from "../../components/graphs/SingleAreaChart.js"

const HOST = {
  local: "http://192.168.100.7:3003",
  test: "https://ibpem.com/api",
  maythu: "http://192.168.100.27:3003"
};

const DataFetcher = (params, callback) => {
  const res =  fetch(`${HOST.test}/dummy-data?startDate=${params.startDate}&endDate=${params.endDate}`)
    .then(res => res.json())
    .then(data => callback(data.error, data))
    .catch(error => callback(error, null))
  return res
}
const GetHistoryData = callback =>{
  return fetch(`${HOST.test}/history`)
  .then(res => res.json())
  .then(data => callback(data.error,data))
  .catch(error => callback(error,null))
}
class AnormaliesHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      tableData: [],
      FilteronChangeValue: "",
      filter: {
        user: null,
        equipmentType:null,
        dateTime: null
      },
      HistoryTableData:[],
      HistoryTableDataOrigin: null,
  
    }; 
  }

  componentDidMount() {
    GetHistoryData((error,data)=>{
      if(error)console.log("Error :",error)
      else{
        const HistoryTableDataOrigin = data.payload === null ? []: data.payload
        this.setState({HistoryTableData:HistoryTableDataOrigin,HistoryTableDataOrigin})
      } 
    })
  }

  handleDoFilter = () => {
    const HistoryTableData =this.state.HistoryTableDataOrigin.filter(v => {
    if(this.state.filter.user !== null && this.state.filter.equipmentType !== null){
      return (v.labeledBy === this.state.filter.user && v.equipmentType === this.state.filter.equipmentType)
    }
        else if(this.state.filter.equipmentType !== null){
          return v.equipmentType === this.state.filter.equipmentType
         }else  if(this.state.filter.user !== null ) {
       return  v.labeledBy === this.state.filter.user
        }
         else return v;
        }) ;
  
    this.setState(prev => ({
      HistoryTableData,
      filter:prev.filter
    }));
  };

  loadChartData = (historyData) => {
    let startTs = getUnixTime(zonedTimeToUtc(historyData.startDate, "Asia/Singapore"));
    let endTs = getUnixTime(zonedTimeToUtc(historyData.endDate, "Asia/Singapore"));
    const diff = endTs - startTs

    const startDate = format(fromUnixTime(startTs - (diff*4)), "yyyy-MM-dd",  'Asia/Singapore')
    const endDate = format(fromUnixTime(endTs + (diff*4)), "yyyy-MM-dd",  'Asia/Singapore')

    return DataFetcher({ startDate, endDate }, (error, data) => {
      if (error) console.log("Error: ", error);
      else {
        const rawData = data.payload.map( v=> {
            return [getUnixTime(zonedTimeToUtc(v.ts, "Asia/Singapore")) * 1000, v.efficiency]
          })
        this.setState({ data: rawData })
      }
    })
    
  }

  render() {
    const { data, FilteronChangeValue, filter, HistoryTableData ,HistoryTableDataOrigin } = this.state;

    if ( HistoryTableDataOrigin===null )
      return <div className="text-center p-4">Loading...</div>;

    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-xl-10 py-3">
            <Navbar.LogoNavbar />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="d-flex flex-row justify-content-between py-4">
              <div>
                <div className="h2 text-dark">History</div>
                <div className="text-secondary">
                  {"1293 Anomalies have been reviewed"}
                </div>
              </div>
              {/* ======================= */}
              <div
                className=""
                style={{ cursor: "pointer" }}
                data-toggle="modal"
                data-target="#exampleModal"
              >
                <span> Filter </span>
                <span>
                  <i className="fas fa-list"></i>
                </span>
              </div>
              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                role="dialog"
                style={{ top: 180, opacity: 1 }}
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        {"Filter History"}
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div className="d-flex flex-column align-items-stretch justify-content-center  py-2">
                         {/* user-labelled filter  */}
                        <div className="dropdown ">
                        <div className="pb-2"> User LabelledBy :</div>
                          <div  className="border rounded p-2 d-flex align-items-center "  data-toggle="dropdown" >
                           {filter.user !== null ? filter.user : "All"}
                            <div className="ml-auto"> <i className="fa fa-sort-down" /> </div>
                          </div>
                          <div className=" dropdown-menu w-100 " >
                            <div
                              onClick={(e) =>{                          
                                    e.preventDefault();
                                this.setState(prev =>   ({
                                  filter: { ...prev.filter, user: null }
                                }) )
                              }
                              }
                              className={`px-2  dropdown-item`}
                            >
                              <label
                                htmlFor="no-filter"
                                style={{ cursor: "pointer" }}
                              >
                               All 
                              </label>
                            </div>
                            { HistoryTableDataOrigin.map(v =>v.labeledBy)
                              .reduce(
                                (r, c) =>
                                  r.findIndex(v1 => c === v1) === -1
                                    ? [...r, c]
                                    : r,
                                []
                              )
                              .map((v, k) =>(
                                <div
                                  key={k}
                                  className={`px-2 dropdown-item  `}
                                  onClick={() =>
                                    this.setState(prev =>({
                                      filter: { ...filter, user: v }
                                    }))
                                  }
                                >
                                  <label   htmlFor={v}   style={{ cursor: "pointer" }} > {v} </label>
                                </div>
                              )  )}
                          </div>
                        
                        </div>
                    {/* equipmentType filter */}
                        <div className="dropdown flex-fill">
                          <div className="pb-2 pt-3"> EquipmentType :</div>
                          <div  className="border rounded p-2 d-flex align-items-center"  data-toggle="dropdown" >
                           {filter.equipmentType !== null ? filter.equipmentType : "All Equipment Type"}
                            <div className="ml-auto"> <i className="fa fa-sort-down" /> </div>
                          </div>
                          <div className=" dropdown-menu w-100 " >
                            <div
                              onClick={e =>
                                this.setState(prev =>   ({
                                  filter: { ...prev.filter, equipmentType: null }
                                }) )
                              }
                              className={`px-2  dropdown-item`}
                            >
                              <label
                                htmlFor="no-filter"
                                style={{ cursor: "pointer" }}
                              >
                               All Equipment Type
                              </label>
                            </div>
                            { HistoryTableDataOrigin.map(v =>v.equipmentType).sort()
                              .reduce(
                                (r, c) =>
                                  r.findIndex(v1 => c === v1) === -1
                                    ? [...r, c]
                                    : r,
                                []
                              )
                              .map((v, k) => (
                                <div
                                  key={k}
                                  className={`px-2 dropdown-item  `}
                                  onClick={e =>
                                    this.setState(prev =>({
                                      filter: { ...filter, equipmentType: v }
                                    }))
                                  }
                                >
                                  <label style={{ cursor: "pointer" }} > {v} </label>
                                </div>
                              )  )}
                          </div>
                          </div>
                      </div>
                      {/* ============================================================================ */}
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary "
                        onClick={this.handleDoFilter}
                        data-dismiss={filter !== null && "modal"}
                      >
                        Do Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CollapseHistoryTable
              loadChartData={this.loadChartData}
              data={data}
              FilteronChangeValue={FilteronChangeValue}
              HistoryTableData={HistoryTableData}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default withLStorage(AnormaliesHistory);

const HistoryTableDataOrignal = [
  {
    id: "1",
    no: "1",
    building: "The Star Vista",
    time: "12/03/2020 14:00-16:00",
    equipmentType: "Chiller 3",
    label: [ "Refrigerant","High", "CHW KW"],
    labeledBy: "Mark Taiwan"
  },
  {
    id: "1",
    no: "1",
    building: "The Star Vista",
    time: "12/03/2020 14:00-16:00",
    equipmentType: "Chiller 3",
    label: [ "Refrigerant","High", "CHW KW"],
    labeledBy: "Mark Taiwan"
  },
  {
    id: "1",
    no: "1",
    building: "The Star Vista",
    time: "12/03/2020 14:00-16:00",
    equipmentType: "Chiller 3",
    label: [ "Refrigerant","High", "CHW KW"],
    labeledBy: "Mark Taiwan"
  },
  {
    id: "1",
    no: "1",
    building: "The Star Vista",
    time: "12/03/2020 14:00-16:00",
    equipmentType: "Chiller 3",
    label: [ "Refrigerant","High", "CHW KW"],
    labeledBy: "Mark Taiwan"
  },
  {
    id: "1",
    no: "1",
    building: "The Star Vista",
    time: "12/03/2020 14:00-16:00",
    equipmentType: "Chiller 3",
    label: [ "Refrigerant","High", "CHW KW"],
    labeledBy: "Lucy"
  }
];