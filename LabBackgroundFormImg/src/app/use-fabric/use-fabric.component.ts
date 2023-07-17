import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-use-fabric',
  templateUrl: './use-fabric.component.html',
  styleUrls: ['./use-fabric.component.css']
})
export class UseFabricComponent implements OnInit {

  public _pngURL: any
  private _urlImage: string = '../assets/mau-giay-de-nghi-thanh-toan-theo-thong-tu-107-1.jpg'
  private _top: number = 214;
  public _name: string = 'Huỳnh Quang Vinh'
  public _address: string = '41/42 Ấp Bắc'
  public _contents: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit rem aspernatur ratione sequi error similique asperiores dolorum unde vero, molestiae quisquam eius esse! Nobis blanditiis libero magnam, atque nihil nostrum.'

  private _canvas?: fabric.Canvas;

  constructor() { }

  ngOnInit(): void {
    this._canvas = new fabric.Canvas('myCanvas', {
      // backgroundColor: '#ebebef',
      selection: false,
      preserveObjectStacking: true,
      height: 600,
      width: 800
    });

    fabric.Image.fromURL(this._urlImage, (img: fabric.Image) => {
      this._canvas?.setBackgroundImage(img, this._canvas?.renderAll.bind(this._canvas))
    });
  }

  addValueIntoCanvas() {
    fabric.Image.fromURL(this._urlImage, (img: fabric.Image) => {
      const name: fabric.Text = new fabric.Text(this._name, {
        left: 350,
        top: this._top,
        fill: '#000000',
        stroke: '#000', // màu nét chữ
        strokeWidth: .1,  // độ dày nét chữ
        fontSize: 20,
        fontFamily: 'Times New-Roman'
      });

      const address: fabric.Text = new fabric.Text(this._address, {
        left: 240,
        top: this._top + 33,
        fill: '#000000',
        stroke: '#000', // màu nét chữ
        strokeWidth: .1,  // độ dày nét chữ
        fontSize: 20,
        fontFamily: 'Times New-Roman'
      });

      const contents: fabric.Textbox = new fabric.Textbox(this._contents, {
        // left: 240,
        // top: this.top + 66,
        left: 65,
        top: this._top + 99,
        fill: '#000000',
        stroke: '#000', // màu nét chữ
        strokeWidth: .1,  // độ dày nét chữ
        fontSize: 20,
        fontFamily: 'Times New-Roman',
        width: 650,
        lineHeight: 1.4
      });

      this._canvas?.add(name);
      this._canvas?.add(address);
      this._canvas?.add(contents);
    });
  }

  downloadCanvas() {
    this._pngURL = this._canvas?.toDataURL({
      format: 'jpg',
      quality: 1
    });
    console.log(this._pngURL);

    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = this._pngURL;
    link.click();
  }
}
