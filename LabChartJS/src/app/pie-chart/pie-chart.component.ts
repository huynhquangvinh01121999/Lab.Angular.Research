import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  public pieChart: any;

  constructor() { }

  ngOnInit(): void {
    this.createPieChart();
  }

  createPieChart() {
    var data =
    {
      labels: ['2023-01-01', '2023-01-02', '2023-01-03', '2023-01-04'],
      datasets: [
        {
          data: [25, 35, 25, 15],
          backgroundColor: ["rgb(30,144,255,0.5)", "rgb(255,20,0,0.5)", "whitesmoke", "#B8D9B0"],
          borderColor: "#3C7363",
          borderWidth: 0.5,
          weight: 0.2,
          label: "This is data1",
        }
      ],
    }

    var options: Chart.ChartOptions = {
      // cutoutPercentage: 20, // Tỷ lệ phần trăm của biểu đồ bị cắt ra khỏi phần giữa
      // rotation: -0.5 * Math.PI
      // circumference: 2 * Math.PI
      legend: {
        position: "left",
        // labels:{
        //   padding: 100
        // }
      },
      title: {
        display: true,
        text: "Đây là Pie Chart"
      },
      animation: {
        // animateRotate: true,
        //animateScale: true,  // hiệu ứng phóng to
        // duration: 10,

        // chức năng show percent 
        onComplete: () => {
          var ctx: any = this.pieChart.ctx;
          ctx.textAlign = 'center';

          // hiển thị value phần trăm trên từng phần 
          data.datasets.forEach((dataset: any) => {
            for (var i = 0; i < dataset.data.length; i++) {
              var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle) / 2;

              var x = mid_radius * Math.cos(mid_angle);
              var y = mid_radius * Math.sin(mid_angle);

              ctx.fillStyle = 'black';
              ctx.font = "bold 20px Arial";  // https://www.w3schools.com/tags/canvas_font.asp

              var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";

              if (dataset.data[i] != 0 && dataset._meta[Object.keys(dataset._meta)[0]].data[i].hidden != true) {
                ctx.fillText(percent, model.x + x, model.y + y);
              }
            }
          })
        }
      }
    }

    this.pieChart = new Chart("pieChart", {
      type: 'pie',
      data: data,
      options: options,
      plugins: [
        {
          beforeInit(chart: any, options: any) {
            // console.log(chart.legend);

            const originalFit = chart.legend.fit;

            chart.legend.fit = function fit() {

              originalFit.bind(chart.legend)();
               this.width -= 200;
            }
          },
          afterInit(chart: any, options: any) {

            const originalFit = chart.legend.fit;

            chart.legend.fit = function fit() {

              originalFit.bind(chart.legend)();

              this.height += 20;
            }
          },
        }
      ]
    });
  }

  createPieChart_v2() {
    var data = {
      datasets: [{
        data: [
          11,
          16,
          7,
          3,
          14
        ],
        backgroundColor: [
          "#FF6384",
          "#4BC0C0",
          "#FFCE56",
          "#E7E9ED",
          "#36A2EB"
        ],
        label: 'My dataset' // for legend
      }],
      labels: [
        "Red",
        "Green",
        "Yellow",
        "Grey",
        "Blue"
      ]
    };

    var pieOptions: Chart.ChartOptions = {
      events: [],
      animation: {
        duration: 500,
        easing: "easeInBounce",
        onComplete: function () {
          var ctx: any = pieChart.ctx;
          ctx.font = 'normal'
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          data.datasets.forEach(function (dataset: any) {

            for (var i = 0; i < dataset.data.length; i++) {
              var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle) / 2;

              var x = mid_radius * Math.cos(mid_angle);
              var y = mid_radius * Math.sin(mid_angle);

              ctx.fillStyle = '#fff';
              if (i == 3) { // Darker text color for lighter background
                ctx.fillStyle = '#444';
              }
              var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
              //Don't Display If Legend is hide or value is 0
              // if (dataset.data[i] != 0 && dataset._meta[0].data[i].hidden != true) {
              //   ctx.fillText(dataset.data[i], model.x + x, model.y + y);
              //   // Display percent in another line, line break doesn't work for fillText
              //   ctx.fillText(percent, model.x + x, model.y + y + 15);
              // }

              ctx.fillText(10, model.x + x, model.y + y);
              ctx.fillText(percent, model.x + x, model.y + y + 15);
            }
          });
        }
      }
    };

    var pieChart = new Chart('pieChart', {
      type: 'pie',
      data: data,
      options: pieOptions,
      plugins: [
        {
          beforeInit(chart: any, options: any) {
            // Get reference to the original fit function
            const originalFit = chart.legend.fit;

            // Override the fit function
            chart.legend.fit = function fit() {
              // Call original function and bind scope in order to use `this` correctly inside it
              originalFit.bind(chart.legend)();
              // Change the height as suggested in another answers
              this.height += 20;
            }
          },
          afterInit(chart: any, options: any) {
            // Get reference to the original fit function
            const originalFit = chart.legend.fit;

            chart.legend.fit = function fit() {
              // Call original function and bind scope in order to use `this` correctly inside it
              originalFit.bind(chart.legend)();
              // Change the height as suggested in another answers
              this.height = this.height + 20;
            }
          },
        }
      ]
    });
  }
}
