import styles from './StatisticChartView.module.css'
import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../providers/context/Settings";
import ReactApexChart from 'react-apexcharts';

export default function StatisticChartView({originalTransactions, modTransactions}) {
    const {settingsState} = useContext(SettingsContext);
    const chart = useRef()
    const [cat, setCat] = useState()
    const [options] = useState({
        series: [{
            name: '',
            data: modTransactions?.map(el => el[1])
        }],
        
        options: {
            chart: {
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    colors: {
                        ranges: [{
                            from: -1000000,
                            to: 0,
                            color: '#dc3545'
                        }, {
                            from: 0,
                            to: 1000000,
                            color: '#20c997'
                        }]
                    },
                    columnWidth: '80%',
                    dataLabels: {
                        position: 'top'
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return `${val} ${settingsState.currency}`;
                },
                style: {
                    colors: [settingsState.theme === 'light'? '#000' : '#fff']
                },
                offsetY: -20
            },theme: {
                mode: settingsState.theme
            },
            xaxis: {
                type: 'string',
                categories: modTransactions?.map(el => el[0]),
                labels: {
                    rotate: -90
                }
            },
            yaxis: {
                labels: {
                    formatter: function (val) {
                        return `${val} ${settingsState.currency}`
                    }
                }
                
            },
            chart: {
                events: {
                    dataPointSelection: function(event, chartContext, config) {
                        setCat(modTransactions[config.dataPointIndex][0])
                    }
                }
            }
        },      
    })
    
    return (<>
        <ReactApexChart ref={chart} options={options.options} series={options.series} type="bar"  />
        {cat ? <>
            <h2 className={styles.details__heading}>{cat}</h2>
            <div className={styles.details}>
            {      
                originalTransactions.filter(el => el.category === cat).sort((a, b) => a.date - b.date).map(el => {
                    return(<div className={styles.details__item} key={el.id}>
                        <div className={styles.details__date}>{el.date.toLocaleString()}</div>
                        <div className={styles.details__from}>{el.from}</div>
                        <div className={styles.details__sum}>{el.sum} {settingsState.currency}</div>
                        </div>)
                    })
                
            }
            </div>
            
            </>: null
        }
            
            </>)
        }
        