import React, { useState, Fragment, useEffect } from "react";
import SingleAreaChart from "../../components/graphs/SingleAreaChart.js";

const CollapseTable = props => {
  const { data = [], FilteronChangeValue, HistoryTableData } = props;
  const [expandedId, setExpandedId] = useState(-1);

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
            <th className="py-3 px-4 text-secondary">
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
              <div>Labeled by</div>
            </th>
            <th className="py-3 text-secondary">
              <div></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {HistoryTableData.map((v, k) => {
            return <Row id={k} expandedId={expandedId} setExpandedId={setExpandedId} data={data} history={v} key={k} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

const Row = props => {
  const [expand, setExpand] = useState(false);
  const { data, history, id, expandedId, setExpandedId } = props;

  return (
    <Fragment>
      <TableRow
         expand={expand}
         setExpand={setExpand}
        history={history}
        setExpandedId={()=>{expandedId!==id ? setExpandedId(id) : setExpandedId(-1);setExpand(!expand)} }
        id={id}
      />
      <ExpandedRow
        expand={expandedId === id}
        data={data}
        history={history}
      />
    </Fragment>
  );
};

const TableRow = ({ expand, history, setExpandedId,}) => {
  return (
    <tr
      style={{
        background: "#f5f5f5",
        borderBottom: "1px solid red",
        cursor: "pointer",
        padding: 0
      }}
      onClick={setExpandedId}
    >
      <td
        className="py-3 px-4 "
        style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
      >
        <div > {history.no}</div>
      </td>
      <td className="py-3">
        <div>{history.building} </div>
      </td>
      <td className="py-3">
        <div> {history.equipmentType} </div>
      </td>
      <td className="py-3">
        <div> {history.time}</div>
      </td>
      <td>
        <div className="d-flex flex-wrap">
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11" }}>
    <small>{history.label[0]}</small>
          </div>
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11" }}>
            <small>
              <span className="text-secondary pr-2">SEVERITY</span>{history.label[1]}
            </small>
          </div>
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11" }}>
            <small>
              <span className="text-secondary pr-2">Sensor Signal</span>{history.label[2]}
            </small>
          </div>
        </div>
      </td>
      <td style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
        <div className="text-sm">
          <span className="px-3">{history.labeledBy}</span>
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
          <span className="">
            <i className={`fas fa-chevron-down`} />
          </span>
        </div>
      </td>
    </tr>
  );
};

const ExpandedRow = ({ expand, data, history }) => {
  return (
    <tr>
      <td colSpan={7}>
        <div
          className={`p-3 collapse ${expand &&  `show`} border my-1 bg-white rounded `}
        >
          <SingleAreaChart data={data} />
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span>{history.labeledBy}</span>
              <span className="text-secondary">
                {history.equipmentType} show some issues due to water pump{" "}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <div className="pr-3" className="btn" onClick={()=>alert(JSON.stringify('Show Similarity'),null,2)}>Show Similar</div>
              <div className="pl-3 ">
                <button
                  type="button"
                  className="btn"
                  style={{ background: "#32c18c" }}
                >
                  Remove Anomaly
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default CollapseTable;
