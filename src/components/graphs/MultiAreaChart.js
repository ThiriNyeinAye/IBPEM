import React, { useState, useEffect, useRef, Component } from 'react'
import Highcharts, { Axis } from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment from "moment-timezone"
import deepEqual from "deep-equal"

const AppConst = {
    CREATE: 2,
    UPDATE: 1,
    DEFAULT: 0,
}

class MultiAreaChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leftLine: null,
            rightLine: null,
            rangeUpdateCondition: AppConst.DEFAULT,
            options: {},
            monitorText: {}
        }
        this.multiChartRef = React.createRef(null)
    }

    setLeftLine = leftLine => {
        this.setState({ leftLine })
    }
    setRightLine = rightLine => {
        this.setState({ rightLine })
    }
    setRangeUpdateCondition = rangeUpdateCondition => {
        this.setState({ rangeUpdateCondition })
    }

    removeSelectedRange = () => {
        if (this.state.leftLine !== null || this.state.rightLine !== null) {
            const tmpLines = document.getElementsByClassName("selected-range")
            Object.values(tmpLines).forEach(e => {
                e.remove()
            });
            this.setLeftLine(null);
            this.setRightLine(null);
        }
    }

    addSelectedRange =  async ({ leftX, rightX }) => {
        const chart = this.multiChartRef.current.chart;
        const { leftLine, rightLine } = this.state
        if(leftLine!==null && rightLine!==null) {
            await this.removeSelectedRange()
        }
        this.createSelectedTimeRange({
            chart,
            leftLine: this.state.leftLine,
            rightLine: this.state.rightLine,
            setLeftLine: this.setLeftLine,
            setRightLine: this.setRightLine,
            offsetXLeft: leftX,
            offsetXRight: rightX,
        })
        //this.setRangeUpdateCondition(AppConst.CREATE)
    }

    tsToPixels = ts => {
        return this.chartRef.current.chart.xAxis[0].toPixels(ts)
    }
    pixelToTs = pixel => {
        return this.chartRef.current.chart.xAxis[0].toValue(pixel)
    }

    setChartOption = () => {
        this.setState({ options: this.initChartOption(this.chartRef.chart, this.props) })
    }

    componentDidUpdate(prevProps, prevState) {   
        const chart = this.multiChartRef.current.chart; 
        const empty = this.props.length===0 && this.props.anomalyDataByTime.length===0    
        if (!empty && !deepEqual(prevProps.data, this.props.data) && this.multiChartRef.current !== null) {
            this.setState({ options: this.initChartOption(chart, this.props) })
        }
        else if(!empty && !deepEqual(prevProps.anomalyDataByTime, this.props.anomalyDataByTime) && this.multiChartRef.current !== null) {
            this.setState({ options: this.initChartOption(chart, this.props) })
        } 
    }

    componentDidMount() {
        const chart = this.multiChartRef.current.chart;
       
        this.setState({ options: this.initChartOption(chart, this.props) })

        chart.container.ondblclick = (e) => {
            this.addSelectedRange({ leftX: e.offsetX - 24, rightX: e.offsetX + 24 })
        }

        chart.container.children[0].onmousemove = e => {
            chart.pointer.normalize(e)
            e.preventDefault()
            return this.refreshSelectedTimeRangeOnResize({
                chart,
                leftLine: this.state.leftLine,
                rightLine: this.state.rightLine,
                chartX: e.chartX,
                offsetX: e.offsetX,
            })
        }

        chart.container.children[0].ontouchmove = e => {
            chart.pointer.normalize(e)
            e.preventDefault()
            this.refreshSelectedTimeRangeOnResize({
                chart,
                leftLine: this.state.leftLine,
                rightLine: this.state.rightLine,
                chartX: e.chartX,
                offsetX: e.chartX,
            })
        }

        chart.container.onclick = e => {
            // chart.showLoading("....Loading....")
            // console.log("Click: ", `${e.offsetX } : ${chart.xAxis[0].toValue(e.offsetX)} : ${moment.unix(chart.xAxis[0].toValue(e.offsetX)/1000).format("YYYY-DD-MM HH:mm:ss")}`)
        }
    } // end Did mount

    render() {
        const { props } = this

        // Define a custom symbol path
        Highcharts.SVGRenderer.prototype.symbols.leftarrow = (x, y, w, h) => {
            return [
                'M', x + w / 2, y,
                'L', x + w / 2, y + h,
                x, y + h / 2,
                'Z'
            ];
        };
        Highcharts.SVGRenderer.prototype.symbols.rightarrow = (x, y, w, h) => {
            return [
                'M', x + w / 2, y,
                'L', x + w / 2, y + h,
                x + w, y + h / 2,
                'Z'
            ];
        };

        return (
            <div className="">
                <HighchartsReact ref={this.multiChartRef} highcharts={Highcharts} constructorType={"stockChart"} options={this.state.options} containerProps={{ className: "" }} />
            </div>
        )


    }

    //====================================================================
    setLoading = (isLoading) => {
        const chartContainer = this.multiChartRef.current;
        if(chartContainer!==null) {
            if(isLoading) chartContainer.chart.showLoading()
            else chartContainer.chart.hideLoading()
        }
    } 

    initChartOption = (chart, props) => {
        // const navigatorZoneColors = props.data1.map((v, i, arr) => {
        //     if (i === 0) return { value: v[0], color: "#B6B6B6" }
        //     return ((i>20 && i<26) ? { value: v[0], color: "#BF0B2399", } : { value: v[0], color: "#B6B6B6" })
        //     // return ((arr[i - 1][0] >= 1581639130000 && arr[i - 1][0] <= 1581639190000) ? { value: v[0], color: "#BF0B2399", } : { value: v[0], color: "#B6B6B6" })
        // })
        const anomalyDataByTimeProps = props.anomalyDataByTime === undefined ? [] : props.anomalyDataByTime /*@lucy */
        const anomalyDataByTime = anomalyDataByTimeProps.map(v => ({ 
            startDate: moment.tz(v.startDate, "Europe/Lisbon").unix() * 1000, 
            endDate: moment.tz(v.endDate, "Europe/Lisbon").unix() * 1000, 
        }))
        
        const navigatorZoneColors = props.data1.map(
            (v,i)=> (i===100 || i===130 || i===140 || i===165 || i===177 || i===180)? {value: v[0], color:"#BF0B2399"} : {value:v[0], color:"#B6B6B6"}
        );
        return {
            credits: {
                enabled: false
            },
            // loading: {
            //     hideDuration: 1000,
            //     showDuration: 1000
            // },
            rangeSelector: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            chart: {
                style: {
                    marginBottom: 10,
                    color: '#00BF8E'
                },
                lineColor: '#00BF8E',
                spacing: [0, 0, 30, 0],
                zoomType: '', // removed by @nayhtet
                type: 'area',
                events: {
                    click: function (event) {
                        //console.log('event', event);
                        alert('x : ' + event.xAxis[0].value + '\ny : ' + event.yAxis[0].value)
                    }
                }
            },
            tooltip: {
                split: 'true'
            },
            title: {
                text: "My chart",
                style: {
                    color: '#fff',
                    font: ' 16px "Trebuchet MS", Verdana, sans-serif',
                }
            },
            yAxis: [
                {
                    labels: {
                        align: 'right',
                        x: 4
                    },
                    title: {
                        text: 'Temperature (°C)',
                        style: {
                            color: '#000'
                        },
                        x: 12,
                        rotation: -90
                    }
                },
                {
                    // labels:{
                    //     align:'left',
                    //     x:20,
                    // },
                    // title: {
                    //     text: 'Dollar ($)',
                    //     style: {
                    //         color: '#000'
                    //     },
                    //     x:25,
                    //     rotation: -90
                    // }
                } 
            ],
            xAxis: {
                type: 'datetime',
                labels: {
                    format: '{value:%m-%d %H:%M}'
                },
                events: {
                    afterSetExtremes: e => {
                        this.refreshSelectedTimeRange({
                            chart,
                            leftLine: this.state.leftLine,
                            rightLine: this.state.rightLine
                        })
                    }
                },
            },
            plotOptions: {
                series: {
                    color: '#00BF8E',
                    fillColor: {
                        linearGradient: [0, 0, 0, 200],
                        stops: [
                            [0, "#00BF8E77"],
                            [1, "#00BF8E00"]
                        ]
                    },
                    events: {
                        afterAnimate: function () {
                            // TODO: laters
                            // if(leftLine===null || rightLine===null) {
                            //     createSelectedTimeRange({ 
                            //         chart: chartRef.current.chart, 
                            //         leftLine,
                            //         rightLine,
                            //         setLeftLine,
                            //         setRightLine,
                            //         offsetXLeft: 100,
                            //         offsetXRight: 180,
                            //     })
                            // }
                        }
                    }
                }
            },
            navigator: {
                series: {
                    // data: props.data,
                    type: 'column',
                    pointRange: undefined,
                    // dataGrouping: {
                    //     groupPixelWidth: 1
                    // },
                    zoneAxis: 'x',
                    zones: [...navigatorZoneColors, { color: "#B6B6B6" }],
                },
                height: 60,
                maskFill: "#00000015",
                xAxis: {
                    labels: {
                        enabled: true,
                        y: 12
                    },
                    left: 6,
                    right: 6,
                },
                handles: {
                    backgroundColor: "#2196f399",
                    borderColor: "#2196f399",
                    enabled: true,
                    height: 20,
                    lineWidth: 1,
                    symbols: ['leftarrow', 'rightarrow'],
                    width: 10
                },
            },
            series: [
                {
                    yAxis: 0,
                    showInNavigator: true,
                    name: 'Dollar',
                    data: props.data1,
                    zones: [
                        {
                            color: '#1A237E'
                        }
                    ],
                    tooltip: {
                        valueSuffix: '$'
                    }
                },
                {
                    // yAxis: 1,
                    showInNavigator: false,
                    name: 'Temperature',
                    data: props.data2,
                    zones: [{
                        color: '#0693E3'
                    }],
                    tooltip: {
                        valueSuffix: '°C'
                    }
                },
            ]
        };
    } // end chart Options

    refreshSelectedTimeRange = ({ chart, leftLine, rightLine }) => {
        if (leftLine !== null && leftLine.element !== null) {
            leftLine.element.attr({
                transform: `translate(${chart.xAxis[0].toPixels(leftLine.xValue)},${0})`
            })
        }
        if (rightLine !== null && rightLine.element !== null) {
            rightLine.element.attr({
                transform: `translate(${chart.xAxis[0].toPixels(rightLine.xValue)},${0})`
            })
        }
        if (leftLine !== null !== null && rightLine !== null) {
            if (document.getElementById("redRoof") !== null)
                document.getElementById("redRoof").attributes.d.value = `M ${chart.xAxis[0].toPixels(leftLine.xValue)} ${chart.plotTop} L ${chart.xAxis[0].toPixels(rightLine.xValue)} ${chart.plotTop}`
        }
    }

    refreshSelectedTimeRangeOnResize = ({ chart, leftLine, rightLine, chartX, offsetX }) => {
        let extremes = {
            left: chart.plotLeft,
            right: chart.plotLeft + chart.plotWidth
        };
        if (chartX >= extremes.left && chartX <= extremes.right) {
            if (rightLine !== null && rightLine.element !== null && rightLine.element.drag) {
                rightLine.element.attr({
                    transform: `translate(${offsetX},${0})`
                })
                rightLine.xValue = chart.xAxis[0].toValue(offsetX)
            } if (leftLine !== null && leftLine.element !== null && leftLine.element.drag) {
                leftLine.element.attr({
                    transform: `translate(${offsetX},${0})`
                })
                leftLine.xValue = chart.xAxis[0].toValue(offsetX)
            }
            if (leftLine !== null && rightLine !== null) {
                if (document.getElementById("redRoof") !== null)
                    document.getElementById("redRoof").attributes.d.value = `M ${chart.xAxis[0].toPixels(leftLine.xValue)} ${chart.plotTop} L ${chart.xAxis[0].toPixels(rightLine.xValue)} ${chart.plotTop}`
            }
        }
    }

    createSelectedTimeRange = ({ chart, offsetXLeft, offsetXRight, leftLine, rightLine, setLeftLine, setRightLine }) => {
        const lineWidth = 2
        const handleWidth = 24;
        const handleHeight = 24;

        if (leftLine !== null || rightLine !== null) {
            const tmpLines = document.getElementsByClassName("selected-range")
            Object.values(tmpLines).forEach(e => {
                e.remove()
            });
            setLeftLine(null);
            setRightLine(null);
        } else {
            const renderer = chart.renderer

            const groupLeft = renderer.g()
                .attr({
                    class: "selected-range",
                    id: Date.now(),
                    fill: '#00BF8E99',
                    zIndex: 100,
                    transform: `translate(${offsetXLeft},${0})`
                })
                .add()
            chart.renderer.rect(-lineWidth / 2, chart.plotTop, lineWidth, chart.plotHeight)
                .attr({
                    fill: '#00BF8E99',
                    zIndex: 100,
                })
                .add(groupLeft);
            const yH = chart.plotTop + chart.plotHeight / 2
            chart.renderer.path()
                .attr({
                    zIndex: 102,
                    d: `M -4 ${yH - 6} L -9 ${yH}, -4 ${yH + 6} M 4 ${yH - 6} L 9 ${yH}, 4 ${yH + 6} M -9 ${yH} L 9 ${yH}`,
                    style: "stroke: #00BF8E; stroke-width: 1px; cursor: col-resize",
                })
                .add(groupLeft)
            const draggablePlotHandleLeft = chart.renderer.rect(-handleWidth / 2, chart.plotTop + chart.plotHeight / 2 - handleHeight / 2, handleWidth, handleHeight) //offsetXLeft-handleWidth/2+lineWidth/2, chart.plotTop+chart.plotHeight/2-handleHeight/2
                .attr({
                    fill: '#f5f5f5',
                    style: "stroke: #00BF8E99; cursor: col-resize; stroke-width: 2px",
                    zIndex: 101,
                    rx: 4
                })
                .add(groupLeft);
            draggablePlotHandleLeft.element.onmousedown = (e) => {
                groupLeft.drag = true
                e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
            }
            draggablePlotHandleLeft.element.ontouchstart = (e) => {
                groupLeft.drag = true
                e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
            }
            draggablePlotHandleLeft.element.onmouseup = (e) => {
                groupLeft.drag = false
                e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
            }
            draggablePlotHandleLeft.element.ontouchend = (e) => {
                groupLeft.drag = false
                e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
            }
            draggablePlotHandleLeft.element.onmouseenter = (e) => {
                e.target.attributes.style.value = e.target.attributes.style.value+"; fill: #daeeda;"
            }
            draggablePlotHandleLeft.element.onmouseleave = (e) => {
                e.target.attributes.style.value = e.target.attributes.style.value.replace("; fill: #daeeda;", "")
            }

            // Right
            const groupRight = renderer.g()
                .attr({
                    class: "selected-range",
                    id: Date.now(),
                    fill: '#00BF8E99',
                    zIndex: 100,
                    transform: `translate(${offsetXRight},${0})`
                })
                .add()
            chart.renderer.rect(-lineWidth / 2, chart.plotTop, lineWidth, chart.plotHeight)
                .attr({
                    fill: '#00BF8E99',
                    zIndex: 100,
                })
                .add(groupRight);
            chart.renderer.path()
                .attr({
                    zIndex: 102,
                    d: `M -4 ${yH - 6} L -9 ${yH}, -4 ${yH + 6} M 4 ${yH - 6} L 9 ${yH}, 4 ${yH + 6} M -9 ${yH} L 9 ${yH}`,
                    style: "stroke: #00BF8E; stroke-width: 1px; cursor: col-resize",
                })
                .add(groupRight)
            const draggablePlotHandleRight = chart.renderer.rect(-handleWidth / 2, chart.plotTop + chart.plotHeight / 2 - handleHeight / 2, handleWidth, handleHeight) //offsetX-handleWidth/2+lineWidth/2, chart.plotTop+chart.plotHeight/2-handleHeight/2
                .attr({
                    fill: '#f5f5f5',
                    style: "stroke: #00BF8E99; cursor: col-resize; stroke-width: 2px",
                    zIndex: 101,
                    rx: 4
                })
                .add(groupRight);
            draggablePlotHandleRight.element.onmousedown = (e) => {
                groupRight.drag = true
                e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
            }
            draggablePlotHandleRight.element.ontouchstart = (e) => {
                groupRight.drag = true
                e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
            }
            draggablePlotHandleRight.element.onmouseup = (e) => {
                groupRight.drag = false
                e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
            }
            draggablePlotHandleRight.element.ontouchend = (e) => {
                groupRight.drag = false
                e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
            }
            draggablePlotHandleRight.element.onmouseenter = (e) => {
                e.target.attributes.style.value = e.target.attributes.style.value+"; fill: #daeeda;"
            }
            draggablePlotHandleRight.element.onmouseleave = (e) => {
                e.target.attributes.style.value = e.target.attributes.style.value.replace("; fill: #daeeda;", "")
            }

            chart.renderer.path()
                .attr({
                    class: "selected-range",
                    id: "redRoof",
                    d: `M ${offsetXLeft} ${chart.plotTop} L ${offsetXRight} ${chart.plotTop}`,
                    zIndex: 103,
                    style: "stroke: #ff333399; stroke-width: 4px"
                })
                .add();

            setLeftLine({ xValue: chart.xAxis[0].toValue(offsetXLeft), element: groupLeft })
            setRightLine({ xValue: chart.xAxis[0].toValue(offsetXRight), element: groupRight })
            // }     
        }
    }

    setMultiZoomIn = (chart) => {
        var min = chart.xAxis[0].getExtremes().min;
        var max = chart.xAxis[0].getExtremes().max;

        const diffTime = (max - min) / (1000 * 60 * 60)
        const zoomHours = diffTime < 24 ? (1000 * 60 * 60) : diffTime < 24 * 7 ? (1000 * 60 * 60 * 24) : (1000 * 60 * 60)

        // console.log("currentXC", min, max, (max - min) / (1000 * 60 * 60), diffTime, zoomHours)
        chart.xAxis[0].setExtremes((min + zoomHours), (max - zoomHours));
    }

    setMultiZoomOut = (chart) => {
        var min = chart.xAxis[0].getExtremes().min;
        var max = chart.xAxis[0].getExtremes().max;

        const diffTime = (max - min) / (1000 * 60 * 60)
        const zoomHours = diffTime < 24 ? (1000 * 60 * 60) : diffTime < 24 * 7 ? (1000 * 60 * 60 * 24) : (1000 * 60 * 60)

        chart.xAxis[0].setExtremes((min - zoomHours), (max + zoomHours));
    }

}

