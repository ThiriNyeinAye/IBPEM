import React from 'react';
import { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import img1 from '../assets/s5.jpg';
import img2 from '../assets/s2.jpg';
import img3 from '../assets/s3.jpg';
import img4 from '../assets/s4.jpg'


const Tab=(props)=>{
    const [activeTab,setActiveTab]=useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
      }    
      return (
        <div className="pt-5 pb-4 container">
            <div>
                <h1 className="font-weight-bold text-center">Our Services</h1>
                <p className="text-center">Excepteur sint occaecat cupidatat</p>
            </div>
                <Nav tabs className="text-center pt-5">
                    <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                    <p className="text-center font-weight-bold">Restruant</p>
                    </NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                        >
                  
                   <p className="text-center font-weight-bold">Health & Spa</p>
                    </NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '3' })}
                        onClick={() => { toggle('3'); }}
                    >
                
                   <p className="text-center font-weight-bold">Swimming Pool</p>
                    </NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '4' })}
                        onClick={() => { toggle('4'); }}
                    >
                   
                   <p className="text-center font-weight-bold">Conference Room</p>
                    </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                        <Row>
                            <Col sm=" 12">
                                <div className="pt-5 d-flex flex-wrap justify-content-center">
                                    <div className="col-lg-6">
                                        <img src={img1} className="w-100" alt="" />
                                    </div>
                                <div className="col-lg-6">
                                        <h3 className="font-weight-bold">Restruant</h3>
                                        <p className="pt-3">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. sed ut perspiciatis unde omnis natus error.Inventore veritatis et quasi architebeatae vitae dicta sunt explicabonemo enim ipsam voluptatem quia voluptassit.aspernatur aut odit aut fugit</p>
                                        <p>sed quia consequunturMagni dolores eos qui ratione voluptatem sequi nesciunt.neque porro quisquam est qui dolore ipsum quia dolor sit amet, consectetur adipisci velit sed quia.</p>
                                </div>
                                </div>        
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col sm=" 12">
                                <div className="pt-5 d-flex flex-wrap justify-content-center">
                                    <div className="col-lg-6">
                                        <img src={img2} className="w-100" alt="" />
                                    </div>
                                <div className="col-lg-6">
                                        <h3 className="font-weight-bold">Health & Spa</h3>
                                        <p className="pt-3">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. sed ut perspiciatis unde omnis natus error.Inventore veritatis et quasi architebeatae vitae dicta sunt explicabonemo enim ipsam voluptatem quia voluptassit.aspernatur aut odit aut fugit</p>
                                        <p>sed quia consequunturMagni dolores eos qui ratione voluptatem sequi nesciunt.neque porro quisquam est qui dolore ipsum quia dolor sit amet, consectetur adipisci velit sed quia.</p>
                                </div>
                                </div>        
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row>
                            <Col sm=" 12">
                                <div className="pt-5 d-flex flex-wrap justify-content-center">
                                    <div className="col-lg-6">
                                        <img src={img3} className="w-100" alt="" />
                                    </div>
                                <div className="col-lg-6">
                                        <h3 className="font-weight-bold">Swimming Pool</h3>
                                        <p className="pt-3">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. sed ut perspiciatis unde omnis natus error.Inventore veritatis et quasi architebeatae vitae dicta sunt explicabonemo enim ipsam voluptatem quia voluptassit.aspernatur aut odit aut fugit</p>
                                        <p>sed quia consequunturMagni dolores eos qui ratione voluptatem sequi nesciunt.neque porro quisquam est qui dolore ipsum quia dolor sit amet, consectetur adipisci velit sed quia.</p>
                                </div>
                                </div>        
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="4">
                        <Row>
                            <Col sm=" 12">
                                <div className="pt-5 d-flex flex-wrap justify-content-center">
                                    <div className="col-lg-6">
                                        <img src={img4} className="w-100" alt="" />
                                    </div>
                                <div className="col-lg-6">
                                        <h3 className="font-weight-bold">Conference Room</h3>
                                        <p className="pt-3">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. sed ut perspiciatis unde omnis natus error.Inventore veritatis et quasi architebeatae vitae dicta sunt explicabonemo enim ipsam voluptatem quia voluptassit.aspernatur aut odit aut fugit</p>
                                        <p>sed quia consequunturMagni dolores eos qui ratione voluptatem sequi nesciunt.neque porro quisquam est qui dolore ipsum quia dolor sit amet, consectetur adipisci velit sed quia.</p>
                                </div>
                                </div>        
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
        </div>
      );
    }
    
export default Tab;
// import React from 'react';
// import { useState } from 'react';
// import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
// import classnames from 'classnames';
// import img1 from '../assets/s5.jpg';
// import img2 from '../assets/s2.jpg';
// import img3 from '../assets/s3.jpg';
// import img4 from '../assets/s4.jpg'


// const Tab=(props)=>{
//     const [activeTab,setActiveTab]=useState('1');

