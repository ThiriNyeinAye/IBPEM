import React, { useState } from "react";
import { DropDown } from "../../components/app/DropDown";

const NormalDropDownView = props => {
  const {
    onAnormalyInputChanged,
    anomalyInputData,
    setShowEditAllDropdown,
    FaultTypeLabel,
    severityLabel,
    sensorSignalLabel,
    inputData,
    handleAddData
  } = props;

  // const outsideClickControl = p => {setoutsideClick(p); };
  console.log("NormalDropDown>>>", inputData)
  return (
    <div className="d-flex flex-wrap flex-md-wrap flex-sm-wrap justify-content-start ">
      <DropDown
        onDropDownItemClicked={onAnormalyInputChanged}
        label={"FAULT TYPE"}
        dataType={"faultType"}
        defaultValue={anomalyInputData /*"Refregerant Lean"*/}
        additionalValue={FaultTypeLabel}
        handleAddData={handleAddData}
        // outsideClickControl={outsideClickControl}
      />
      <DropDown
        onDropDownItemClicked={onAnormalyInputChanged}
        label={"SEVERITY"}
        dataType={"severity"}
        defaultValue={anomalyInputData /*"Low"*/}
        additionalValue={severityLabel}
        // outsideClickControl={outsideClickControl}
      />
      <DropDown
        onDropDownItemClicked={onAnormalyInputChanged}
        label={"SENSOR SIGNAL"}
        dataType={"sensorSignal"}
        defaultValue={anomalyInputData /*"Plant EMG"*/}
        additionalValue={sensorSignalLabel}
        // outsideClickControl={outsideClickControl}
      />
      <div className="d-flex flex-column justify-content-center">
        <div
          className="btn"
          onClick={e => {
            e.stopPropagation();
            return setShowEditAllDropdown(true);
          }}
        >
          Edit All <i className="fa fa-caret-down" />
        </div>
      </div>
    </div>
  );
};
export default NormalDropDownView
