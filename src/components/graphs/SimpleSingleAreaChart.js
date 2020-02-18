import React, { useState, useEffect } from 'react'
import Highcharts, { color } from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'

const SimpleSingleAreaChart = (props) => {
    const { title } = props

    const options = {
        credits: {
            enabled: false
        },
        chart: {
            type: 'area',
            spacing: [0, 0, 30, 16],
            height: 200,
            zoomType: 'x',
            backgroundColor: "#ffffff"
        },
        title: {
            text: title,
            align: 'left',
            style: {
                color: '#000',
                fontWeight: 'bold',
                font: ' 16px "Trebuchet MS", Verdana, sans-serif'
            }
        },
        navigator: {
            enabled: false 
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        xAxis: {
            labels: {
                enabled: false
            },
            tickLength: 0
        },
        series : [
            {
                type:'area',
                name: 'Temperature',
                data: props.data,
                tooltip: {
                    valueSuffix: '°C'
                },
                turboThreshold:0,
            },
        ],
        yAxis: [
            {
                labels: {
                    align: 'right',
                    x: -6,
                    y: -3
                }
            }
        ],
        plotOptions: {
            series: {
                color: "#00BF8E",
                fillColor: {
                    linearGradient: [0, 0, 0, 200],
                    stops: [
                        [0, "#00BF8E77"],
                        [1, "#2196f300"]
                    ]
                }
            }
        }
    }
    return(
        <div className="">
            <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={options} />
        </div>
    )
}

export default SimpleSingleAreaChart