export default MultiAreaChart;

//Old version///////////////////////////////////////////

// const MultiLineChart = props => {

//     const navigatorZoneColor = data.map(
//         (v, i) => (i === 100 || i === 130 || i === 140 || i === 165 || i === 177 || i === 180) ? { value: v[0], color: "#BF0B2399" } : { value: v[0], color: "#B6B6B6" }
//     );
//     const options = {
//         credits: {
//             enabled: false
//         },
//         rangeSelector: {
//             enabled: false
//         },
//         scrollbar: {
//             enabled: false
//         },
//         responsive: {
//             rules: [{
//                 condition: {
//                     width:'100%'
//                 }
//             }]
//         },
//         chart: {
//             // style: {
//             //     marginBottom: 10
//             // },
//             spacing: [0, 0, 30, 0],
//             type: 'area'
//         },
//         tooltip: {
//             split: 'true'
//         },
//         xAxis: {
//             type: 'datetime',
//             labels: {
//                 format: '{value:%m-%d %H:%M}'
//             },
//             plotBands: [{
//                 color: '#2196f311',
//                 from: 1246814400000,
//                 to: 1248814400000,
//                 zIndex: 1,
//                 borderColor: '#2196f3ee',
//                 borderWidth: 2
//             }]
//         },
//         yAxis: [
//             {
//                 // labels: {
//                 //     align: 'left',
//                 //     x: -1060,
//                 // },
//                 // title: {
//                 //     text: 'Dollar ($)',
//                 //     style: {
//                 //         color: '#000',

