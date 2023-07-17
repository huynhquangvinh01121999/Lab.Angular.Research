import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  year: number = 2023;
  public barLineChart: any;
  data: any = {
    datasets: [],
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }

  borderColor: string[] = ["red", "yellow", "pink", "silver", "black"]
  bgColor: string[] = ["red", "yellow", "pink", "silver", "black"]
  _idx: number = 0

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.generateChart();
  }

  fn_ThongKeNgayKhaiGiang(nam: number) {
    return new Promise((resolve, reject) => {
      let apiURL = `http://localhost:5000/api/v1/Dashboard/ThongKeNgayKhaiGiang`;

      this.httpClient.get(apiURL, {
        params: {
          Nam: nam
        }
      })
        .toPromise()
        .then(
          (res: any) => {
            resolve(res.data);
          }
        )
        .catch(err => reject(err));
    });
  }

  generateChart() {
    this.barLineChart = new Chart("barLineChart", {
      type: 'bar',
      data: this.data,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: true,
          position: "bottom"
        },
        title: {
          display: true,
          text: "Thống kê số ngày khai giảng"
        },
        tooltips: {
          enabled: true
        },
        hover: {
          animationDuration: 1
        },
        maintainAspectRatio: false
      }
    });
  }

  async addNewColumn() {
    var data: any = await this.fn_ThongKeNgayKhaiGiang(this.year);
    this._idx += 1;

    this.barLineChart.data.datasets.push({
      label: this.year,
      data: data.map((obj: any) => obj.soLuong),
      // borderColor: this.borderColor[(this._idx % (this.borderColor.length))],
      // backgroundColor: this.bgColor[(this._idx % (this.bgColor.length))],
      borderColor: `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},0.8)`,
      backgroundColor: `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},0.5)`,
      borderWidth: 0.5,
      fillColor: "#79D1CF",
      strokeColor: "#79D1CF"
    })

    this.barLineChart.update();

  }

  removeLastColumn() {
    this.barLineChart.data.datasets.pop();
    this.barLineChart.update();
  }

  async generateBarLineChart() {

    // var data2022: any = await this.fn_ThongKeNgayKhaiGiang(2022);
    // var data2023: any = await this.fn_ThongKeNgayKhaiGiang(2023);

    // this.data = {
    //   datasets: [
    // {
    //   label: '2022',
    //   data: data2022.map((obj: any) => obj.soLuong),
    //   borderColor: "red",
    //   backgroundColor: "rgb(255,20,0,0.5)",
    //   fillColor: "#79D1CF",
    //   strokeColor: "#79D1CF",
    //   order: 1  // thứ tự của data
    // },
    // {
    //   label: '2023',
    //   data: data2023.map((obj: any) => obj.soLuong),
    //   borderColor: "red",
    //   backgroundColor: "rgb(0,20,255,0.5)",
    //   fillColor: "#79D1CF",
    //   strokeColor: "#79D1CF",
    //   order: 2  // thứ tự của data
    // },
    // add line chart
    // {
    //   type: 'line',
    //   label: 'Line 1',
    //   data: [35, 24, 30, 10],
    //   borderColor: "rgb(139, 34, 82, 0.5)",
    //   backgroundColor: 'rgba(0, 0, 0, 0)',
    //   borderDash: [10, 3, 10],
    //   order: 3
    // }
    //   ],
    //   labels: data2023.map((obj: any) => obj.thang)
    // };

    // var options: Chart.ChartOptions =
    // {
    //   layout: {
    //     padding: {
    //       // left: 50,
    //       // right: 130,
    //       top: 100,
    //       bottom: 0
    //     }
    //   },
    //   legend: {
    //     display: true,
    //     position: "bottom"
    //   },
    //   title: {
    //     display: true,
    //     text: "Thống kê số ngày khai giảng 2023"
    //   },
    //   tooltips: {
    //     enabled: true
    //   },
    //   hover: {
    //     animationDuration: 1
    //   },
    //   maintainAspectRatio: false, // false -> loại bỏ kích thước auto scale của chart
    //   // animation: {
    //   //   onComplete: () => {
    //   //     var ctx: any = this.barLineChart.ctx;
    //   //     ctx.textAlign = 'center';
    //   //     ctx.textBaseline = 'bottom';
    //   //     ctx.fillStyle = "rgba(0, 0, 0, 1)";

    //   //     data.datasets.forEach((dataset: any) => {
    //   //       for (var i = 0; i < dataset.data.length; i++) {
    //   //         // chỉ show vs char bar
    //   //         if (dataset._meta[Object.keys(dataset._meta)[0]].type == 'bar') {
    //   //           var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
    //   //           ctx.fillText(dataset.data[i], model.x, model.y - 5);
    //   //         }
    //   //       }
    //   //     });
    //   //   }
    //   // }
    // }

    // this.barLineChart = new Chart("barLineChart", {
    //   type: 'bar',
    //   data: data,
    //   options: options,
    //   plugins: [
    //     {
    //       beforeInit(chart: any, options: any) {
    //         // Get reference to the original fit function
    //         const originalFit = chart.legend.fit;

    //         // Override the fit function
    //         chart.legend.fit = function fit() {
    //           // Call original function and bind scope in order to use `this` correctly inside it
    //           originalFit.bind(chart.legend)();
    //           // Change the height as suggested in another answers
    //           this.height += 20;
    //         }
    //       },
    //       afterInit(chart: any, options: any) {
    //         // Get reference to the original fit function
    //         const originalFit = chart.legend.fit;

    //         chart.legend.fit = function fit() {
    //           // Call original function and bind scope in order to use `this` correctly inside it
    //           originalFit.bind(chart.legend)();
    //           // Change the height as suggested in another answers
    //           this.height = this.height + 20;
    //         }
    //       },
    //     }
    //   ]
    // });
  }
}
