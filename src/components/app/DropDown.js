import React, { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

export const DropDown = props => {
  const { fields } = props;
  const [inputData, setInputData] = useState("");
  const [menuShow, setMenuShow] = useState(false);
  const [Open, setOpen] = useState(false);
  const {
    label,
    defaultValue,
    additionalValue,
    onDropDownItemClicked,
    dataType,
    // setoutsideClick,
    outsideClick,
    outsideClickControl
  } = props;
  const defaultValueData = defaultValue[dataType].reduce(
    (r, c) => `${r}${c}`,
    ""
  );

  const handleAddData = e => {
    alert(inputData);
  };
  const handleChange = e => {
    setInputData(e.target.value);
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => { // console.log('outside handler')
       setMenuShow(false);
      }}
    >
      <div
        className=" d-flex flex-row p-1 mx-1"
        style={{ minWidth: 100 }}
      >
        <div className="dropdown border rounded">
          <div
            className="d-flex align-items-center justify-content-between w-100"
            data-toggle="dropdown" onClick={e => {
              // e.stopPropagation();
              setMenuShow(!menuShow);
            }}
          >
            <div className="d-flex flex-row align-items-center">
              <div
                className="px-2 btn btn-sm"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDropDownItemClicked(defaultValueData, dataType);
                }}
              >
                <i
                  className="fa fa-times"
                  style={{ fontSize: 13, color: "#23c49e" }}
                ></i>{" "}
              </div>
              <div
                style={{ fontSize: 12, color: "#A9A9A9", cursor: "pointer" }}
              >
                {" "}
                {label}
              </div>
            </div>
            <div className="btn dropdown-toggle px-3"> {defaultValueData} </div>
          </div>
          <div
            className={`dropdown-menu ${
              menuShow && outsideClick ? "show" : "none"
            }`}
          >
            {additionalValue.map((v, k) =>
              v === "Add custom" ? (
                <div id="DropdownMenuItem" key={k}>
                  <hr />
                  <div
                    key={k}
                    className="dropdown-item pb-3"
                    onClick={e => (Open ? setOpen(false) : setOpen(true))}
                    style={{ cursor: "pointer" }}
                  >
                    {v}
                  </div>
                  {Open && (
                    <div className="container">
                      <input
                        type="text"
                        className="w-100"
                        onChange={handleChange}
                      ></input>
                      <div
                        className="btn btn-sm btn-block my-1"
                        style={{ backgroundColor: "#20b390", color: "#ffffff" }}
                        onClick={e => {
                          handleAddData();
                          setOpen(false);
                        }}
                      >
                        ADD
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  key={k}
                  className={`dropdown-item btn btn-block rounded-0 text-left py-2 my-0`}
                  style={{ 
                    backgroundColor: defaultValue[dataType].findIndex(v1 => v1 === v) > -1
                      ? "#2b916933"
                      : undefined,
                      
                  }}
                  onClick={e => {
                    onDropDownItemClicked(v, dataType);
                    setMenuShow(false);
                  }}
                >
                  {v}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
}

export const DropDownBlock = props => {
  const {
    label,
    defaultValue,
    additionalValue,
    showEditAllDropdown = false,
    onDropDownItemClicked,
    dataType
  } = props;
  const defaultValueData = defaultValue[dataType].reduce(
    (r, c) => `${r} ${c}`,
    ""
  );

  return (
    <div className={`d-flex ${showEditAllDropdown ? "" : "p-1"}`}>
      <div
        className={`dropdown rounded ${
          showEditAllDropdown ? "none" : "border"
        }`}
      >
        <div
          className="d-flex align-items-center justify-content-between"
          style={showEditAllDropdown ? customDropdownStyle : {}}
        >
          <span>
            <span className="pl-3"></span>
            <span style={{ fontSize: 12, color: "#A9A9A9" }}> {label}</span>
          </span>
          <span className="btn dropdown-toggle px-3"> {defaultValueData} </span>
        </div>
        <div
          className={`dropdown-menu w-100 ${showEditAllDropdown && "show"}`}
          style={showEditAllDropdown ? customDropdownMenuStyle : {}}
        >
          {additionalValue.map((v, k) => (
            <div
              key={k}
              className={`btn btn-block rounded-0 text-left `}
              style={{ 
                backgroundColor: defaultValue[dataType].findIndex(v1 => v1 === v) > -1
                  ? "#2b916933"
                  : undefined
              }}
              onClick={e => onDropDownItemClicked(v, dataType)}
            >
              {" "}
              {v}{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const customDropdownMenuStyle = {
  display: "block",
  position: "relative",
  margin: 0,
  border: "none",
  borderRadius: 0,
  top: 0
};

const customDropdownStyle = {
  padding: 0,
  margin: 0,
  borderBottom: "1px solid lightgray"
};

export const SampleDropdown = props => {
  const {
    label,
    additionalValue,
    icon,
    notToggle,
    onChange,
    FilteronChangeValue
  } = props;
  // const [Dropdownvalue, setDropdownvalue] = useState("");

  return (
    <div className="">
      <div className="dropdown" data-toggle="dropdown">
        <div
          className="d-flex flex-row align-items-center justify-content-between "
          style={{ cursor: "pointer" }}
        >
          <div className=" d-flex align-items-center justify-content-start">
            <span className="px-2"> {icon}</span>
            <span className="text-secondary"> {label}</span>
            {/* <span></span> */}
            {!notToggle && (
              <div className="px-1 text-secondary">
                {" "}
                <i className="fa fa-caret-down" />{" "}
              </div>
            )}
          </div>
          {notToggle && (
            <div className="px-2">
              {/* {FilteronChangeValue.length > 0 && "By: "} */}
              {FilteronChangeValue}{" "}
            </div>
          )}
        </div>
      </div>
      <div className="dropdown-menu py-0 " onClick={onChange}>
        {additionalValue.map((v, k) => [
          <div
            key={k}
            className="dropdown-item my-2"
            style={{ cursor: "pointer" }}
            value={v}
          >
            {v}
          </div>,
          <div key={v} className="dropdown-divider my-0" />
        ])}
      </div>
    </div>
  );
};
