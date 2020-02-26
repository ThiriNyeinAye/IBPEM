import React, { useState, Fragment, useEffect } from "react";
import SingleAreaChart from "../../components/graphs/SingleAreaChart.js";

const CollapseTable = props => {
  const { data = [], FilteronChangeValue, HistoryTableData ,} = props;
  
  return (
    <div className="table-responsive ">
      <table
        className="w-100 "
        style={{
          borderSpacing: "0 6px",
          borderCollapse: "separate",
          minWidth: 1200
        }}
      >
        <thead>
          <tr>
            <th className="py-3 text-secondary">
              <div>No</div>
            </th>
            <th className="py-3 text-secondary">
              <div>Building</div>
            </th>
            <th className="py-3 text-secondary">
              <div>Equipment Type</div>
            </th>
            <th className="py-3 text-secondary">
              <div>Time</div>
            </th>
            <th className="py-3 text-secondary">
              <div>Label</div>
            </th>
            <th className="py-3 text-secondary">
              <div>Labelled by</div>
            </th>
            <th className="py-3 text-secondary">
              <div></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {HistoryTableData.map((v, k) => {
            return (
              <Row
                data={data}
                history={ v}
                key={k}
                
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Row = props => {
   const [expand, setExpand] = useState(false);
  const { data, history} = props;
 
  return (
    <Fragment>
      <TableRow expand={expand} setExpand={setExpand} history={history}/>
      <ExpandedRow expand={expand} data={data} />
    </Fragment>
  );
};

const TableRow = ({ expand, setExpand, history }) => {
  const clickRow = ()=> setExpand(!expand)  
  return (
    <tr
      style={{ background: "#f5f5f5", borderBottom: "1px solid red",cursor:'pointer' }}
      onClick={clickRow}
    >
      <td
        className="py-3 px-2"
        style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
      >
        <div style={{ width: 100 }}> {history.No}</div>
      </td>
      <td className="py-3">
        <div>{history.Building} </div>
      </td>
      <td className="py-3">
        <div> {history.EquipmentType} </div>
      </td>
      <td className="py-3">
        <div> {history.Time}</div>
      </td>
      <td>
        <div className="d-flex flex-wrap">
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11" }}>
            <small>Refregerant Lean</small>
          </div>
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11" }}>
            <small>
              <span className="text-secondary pr-2">SEVERITY</span>Low
            </small>
          </div>
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11" }}>
            <small>
              <span className="text-secondary pr-2">Sensor Signal</span>Plant
              EMG
            </small>
          </div>
        </div>
      </td>
      <td style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
        <div className="text-sm">
          <span className="px-3">{history.LabelledBy}</span>
        </div>
      </td>
      <td style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
        <div
          className="text-center d-flex flex-column justify-content-center"
          style={{
            color: "#0184CC",
            fontSize: 15,
            cursor: "pointer",
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "inline-block",
            background: "#FEFEFE"
          }}
        >
          <span className="">  <i className={`fas fa-chevron-${expand ? "up" : "down"}`} />   </span>
        </div>
      </td>
    </tr>
  );
};

const ExpandedRow = ({ expand, data }) => {
  return (
    <tr >
      <td colSpan={7} >
        <div className={`p-3 collapse ${ expand && `show` } border my-1 bg-white rounded `}>
          <SingleAreaChart data={data } />
        </div>
      </td>
    </tr>
  );
};

export default CollapseTable;
