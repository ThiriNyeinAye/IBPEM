import React, { useState } from "react";

export const DropDown = props => {
  const { label, defaultValue, additionalValue } = props;
  return (
    <div className=" d-flex flex-row p-1">
      <div className="dropdown border rounded" data-toggle="dropdown">
        <div className="d-flex align-items-center">
          <span className="px-2">
            <i className="fa fa-times" style={{ fontSize: 13, color: '#23c49e' }}></i>{" "}
          </span>
          <span style={{ fontSize: 13, color: '#A9A9A9' }}> {label}</span>
          <span className="btn dropdown-toggle px-3"> {defaultValue} </span>
        </div>
        <div className="dropdown-menu w-100">
          {
            additionalValue.map((v, k) => <div key={k} className="dropdown-item"> {v} </div>)
          }
        </div>
      </div>
    </div>
  );
};

export const DropDownBlock = props => {
  const { label, defaultValue, additionalValue, showEditAllDropdown = false } = props;
  // console.log("additionalValue: ", additionalValue)
  return (
    <div className={`d-flex ${showEditAllDropdown ? '' : 'p-1'}`}>
      <div className={`dropdown rounded ${showEditAllDropdown ? 'none' : 'border'}`} >
        <div className="d-flex align-items-center" style={showEditAllDropdown ? customDropdownStyle : {}}>
          <span className="pl-3">
          </span>
          <span style={{ fontSize: 13, color: '#A9A9A9' }}> {label}</span>
          <span className="btn dropdown-toggle px-3"> {defaultValue} </span>
        </div>
        <div className={`dropdown-menu w-100 ${showEditAllDropdown && "show"}`} style={showEditAllDropdown ? customDropdownMenuStyle : {}}>
          {
            additionalValue.map((v, k) => <div key={k} className={`btn btn-block text-left`} > {v} </div>)
          }
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
  top: 0,
}

const customDropdownStyle = {
  padding: 0,
  margin: 0,
  borderBottom: "1px solid lightgray"
}

export const SampleDropdown = props => {
  const { label, additionalValue, icon } = props
  return (
    <div className="">
      <div className="dropdown" data-toggle="dropdown">
        <div className="d-flex align-items-center justify-content-center" style={{ cursor: 'pointer' }}>
          <div className=" d-flex align-items-center">
            <span className="px-2"> {icon}</span>
            <span> {label}</span>
          </div>
          <div className="px-2" ><i className="fa fa-caret-down" /></div>
        </div>
      </div>
      <div className="dropdown-menu  py-0">
        {additionalValue.map((v, k) => ([
          <div key={k} className="dropdown-item my-2" style={{ cursor: 'pointer', }}>{v}</div>,
          <div key={v} className="dropdown-divider my-0" />
        ])
        )}
      </div>
    </div>
  )
}