//                 //     },
//                 //     x: -43,
//                 //     rotation: -90
//                 // }
//             },
//             {
//                 labels: {
//                     align: 'right',
//                     x: 20
//                 },
//                 title: {
//                     text: 'Temperature (°C)',
//                     style: {
//                         color: '#000'
//                     },
//                     x: 25,
//                     rotation: -90
//                 }
//             }
//         ],
//         plotOptions: {
//             series: {
//                 color: '#2196f3',
//                 fillColor: {
//                     linearGradient: [0, 0, 0, 170],
//                     stops: [
//                         [0, "#2196f377"],
//                         [1, "#2196f300"]
//                     ]
//                 }
//             }
//         },
//         navigator: {
//             height: 50,
//             series: {
//                 type: 'column',
//                 zoneAxis: 'x',
//                 zones: [...navigatorZoneColor, { color: "#B6B6B6" }]
//             },
//             maskFill: "#00000015",
//             xAxis: {
//                 labels:{
//                     enabled: true,
//                     y:12
//                 }
//             }
//         },
//         series: [
//             {
//                 yAxis: 0,
//                 showInNavigator: true,
//                 name: 'Dollar',
//                 data: props.data1,
//                 zones: [
//                     {
//                         color: '#1A237E'
//                     }
//                 ],
//                 tooltip: {
//                     valueSuffix: '$'
//                 }
//             },
//             {
//                 yAxis: 1,
//                 showInNavigator: true,
//                 name: 'Temperature',
//                 data: props.data2,
//                 zones: [{
//                     color: '#0693E3'
//                 }],
//                 tooltip: {
//                     valueSuffix: 'Â°C'
//                 }
//             },

