// pdf-generation.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SharedService } from './shared.service';

interface jsPDFWithPlugin extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}
@Injectable({
  providedIn: 'root'
})
export class PdfGenerationService {
  constructor (private service:SharedService){}

  photoUrl:any = this.service.PhotoURL + 'Logo.jpg'
  generateQuotationPdf(data: any) {
    const doc = new jsPDF();

    // Add the logo
    const img = new Image();
    img.src = String(this.photoUrl); // Add the correct path to your logo
    doc.addImage(img, 'PNG', 15, 15, 100, 20);

    // Add the header text
    doc.setFontSize(12);
    doc.text('Marine Diesel Service GmbH', 200, 20, { align: 'right' });
    doc.text('Weierstrasse 3, CH-8355 Aadorf, Switzerland', 200, 25, { align: 'right' });
    doc.text('Phone: +00 00 00 00 000', 200, 30, { align: 'right' });
    doc.text('Email: info@marine-diesel-service.com', 200, 35, { align: 'right' });
    doc.text('VAT: CHE-112.750.485 MWST', 200, 40, { align: 'right' });
    doc.text('EORI: DE696921249932558', 200, 45, { align: 'right' });

    // Add the Quotation title and details
    doc.setFontSize(16);
    doc.text('Quotation', 15, 60);
    doc.setFontSize(12);
    doc.text(`Quotation No. ${data.quotationNumber}`, 200, 60, { align: 'right' });
    doc.text(`Date: ${data.date}`, 200, 65, { align: 'right' });

    // Add delivery information
    doc.text(`Delivery to:`, 15, 75);
    const deliveryToLines = data.deliveryTo.split('\n');
    deliveryToLines.forEach((line: string, index: number) => {
      doc.text(line, 15, 80 + (index * 5));
    });

    // Add customer details table
    autoTable(doc, {
      startY: 100,
      head: [[]],
      body: [[

      ]],
      theme: 'grid',
      styles: { fillColor: [255, 255, 255], fontSize: 1, lineColor: [255, 255, 255] },
      headStyles: { fillColor: [255, 255, 255] }
    });

    // Add the table with items
    autoTable(doc, {
      startY: (doc as jsPDFWithPlugin).lastAutoTable.finalY + 10,
      head: [['Your Item', 'Qty.', 'Description', 'Unit price', 'Amount EUR', 'Del. time']],
      body: data.tableData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 96, 183] }
    });

    // Get the final Y position after the table
    const finalY = (doc as jsPDFWithPlugin).lastAutoTable.finalY;

    // Add the summary
    doc.setFontSize(12);
    doc.text(`Net weight: ${data.netWeight} kgs`, 15, finalY + 10);
    doc.text(`Value of goods: ${data.valueOfGoods} EUR`, 15, finalY + 20);
    doc.text(`Packing & handling: ${data.packingHandling} EUR`, 15, finalY + 30);
    doc.text(`Freight fare: ${data.freightFare} EUR`, 15, finalY + 40);
    doc.text(`Total amount EUR: ${data.totalAmount} EUR`, 15, finalY + 50);

    // Add the closing text and signature
    doc.text('Thank you for your enquiry.', 15, finalY + 70);
    // doc.text('We have pleasure in submitting our quotation for your consideration, based on our general condition of supply.', 15, finalY + 80);
    doc.text('If you have any queries regarding this quotation please contact the undersigned.', 15, finalY + 60);
    doc.text(`Aadorf, ${data.date}`, 15, finalY + 110);
    doc.text('Lukas Frischknecht', 15, finalY + 130);

    // Save the PDF
    doc.save('quotation.pdf');
  }
}
