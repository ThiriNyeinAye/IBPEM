import React, { Component, useState, useEffect, useRef } from 'react'
import { createPortal } from "react-dom"
import Highcharts, { Axis } from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment from "moment-timezone"
import deepEqual from "deep-equal"
// import moment from 'moment'

// const PlotBands = props => {
//     const d = props.d.split(" ").filter(v => v !== "M" && v !== "L" && v !== "z")
//     const x1 = d[0]
//     const y1 = d[1]
//     const x2 = d[2]
//     const y2 = d[3]
//     const x3 = d[4]
//     const y3 = d[5]
//     const x4 = d[6]
//     const y4 = d[7]
//     return (
//         <g className={props.gClass}>
//             {/* <path fill="#00bf8e22" strokeWidth={0} d={props.d} ></path> */}
//             {/* Left */}
//             <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00bf8e" strokeWidth={props.strokeWidth} />
//             {/* Right */}
//             <line x1={x4} y1={y4} x2={x3} y2={y3} stroke="#00bf8e" strokeWidth={props.strokeWidth} />
//             {/* Top */}
//             <line x1={x1} y1={y1} x2={x4} y2={y4} stroke="#BF0B2399" strokeWidth={props.strokeWidth} />
//         </g>
//     )
// }

const AppConst = {
    CREATE: 2,
    UPDATE: 1,
    DEFAULT: 0,
}

class SingleAreaChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leftLine: null,
            rightLine: null,
            rangeUpdateCondition: AppConst.DEFAULT,
            options: {},
            monitorText: {}
        }
        this.chartRef = React.createRef(null)
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

    addSelectedRange = async ({ leftX, rightX }) => {
        const chart = this.chartRef.current.chart;
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
        // this.setRangeUpdateCondition(AppConst.CREATE)
        // }
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

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log(nextProps, nextState)
    //     return true
    //     // if(!deepEqual(nextProps, this.props) || !deepEqual(nextState, this.state)) return true
    //     // else return false
    //     // const empty = nextProps.data.length===0 && nextProps.anomalyDataByTime.length===0
    //     // if (!empty && !deepEqual(nextProps.data, this.props.data) && this.chartRef.current !== null) 
    //     //     return true
    //     // else if(!empty && !deepEqual(nextProps.anomalyDataByTime, this.props.anomalyDataByTime) && this.chartRef.current !== null) 
    //     //     return true 
    //     // else 
    //     //     return false
    // }

    componentDidUpdate(prevProps, prevState) {   
        const chart = this.chartRef.current.chart; 
        const empty = this.props.length===0 && this.props.anomalyDataByTime.length===0    
        if (!empty && !deepEqual(prevProps.data, this.props.data) && this.chartRef.current !== null) {
            this.setState({ options: this.initChartOption(chart, this.props) })
        }
        else if(!empty && !deepEqual(prevProps.anomalyDataByTime, this.props.anomalyDataByTime) && this.chartRef.current !== null) {
            this.setState({ options: this.initChartOption(chart, this.props) })
        } 
    }

    componentDidMount() {
        const chart = this.chartRef.current.chart;

        this.setState({ options: this.initChartOption(chart, this.props) })

        chart.container.ondblclick = (e) => {
            return this.addSelectedRange({ leftX: e.offsetX - 24, rightX: e.offsetX + 24 })
        }

        chart.container.children[0].onmousemove = e => {
            chart.pointer.normalize(e)
            e.preventDefault()
            this.refreshSelectedTimeRangeOnResize({
                chart,
                leftLine: this.state.leftLine,
                rightLine: this.state.rightLine,
                chartX: e.chartX,
                offsetX: e.offsetX,
            })
        }

        chart.container.children[0].ontouchmove = e => {
            e.preventDefault()
            chart.pointer.normalize(e)
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
        // Define a custom symbol path
        // Highcharts.SVGRenderer.prototype.symbols.leftarrow = (x, y, w, h) => {
        //     return [
        //         'M', x + w / 2, y,
        //         'L', x + w / 2, y + h,
        //         x, y + h / 2,
        //         'Z'
        //     ];
        // };
        // Highcharts.SVGRenderer.prototype.symbols.rightarrow = (x, y, w, h) => {
        //     return [
        //         'M', x + w / 2, y,
        //         'L', x + w / 2, y + h,
        //         x + w, y + h / 2,
        //         'Z'
        //     ];
        // };
        const { props } = this
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
            // <div className="" style={{ display: "none" }}>
                /* <div>{JSON.stringify(this.state.monitorText)} </div> */
                <HighchartsReact ref={this.chartRef} highcharts={Highcharts} constructorType={"stockChart"} options={this.state.options} containerProps={{ className: "" }} />
            // </div>
        )


    }

    //====================================================================
    
    setLoading = (isLoading) => {
        const chartContainer = this.chartRef.current;
        if(chartContainer!==null) {
            if(isLoading) chartContainer.chart.showLoading()
            else chartContainer.chart.hideLoading()
        }
    }

    initChartOption = (chart, props) => {
        const anomalyDataByTimeProps = props.anomalyDataByTime === undefined ? [] : props.anomalyDataByTime /*@lucy */
        const anomalyDataByTime = anomalyDataByTimeProps.map(v => ({ 
            startDate: moment.tz(v.startDate, "Europe/Lisbon").unix() * 1000, 
            endDate: moment.tz(v.endDate, "Europe/Lisbon").unix() * 1000, 
        }))
        // let navigatorZoneColors = props.data.map((v, i, arr) => {
        //     // const flag = i>0 ? anomalyDataByTime.findIndex( v1 => arr[i-1][0]>=v1.startDate-60000 && arr[i-1][0]<=v1.endDate )>-1 : false
        //     const flag = anomalyDataByTime.findIndex(v1 => v[0] >= v1.startDate && v[0] <= v1.endDate) > -1
        //     return ({
        //         value: v[0],
        //         color: flag ? "#BF0B2399" : "#B6B6B6"
        //     })
        // })

        const sortDate = anomalyDataByTime.reverse()
        
        const navigatorZoneColors = sortDate.reduce((r,v, arr) => {
            const c1 = { value: v.startDate, color: "#B6B6B6" }
            const c2 = { value: v.endDate, color: "#BF0B2399" }
            return [...r, c1, c2 ]
            
        }, [])
        navigatorZoneColors.push({ color:"#B6B6B6"})

        const zoneColors = sortDate.reduce((r,v, arr) => {
            const c1 = { value: v.startDate, color: "#00BF8E" }
            const c2 = { value: v.endDate, color: "red" }
    
            return [...r, c1, c2 ]
        }, [])
        zoneColors.push({ color: "#00BF8E" })
        // console.log("navigatorZoneColors: \n", anomalyDataByTime, "\n", navigatorZoneColors)
        // let lineZoneColors = props.data.map((v, i, arr) => {
        //     // const flag = i>0 ? anomalyDataByTime.findIndex( v1 => arr[i-1][0]>=v1.startDate-60000 && arr[i-1][0]<=v1.endDate )>-1 : false
        //     const flag = anomalyDataByTime.findIndex(v1 => v[0] >= v1.startDate && v[0] <= v1.endDate) > -1
        //     return ({
        //         value: v[0],
        //         color: flag ? "#BF0B2399" : "#00BF8E"
        //     })
        // })
        return {
            boost: {
                useGPUTranslations: true
            },
            credits: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            chart: {
                lineColor: '#00BF8E',
                spacing: [120, 0, -80, 0],
                zoomType: '', // removed by @nayhtet
                type: 'area',
                events: {
                    click: function (event) {
                        alert('x : ' + event.xAxis[0].value + '\ny : ' + event.yAxis[0].value)
                    }
                }
            },
            tooltip: {
                split: 'true',
                formatter: function() {
                    return Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + '<br />' +
                        Highcharts.numberFormat(this.y, 3) + ' °C'
                }
            },
            title: {
                style: {
                    color: '#fff',
                    font: ' 16px "Trebuchet MS", Verdana, sans-serif',
                }
            },
            yAxis: [
                {
                    min: this.props.data.map(v => v[1]).reduce((r, c) => c < r ? c : r, 0),
                    max: this.props.data.map(v => v[1]).reduce((r, c) => c > r ? c : r, 0),
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
                    // color: '#00BF8E',
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
                enabled: true,
                style: {
                    backgroundColor: "red"
                },
                top: 10,
                series: {
                    // color: "#ff7777",
                    data: props.data, //TODO:
                    type: 'column',
                    pointRange: undefined,
                    // dataGrouping: {
                    //     groupPixelWidth: 1
                    // },
                    zoneAxis: 'x',
                    zones: navigatorZoneColors
                    // zones: [
                    //     ...navigatorZoneColors, { color: "#B6B6B6" }
                    // ] 
                },
                height: 60,
                maskFill: "#44aa2210",
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
                    height: 30,
                    // lineWidth: 1,
                    // symbols: ['leftarrow', 'rightarrow'],
                    width: 14
                },
            },
            series: [{
                // lineColor: '#00BF8E',

                type:'area',
                yAxis: 0,
                showInNavigator: true,
                name: 'Temperature',
                data: props.data,//.filter((v,i) => i>30), //TODO:
                tooltip: {
                    valueSuffix: '°C'
                },
                turboThreshold: 0,
                boostThreshold: 1,
                zoneAxis: 'x',
                zones: zoneColors
                // zones: [
                //     ...lineZoneColors,
                //     {color: '#00BF8E'}
                // ]
                // zones: [
                //     ...navigatorZoneColors, { color: "#B6B6B6" }
                // ],
            }],
            /*responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    // Make the labels less space demanding on mobile
                    chartOptions: {
                        xAxis: {
                            labels: {
                                formatter: function () {
                                    return this.value.charAt(0);
                                }
                            }
                        },
                        yAxis: {
                            labels: {
                                align: 'left',
                                x: 0,
                                y: -2
                            },
                            title: {
                                text: ''
                            }
                        }
                    }
                }]
            }*/
        };
    } // end chart Options

    refreshSelectedTimeRange = ({ chart, leftLine, rightLine }) => {
        if (chart && leftLine !== null && leftLine.element !== null) {
            leftLine.element.attr({
                transform: `translate(${chart.xAxis[0].toPixels(leftLine.xValue)},${0})`
            })
        }
        if (chart && rightLine !== null && rightLine.element !== null) {
            rightLine.element.attr({
                transform: `translate(${chart.xAxis[0].toPixels(rightLine.xValue)},${0})`
            })
        }
        if (chart && leftLine !== null !== null && rightLine !== null) {
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
            this.setState({
                monitorText: {
                    ...this.state.monitorText,
                    mouse: "down"
                }
            })
            groupLeft.drag = true
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
        }
        draggablePlotHandleLeft.element.ontouchstart = (e) => {
            groupLeft.drag = true
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
        }
        draggablePlotHandleLeft.element.onmouseup = (e) => {
            this.setState({
                monitorText: {
                    ...this.state.monitorText,
                    mouse: "down"
                }
            })
            groupLeft.drag = false
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
        }
        draggablePlotHandleLeft.element.ontouchend = (e) => {
            groupLeft.drag = false
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
        }
        draggablePlotHandleLeft.element.onmouseenter = (e) => {
            e.target.attributes.style.value = e.target.attributes.style.value + "; fill: #daeeda;"
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
            e.target.attributes.style.value = e.target.attributes.style.value + "; fill: #daeeda;"
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

    setZoom = (startTime, endTime) => {
        const chart = this.chartRef.current.chart
        const diff = endTime-startTime
        chart.xAxis[0].setExtremes(startTime-diff*4, endTime+diff*4);
    }

    setZoomIn = (chart) => {
        var min = chart.xAxis[0].getExtremes().min;
        var max = chart.xAxis[0].getExtremes().max;

        const diffTime = (max - min) / (1000 * 60 * 60)
        const zoomHours = diffTime < 24 ? (1000 * 60 * 60) : diffTime < 24 * 7 ? (1000 * 60 * 60 * 24) : (1000 * 60 * 60)

        // console.log("currentXC", min, max, (max - min) / (1000 * 60 * 60), diffTime, zoomHours)
        chart.xAxis[0].setExtremes((min + zoomHours), (max - zoomHours));
    }

    setZoomOut = (chart) => {
        var min = chart.xAxis[0].getExtremes().min;
        var max = chart.xAxis[0].getExtremes().max;

        const diffTime = (max - min) / (1000 * 60 * 60)
        const zoomHours = diffTime < 24 ? (1000 * 60 * 60) : diffTime < 24 * 7 ? (1000 * 60 * 60 * 24) : (1000 * 60 * 60)

        chart.xAxis[0].setExtremes((min - zoomHours), (max + zoomHours));
    }

}

export default SingleAreaChart

// Previous Version 
/*
const SingleAreaChart = props => {
    const refContainer = useRef(null);
    const [leftLine, setLeftLine] = useState(null)
    const [rightLine, setRightLine] = useState(null)
    const [rangeUpdateCondition, setRangeUpdateCondition] = useState(AppConst.DEFAULT)

    const navigatorZoneColors = props.data.map((v, i, arr) => {
        if (i === 0) return { value: v[0], color: "#B6B6B6" }
        // if(i>11 && i<15) console.log(v[0])
        return ((arr[i - 1][0] >= 1581639130000 && arr[i - 1][0] <= 1581639190000) ? { value: v[0], color: "#BF0B2399", } : { value: v[0], color: "#B6B6B6" })
    })

    useEffect(() => {
        // console.log("Did mount: ", refContainer.current)

        const chart = refContainer.current.chart;

        chart.container.ondblclick = (e) => {
            createSelectedTimeRange({
                chart: refContainer.current.chart,
                leftLine,
                rightLine,
                setLeftLine,
                setRightLine,
                offsetXLeft: e.offsetX-6,
                offsetXRight: e.offsetX+6,
            })
            setRangeUpdateCondition(AppConst.CREATE)
        }

        chart.container.onmousemove = (e) => {
            chart.pointer.normalize(e)
            return refreshSelectedTimeRangeOnResize({
                chart,
                leftLine,
                rightLine,
                chartX: e.chartX,
                offsetX: e.offsetX,
            })
        }
        chart.container.ontouchmove = (e) => {
            chart.pointer.normalize(e)
            return refreshSelectedTimeRangeOnResize({
                chart,
                leftLine,
                rightLine,
                chartX: e.chartX,
                offsetX: e.offsetX,
            })
        }

        chart.container.onclick = e => {
            // chart.showLoading("....Loading....")
            // console.log("Click: ", `${e.offsetX } : ${chart.xAxis[0].toValue(e.offsetX)} : ${moment.unix(chart.xAxis[0].toValue(e.offsetX)/1000).format("YYYY-DD-MM HH:mm:ss")}`)
        }

    }, [leftLine, setLeftLine, rightLine, setRightLine, rangeUpdateCondition, setRangeUpdateCondition])

    const options = {
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
            zoomType: 'x',
            type: 'area',
            events:{
                click: function(event) {
                    //console.log('event', event);
                    alert('x : '+ event.xAxis[0].value + '\ny : '+ event.yAxis[0].value)
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
                    text: 'Temperature (Â°C)',
                    style: {
                        color: '#000'
                    },
                    x: 12,
                    rotation: -90
                }
            }
        ],
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%m-%d %H:%M}'
            },
            // plotBands: [{ // mark the weekend
            //     color: '#00bf8e32',
            //     from: 1581379820000,
            //     to: 1581380100000,
            //     zIndex: 20,
            //     borderColor: '#BF0B2399',//'#00bf8e',
            //     borderWidth: 2,
            // }],
            events: {
                afterSetExtremes: e => {
                    refreshSelectedTimeRange({
                        chart: refContainer.current.chart,
                        leftLine: leftLine,
                        rightLine: rightLine
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
                    afterAnimate: function() {
                        // TODO: laters
                        // if(leftLine===null || rightLine===null) {
                        //     createSelectedTimeRange({
                        //         chart: refContainer.current.chart,
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
                data: props.data,
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
        series: [{
            lineColor: '#00BF8E',
            yAxis: 0,
            showInNavigator: true,
            name: 'Temperature',
            data: props.data,//.filter((v,i) => i>30),
            tooltip: {
                valueSuffix: 'Â°C'
            },
            turboThreshold: 0,
        }]
    };

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
            {props.ControlPanel && <props.ControlPanel
                setZoomIn={e => setZoomIn(refContainer.current.chart,e)}
                setZoomOut={e => setZoomOut(refContainer.current.chart,e)} />}
            <HighchartsReact ref={refContainer} highcharts={Highcharts} constructorType={"stockChart"} options={options} />
        </div>
    )
}

export default SingleAreaChart

const refreshSelectedTimeRange = ({ chart, leftLine, rightLine}) => {
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
    if(leftLine !== null !== null && rightLine !== null) {
        if(document.getElementById("redRoof")!==null)
            document.getElementById("redRoof").attributes.d.value = `M ${chart.xAxis[0].toPixels(leftLine.xValue)} ${chart.plotTop} L ${chart.xAxis[0].toPixels(rightLine.xValue)} ${chart.plotTop}`
    }
}

const refreshSelectedTimeRangeOnResize = ({ chart, leftLine, rightLine, chartX, offsetX}) => {
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
        if(leftLine !== null && rightLine !==null) {
            if(document.getElementById("redRoof")!==null)
                document.getElementById("redRoof").attributes.d.value = `M ${chart.xAxis[0].toPixels(leftLine.xValue)} ${chart.plotTop} L ${chart.xAxis[0].toPixels(rightLine.xValue)} ${chart.plotTop}`
        }
    }
}

const createSelectedTimeRange = ({ chart, offsetXLeft, offsetXRight, leftLine, rightLine, setLeftLine, setRightLine }) => {
    const lineWidth = 2
    const handleWidth = 24;
    const handleHeight = 24;

    console.log("left: ", leftLine)
    console.log("right: ", rightLine)

    if (leftLine !== null || rightLine !== null) {
        console.log("Clear................\n", document.getElementsByClassName("selected-range"))
        const tmpLines = document.getElementsByClassName("selected-range")
        Object.values(tmpLines).forEach(e => {
            e.remove()
        });
        setLeftLine(null);
        setRightLine(null);

        // if(document.getElementById("redRoof") !==null) document.getElementById("redRoof").remove()
        // if(leftLine !== null) {
        //     const lL = {...leftLine}
        //     document.getElementById(lL.element.element.id).remove();
        //     setLeftLine(null);
        // }
        // if(rightLine !== null) {
        //     const rL = {...rightLine}
        //     document.getElementById(rL.element.element.id).remove();
        //     setRightLine(null);
        // }
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
        chart.renderer.rect(-lineWidth/2, chart.plotTop, lineWidth, chart.plotHeight)
            .attr({
                fill: '#00BF8E99',
                zIndex: 100,
            })
            .add(groupLeft);
        const yH = chart.plotTop+chart.plotHeight/2
        chart.renderer.path()
            .attr({
                zIndex: 102,
                d: `M -4 ${yH-6} L -9 ${yH}, -4 ${yH+6} M 4 ${yH-6} L 9 ${yH}, 4 ${yH+6} M -9 ${yH} L 9 ${yH}`,
                style: "stroke: #00BF8E; stroke-width: 1px; cursor: col-resize",
            })
            .add(groupLeft)
        const draggablePlotHandleLeft = chart.renderer.rect(-handleWidth/2, chart.plotTop+chart.plotHeight/2-handleHeight/2, handleWidth, handleHeight) //offsetXLeft-handleWidth/2+lineWidth/2, chart.plotTop+chart.plotHeight/2-handleHeight/2
            .attr({
                fill: '#f5f5f5',
                style: "stroke: #00BF8E99; cursor: col-resize; stroke-width: 2px",
                zIndex: 101,
                rx: 4
            })
            .add(groupLeft);
            draggablePlotHandleLeft.element.onmousedown = function (e) {
            e.preventDefault()
            groupLeft.drag = true
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
        }
        draggablePlotHandleLeft.element.ontouchstart = function (e) {
            e.preventDefault()
            groupLeft.drag = true
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
        }
        draggablePlotHandleLeft.element.onmouseup = function (e) {
            e.preventDefault()
            groupLeft.drag = false
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
        }
        draggablePlotHandleLeft.element.ontouchend = function (e) {
            e.preventDefault()
            groupLeft.drag = false
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
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
        chart.renderer.rect(-lineWidth/2, chart.plotTop, lineWidth, chart.plotHeight)
            .attr({
                fill: '#00BF8E99',
                zIndex: 100,
            })
            .add(groupRight);
        chart.renderer.path()
            .attr({
                zIndex: 102,
                d: `M -4 ${yH-6} L -9 ${yH}, -4 ${yH+6} M 4 ${yH-6} L 9 ${yH}, 4 ${yH+6} M -9 ${yH} L 9 ${yH}`,
                style: "stroke: #00BF8E; stroke-width: 1px; cursor: col-resize",
            })
            .add(groupRight)
        const draggablePlotHandleRight = chart.renderer.rect(-handleWidth/2, chart.plotTop+chart.plotHeight/2-handleHeight/2, handleWidth, handleHeight) //offsetX-handleWidth/2+lineWidth/2, chart.plotTop+chart.plotHeight/2-handleHeight/2
            .attr({
                fill: '#f5f5f5',
                style: "stroke: #00BF8E99; cursor: col-resize; stroke-width: 2px",
                zIndex: 101,
                rx: 4
            })
            .add(groupRight);
            draggablePlotHandleRight.element.onmousedown = function (e) {
            e.preventDefault()
            groupRight.drag = true
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
        }
        draggablePlotHandleRight.element.ontouchstart = function (e) {
            e.preventDefault()
            groupRight.drag = true
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
        }
        draggablePlotHandleRight.element.onmouseup = function (e) {
            e.preventDefault()
            groupRight.drag = false
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
        }
        draggablePlotHandleRight.element.ontouchend = function (e) {
            e.preventDefault()
            groupRight.drag = false
            e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
        }

        // if (leftLine === null && rightLine === null) {
        //     setLeftLine({ xValue: chart.xAxis[0].toValue(offsetXLeft), element: groupLeft })
        // } else if(leftLine !== null && rightLine===null) {
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

export const setZoomIn = (chart) => {

    var min = chart.xAxis[0].getExtremes().min;
    var max = chart.xAxis[0].getExtremes().max;

    const diffTime = (max-min)/(1000*60*60)
    const zoomHours = diffTime<24 ? (1000*60*60) : diffTime<24*7 ? (1000*60*60*24) : (1000*60*60)

    console.log("currentXC", min, max, (max-min)/(1000*60*60), diffTime, zoomHours)

    chart.xAxis[0].setExtremes((min + zoomHours), (max - zoomHours ));
}

export const setZoomOut = (chart) => {
    var min = chart.xAxis[0].getExtremes().min;
    var max = chart.xAxis[0].getExtremes().max;

    const diffTime = (max-min)/(1000*60*60)
    const zoomHours = diffTime<24 ? (1000*60*60) : diffTime<24*7 ? (1000*60*60*24) : (1000*60*60)

    chart.xAxis[0].setExtremes((min - zoomHours), (max + zoomHours ));
}
*/