//         ]
//     };

//     return (
//         <div>
//             <HighchartsReact
//                 highcharts={Highcharts}
//                 constructorType={"stockChart"}
//                 options={options}
//             />
//         </div>
//     );
// }

// export default MultiLineChart;

// const data =
//     [
//         [1235952000000, 15.79],
//         [1236038400000, 15.88],
//         [1236124800000, 16.12],
//         [1236211200000, 15.27],
//         [1236297600000, 15.28],
//         [1236556800000, 15.15],
//         [1236643200000, 16.48],
//         [1236729600000, 17.11],
//         [1236816000000, 17.01],
//         [1236902400000, 16.65],
//         [1237161600000, 16.25],
//         [1237248000000, 16.90],
//         [1237334400000, 16.96],
//         [1237420800000, 17.14],
//         [1237507200000, 17.06],
//         [1237766400000, 18.33],
//         [1237852800000, 17.93],
//         [1237939200000, 17.88],
//         [1238025600000, 18.83],
//         [1238112000000, 18.13],
//         [1238371200000, 17.48],
//         [1238457600000, 18.37],

//         [1238544000000, 19.31],
//         [1238630400000, 19.29],
//         [1238716800000, 18.75],
//         [1238976000000, 18.76],
//         [1239062400000, 18.76],
//         [1239148800000, 19.19],
//         [1239235200000, 19.67],
//         [1239321600000, 19.67],
//         [1239580800000, 19.59],
//         [1239667200000, 19.35],
//         [1239753600000, 18.83],
//         [1239840000000, 19.76],
//         [1239926400000, 19.20],
//         [1240185600000, 18.61],
//         [1240272000000, 18.97],
//         [1240358400000, 18.78],
//         [1240444800000, 18.92],
//         [1240531200000, 20.91],
//         [1240790400000, 20.40],
//         [1240876800000, 19.93],
//         [1240963200000, 20.25],
//         [1241049600000, 20.26],

