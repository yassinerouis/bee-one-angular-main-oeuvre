import { Injectable, ViewChild, ElementRef } from '@angular/core';

import jsPDF from 'jspdf'
import * as jspdf from 'jspdf';  

import 'jspdf-autotable'
import html2canvas from 'html2canvas';  
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  @ViewChild('topdf') topdf: ElementRef;

  constructor(){
  }
  setTable(table:any){
    this.table = table
  }
  table;
  exportPdf(columns,name) {
    console.log(this.table)
    const doc:any = new jsPDF()
    doc.autoTable({
        body:this.table,
        columns:columns,
        styles:{cellWidth:"10px",fontSize:4},
        tableWidth:'wrap'
    })
    doc.save(name)
  }

  printPdf(columns){
    var doc:any = new jsPDF();
    doc.setFontSize(1);
    doc.autoTable({
      body:this.table,
      columns: columns,
      styles:{cellWidth:"20px",fontSize:4},
      tableWidth:'wrap'
    })
    doc.autoPrint();
    //This is a key for printing
    doc.output('dataurlnewwindow');
  }
  printQR(){
    var data = document.getElementById('topdf');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 200;   
      var imgHeight = canvas.height * imgWidth / canvas.width;    
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 20;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save("fileName"); // Generated PDF  
    });   
  }
  exportExcel(name,table) {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(table);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, name);
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  } 
}
