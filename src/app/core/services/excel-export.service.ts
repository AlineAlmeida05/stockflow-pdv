import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelExportService {

    exportSheets(
        sheets: {
            nome: string;
            dados: any[];
        }[],
        nomeArquivo: string
    ): void {

        const workbook =
            XLSX.utils.book_new();

        sheets.forEach(sheet => {

            const worksheet =
                XLSX.utils.json_to_sheet(
                    sheet.dados
                );

            const colunas = Object.keys(
                sheet.dados[0] ?? {}
            ).map(cabecalho => ({

                wch: Math.max(

                    cabecalho.length,

                    ...sheet.dados.map(
                        linha =>
                            String(
                                linha[cabecalho] ?? ''
                            ).length
                    )

                ) + 2

            }));

            worksheet['!cols'] =
                colunas;

            worksheet['!freeze'] = {
                xSplit: 0,
                ySplit: 1
            };

            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                sheet.nome
            );

        });

        XLSX.writeFile(
            workbook,
            `${nomeArquivo}.xlsx`
        );

    }

}