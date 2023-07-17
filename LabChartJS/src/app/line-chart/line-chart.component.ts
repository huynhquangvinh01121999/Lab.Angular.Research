import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  public lineChart: any;

  constructor() { }

  ngOnInit(): void {
    this.createLineChart();
  }

  createLineChart() {
    var data1: any = [2, 5, 7, 2, 4, 2, 7, 3];
    var data2: any = [5, 8, 2, 6, 3, 7, 3, 7];
    var data3: any = [1, 2, 2, 4, 3, 6, 4, 10];

    this.lineChart = new Chart("lineChart", {
      type: 'line',
      data: {
        labels: ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04', '2023-01-05', '2023-01-06', '2023-01-07', '2023-01-08'],
        datasets: [
          {
            label: "Data 1",
            //data: [{ x: 5, y: 20 }, { x: 5, y: 30 }],
            data: data1,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderCapStyle: "square",
            borderColor: "rgb(139, 34, 82, 0.5)",
            borderDash: [1, 3, 1], // tạo vạch nét đứt
            borderDashOffset: 0,
            borderJoinStyle: 'round',
            borderWidth: 0.8, // độ dày của line,
            pointBackgroundColor: "red", // màu của từng nút
            pointStyle: "triangle", // kiểu nút
            order: 1
          },
          {
            label: "Data 2",
            data: data2,
            //data: [{ x: 5, y: 20 }, { x: 5, y: 30 }],
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderCapStyle: "butt",
            borderColor: "rgba(0, 0, 128, 0.5)",
            order: 2
          },
          {
            label: "",
            data: data3,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: "rgba(0, 0, 0, 0)",
            pointBackgroundColor: "rgba(0, 0, 0, 0)", // màu của từng nút
            pointBorderColor: "rgba(0, 0, 0, 0)",
            order: 3
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            stacked: false, // true => các line xếp trồng lên nhau/ false => các line đè lên nhau
          }]
        },
        // config labels
        legend: {
          display: true,
          fullWidth: true,
          position: 'right',
          align: 'start',
          // onClick: (e, legendItem) => {
          //   alert("onClick");
          //   console.log(e);
          //   console.log(legendItem);
          // },
          // onHover: (e, legendItem) => {
          //   alert("onHover");
          //   console.log(e);
          //   console.log(legendItem);
          // },
          labels: {
            boxWidth: 50, // kích thước box
            fontSize: 16,
            fontStyle: "bold", // normal - bold - italic
            fontColor: "#3C7363",
            fontFamily: "Times New Roman"
          }
        },
        legendCallback: (chart: Chart): string => {
          console.log("legendCallback");
          return '<h3>legendCallback</h3>'
        },
        title: {
          display: true,
          text: 'Đây là title của Line Chart'
        },
        tooltips: {
          callbacks: {
            labelColor: function (tooltipItem, chart) {
              return {
                borderColor: 'rgb(255, 0, 0)',
                backgroundColor: 'rgb(255, 0, 0)'
              };
            },
            labelTextColor: function (tooltipItem, chart) {
              return 'white'; // màu chữ tooltip
            }
          }
        }
        // layout: {
        //   padding: {
        //     left: 50,
        //     right: 0,
        //     top: 0,
        //     bottom: 0
        //   },
        // }
      }
    }).generateLegend();
  }
}
