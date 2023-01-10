import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { AuthContextType } from "../../contexts/Auth/AuthContext";
import { getFormatDate } from "../../hooks/getDate";
import { Piece } from "../../types/Piece";
import { RomaneioCarga } from "../../types/RomaneioCarga";
import swal from 'sweetalert';

export const generateRomaneioReport = (cargas: RomaneioCarga[], auth: AuthContextType) => {
    if(cargas.length === 0) return swal("Oops!", "Nenhuma peça foi Selecionada", "error");
    const doc = new jsPDF();

    let lastY: number = 0
    let lastTableY: number = 0

    function setMoreY(moreY: number) {
        lastY = lastTableY ? moreY : lastY + moreY
        return lastY + lastTableY
    }

    doc.setFont('helvetica', 'normal', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text((auth.user?.cliente === undefined) ? "Cliente" : auth.user?.cliente, 145, 10);

    doc.line(140, 11, 185, 11)

    doc.setDrawColor(100)
    doc.setFontSize(12)
    doc.setTextColor(30)
    doc.text("Relatório de Romaneio", 140, 15)
    doc.setTextColor(100)
    doc.text(getFormatDate(), 140, 19)

    cargas.forEach((carga, i) => {
        doc.setDrawColor(0)
        doc.setFillColor(200,196,196)
        doc.rect(13, 7, 100, 10, 'F')

        doc.setFontSize(20)
        doc.setTextColor(50)
        doc.text("#Carga  " + carga.romaneio_carga, 14, setMoreY(14))
        doc.setLineWidth(1)
        doc.line(13, 16, 100, 16)

        //---------------------Armação------------------------
        //Título Armação

        doc.setTextColor(16, 17, 17)
        doc.setFont('helvetica', "bold")
        doc.setFontSize(15)
        doc.text('Dados do Romaneio: ', 14, setMoreY(10))

        //Informações de  Inspetor
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal', 'normal')
        doc.setTextColor(108, 117, 125)
        doc.text(`Registrado por: ${auth.usersMap.get(carga.lastModifiedBy!)}`, 14, setMoreY(5))
        //Informações de Data
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal', 'normal')
        doc.setTextColor(108, 117, 125)
        doc.text(`Data de Registro: ${carga.lastModifiedOn!.slice(0, 10)}`, 14, setMoreY(5))

        //Tabela
        autoTable(doc, {
            startY: setMoreY(2),
            head: [
                ['Informação', 'Valor']
            ],
            body: [
                ["Obra de Destino", carga.construction!.nome_obra],
                ["Data de Previsão", carga.data_prev],
                ["Transportadora", carga.transportator!.nome_empresa],
                ["Motorista", carga.driver!.nome_motorista],
                ["Veículo", 'marca: ' + carga.vehicle!.marca + ' - Placa: ' + carga.vehicle!.placa],
                ["Capacidade de Carga (Veículo)", carga.vehicle!.capacidade_carga + ' Kg'],
                ["Peso do Carregamento", carga.peso_carregamento + ' Kg'],
                ["Volume do Carregamento", carga.volume_carregamento + ' m³'],
                ["Quantidade de Peças", Object.keys(carga.pecas).length],
                ["A (Veículo Carregado)", (carga.data_carga === undefined) ? "-" : carga.data_carga],
                ["B (Veículo em Transporte)", (carga.data_transporte === undefined) ? "-" : carga.data_transporte],
                ["C (Veículo em Obra)", (carga.data_descarga === undefined) ? "-" : carga.data_descarga],

            ],
            styles: { fontSize: 10, cellPadding: 1, cellWidth: 'auto' },
        })
        lastY = (doc as any).lastAutoTable.finalY
        
        doc.setTextColor(16, 17, 17)
        doc.setFont('helvetica', "bold")
        doc.setFontSize(15)
        doc.text('Dados de Peças do Romaneio: ', 14, setMoreY(10))
        const pecas_de_carga:any[] = Object.entries(carga.pecas).map((peca) => {
            const tag = (peca[0])
            const piece: Piece = peca[1] as Piece
            console.log(tag, carga.uid);
            return[
                tag, 
                piece.element!.nome_elemento,
                piece.element!.geometry?.nome_tipo_peca,
                piece.element!.b + " cm x " + piece.element!.h + " cm",
                piece.element!.c + " m",
                piece.element!.peso + " Kg",
                piece.element!.volume + " m³"
            ]
        })

        autoTable(doc, {
            startY: setMoreY(2),
            head: [
                ['Tag', 'elemento', "Tipo da Peça", "Seção", "Comprimento", "Peso", "Volume"]
            ],
            body: pecas_de_carga,
            styles: { fontSize: 9, cellPadding: 1, cellWidth: 'auto', halign : 'center', valign: 'middle'},
        })
        lastY = (doc as any).lastAutoTable.finalY
        if (i !== cargas.length - 1) {
            doc.addPage('a4', "portrait")
            lastY = 0
            lastTableY = 0
        }
    });
    doc.save('Relatório Romaneio')
}