import { ChartType } from './jobs.model';

const ressourcesChart: ChartType = {
    name: "All resources/Last week resources",
    count:0,
    series: [{
        name: "Resources",
        data: [],
    },],
    chart: {
        width: 130,
        height: 46,
        type: "area",
        sparkline: {
            enabled: true,
        },
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
        width: 1.5,
    },
    colors: ['#34c38f'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100],
        },
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
};

const QueriesChart: ChartType = {
    name: "All queries/Last week queries",
    count:0,
    series: [{
        name: "New Application",
        data: [],
    },],
    chart: {
        width: 130,
        height: 46,
        type: "area",
        sparkline: {
            enabled: true,
        },
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
        width: 1.5,
    },
    colors: ['#34c38f'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100],
        },
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
};

const SizeOnDiskChart: ChartType = {
    name: "Data size on disk/Last week data size",
    count:0,
    series: [{
        name: "Total Approved",
        data: [],
    },],
    chart: {
        width: 130,
        height: 46,
        type: "area",
        sparkline: {
            enabled: true,
        },
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
        width: 1.5,
    },
    colors: ['#34c38f'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100],
        },
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
};

const RejectedChart: ChartType = {
    name: "Index size/Last week index size",
    count:0,
    series: [{
        name: "Total Rejected",
        data: [],
    },],
    chart: {
        width: 130,
        height: 46,
        type: "area",
        sparkline: {
            enabled: true,
        },
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: "smooth",
        width: 1.5,
    },
    colors: ['#f46a6a'],
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [50, 100, 100, 100],
        },
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    },
};

const fileTypePie: ChartType = {
    series: [],
    chart: {
      type: "donut"
    },
    labels: []
  };;


export { ressourcesChart, QueriesChart, SizeOnDiskChart, RejectedChart, fileTypePie};
