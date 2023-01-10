import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { AuthContextType } from "../../contexts/Auth/AuthContext";
import { getFormatDate } from "../../hooks/getDate";
import { Piece } from "../../types/Piece";
import swal from 'sweetalert';
import { Error, ErrorsApiGetInterface } from '../../types/Erros';
import { ChecklistHistoryType } from "../../types/Checklist";

export const reportInspectionPDF = (pieces: Piece[], auth: AuthContextType,errors: ErrorsApiGetInterface | undefined,  constructionName: string, checklistHistory: ChecklistHistoryType | undefined) => {
    if(pieces.length === 0) return swal("Oops!", "Nenhuma peça foi Selecionada", "error");

    const prettyEtapas: Map<string, string> = new Map([
        ["planejamento", "Planejamento"],
        ["cadastro", "Produção/Cadastro"],
        ["armacao", "Produção/Armação"],
        ["forma", "Produção/Forma"],
        ["armacaoForma", "Produção/Armação com Forma"],
        ["concretagem", "Produção/Concretagem"],
        ["liberacao", "Produção/Liberação Final"],
        ["carga", "Transporte/Carga"],
        ["descarga", "Transporte/Descarga"],
        ["montagem", "Montagem"],
    ])
    
    const doc = new jsPDF()

    let lastY: number = 0
    let lastTableY: number = 0

    function setMoreY(moreY: number) {
        lastY = lastTableY ? moreY : lastY + moreY
        return lastY + lastTableY
    }

    doc.setFont('helvetica', 'normal', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text('SIMC 4.0', 140, 10)

    doc.setDrawColor(100)
    doc.line(140, 11, 185, 11)

    doc.setDrawColor(100)
    doc.setFontSize(12)
    doc.setTextColor(30)
    doc.text(constructionName, 140, 15)
    doc.text("Relatório de Inspeção", 140, 19)
    doc.setTextColor(100)
    doc.text(getFormatDate(), 140, 23)

    pieces.forEach((piece, i) => {     
        doc.setDrawColor(0)
        doc.setFillColor(200,196,196)
        doc.rect(13, 7, 100, 10, 'F')

        doc.setFontSize(20)
        doc.setTextColor(50)
        doc.text(piece.nome_peca, 14, setMoreY(14))
        doc.setLineWidth(1)
        doc.line(13, 16, 100, 16)

        doc.setFontSize(12)
        doc.setTextColor(108, 117, 125)
        doc.text("RFID: " + piece.tag  + ' '.repeat(10) +"Tipo: " + piece.element?.geometry?.nome_tipo_peca.charAt(0).toUpperCase() + piece.element?.geometry?.nome_tipo_peca.slice(1), 14, setMoreY(10))

        doc.setFontSize(12)
        doc.setTextColor(108, 117, 125)
        doc.text("Etapa Atual: " + piece.pretty_etapa_atual, 14, setMoreY(6))

        const etapas = ["cadastro","armacao", "forma", "armacaoForma", "concretagem", "liberacao", "carga", "descarga", "montagem", "completo"]
        const pieceEtapas = (piece === undefined) ? [] : etapas.filter((_etapa: string, index: number) => index < etapas.indexOf(piece.etapa_atual))

        pieceEtapas.forEach((etapa) => {

            const foundErrors: Error[] = (errors === undefined || piece === undefined || errors[piece.obra] === undefined || errors[piece.obra][piece.tag] === undefined) ? [] : Array.from(Object.values(errors[piece.obra][piece.tag])).filter((error: Error) => error.etapa_detectada === etapa)
            const items = checklistHistory === undefined ? undefined : checklistHistory[etapa][piece.etapas[etapa].checklist]
            if(items !== undefined && items.createdBy !== undefined) delete items.createdBy;
            if(items !== undefined && items.creation !== undefined) delete items.creation;
            const checklist_items = items === undefined ? [] : Array.from(Object.values(items)).map((item: string, i: number) => {
                if(foundErrors.length === 0){
                    return [
                        item,
                        "conforme",
                        "-",
                        "-"
                    ]
                }else{
                    const error: Error = foundErrors[0];
                    return [
                        item,
                        (error.status === "aberto") ? "Aberto" : "Solucionado",
                        error.comentarios,
                        (error.comentarios_solucao !== undefined) ? error.comentarios_solucao : "-",
                    ]
                }
            })

            //Título Etapa
            doc.setTextColor(16, 17, 17)
            doc.setFont('helvetica', "bold")
            doc.setFontSize(15)
            doc.text(prettyEtapas.get(etapa)!.toString(), 14, setMoreY(10))

            //Informações de  Inspetor e data
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal', 'normal')
            doc.setTextColor(108, 117, 125)
            doc.text(`Inspetor: ${auth.usersMap.get(piece.etapas[etapa].createdBy)}` + ' '.repeat(10) + `Data: ${piece.etapas[etapa].creation}`, 14, setMoreY(5))

            //Tabela
            autoTable(doc, {
                startY: setMoreY(2),
                head: [
                    ['Item', 'Status', 'Descrição', 'Solução']
                ],
                headStyles: {
                    halign: 'center'
                },
                body: checklist_items,
                columnStyles: {
                    0: {
                        cellWidth: 'auto',
                        halign: 'left',
                        valign: "middle"
                    },
                    1: {
                        cellWidth: 20,
                        halign: 'center',
                        valign: "middle"
                    },
                    2: {
                        cellWidth: 60,
                        halign: 'center',
                        valign: "middle"
                    },
                    3: {
                        cellWidth: 60,
                        halign: 'center',
                        valign: "middle"
                    }
                },
                styles: { overflow: 'linebreak', fontSize: 8, cellPadding: 1},
                didParseCell: (hookData) => {
                    if (hookData.section === 'head') {
                        if (hookData.column.dataKey === 'item') {
                            hookData.cell.styles.halign = 'left';
                        }
                    }
                }
            })
            lastY = (doc as any).lastAutoTable.finalY
        });
        
        lastY = (doc as any).lastAutoTable.finalY
        if (i !== pieces.length) {
            doc.addPage('a4', "portrait")
            lastY = 0
            lastTableY = 0
        }
    });
    doc.save('Relatório Inspeção - ' + constructionName)
}