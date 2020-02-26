import React, { useState } from "react";
import { DropDown } from "../../components/app/DropDown";

const NormalDropDownView = props => {
  const {
    onAnormalyInputChanged,
    anomalyInputData,
    setShowEditAllDropdown
  } = props;
  // const outsideClickControl = p => {setoutsideClick(p); };

  return (
    <div className="d-flex flex-wrap flex-md-wrap flex-sm-wrap justify-content-start ">
      <DropDown
        onDropDownItemClicked={onAnormalyInputChanged}
        label={"FAULT TYPE"}
        dataType={"faultType"}
        defaultValue={anomalyInputData /*"Refregerant Lean"*/}
        additionalValue={[
          "Condenser Fouling",
          "Excess Oil",
          "Low Condenser Water Flow",
          "Non-Condensable",
          "Normal",
          "Reduced Condenser Flow",
          "Refrigerant Leak",
          "Refrigerant Overcharge",
          "Add custom"
        ]}
        // outsideClickControl={outsideClickControl}
      />
      <DropDown
        onDropDownItemClicked={onAnormalyInputChanged}
        label={"SEVERITY"}
        dataType={"severity"}
        defaultValue={anomalyInputData /*"Low"*/}
        additionalValue={["1-Low", "2-Medium", "3-High"]}
        // outsideClickControl={outsideClickControl}
      />
      <DropDown
        onDropDownItemClicked={onAnormalyInputChanged}
        label={"SENSOR SIGNAL"}
        dataType={"sensorSignal"}
        defaultValue={anomalyInputData /*"Plant EMG"*/}
        additionalValue={[
          "Chiller KW",
          "Chiller Running Count",
          "CHW DP STPT",
          "CHW DP",
          "CHW KW",
          "CHW MIN",
          "CHW RL",
          "CHWP-VSD-OP",
          "CHWP-StageDNSP",
          "CHWP-StageINSP"
        ]}
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
