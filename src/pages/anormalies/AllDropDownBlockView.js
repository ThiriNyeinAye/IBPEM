import React, { useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import { DropDownBlock } from "../../components/app/DropDown.js";

const AllDropDownBlockView = props => {
  const {
    anomalyInputData,
    onAnormalyInputChanged,
    showEditAllDropdown,
    setShowEditAllDropdown
  } = props;
  // AllDropDownBlockView.handleClickOutside = () =>  
  return (
    <OutsideClickHandler
      onOutsideClick={() =>  setShowEditAllDropdown(false)   }
    >
    <div className="d-flex flex-lg-nowrap flex-wrap justify-content-start bg-white border bg-white rounded">
      <div className="bg-white ">
        <DropDownBlock
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
          showEditAllDropdown={showEditAllDropdown}
        />
      </div>
      <div className="bg-white border border-top-0 border-bottom-0 ">
        <DropDownBlock
          onDropDownItemClicked={onAnormalyInputChanged}
          label={"SEVRITY"}
          dataType={"severity"}
          defaultValue={anomalyInputData /*"Low"*/}
          additionalValue={["1-Low", "2-Medium", "3-High"]}
          showEditAllDropdown={showEditAllDropdown}
        />
      </div>
      <div className="bg-white ">
        <DropDownBlock
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
          showEditAllDropdown={showEditAllDropdown}
        />
      </div>
    </div>
    </OutsideClickHandler>
  );
};
// const clickOutsideConfig = {
//     handleClickOutside: () => AllDropDownBlockView.handleClickOutside,
//   };
//  export default onClickOutside(AllDropDownBlockView, clickOutsideConfig)
 export default  AllDropDownBlockView;