//         [1241136000000, 20.24],
//         [1241395200000, 20.19],
//         [1241481600000, 19.79],
//         [1241568000000, 19.79],
//         [1241654400000, 19.32],
//         [1241740800000, 19.42],
//         [1242000000000, 19.32],
//         [1242086400000, 19.89],
//         [1242172800000, 19.75],
//         [1242259200000, 20.06],
//         [1242345600000, 20.22],
//         [1242604800000, 20.60],
//         [1242691200000, 20.31],
//         [1242777600000, 20.38],
//         [1242864000000, 19.82],
//         [1242950400000, 19.75],
//         [1243296000000, 20.34],
//         [1243382400000, 20.13],
//         [1243468800000, 20.45],
//         [1243555200000, 20.89],

//         [1243814400000, 21.40],
//         [1243900800000, 21.40],
//         [1243987200000, 21.73],
//         [1244073600000, 21.83],
//         [1244160000000, 22.14],
//         [1244419200000, 22.05],
//         [1244505600000, 22.08],
//         [1244592000000, 22.55],
//         [1244678400000, 22.83],
//         [1244764800000, 23.33],
//         [1245024000000, 23.42],
//         [1245110400000, 23.45],
//         [1245196800000, 23.68],
//         [1245283200000, 23.50],
//         [1245369600000, 24.07],
//         [1245628800000, 23.28],
//         [1245715200000, 23.34],
//         [1245801600000, 23.47],
//         [1245888000000, 23.79],
//         [1245974400000, 23.35],
//         [1246233600000, 23.86],
//         [1246320000000, 23.77],

