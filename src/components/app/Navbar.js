import React from 'react'
import { SampleDropdown } from './DropDown.js'
import {routeName} from '../../routes/index'
import {Link} from 'react-router-dom'

export const LogoNavbar = props => {
    return (
        <div className="d-flex flex-row justify-content-between flex-wrap ">
            <div className="pt-2">
               <Link to="/"><img src={"evercommlogo1.png"} alt="logo"/></Link>
            </div>
            <div className="d-flex text-secondary pt-2 ">
                <div className="px-3 h4"><i className="fas fa-bell"></i></div>
                <div className="px-3 h5">
                    <SampleDropdown label={"Mary Silvestre"}
                        additionalValue={[""]}
                    />
                </div>
            </div>
        </div>
    )
}
export const ItemNavbar = props => {
    return (
        <div className='d-flex justify-content-between py-3'>
            <div className='text-secondary'>
                <SampleDropdown label={"Star Vista"}
                    additionalValue={["Star Vista"]}
                />
            </div>
             <div className='pl-2 text-secondary'>
                <SampleDropdown label={"Mary Silvestre"}
                    additionalValue={["Mary Silvestre"]}
                />
            </div>
        </div>
        // <div className="d-flex justify-content-between align-items-center flex-fill">
        //     <div className="d-flex text-secondary">
        //         <div className="px-3 h5">
        //             <SampleDropdown label={"Star Vista"}
        //                 additionalValue={["Other action asdfas dfasd fasdfas df", "Other action", "Other action",]}
        //             />
        //         </div>
        //     </div>
        //     <div className="d-flex text-secondary">
        //         {/* <div className="px-3 h4"><i className="fas fa-bell"></i></div> */}
        //         <div className="pl-3 h5">
        //             <SampleDropdown label={"Mary Silvestre"}
        //                 additionalValue={["Other actionasdfa ", "Other action", "Other action",]}
        //             />
        //         </div>
        //     </div>
        // </div>
    )
}
// export default {LogoNavbar,ItemNavbar};

