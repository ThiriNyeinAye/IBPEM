import React, { Component } from "react"

export default class TestComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            state1: "Value1",
            state2: "Value2"
        }
    }

    changeStateValue = () => {
        this.setState({ state1: "State 1", state2: "State 2" })
    }

    render() {
        return(
            <div className="p-4">
                <div>State 1: {this.state.state1} <button onClick={e=>this.setState({ state1: "Value 11"})}>Change</button> </div>
                <div>State 1: {this.state.state2} <button onClick={e=>this.setState({ state2: "Value 22"})}>Change</button> </div>
            </div>
        )
    }
}