//     const toggle = tab => {
//         if(activeTab !== tab) setActiveTab(tab);
//       }    
//       return (
//         <div className="pt-5 pb-4 container">
//             <div>
//                 <h1 className="font-weight-bold text-center">Our Services</h1>
//                 <p className="text-center">Excepteur sint occaecat cupidatat</p>
//             </div>
//                 <Nav tabs className="text-center pt-5">
//                     <NavItem>
//                     <NavLink
//                         className={classnames({ active: activeTab === '1' })}
//                         onClick={() => { toggle('1'); }}
//                     >
//                     <p className="text-center font-weight-bold">Restruant</p>
//                     </NavLink>
//                     </NavItem>
//                     <NavItem>
//                     <NavLink
//                         className={classnames({ active: activeTab === '2' })}
//                         onClick={() => { toggle('2'); }}
//                         >
                  
//                    <p className="text-center font-weight-bold">Health & Spa</p>
//                     </NavLink>
//                     </NavItem>
//                     <NavItem>
//                     <NavLink
//                         className={classnames({ active: activeTab === '3' })}
//                         onClick={() => { toggle('3'); }}
//                     >
                
//                    <p className="text-center font-weight-bold">Swimming Pool</p>
//                     </NavLink>
//                     </NavItem>
//                     <NavItem>
//                     <NavLink
//                         className={classnames({ active: activeTab === '4' })}
//                         onClick={() => { toggle('4'); }}
//                     >
                   
//                    <p className="text-center font-weight-bold">Conference Room</p>
//                     </NavLink>
//                     </NavItem>
//                 </Nav>
//                 <TabContent activeTab={activeTab}>
//                 <TabPane tabId="1">
//                         <Row>
//                             <Col sm=" 12">
//                                 <div className="pt-5 d-flex flex-wrap justify-content-center">
//                                     <div className="col-lg-6">
//                                         <img src={img1} className="w-100" alt="" />
//                                     </div>
//                                 <div className="col-lg-6">
//                                         <h3 className="font-weight-bold">Restruant</h3>
//                                         <p className="pt-3">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. sed ut perspiciatis unde omnis natus error.Inventore veritatis et quasi architebeatae vitae dicta sunt explicabonemo enim ipsam voluptatem quia voluptassit.aspernatur aut odit aut fugit</p>
//                                         <p>sed quia consequunturMagni dolores eos qui ratione voluptatem sequi nesciunt.neque porro quisquam est qui dolore ipsum quia dolor sit amet, consectetur adipisci velit sed quia.</p>
//                                 </div>
//                                 </div>        
//                             </Col>
//                         </Row>
//                     </TabPane>
//                     <TabPane tabId="2">
//                         <Row>
//                             <Col sm=" 12">
//                                 <div className="pt-5 d-flex flex-wrap justify-content-center">
//                                     <div className="col-lg-6">
//                                         <img src={img2} className="w-100" alt="" />
//                                     </div>
//                                 <div className="col-lg-6">
//                                         <h3 className="font-weight-bold">Health & Spa</h3>
//                                         <p className="pt-3">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. sed ut perspiciatis unde omnis natus error.Inventore veritatis et quasi architebeatae vitae dicta sunt explicabonemo enim ipsam voluptatem quia voluptassit.aspernatur aut odit aut fugit</p>
//                                         <p>sed quia consequunturMagni dolores eos qui ratione voluptatem sequi nesciunt.neque porro quisquam est qui dolore ipsum quia dolor sit amet, consectetur adipisci velit sed quia.</p>
//                                 </div>
//                                 </div>        
//                             </Col>
//                         </Row>
//                     </TabPane>
//                     <TabPane tabId="3">
//                         <Row>
//                             <Col sm=" 12">
//                                 <div className="pt-5 d-flex flex-wrap justify-content-center">
//                                     <div className="col-lg-6">
//                                         <img src={img3} className="w-100" alt="" />
//                                     </div>
//                                 <div className="col-lg-6">
//                                         <h3 className="font-weight-bold">Swimming Pool</h3>
//                                         <p className="pt-3">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. sed ut perspiciatis unde omnis natus error.Inventore veritatis et quasi architebeatae vitae dicta sunt explicabonemo enim ipsam voluptatem quia voluptassit.aspernatur aut odit aut fugit</p>
//                                         <p>sed quia consequunturMagni dolores eos qui ratione voluptatem sequi nesciunt.neque porro quisquam est qui dolore ipsum quia dolor sit amet, consectetur adipisci velit sed quia.</p>
//                                 </div>
//                                 </div>        
//                             </Col>
//                         </Row>
//                     </TabPane>
//                     <TabPane tabId="4">
//                         <Row>
//                             <Col sm=" 12">
//                                 <div className="pt-5 d-flex flex-wrap justify-content-center">
//                                     <div className="col-lg-6">
//                                         <img src={img4} className="w-100" alt="" />
//                                     </div>
//                                 <div className="col-lg-6">
//                                         <h3 className="font-weight-bold">Conference Room</h3>
//                                         <p className="pt-3">Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. sed ut perspiciatis unde omnis natus error.Inventore veritatis et quasi architebeatae vitae dicta sunt explicabonemo enim ipsam voluptatem quia voluptassit.aspernatur aut odit aut fugit</p>
//                                         <p>sed quia consequunturMagni dolores eos qui ratione voluptatem sequi nesciunt.neque porro quisquam est qui dolore ipsum quia dolor sit amet, consectetur adipisci velit sed quia.</p>
//                                 </div>
//                                 </div>        
//                             </Col>
//                         </Row>
//                     </TabPane>
//                 </TabContent>
//         </div>
//       );
//     }
    
// export default Tab;