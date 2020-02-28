import React, { useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import { DropDownBlock } from "../../components/app/DropDown.js";

const AllDropDownBlockView = props => {
  const {
    anomalyInputData,
    onAnormalyInputChanged,
    showEditAllDropdown,
    setShowEditAllDropdown,
    handleAddData,
    FaultTypeLabel,
    severityLabel,
    sensorSignalLabel
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
          handleAddData={handleAddData}
          defaultValue={anomalyInputData /*"Refregerant Lean"*/}
          additionalValue={FaultTypeLabel}
          showEditAllDropdown={showEditAllDropdown}
        />
      </div>
      <div className="bg-white border border-top-0 border-bottom-0 ">
        <DropDownBlock
          onDropDownItemClicked={onAnormalyInputChanged}
          label={"SEVRITY"}
          dataType={"severity"}
          defaultValue={anomalyInputData /*"Low"*/}
          additionalValue={severityLabel}
          showEditAllDropdown={showEditAllDropdown}
        />
      </div>
      <div className="bg-white ">
        <DropDownBlock
          onDropDownItemClicked={onAnormalyInputChanged}
          label={"SENSOR SIGNAL"}
          dataType={"sensorSignal"}
          defaultValue={anomalyInputData /*"Plant EMG"*/}
          additionalValue={sensorSignalLabel}
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
