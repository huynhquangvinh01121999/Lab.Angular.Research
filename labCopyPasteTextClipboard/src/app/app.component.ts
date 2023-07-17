import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'labCopyPasteTextClipboard';

  displayedColumns: string[] = [];
  dataSource: any[] = [];

  // code tối ưu hơn và đã đc clean
  onListenPasted(event: ClipboardEvent) {
    const clipboardData: any = event.clipboardData;
    const pastedText = clipboardData.getData('text/plain');

    const row_data = pastedText.split('\r\n');

    this.displayedColumns = row_data[0].split('\t');

    console.log(row_data);


    const data = row_data.slice(0, -1).map((row: any) => {
      const rowData: any = {};
      this.displayedColumns.forEach((col, index) => {
        let valCol = row.split('\t')[index];
        rowData[index + 1] = valCol.trim().replaceAll('"', '');
      });
      return rowData;
    });
    this.dataSource = data;
  }

  // -----------------------------------------------------------------
  // -----------------------------------------------------------------

  // async getClipboardContents() {
  //   try {
  //     const text = await navigator.clipboard.readText();
  //     console.log('Pasted content: ', text);
  //   } catch (err) {
  //     console.error('Failed to read clipboard contents: ', err);
  //   }
  // }

  // async getClipboardContents() {
  //   try {
  //     const clipboardItems = await navigator.clipboard.read();
  //     for (const clipboardItem of clipboardItems) {
  //       for (const type of clipboardItem.types) {
  //         const blob = await clipboardItem.getType(type);
  //         console.log(URL.createObjectURL(blob));
  //       }
  //     }
  //   } catch (err) {
  //     console.error(err.name, err.message);
  //   }
  // }

  // Hàm xử lý sự kiện khi người dùng nhấn tổ hợp phím 'Ctrl+V'

  // -----------------------------------------------------------------
  // -----------------------------------------------------------------

  getClipboardContents() {
    navigator.clipboard.readText().then(
      (text: any) => {
        var textArray = text.split('\r\n');
        this.fnXuLy(textArray);
      }
    );
  }

  fnXuLy(textArray) {
    textArray.forEach((row) => {
      if (row) {
        let item = row.split('\t');
        this.dataSource.push({
          name: item[0],
          title: item[1],
          phone: item[2],
          country: item[3],
          work: item[3]
        })
      }
    });
  }

  // -----------------------------------------------------------------
  // -----------------------------------------------------------------

  test() {
    console.log(window.isSecureContext);

    if (navigator.clipboard && window.isSecureContext) {
      console.log("secure context");
      navigator.clipboard.readText().then(
        (text: any) => {
          console.log('Pasted content: ', text);
          var arr = text.split('\r\n');
          this.fnXuLy(arr);
        }
      );
    } else {
      console.log("non-secure context");

    }
  }

  // -----------------------------------------------------------------
  // -----------------------------------------------------------------

  // Hàm xử lý sự kiện khi người dùng nhấn tổ hợp phím 'Ctrl+V'
  handlePasteEvent(event) {
    var textArray = [];
    var hasInputEventOccurred = false; // Biến cờ để kiểm tra xem sự kiện 'input' đã xảy ra hay chưa

    // Tạo một thẻ input tạm thời để chứa dữ liệu từ clipboard
    var tempInput = document.createElement("input");
    tempInput.style.position = "absolute";
    tempInput.style.left = "-1000px";
    document.body.appendChild(tempInput);

    // Focus vào thẻ input tạm thời để nhận dữ liệu từ clipboard
    tempInput.focus();

    // Lắng nghe sự kiện 'input' để lấy dữ liệu đã dán
    tempInput.addEventListener("input", function () {
      if (!hasInputEventOccurred) {
        hasInputEventOccurred = true; // Cập nhật biến cờ

        var pastedText = tempInput.value;

        // Kiểm tra xem dữ liệu đã dán có tồn tại hay không
        if (pastedText) {
          // Sử dụng dữ liệu đã dán ở đây
          console.log("Dữ liệu đã dán:", pastedText);

          textArray = pastedText.split('\r\n');
        }

        // Loại bỏ thẻ input tạm thời khỏi DOM nếu nó là con của document.body
        if (tempInput.parentNode === document.body) {
          document.body.removeChild(tempInput);
        }
      }
    });

    // Thực hiện lệnh dán từ clipboard bằng cách giả lập sự kiện 'input'
    setTimeout(function () {
      tempInput.dispatchEvent(new Event("input"));
    }, 0);

    setTimeout(function () {
      console.log("Dữ liệu đã xử lý:", textArray);
    }, 1000);
  }

}
