import React, { Component, PureComponent, useState, useEffect, useRef } from 'react'
import { createPortal } from "react-dom"
import Highcharts, { Axis } from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment, { defaultFormatUtc } from "moment-timezone"
import { format, getUnixTime } from 'date-fns'
import { zonedTimeToUtc } from "date-fns-tz"
import deepEqual from "deep-equal"
import * as d3 from "d3"
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

class SingleAreaChart extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            rangeUpdateCondition: AppConst.DEFAULT,
            // options: {},
            monitorText: {}
        }
        this.chartRef = React.createRef(null)
        this.options = {}
    }

    //=========================================================================================

    createSelecedArea = ({ startTs, endTs }) => {
        const rect = d3.select(".highcharts-plot-border")
        if(d3.select("#selectedSvg").node()!==null) d3.select("#selectedSvg").node().remove()
   
        const xValue = this.tsToPixels(startTs)
        const endXValue = this.tsToPixels(endTs)
        const width = endXValue-xValue
        
        const svg = d3.select(".highcharts-root")
            .append("svg")
            .attr("id", "selectedSvg")
        const g = svg.append("g")
            .attr("startTs", startTs)
            .attr("endTs", endTs)
            .attr("pressed-id", null)
            .attr("id", "rect")
            .attr("x", xValue)
            .attr("y", rect.attr("y"))
            .attr("width", width)
            .attr("height", rect.attr("height"))
            .attr("z-index", 100)
            .attr("fill", "#28a74522")
            .attr("cursor", "pointer")
            .attr("opacity", 0.8)
            .attr("stroke", "#28a745")
            .attr("stroke-width", 0)
            .attr("transform", `translate (${xValue} ${rect.attr("y")})`)
            
        g.append("rect")
            .attr("id", "rect-body")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", g.attr("width"))
            .attr("height", g.attr("height"))

        g.append("rect")
            .attr("id", "slider-left-bar")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 2)
            .attr("height", g.attr("height"))
            .attr("fill", "#28a745")
        g.append("rect")
            .attr("id", "slider-right-bar")
            .attr("x", Number(g.attr("width")))
            .attr("y", 0)
            .attr("width", 2)
            .attr("height", g.attr("height"))
            .attr("fill", "#28a745")
        
        g.append("path")
            .attr("id", "slider-left-handle")
            .attr("d", `
                M-8 ${Number(g.attr("height"))/3-16}
                L8 ${Number(g.attr("height"))/3-16}
                L8 ${Number(g.attr("height"))/3}
                L-8 ${Number(g.attr("height"))/3}
                Z
                M-6 ${Number(g.attr("height"))/3-8}
                L6 ${Number(g.attr("height"))/3-8}
                
                M-2 ${Number(g.attr("height"))/3-12}
                L-6 ${Number(g.attr("height"))/3-8}
                L-2 ${Number(g.attr("height"))/3-4}

                M2 ${Number(g.attr("height"))/3-12}
                L6 ${Number(g.attr("height"))/3-8}
                L2 ${Number(g.attr("height"))/3-4}
            `)
            .attr("stroke-linejoin", "round")
            .attr("fill", "#f5fef5")
            .attr("stroke", "#28a745")
            .attr("stroke-width", 1.4)
            .attr("cursor", "col-resize")
        g.append("path")
            .attr("id", "slider-right-handle")
            .attr("x", Number(g.attr("x")))
            .attr("y", 0)
            .attr("d", `
                M${Number(g.attr("width"))-8} ${Number(g.attr("height"))/3-16}
                L${Number(g.attr("width"))+8} ${Number(g.attr("height"))/3-16}
                L${Number(g.attr("width"))+8} ${Number(g.attr("height"))/3}
                L${Number(g.attr("width"))-8} ${Number(g.attr("height"))/3}
                Z
                M${Number(g.attr("width"))-6} ${Number(g.attr("height"))/3-8}
                L${Number(g.attr("width"))+6} ${Number(g.attr("height"))/3-8}
                
                M${Number(g.attr("width"))-2} ${Number(g.attr("height"))/3-12}
                L${Number(g.attr("width"))-6} ${Number(g.attr("height"))/3-8}
                L${Number(g.attr("width"))-2} ${Number(g.attr("height"))/3-4}

                M${Number(g.attr("width"))+2} ${Number(g.attr("height"))/3-12}
                L${Number(g.attr("width"))+6} ${Number(g.attr("height"))/3-8}
                L${Number(g.attr("width"))+2} ${Number(g.attr("height"))/3-4}
            `)
            .attr("stroke-linejoin", "round")
            .attr("fill", "#f5fef5")
            .attr("stroke", "#28a745")
            .attr("stroke-width", 1.4)
            .attr("cursor", "col-resize")

        g.append("rect")
            .attr("id", "represented-bar")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", Number(g.attr("width"))+2)
            .attr("height", 3)
            .attr("fill", "#dc3545")

        const updateSelectedArea = this.updateSelectedArea
        const tsToPixels = this.tsToPixels
        const pixelToTs = this.pixelToTs

        const handleDragAndMove = d3.drag()
            .subject(function () {
                const me = d3.select(this);
                return { x: me.attr('x'), y: me.attr('y') }
            })
            .on("start", function() {
                const me = d3.select(this)
                const targetId = d3.event.sourceEvent.target ? d3.event.sourceEvent.target.id : null
                if(targetId!==null) {
                    me.raise()
                        .attr("opacity", 1)
                        .attr("pressed-id", targetId)
                }
            })
            .on('drag', function () {  
                const e = d3.event
                const me = d3.select(this)
                const targetId = me.attr("pressed-id")
                if(targetId!==null && (targetId==="slider-left-handle" || targetId==="slider-right-handle") && Number(me.attr("width"))+e.dx>=16) {
                    if(targetId==="slider-left-handle") {
                        me.raise().attr("x", e.x)                
                        me.raise().attr("width", Number(me.attr("width"))-e.dx) 
                        me.raise().attr("transform", `translate (${e.x} ${Math.floor(Number(me.attr("y")))})`)
                        updateSelectedArea()
                    } else {
                        me.raise().attr("width", Number(me.attr("width"))+e.dx) 
                        updateSelectedArea()     
                    }     
                }
                else if(targetId!==null && targetId==="rect-body" && e.x>=Number(rect.attr("x")) && e.x<=Number(rect.attr("width"))-Number(me.attr("width"))) {
                    me.raise().attr("x", e.x)                
                    me.raise().attr("transform", `translate (${e.x} ${Math.floor(Number(me.attr("y")))})`)
                    me.attr("startTs", pixelToTs(e.x))
                    me.attr("endTs", pixelToTs(e.x+Number(me.attr("width"))))
                }

            })
            .on("end", function() {
                const me = d3.select(this)
                me.raise()
                    .attr("opacity", 0.8)
                    .attr("pressed-id", null)
            })
        handleDragAndMove(d3.select("#selectedSvg > #rect"))    
    }

    updateSelectedAreaParent = () => {
        const g = d3.select("#selectedSvg > #rect")
        if(g.node()!=null) {
            const xValue = this.tsToPixels(Number(g.attr("startTs")))
            const endXValue = this.tsToPixels(Number(g.attr("endTs")))
            // console.log(endXValue, xValue)
            g.attr("x", xValue)   
            g.attr("width", endXValue-xValue)             
            g.attr("transform", `translate (${xValue} ${Math.floor(Number(g.attr("y")))})`)
            this.updateSelectedArea()
        }
    }

    updateSelectedArea = () => {
        const g = d3.select("#selectedSvg > #rect")
        if(g.node()===null) return
        g.attr("startTs", this.pixelToTs(Number(g.attr("x"))))
        g.attr("endTs", this.pixelToTs( Number(g.attr("x"))+Number(g.attr("width")) ) )

        g.select("#rect-body")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", g.attr("width"))
            // .attr("height", g.attr("height"))

        g.select("#slider-left-bar")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 2)
            // .attr("height", g.attr("height"))
        g.select("#slider-right-bar")
            .attr("x", Number(g.attr("width")))
            .attr("y", 0)
            .attr("width", 2)
            // .attr("height", g.attr("height"))
        
        g.select("#slider-left-handle")
            .attr("d", `
                M-8 ${Number(g.attr("height"))/3-16}
                L8 ${Number(g.attr("height"))/3-16}
                L8 ${Number(g.attr("height"))/3}
                L-8 ${Number(g.attr("height"))/3}
                Z
                M-6 ${Number(g.attr("height"))/3-8}
                L6 ${Number(g.attr("height"))/3-8}
                
                M-2 ${Number(g.attr("height"))/3-12}
                L-6 ${Number(g.attr("height"))/3-8}
                L-2 ${Number(g.attr("height"))/3-4}

                M2 ${Number(g.attr("height"))/3-12}
                L6 ${Number(g.attr("height"))/3-8}
                L2 ${Number(g.attr("height"))/3-4}
            `)
        g.select("#slider-right-handle")
            .attr("d", `
                M${Number(g.attr("width"))-8} ${Number(g.attr("height"))/3-16}
                L${Number(g.attr("width"))+8} ${Number(g.attr("height"))/3-16}
                L${Number(g.attr("width"))+8} ${Number(g.attr("height"))/3}
                L${Number(g.attr("width"))-8} ${Number(g.attr("height"))/3}
                Z
                M${Number(g.attr("width"))-6} ${Number(g.attr("height"))/3-8}
                L${Number(g.attr("width"))+6} ${Number(g.attr("height"))/3-8}
                
                M${Number(g.attr("width"))-2} ${Number(g.attr("height"))/3-12}
                L${Number(g.attr("width"))-6} ${Number(g.attr("height"))/3-8}
                L${Number(g.attr("width"))-2} ${Number(g.attr("height"))/3-4}

                M${Number(g.attr("width"))+2} ${Number(g.attr("height"))/3-12}
                L${Number(g.attr("width"))+6} ${Number(g.attr("height"))/3-8}
                L${Number(g.attr("width"))+2} ${Number(g.attr("height"))/3-4}
            `)

        g.select("#represented-bar")
            .attr("width", Number(g.attr("width"))+2)
    }   
    
    readSelectedAreaValues = () => {
        const g = d3.select("#selectedSvg > #rect")
        if(g.node()!==null) {
            return ({ startTs: g.attr("startTs"), endTs: g.attr("endTs") })
        } else {
            return null
        }
    }

    removeSelectedArea = () => {
        this.props.removeSelectedAnomaly()
        if(d3.select("#selectedSvg").node()!==null) {
            d3.select("#selectedSvg").node().remove()
        }
    }

    //=========================================================================================

    // setLeftLine = leftLine => {
    //     this.setState({ leftLine })
    // }
    // setRightLine = rightLine => {
    //     this.setState({ rightLine })
    // }

    setRangeUpdateCondition = rangeUpdateCondition => {
        this.setState({ rangeUpdateCondition })
    }

    // removeSelectedRange = () => {
    //     if (this.state.leftLine !== null || this.state.rightLine !== null) {
    //         const tmpLines = document.getElementsByClassName("selected-range")
    //         Object.values(tmpLines).forEach(e => {
    //             e.remove()
    //         });
    //         this.setLeftLine(null);
    //         this.setRightLine(null);
    //     }
    // }

    // addSelectedRange = async ({ leftX, rightX }) => {
    //     const chart = this.chartRef.current.chart;
    //     const { leftLine, rightLine } = this.state
    //     if(leftLine!==null && rightLine!==null) {
    //         await this.removeSelectedRange()
    //     }
    //     this.createSelectedTimeRange({
    //         chart,
    //         leftLine: this.state.leftLine,
    //         rightLine: this.state.rightLine,
    //         setLeftLine: this.setLeftLine,
    //         setRightLine: this.setRightLine,
    //         offsetXLeft: leftX,
    //         offsetXRight: rightX,
    //     })
    //     // this.setRangeUpdateCondition(AppConst.CREATE)
    //     // }
    // }

    tsToPixels = ts => {
        return this.chartRef.current.chart.xAxis[0].toPixels(ts)
    }
    pixelToTs = pixel => {
        return this.chartRef.current.chart.xAxis[0].toValue(pixel)
    }

    setChartOption = () => {
        this.options = this.initChartOption(this.chartRef.chart, this.props)
        this.forceUpdate()
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(!deepEqual(this.props.data, nextProps.data)) {
            return true
        } else if(!deepEqual(this.props.datum, nextProps.datum)) {
            return true
        } else {
            return false
        }
    }

    componentDidUpdate(prevProps, prevState) {  
        const empty = this.props.data.length===0 && this.props.anomalyDataByTime.length===0    
        if (!empty && (!deepEqual(prevProps.data, this.props.data) || !deepEqual(prevProps.datum, this.props.datum)) && this.chartRef.current !== null) {
            this.setChartOption()
        }     
    }

    componentDidMount() {
        const chart = this.chartRef.current.chart;

        this.setChartOption()

        chart.container.ondblclick = (e) => {
            return this.createSelecedArea({ startTs: this.pixelToTs(e.offsetX-20), endTs: this.pixelToTs(e.offsetX+20)})
        }

        chart.container.children[0].onmousemove = e => {
        }

        chart.container.children[0].ontouchmove = e => {
         
        }

        chart.container.onclick = e => {
           
        }

        

    } // end Did mount

    render() {
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
            <HighchartsReact 
                ref={this.chartRef} 
                highcharts={Highcharts} 
                constructorType={"stockChart"} 
                options={this.options} 
                oneToOne={true}
                containerProps={{ className: "" }} />
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
            startDate: getUnixTime(zonedTimeToUtc(v.startDate, "Europe/Lisbon")) * 1000,
            endDate: getUnixTime(zonedTimeToUtc(v.endDate, "Europe/Lisbon")) *1000
        }))

        const sortDate = anomalyDataByTime.reverse()
        
        const navigatorZoneColors = sortDate.reduce((r,v, arr) => {
            const c1 = { value: v.startDate, color: "#B6B6B6" }
            const c2 = { value: v.endDate, color: "#BF0B2399" }
            return [...r, c1, c2 ]
            
        }, [])
        navigatorZoneColors.push({ color:"#B6B6B6"})

        const zoneColorsEach = sortDate.reduce((r,v, arr) => {
            const c1 = { value: v.startDate, color: "#00BF8E" }
            const c2 = { value: v.endDate, color: "#BF0B2399" }
    
            return [...r, c1, c2 ]
        }, [])
        zoneColorsEach.push({ color: "#00BF8E" })
        const colors = ["#00BF8E", "#008EBE", "#A0AF6E", "#F0AF6E"]
        const zoneColors = props.datum.length> 0 ? props.datum.map( (v, i) => zoneColorsEach.map( v1 => ({ ...v1, color: v1.color==="#BF0B2399" ? v1.color : colors[i] })) ) : zoneColorsEach
       
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
                        Highcharts.numberFormat(this.y, 2)*1 + ' °C'
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
                    // min: this.props.data.map(v => v[1]).reduce((r, c) => c < r ? c : r, 0),
                    // max: this.props.data.map(v => v[1]).reduce((r, c) => c > r ? c : r, 0),
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
                        const startTs = e.min
                        const endTs = e.max
                        if(startTs && endTs && e.trigger==="navigator") {
                            props.handleFilterAnomalyData(startTs, endTs)
                            this.updateSelectedAreaParent()
                        }
                    }
                },
            },
            plotOptions: {
                series: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 200],
                        stops: [
                            [0, "#00BF8E77"],
                            [1, "#00BF8E00"]
                        ]
                    },
                    events: {
                        afterAnimate: function () {
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
                    data: props.data, //TODO:
                    type: 'column',
                    pointRange: undefined,
                    // dataGrouping: {
                    //     groupPixelWidth: 1
                    // },
                    zoneAxis: 'x',
                    zones: navigatorZoneColors
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
                    width: 14
                },
            },
            series: props.datum.length>0 
                ? props.datum.map((data, i) => ({
                    type:'area',
                    yAxis: 0,
                    showInNavigator: i===0 ? true : false,
                    name: 'Temperature',
                    data: data,
                    tooltip: {
                        valueSuffix: '°C'
                    },
                    turboThreshold: 0,
                    boostThreshold: 1,
                    zoneAxis: 'x', 
                    zones: zoneColors[i],
                }))
                : [{
                    type:'area',
                    yAxis: 0,
                    showInNavigator: true,
                    name: 'Temperature',
                    data: props.data,
                    tooltip: {
                        valueSuffix: '°C'
                    },
                    turboThreshold: 0,
                    boostThreshold: 1,
                    zoneAxis: 'x', 
                    zones: zoneColors,
                }],
        };
    } // end chart Options

    // refreshSelectedTimeRange = ({ chart, leftLine, rightLine }) => {
    //     if (chart && leftLine !== null && leftLine.element !== null) {
    //         leftLine.element.attr({
    //             transform: `translate(${chart.xAxis[0].toPixels(leftLine.xValue)},${0})`
    //         })
    //     }
    //     if (chart && rightLine !== null && rightLine.element !== null) {
    //         rightLine.element.attr({
    //             transform: `translate(${chart.xAxis[0].toPixels(rightLine.xValue)},${0})`
    //         })
    //     }
    //     if (chart && leftLine !== null !== null && rightLine !== null) {
    //         if (document.getElementById("redRoof") !== null)
    //             document.getElementById("redRoof").attributes.d.value = `M ${chart.xAxis[0].toPixels(leftLine.xValue)} ${chart.plotTop} L ${chart.xAxis[0].toPixels(rightLine.xValue)} ${chart.plotTop}`
    //     }
    // }

    // refreshSelectedTimeRangeOnResize = ({ chart, leftLine, rightLine, chartX, offsetX }) => {
    //     let extremes = {
    //         left: chart.plotLeft,
    //         right: chart.plotLeft + chart.plotWidth
    //     };
    //     if (chartX >= extremes.left && chartX <= extremes.right) {

    //         if (rightLine !== null && rightLine.element !== null && rightLine.element.drag) {
    //             rightLine.element.attr({
    //                 transform: `translate(${offsetX},${0})`
    //             })
    //             rightLine.xValue = chart.xAxis[0].toValue(offsetX)
    //         } if (leftLine !== null && leftLine.element !== null && leftLine.element.drag) {
    //             leftLine.element.attr({
    //                 transform: `translate(${offsetX},${0})`
    //             })
    //             leftLine.xValue = chart.xAxis[0].toValue(offsetX)
    //         }
    //         if (leftLine !== null && rightLine !== null) {
    //             if (document.getElementById("redRoof") !== null)
    //                 document.getElementById("redRoof").attributes.d.value = `M ${chart.xAxis[0].toPixels(leftLine.xValue)} ${chart.plotTop} L ${chart.xAxis[0].toPixels(rightLine.xValue)} ${chart.plotTop}`
    //         }
    //     }
    // }

    // createSelectedTimeRange = ({ chart, offsetXLeft, offsetXRight, leftLine, rightLine, setLeftLine, setRightLine }) => {
    //     const lineWidth = 2
    //     const handleWidth = 24;
    //     const handleHeight = 24;

    //     const renderer = chart.renderer

    //     const groupLeft = renderer.g()
    //         .attr({
    //             class: "selected-range",
    //             id: Date.now(),
    //             fill: '#00BF8E99',
    //             zIndex: 100,
    //             transform: `translate(${offsetXLeft},${0})`
    //         })
    //         .add()
    //     chart.renderer.rect(-lineWidth / 2, chart.plotTop, lineWidth, chart.plotHeight)
    //         .attr({
    //             fill: '#00BF8E99',
    //             zIndex: 100,
    //         })
    //         .add(groupLeft);
    //     const yH = chart.plotTop + chart.plotHeight / 2
    //     chart.renderer.path()
    //         .attr({
    //             zIndex: 102,
    //             d: `M -4 ${yH - 6} L -9 ${yH}, -4 ${yH + 6} M 4 ${yH - 6} L 9 ${yH}, 4 ${yH + 6} M -9 ${yH} L 9 ${yH}`,
    //             style: "stroke: #00BF8E; stroke-width: 1px; cursor: col-resize",
    //         })
    //         .add(groupLeft)
    //     const draggablePlotHandleLeft = chart.renderer.rect(-handleWidth / 2, chart.plotTop + chart.plotHeight / 2 - handleHeight / 2, handleWidth, handleHeight) //offsetXLeft-handleWidth/2+lineWidth/2, chart.plotTop+chart.plotHeight/2-handleHeight/2
    //         .attr({
    //             fill: '#f5f5f5',
    //             style: "stroke: #00BF8E99; cursor: col-resize; stroke-width: 2px",
    //             zIndex: 101,
    //             rx: 4
    //         })
    //         .add(groupLeft);
    //     draggablePlotHandleLeft.element.onmousedown = (e) => {
    //         this.setState({
    //             monitorText: {
    //                 ...this.state.monitorText,
    //                 mouse: "down"
    //             }
    //         })
    //         groupLeft.drag = true
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
    //     }
    //     draggablePlotHandleLeft.element.ontouchstart = (e) => {
    //         groupLeft.drag = true
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
    //     }
    //     draggablePlotHandleLeft.element.onmouseup = (e) => {
    //         this.setState({
    //             monitorText: {
    //                 ...this.state.monitorText,
    //                 mouse: "down"
    //             }
    //         })
    //         groupLeft.drag = false
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
    //     }
    //     draggablePlotHandleLeft.element.ontouchend = (e) => {
    //         groupLeft.drag = false
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
    //     }
    //     draggablePlotHandleLeft.element.onmouseenter = (e) => {
    //         e.target.attributes.style.value = e.target.attributes.style.value + "; fill: #daeeda;"
    //     }
    //     draggablePlotHandleLeft.element.onmouseleave = (e) => {
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("; fill: #daeeda;", "")
    //     }

    //     // Right
    //     const groupRight = renderer.g()
    //         .attr({
    //             class: "selected-range",
    //             id: Date.now(),
    //             fill: '#00BF8E99',
    //             zIndex: 100,
    //             transform: `translate(${offsetXRight},${0})`
    //         })
    //         .add()
    //     chart.renderer.rect(-lineWidth / 2, chart.plotTop, lineWidth, chart.plotHeight)
    //         .attr({
    //             fill: '#00BF8E99',
    //             zIndex: 100,
    //         })
    //         .add(groupRight);
    //     chart.renderer.path()
    //         .attr({
    //             zIndex: 102,
    //             d: `M -4 ${yH - 6} L -9 ${yH}, -4 ${yH + 6} M 4 ${yH - 6} L 9 ${yH}, 4 ${yH + 6} M -9 ${yH} L 9 ${yH}`,
    //             style: "stroke: #00BF8E; stroke-width: 1px; cursor: col-resize",
    //         })
    //         .add(groupRight)
    //     const draggablePlotHandleRight = chart.renderer.rect(-handleWidth / 2, chart.plotTop + chart.plotHeight / 2 - handleHeight / 2, handleWidth, handleHeight) //offsetX-handleWidth/2+lineWidth/2, chart.plotTop+chart.plotHeight/2-handleHeight/2
    //         .attr({
    //             fill: '#f5f5f5',
    //             style: "stroke: #00BF8E99; cursor: col-resize; stroke-width: 2px",
    //             zIndex: 101,
    //             rx: 4
    //         })
    //         .add(groupRight);
    //     draggablePlotHandleRight.element.onmousedown = (e) => {
    //         groupRight.drag = true
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
    //     }
    //     draggablePlotHandleRight.element.ontouchstart = (e) => {
    //         groupRight.drag = true
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 2px", "stroke-width: 4px")
    //     }
    //     draggablePlotHandleRight.element.onmouseup = (e) => {
    //         groupRight.drag = false
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
    //     }

    //     draggablePlotHandleRight.element.ontouchend = (e) => {
    //         groupRight.drag = false
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("stroke-width: 4px", "stroke-width: 2px")
    //     }
    //     draggablePlotHandleRight.element.onmouseenter = (e) => {
    //         e.target.attributes.style.value = e.target.attributes.style.value + "; fill: #daeeda;"
    //     }
    //     draggablePlotHandleRight.element.onmouseleave = (e) => {
    //         e.target.attributes.style.value = e.target.attributes.style.value.replace("; fill: #daeeda;", "")
    //     }

    //     chart.renderer.path()
    //         .attr({
    //             class: "selected-range",
    //             id: "redRoof",
    //             d: `M ${offsetXLeft} ${chart.plotTop} L ${offsetXRight} ${chart.plotTop}`,
    //             zIndex: 103,
    //             style: "stroke: #ff333399; stroke-width: 4px"
    //         })
    //         .add();

    //     setLeftLine({ xValue: chart.xAxis[0].toValue(offsetXLeft), element: groupLeft })
    //     setRightLine({ xValue: chart.xAxis[0].toValue(offsetXRight), element: groupRight })
    //     // }     
    // }

    setZoom = (startTime, endTime) => {
        const chart = this.chartRef.current.chart
        const diff = endTime-startTime
        chart.xAxis[0].setExtremes(startTime-diff*4, endTime+diff*4);
    }

    setZoomIn = (chart) => {
        var min = chart.xAxis[0].getExtremes().min;
        var max = chart.xAxis[0].getExtremes().max;

        const diffTime = (max - min) / (1000 * 60 * 60)
        //console.log('min: ', moment(min).format('DD-MM hh:mm') , '\nmax: ', moment(max).format('DD-MM hh:mm'))
       
        const zoomHours = 1000* 60 * 60 * 3
        //const zoomHours = diffTime < 24 ? (1000 * 60 * 60) : diffTime < 24 * 7 ? (1000 * 60 * 60 * 24) : (1000 * 60 * 60)

        diffTime < 6 ?  chart.xAxis[0].setExtremes((min + 0), (max - 0)) : chart.xAxis[0].setExtremes((min + zoomHours), (max - zoomHours))
        
        
    }

    setZoomOut = (chart) => {
        var min = chart.xAxis[0].getExtremes().min;
        var max = chart.xAxis[0].getExtremes().max;

        const diffTime = (max - min) / (1000 * 60 * 60)
        const zoomHours = 1000 * 60 * 60 * 3
        //const zoomHours = diffTime < 24 ? (1000 * 60 * 60) : diffTime < 24 * 7 ? (1000 * 60 * 60 * 24) : (1000 * 60 * 60)

        chart.xAxis[0].setExtremes((min - zoomHours), (max + zoomHours));
    }

}

export default SingleAreaChart