//         [1246406400000, 24.04],
//         [1246492800000, 23.37],
//         [1246579200000, 23.37],
//         [1246838400000, 23.20],
//         [1246924800000, 22.53],
//         [1247011200000, 22.56],
//         [1247097600000, 22.44],
//         [1247184000000, 22.39],
//         [1247443200000, 23.23],
//         [1247529600000, 23.11],
//         [1247616000000, 24.12],
//         [1247702400000, 24.44],
//         [1247788800000, 24.29],
//         [1248048000000, 24.53],
//         [1248134400000, 24.83],
//         [1248220800000, 24.80],
//         [1248307200000, 25.56],
//         [1248393600000, 23.45],
//         [1248652800000, 23.11],
//         [1248739200000, 23.47],
//         [1248825600000, 23.80],
//         [1248912000000, 23.81],
//         [1248998400000, 23.52],

//         [1249257600000, 23.83],
//         [1249344000000, 23.77],
//         [1249430400000, 23.81],
//         [1249516800000, 23.46],
//         [1249603200000, 23.56],
//         [1249862400000, 23.42],
//         [1249948800000, 23.13],
//         [1250035200000, 23.53],
//         [1250121600000, 23.62],
//         [1250208000000, 23.69],
//         [1250467200000, 23.25],
//         [1250553600000, 23.58],
//         [1250640000000, 23.65],
//         [1250726400000, 23.67],
//         [1250812800000, 24.41],
//         [1251072000000, 24.64],
//         [1251158400000, 24.64],
//         [1251244800000, 24.55],
//         [1251331200000, 24.69],
//         [1251417600000, 24.68],
//         [1251676800000, 24.65],
//     ]

