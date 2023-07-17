import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { TemplateHandler } from 'easy-template-x';
import { createResolver } from "easy-template-x-angular-expressions";

import Docxtemplater from 'docxtemplater';
import * as PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';

function loadFile(url: any, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  data: any = {
    author: 'Trần Thị Thơm',
    age: 42,
    dob: '2023-03-08T09:27:17',
    phone: '0987896542',
    address: '40/12 - 40/14 Ấp Bắc, Tân Bình',
    position: 'Chủ tịch Hiệp hội nhà báo Việt Nam',
    items: [
      {
        fullname: 'Nguyễn Văn A',
        age: 18,
        phone: '0785632541',
        cccd: { id: "720535125452", created: "2022-12-06" }
      },
      {
        fullname: 'Nguyễn Văn B',
        age: 25,
        phone: '0354257896',
        cccd: { id: "620535125452", created: "2022-12-07" }
      },
      {
        fullname: 'Nguyễn Văn C',
        age: 28,
        phone: '0254257896',
        cccd: { id: "520535125452", created: "2022-12-08" }
      }
    ]
  }

  // data: any = {
  //   "author": "Trần Thị Thơm",
  //   "age": 42,
  //   "phone": "0987896542",
  //   "address": "40/12 - 40/14 Ấp Bắc, Tân Bình",
  //   "position": "Chủ tịch Hiệp hội nhà báo Việt Nam",
  //   "items": [
  //     {
  //       "fullname": "Nguyễn Văn A",
  //       "age": 18,
  //       "phone": "0785632541",
  //       "cccd": { "id": "720535125452", "created": "2022-12-06" }
  //     },
  //     {
  //       "fullname": "Nguyễn Văn B",
  //       "age": 20,
  //       "phone": "0785632541",
  //       "cccd": { "id": "620535125452", "created": "2022-12-06" }
  //     },
  //     {
  //       "fullname": "Nguyễn Văn C",
  //       "age": 25,
  //       "phone": "0785632541",
  //       "cccd": { "id": "520535125452", "created": "2022-12-06" }
  //     }
  //   ]
  // }

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // this.generateDocx('template');
  }

  downloadFile(fileBlob: any, fileNameExport?: any) {
    const blobUrl = URL.createObjectURL(fileBlob);

    let link = document.createElement("a");
    link.download = `${fileNameExport ?? 'download'}.docx`;
    link.href = blobUrl;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    }, 0);
  }

  generateDocx(fileName: string, dataExport: any) {
    this.httpClient.get(`assets/Templates/${fileName}.docx`, { responseType: 'blob' })
      .subscribe(async (file: Blob) => {

        dataExport.dob = dataExport.dob.split('T')[0]

        const handler = new TemplateHandler();

        const fileBlob = await handler.process(file, dataExport);

        this.downloadFile(fileBlob);
      });
  }

  async generateDocx_v2(fileName: string, dataExport: any) {
    const response = await fetch(`assets/Templates/${fileName}.docx`);

    const templateFile = await response.blob();

    const handler = new TemplateHandler();

    const fileBlob = await handler.process(templateFile, dataExport);

    this.downloadFile(fileBlob);

  }

  generateDocx_v3(fileName: any, dataExport: any) {

    PizZipUtils.getBinaryContent(
      `assets/Templates/${fileName}.docx`,
      function (error: Error | null, content: string) {
        if (error) {
          throw error;
        }
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });
        try {
          doc.setData(dataExport);
          doc.render();
        } catch (error) {
          console.log(error);
        }

        const out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        console.log(out);
        const blobUrl = URL.createObjectURL(out);

        let link = document.createElement("a");
        link.download = `download.docx`;
        link.href = blobUrl;

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          link.remove();
          window.URL.revokeObjectURL(blobUrl);
        }, 0);
      }
    );
  }
}
