import React, { useState, useEffect, useRef } from 'react'
import Highcharts, { color } from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

const PlotBands = props => {
    const d = props.d.split(" ").filter(v => v !== "M" && v !== "L" && v !== "z")
    const x1 = d[0]
    const y1 = d[1]
    const x2 = d[2]
    const y2 = d[3]
    const x3 = d[4]
    const y3 = d[5]
    const x4 = d[6]
    const y4 = d[7]
    return (
        <g className={props.gClass}>
            {/* <path fill="#00bf8e22" strokeWidth={0} d={props.d} ></path> */}
            {/* Left */}
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00bf8e" strokeWidth={props.strokeWidth} />
            {/* Right */}
            <line x1={x4} y1={y4} x2={x3} y2={y3} stroke="#00bf8e" strokeWidth={props.strokeWidth} />
            {/* Top */}
            <line x1={x1} y1={y1} x2={x4} y2={y4} stroke="#BF0B2399" strokeWidth={props.strokeWidth} />
        </g>
    )
}

const SingleAreaChart = props => {
    const refContainer = useRef(null);

    const navigatorZoneColors = props.data.map((v, i, arr) => {
        if (i === 0) return { value: v[0], color: "#B6B6B6" }
        // if(i>11 && i<15) console.log(v[0])
        return ( (arr[i-1][0]>=1581379820000 && arr[i-1][0]<=1581380100000) ? { value: v[0], color: "#BF0B2399", } : { value: v[0], color: "#B6B6B6" })
    })
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
            events: {
                // click: () => {}
                // render: () => {
                // }
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
            }
        ],
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%m-%d %H:%M}'
            },
            plotBands: [{ // mark the weekend
                color: '#00bf8e32',
                from: 1581379820000,
                to: 1581380100000,
                zIndex: 20,
                borderColor: '#BF0B2399',//'#00bf8e',
                borderWidth: 2,
            }],
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
                valueSuffix: '°C'
            },
            turboThreshold: 0,
        }]
    };

    // Define a custom symbol path
    Highcharts.SVGRenderer.prototype.symbols.leftarrow = (x, y, w, h) => {
        return [
            'M', x+w/2, y,
            'L', x+w/2, y + h,
            x, y + h / 2,
            'Z'
        ];
    };
    Highcharts.SVGRenderer.prototype.symbols.rightarrow = (x, y, w, h) => {
        return [
            'M', x+w/2, y,
            'L', x+w/2, y + h,
            x+w, y + h / 2,
            'Z'
        ];
    };

    return (
        <div className="">
            <HighchartsReact ref={refContainer} highcharts={Highcharts} constructorType={"stockChart"} options={options} />
        </div>
    )
}

export default SingleAreaChart