// const data1 =
//     [
//         [1235952000000, 87.94],
//         [1236038400000, 88.37],
//         [1236124800000, 91.17],
//         [1236211200000, 88.84],
//         [1236297600000, 85.30],
//         [1236556800000, 83.11],
//         [1236643200000, 88.63],
//         [1236729600000, 92.68],
//         [1236816000000, 96.35],
//         [1236902400000, 95.93],
//         [1237161600000, 95.42],
//         [1237248000000, 99.66],
//         [1237334400000, 101.52],
//         [1237420800000, 101.62],
//         [1237507200000, 101.59],
//         [1237766400000, 107.66],
//         [1237852800000, 106.50],
//         [1237939200000, 106.49],
//         [1238025600000, 109.87],
//         [1238112000000, 106.85],
//         [1238371200000, 104.49],
//         [1238457600000, 105.12],

//         [1238544000000, 108.69],
//         [1238630400000, 112.71],
//         [1238716800000, 115.99],
//         [1238976000000, 118.45],
//         [1239062400000, 115.00],
//         [1239148800000, 116.32],
//         [1239235200000, 119.57],
//         [1239321600000, 119.57],
//         [1239580800000, 120.22],
//         [1239667200000, 118.31],
//         [1239753600000, 117.64],
//         [1239840000000, 121.45],
//         [1239926400000, 123.42],
//         [1240185600000, 120.50],
//         [1240272000000, 121.76],
//         [1240358400000, 121.51],
//         [1240444800000, 125.40],
//         [1240531200000, 123.90],
//         [1240790400000, 124.73],
//         [1240876800000, 123.90],
//         [1240963200000, 125.14],
//         [1241049600000, 125.83],

