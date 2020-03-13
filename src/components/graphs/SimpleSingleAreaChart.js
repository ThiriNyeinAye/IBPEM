import React, { useState, useEffect } from 'react'
import Highcharts, { color } from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import moment from "moment-timezone"

const SimpleSingleAreaChart = (props) => {
    const { title, height } = props

    const anomalyDataByTimeProps = props.anomalyDataByTime === undefined ? [] : props.anomalyDataByTime
    const anomalyDataByTime = anomalyDataByTimeProps.map(v => ({
        startDate: moment.tz(v.startDate, "Europe/Lisbon").unix() * 1000, 
        endDate: moment.tz(v.endDate, "Europe/Lisbon").unix() * 1000, 
    }))
    const sortDate = anomalyDataByTime.reverse()
    const zoneColors = sortDate.reduce((r,v, arr) => {
        const c1 = { value: v.startDate, color: "#00BF8E" }
        const c2 = { value: v.endDate, color: "red" }

        return [...r, c1, c2 ]
    }, [])
    zoneColors.push({ color: "#00BF8E" })

    const options = {
        
        credits: {
            enabled: false
        },
        chart: {
            type: 'area',
            spacing: [0, 0, 30, 16],
            height: `${height===undefined?"15%": height}`,
            zoomType: 'x',
            backgroundColor: "#ffffff"
        },
        tooltip: {
            split: 'true',
            formatter: function() {
                return Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + '<br />' +
                    Highcharts.numberFormat(this.y*1) + ' °C'
            }
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
                zones:[
                    ...zoneColors,
                    {
                        color:'#00BF8E'
                    }
                ],
                zoneAxis: 'x',
                type:'spline',
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