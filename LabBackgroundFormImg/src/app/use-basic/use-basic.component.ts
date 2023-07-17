import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-use-basic',
  templateUrl: './use-basic.component.html',
  styleUrls: ['./use-basic.component.css']
})
export class UseBasicComponent implements OnInit {

  public hoTen: string = 'Huỳnh Quang Vinh'
  public diaChi: string = '12 Đ. Ấp Bắc, Phường 13, Tân Bình, TP.Hồ Chí Minh'
  public noiDungThanhToan: string = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet beatae hic in eaque pariatur sint illum. Doloribus mollitia exercitationem, quidem autem sed porro quisquam eligendi animi reiciendis necessitatibus fugit qui.'
  public soTien: string = '50,000,000'
  public soTienChu: string = 'Năm mươi triệu đồng'

  constructor() { }

  ngOnInit(): void {
  }

  downloadImage() {
    let elem: any = document.getElementById("node");
    html2canvas(elem).then(function (canvas) {
      let generatedImage = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      let a = document.createElement('a');
      a.href = generatedImage;
      a.download = `image.png`;
      a.click();
    });
  }

  downloadImageBasic() {
    const container: any = document.getElementById('node');

    // đọc nội dung của thẻ div
    const html = new XMLSerializer().serializeToString(container);
    console.log(html);
    console.log(container.style.backgroundImage);


    //   const html = container.innerHTML;
    const imgURL = container.style.backgroundImage.slice(4, -1).replace(/"/g, "");

    var bgImage = new Image();

    //set crossOrigin cho trường hợp src image là một đường dẫn trên mạng
    bgImage.crossOrigin = "anonymous";

    // set background cho đối tượng Image
    bgImage.src = imgURL;

    // khởi tạo đối tượng canvas
    var bgCanvas: any = document.createElement("canvas");
    var bgContext: any = bgCanvas.getContext("2d");

    // lấy ra đối tượng cung cấp kích thước của thẻ div cần download
    //set kích thước cho canvas
    const rect = container.getBoundingClientRect();
    bgCanvas.width = rect.width;
    bgCanvas.height = rect.height;

    // draw canvas
    bgImage.onload = function () {
      bgContext.drawImage(bgImage, 0, 0);

      // thiết lập ảnh chứa content của thẻ div
      // set background ảnh trong suốt rgb(255, 255, 255, 0.0)
      const contentImg = new Image();
      const dataSrc = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" style="background-color:rgb(255,255,255,0.0);">
          <foreignObject width="100%" height="100%">
            ${html}
          </foreignObject>
        </svg>
      `);
      contentImg.src = dataSrc;

      const DOMURL = window.URL || window.webkitURL || window;
      const svg = new Blob([dataSrc], { type: "image/svg+xml;charset=utf-8" });
      const url = DOMURL.createObjectURL(svg);
      console.log(url);

      // draw content lên canvas
      contentImg.onload = () => {
        bgContext.drawImage(contentImg, 0, 0);

        // download canvas
        const link = document.createElement('a');
        link.download = 'image.png';
        link.href = bgCanvas.toDataURL();
        // link.click();
      }
    };
  }

  // downloadImageBasic() {
  //   const container: any = document.getElementById('node');
  //   const imgURL = container.style.backgroundImage.slice(4, -1).replace(/"/g, "");

  //   const canvas = document.createElement('canvas');
  //   const rect = container.getBoundingClientRect();
  //   const ctx: any = canvas.getContext('2d');
  //   canvas.width = rect.width;
  //   canvas.height = rect.height;

  //   // Vẽ nội dung của thẻ div lên canvas
  //   // const html = new XMLSerializer().serializeToString(container);
  //   const html = container.innerHTML;
  //   // const data = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">
  //   //               <foreignObject width="100%" height="100%">
  //   //                 <div xmlns="http://www.w3.org/1999/xhtml">
  //   //                 <style>
  //   //                   p{
  //   //                     color:yellow
  //   //                   }
  //   //                 </style>
  //   //                   <p>Con cò bé bé</p>
  //   //                 </div>
  //   //               </foreignObject>
  //   //             </svg>`;

  //   const data = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  //                   <foreignObject width="100%" height="100%">
  //                     <div xmlns="http://www.w3.org/1999/xhtml">
  //                       <style>
  //                         em{color:red;}
  //                       </style>
  //                       <em>I</em> lick 
  //                       <span>cheese</span>
  //                     </div>
  //                   </foreignObject>
  //                 </svg>`;


  //   const DOMURL = window.URL || window.webkitURL || window;

  //   const svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  //   const url = DOMURL.createObjectURL(svg);
  //   console.log(url);

  //   const img = new Image();
  //   // img.crossOrigin = "anonymous";
  //   img.onload = function () {
  //     // canvas.width = img.width;
  //     // canvas.height = img.height;
  //     // ctx.drawImage(img, 0, 0);
  //     // DOMURL.revokeObjectURL(url);

  //     const svgCanvas = document.createElement('canvas');
  //     svgCanvas.width = rect.width;
  //     svgCanvas.height = rect.height;
  //     const svgCtx: any = svgCanvas.getContext('2d');

  //     // tạo background image
  //     const bgImg = new Image();
  //     bgImg.crossOrigin = "anonymous";
  //     bgImg.onload = function () {
  //       // set the svg content as the background of the canvas
  //       ctx.fillStyle = ctx.createPattern(bgImg, 'no-repeat');
  //       ctx.fillRect(0, 0, canvas.width, canvas.height);

  //       // draw the background image on top of the svg content
  //       ctx.drawImage(img, 0, 0);

  //       // create a link and download the image
  //       const link = document.createElement('a');
  //       link.download = 'image.png';
  //       link.href = canvas.toDataURL();
  //       link.click();
  //     };
  //     bgImg.src = imgURL;
  //   };
  //   // img.src = imgURL;
  //     img.src = 'data:image/svg+xml,' + encodeURIComponent(`
  //     <svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" style="border:1px solid red;background-color:white;color:black">
  //       <foreignObject width="100%" height="100%">
  //         <div xmlns="http://www.w3.org/1999/xhtml">
  //           <div id="node" style="background-image: url('../../assets/mau-giay-de-nghi-thanh-toan-theo-thong-tu-107-1.jpg'); 
  //                                 width:800px; 
  //                                 height:585px; 
  //                                 border:1px solid black">
  //             <p style="position: inherit;
  //                 font-family: 'Times New Roman', Times, serif;
  //                 font-size: 20px; 
  //                 font-weight: 700;
  //                 height: 13px;
  //                 margin-top: 215px; 
  //                 margin-left: 350px;">
  //                 ${this.hoTen}
  //             </p>

  //             <p style="position: inherit;
  //                 font-family: 'Times New Roman', Times, serif;
  //                 font-size: 20px; 
  //                 height: 8px;
  //                 margin-left: 240px;">
  //                 ${this.diaChi}
  //             </p>

  //             <p style="position: inherit;
  //                 font-family: 'Times New Roman', Times, serif;
  //                 font-size: 20px;
  //                 width: 650px;
  //                 word-wrap: break-word;
  //                 line-height: 1.58;
  //                 text-indent: 175px; 
  //                 margin-left: 65px;">
  //                 ${this.noiDungThanhToan}
  //             </p>

  //             <p style="position: inherit;
  //                 font-family: 'Times New Roman', Times, serif;
  //                 font-size: 20px;
  //                 margin-top: -14px;
  //                 margin-left: 130px;">
  //                 ${this.soTien}
  //             </p>

  //             <p style="position: inherit;
  //                 font-family: 'Times New Roman', Times, serif;
  //                 font-size: 20px;
  //                 margin-top: -10px;
  //                 margin-left: 190px;">
  //                 ${this.soTienChu}
  //             </p>
  //           </div>
  //         </div>
  //       </foreignObject>
  //     </svg>
  //   `);
  // }

  // downloadImageBasic() {
  //   const container: any = document.getElementById('node');
  //   const imgURL = container.style.backgroundImage.slice(4, -1).replace(/"/g, "");

  //   const canvas = document.createElement('canvas');
  //   const rect = container.getBoundingClientRect();
  //   const ctx: any = canvas.getContext('2d');
  //   canvas.width = rect.width;
  //   canvas.height = rect.height;

  //   // create an image object for the background
  //   const bgImg = new Image();
  //   bgImg.crossOrigin = "anonymous";
  //   bgImg.onload = function () {
  //     // create a new canvas to draw the svg content
  //     const svgCanvas = document.createElement('canvas');
  //     svgCanvas.width = rect.width;
  //     svgCanvas.height = rect.height;
  //     const svgCtx: any = svgCanvas.getContext('2d');
  //     // create a new image object from the svg content
  //     const svgImg = new Image();
  //     svgImg.onload = function () {
  //       // set the svg content as the background of the canvas
  //       ctx.fillStyle = ctx.createPattern(svgImg, 'no-repeat');
  //       ctx.fillRect(0, 0, canvas.width, canvas.height);

  //       // draw the background image on top of the svg content
  //       ctx.drawImage(bgImg, 0, 0);

  //       // create a link and download the image
  //       const link = document.createElement('a');
  //       link.download = 'image.png';
  //       link.href = canvas.toDataURL();
  //       link.click();
  //     };
  //     svgImg.src = 'data:image/svg+xml,' + encodeURIComponent(`
  //       <svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" style="border:1px solid red;background-color:white;color:black">
  //         <foreignObject width="100%" height="100%">
  //           <div xmlns="http://www.w3.org/1999/xhtml">
  //             <div id="node" style="background-image: url(${imgURL}); width:800px; height:585px; border:1px solid black">
  //               <p style="position: inherit; font-family: 'Times New Roman', Times, serif; font-size: 20px; font-weight: 700; height: 13px; margin-top: 215px; margin-left: 350px;">
  //               Vinh Huynh
  //               </p>
  //             </div>
  //           </div>
  //         </foreignObject>
  //       </svg>
  //     `);
  //   };
  //   // bgImg.src = imgURL;
  //   bgImg.src = 'data:image/svg+xml,' + encodeURIComponent(`
  //   <svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000" style="border:1px solid red;background-color:white;color:black">
  //     <foreignObject width="100%" height="100%">
  //       <div xmlns="http://www.w3.org/1999/xhtml">
  //         <div id="node" style="background-image: url(${imgURL}); width:800px; height:585px; border:1px solid black">
  //           <p style="position: inherit; font-family: 'Times New Roman', Times, serif; font-size: 20px; font-weight: 700; height: 13px; margin-top: 100px; margin-left: 50px;">
  //           Vinh Huynh
  //           </p>
  //         </div>
  //       </div>
  //     </foreignObject>
  //   </svg>
  // `);
  // }

}