//         [1241136000000, 127.24],
//         [1241395200000, 132.07],
//         [1241481600000, 132.71],
//         [1241568000000, 132.50],
//         [1241654400000, 129.06],
//         [1241740800000, 129.19],
//         [1242000000000, 129.57],
//         [1242086400000, 124.42],
//         [1242172800000, 119.49],
//         [1242259200000, 122.95],
//         [1242345600000, 122.42],
//         [1242604800000, 126.65],
//         [1242691200000, 127.45],
//         [1242777600000, 125.87],
//         [1242864000000, 124.18],
//         [1242950400000, 122.50],
//         [1243296000000, 130.78],
//         [1243382400000, 133.05],
//         [1243468800000, 135.07],
//         [1243555200000, 135.81],

//         [1243814400000, 139.35],
//         [1243900800000, 139.49],
//         [1243987200000, 140.95],
//         [1244073600000, 143.74],
//         [1244160000000, 144.67],
//         [1244419200000, 143.85],
//         [1244505600000, 142.72],
//         [1244592000000, 140.25],
//         [1244678400000, 139.95],
//         [1244764800000, 136.97],
//         [1245024000000, 136.09],
//         [1245110400000, 136.35],
//         [1245196800000, 135.58],
//         [1245283200000, 135.88],
//         [1245369600000, 139.48],
//         [1245628800000, 137.37],
//         [1245715200000, 134.01],
//         [1245801600000, 136.22],
//         [1245888000000, 139.86],
//         [1245974400000, 142.44],
//         [1246233600000, 141.97],
//         [1246320000000, 142.43],

//         [1246406400000, 142.83],
//         [1246492800000, 140.02],
//         [1246579200000, 140.02],
//         [1246838400000, 138.61],
//         [1246924800000, 135.40],
//         [1247011200000, 137.22],
//         [1247097600000, 136.36],
//         [1247184000000, 138.52],
//         [1247443200000, 142.34],
//         [1247529600000, 142.27],
//         [1247616000000, 146.88],
//         [1247702400000, 147.52],
//         [1247788800000, 151.75],
//         [1248048000000, 152.91],
//         [1248134400000, 151.51],
//         [1248220800000, 156.74],
//         [1248307200000, 157.82],
//         [1248393600000, 159.99],
//         [1248652800000, 160.10],
//         [1248739200000, 160.00],
//         [1248825600000, 160.03],
//         [1248912000000, 162.79],
//         [1248998400000, 163.39],

//         [1249257600000, 166.43],
//         [1249344000000, 165.55],
//         [1249430400000, 165.11],
//         [1249516800000, 163.91],
//         [1249603200000, 165.51],
//         [1249862400000, 164.72],
//         [1249948800000, 162.83],
//         [1250035200000, 165.31],
//         [1250121600000, 168.42],
//         [1250208000000, 166.78],
//         [1250467200000, 159.59],
//         [1250553600000, 164.00],
//         [1250640000000, 164.60],
//         [1250726400000, 166.33],
//         [1250812800000, 169.22],
//         [1251072000000, 169.06],
//         [1251158400000, 169.40],
//         [1251244800000, 167.41],
//         [1251331200000, 169.45],
//         [1251417600000, 170.05],
//         [1251676800000, 168.21],
//     ]