import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
    providedIn: 'root'
})
export class PdfExportService {

    async export(
        elemento: HTMLElement,
        nomeArquivo: string
    ): Promise<void> {

        const canvas =
            await html2canvas(elemento, {
                scale: 2
            });

        const imagem =
            canvas.toDataURL('image/png');

        const pdf =
            new jsPDF(
                'p',
                'mm',
                'a4'
            );

        const larguraPdf = 210;

        const alturaPdf =
            (canvas.height * larguraPdf)
            / canvas.width;

        pdf.setFontSize(18);

        pdf.text(
            nomeArquivo,
            10,
            15
        );

        pdf.addImage(
            imagem,
            'PNG',
            10,
            25,
            larguraPdf - 20,
            alturaPdf
        );
        pdf.save(
            `${nomeArquivo}.pdf`
        );

    }

}