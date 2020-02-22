import React, { Component } from "react"
import { routeName } from "../../routes"
import { withLStorage } from "../../components/hoc.js"

class AnormaliesDevice extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    handleSolutionsClicked(routePath) {
        // console.log(routePath, this.props)
        this.props.history.push(routePath)
    }

    render() {
        const { } = this.state

        return (
            <div className="d-flex flex-column justify-content-center align-items-center px-4">
                <div className="py-4 h4">
                    Device Anormalies
                </div>
                <div className="d-flex flex-column w-100">

                    <div className="d-flex flex-row my-1 border p-2 rounded">
                        <div className="px-5">Chiller 1</div>
                        <div className="flex-grow-1 bg-info rounded" style={{ cursor: "pointer" }} onClick={() => this.handleSolutionsClicked(routeName.routeAnormalies)}></div>
                    </div>
                    <div className="d-flex flex-row my-1 border p-2 rounded">
                        <div className="px-5">Chiller 2</div>
                        <div className="flex-grow-1 bg-info rounded"></div>
                    </div>
                    <div className="d-flex flex-row my-1 border p-2 rounded">
                        <div className="px-5">Chiller 3</div>
                        <div className="flex-grow-1 bg-info rounded"></div>
                    </div>

                </div>
            </div>
        )
    }

}

export default withLStorage(AnormaliesDevice)