import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-bar-line-chart',
  templateUrl: './bar-line-chart.component.html',
  styleUrls: ['./bar-line-chart.component.css']
})
export class BarLineChartComponent implements OnInit {
  public barLineChart: any;

  constructor() { }

  ngOnInit(): void {
    this.createBarLineChart();
  }



  createBarLineChart() {
    var data = {
      datasets: [{
        label: 'Bar 1',
        data: [12, 25, 36, 40],
        borderColor: "red",
        backgroundColor: "rgb(255,20,0,0.5)",
        fillColor: "#79D1CF",
        strokeColor: "#79D1CF",
        order: 1  // thứ tự của data
      },
      {
        label: 'Bar 2',
        data: [15, 20, 33, 30],
        borderColor: "blue",
        backgroundColor: "rgb(30,144,255,0.5)",
        order: 2
      },
      {
        label: 'Bar 3',
        data: [25, 18, 32, 20],
        borderColor: "green",
        backgroundColor: "rgb(102,205,170,0.5)",
        order: 3
      },
      // add line chart
      {
        type: 'line',
        label: 'Line 1',
        data: [35, 24, 30, 10],
        borderColor: "rgb(139, 34, 82, 0.5)",
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderDash: [10, 3, 10],
        order: 4
      },
      {
        type: 'line',
        label: 'Line 2',
        data: [20, 35, 25, 34],
        borderColor: "rgba(0, 0, 128, 0.5)",
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderDash: [1, 2, 1],
        order: 5
      },
      {
        type: 'line',
        label: 'Line 3',
        data: [30, 15, 25, 20],
        borderColor: "rgba(0, 0, 128, 0.5)",
        backgroundColor: 'rgba(0, 0, 0, 0)',
        order: 6
      }
      ],
      labels: ['January', 'February', 'March', 'April']
    };

    var options: Chart.ChartOptions =
    {
      legend: {
        position: "bottom"
      },
      title: {
        display: true,
        text: "Đây là sự kết hợp giữa Bar & Line Chart"
      },
      tooltips: {
        enabled: false
      },
      hover: {
        animationDuration: 1
      },
      animation: {
        onComplete: () => {
          var ctx: any = this.barLineChart.ctx;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = "rgba(0, 0, 0, 1)";

          data.datasets.forEach((dataset: any) => {
            for (var i = 0; i < dataset.data.length; i++) {
              // chỉ show vs char bar
              if (dataset._meta[Object.keys(dataset._meta)[0]].type == 'bar') {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                ctx.fillText(dataset.data[i], model.x, model.y - 5);
              }
            }
          });
        }
      }
    }

    this.barLineChart = new Chart("barLineChart", {
      type: 'bar',
      data: data,
      options: options
    });
  }

}
