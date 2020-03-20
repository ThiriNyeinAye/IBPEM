import React, { useState, Fragment, useEffect } from "react";
import SingleAreaChart from "../graphs/SingleAreaChart"
import { format, getUnixTime,fromUnixTime } from 'date-fns'
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz"
import "../../App.css"

const CollapseTable = props => {
  const { data = [], FilteronChangeValue, HistoryTableData = [], loadChartData } = props;
  const [expandedId, setExpandedId] = useState(-1);

  return (
    <div className="table-responsive ">
      <table
        className="w-100 "
        style={{
          borderSpacing: "0 6px",
          borderCollapse: "unset",
          minWidth: 1200,

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
            return <Row id={k + 1} expandedId={expandedId} setExpandedId={setExpandedId} data={data} history={v} key={k} loadChartData={loadChartData} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

const Row = props => {
  const [expand, setExpand] = useState(false);
  const { data, history, id, expandedId, setExpandedId, loadChartData } = props;

  return (
    <Fragment>
      <TableRow
        expand={expand}
        setExpand={setExpand}
        history={history}
        setExpandedId={(e) => { 
            e.preventDefault();
            if(expandedId !== id) {
              setExpandedId(id) 
              loadChartData(history)
            }
            else setExpandedId(-1); 
          } 
        }
        expandedId={expandedId}
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

const TableRow = ({ history, setExpandedId, expandedId, id }) => {
  // console.log(history.label.length)
  return (
    <tr
      className="historyRow"
      style={{
        background: expandedId !== id ? "#f5f5f5" : "#ffffff",
        cursor: "pointer",
        padding: 0,
        borderRadius: 6,
        boxShadow: expandedId !== id ? "none" : "1px 1px 4px #d5d5d5"
      }}
      onClick={setExpandedId}
    >
      <td
        className="py-3 px-4 "
        style={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
      >
        <div > {id}</div>
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
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11", boxShadow: "1px 1px 4px #d0d0d0" }}>
            <small>{history.label[0]}</small>
          </div>
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11", boxShadow: "1px 1px 4px #d0d0d0" }}>
            <small>
              <span className="text-secondary pr-2">SEVERITY</span>{history.label[1]}
            </small>
          </div>
          <div className="p-1 m-1 rounded" style={{ background: "#00BF8E11", boxShadow: "1px 1px 4px #d0d0d0" }}>
            <small>
              <span className="text-secondary pr-2">Sensor Signal</span>{history.label[2]}
            </small>
          </div>
        </div>
      </td>
      <td style={{ }}>
        <div className="text-sm">
          <span className="px-3">{history.labeledBy}</span>
        </div>
      </td>
      <td className="lastColumn" style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
        <div
          className="text-center d-flex flex-column justify-content-center border"
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
            <i className={`fas fa-chevron-${expandedId !== id ? 'down' : 'up'}`} />
          </span>
        </div>
      </td>
    </tr>
  );
};

const ExpandedRow = ({ expand, data, history }) => {
  const startTs = getUnixTime(zonedTimeToUtc(history.startDate, "Asia/Singapore"))*1000;
  const endTs = getUnixTime(zonedTimeToUtc(history.endDate, "Asia/Singapore"))*1000;

  return (
    <tr>
      <td colSpan={7}>
        <div className={`p-3 collapse ${expand && `show`} border my-1 bg-white rounded `}>
          { expand && /*<SingleAreaChart data={data} datum={[]} anomalyDataByTime={[]} navigatorDisabled />*/ 
            <SingleAreaChart 
              removeSelectedAnomaly={() => null} 
              anomalyDataByTime={[]} 
              data={data} 
              datum={[]} 
              handleFilterAnomalyData={() => null}
              selectedStartTs={startTs}
              selectedEndTs={endTs}
              history={{
                user: history.labeledBy,
                createdTs: history.time,
                remark: history.remark,
              }}
              navigatorDisabled
            />
          }
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span>{history.labeledBy}</span>
              <span className="text-secondary px-2">
                {/* {history.equipmentType} show some issues due to water pump{" "} */}
                { history.remark }
              </span>
            </div>
            <div className="d-flex align-items-center">
              {/* <div className="pr-3" className="btn" onClick={() => alert(JSON.stringify('Show Similarity'), null, 2)}>Show Similar</div> */}
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