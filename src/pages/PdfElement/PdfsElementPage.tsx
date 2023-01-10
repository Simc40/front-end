import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { GridColDef } from "@mui/x-data-grid";
import { getFormatDate } from "../../hooks/getDate";
import { LoadingPage } from "../LoadingPage/LoadingPage";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { ResetableTable } from "../../components/Tables/ResetableTable";
import { DangerButton } from "../../components/Button/DangerButton";
import { PDF, PDFElementsApiGetInterface } from "../../types/Pdf";
import { CheckboxInput } from "../../components/Button/CheckboxInput";
import { Link } from "../../components/Links/Link";
import { pdfApi } from "../../apis/PdfApi";
import { getElementsMapInterface } from "../../types/Element";


export const PdfsElementPage = ({elementsMap, pdfs} : {elementsMap?:getElementsMapInterface , pdfs?: PDFElementsApiGetInterface}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedConstruction, setSelectedConstruction] = useState("");
    const [selectedElement, setSelectedElement] = useState("");
    const [elementSelection, setElementSelection] = useState<string[][] | undefined>([]);
    const [rows, setRows] = useState<PDF[]>([]);
    const [rowsCopy, setRowsCopy] = useState<PDF[]>([]);

    const auth = useContext(AuthContext);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → PDFs → Elementos")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { handleSubmit } = useForm();

    const columns: GridColDef[] = [
        { field: 'nome_pdf', headerName: 'Nome do PDF', flex:3 , minWidth: 150},
        { field: 'creation', headerName: 'Data de Registro', flex:2 , minWidth: 180},
        { field: 'lastModifiedOn', headerName: 'Última Modificação', flex:2 , minWidth: 180},
        { field: 'link', headerName: 'Exibir', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 100, renderCell: (params) => (
            <Link url={params.row.pdfUrl} />
        )},
        { field: 'size_text', headerName: 'Tamanho Arquivo', flex: 1, minWidth: 100, 'align': 'center', 'headerAlign': 'center',},
        { field: 'status', headerName: 'Status', flex:1 , minWidth: 100, 'align': 'center', 'headerAlign': 'center', renderCell: (params) => (
            <CheckboxInput checked={params.row.status === "ativo"} onChange={() => handleStatusChange(params)} />
        )},
        { field: 'remover', headerName: 'Remover', flex:1 , minWidth: 150, 'align': 'center', 'headerAlign': 'center', renderCell: (params) => (
            <DangerButton text="Remover" onClick={() => handleRemoveChange(params)} />
        )}
    ];

    const handleStatusChange = (
        (params:any) => {
            if(params.row.status === "ativo") return;
            const editedRows = rows.map((row) => {
                if(row.uid === params.row.uid && row.activity === "PDF") return{
                    ...row,
                    "status": "ativo",
                }
                else if(row.uid === params.row.uid) return{
                    ...row,
                    "status": "ativo",
                    "activity": "status",
                }
                else if (row.status === "ativo") return{
                    ...row,
                    "status": "inativo",
                    "activity": (row.activity !== "PDF") ? "status" : "PDF",
                }
                else return row;
            })
            setRows(editedRows);
        }
    );

    const handleRemoveChange = (
        (params:any) => {
            if(params.row.status === "ativo") return swal("Oops!", "Não é possível remover um PDF com status Ativo, selecione outro PDF como ativo para remover!", "error");
            if(params.row.activity === "PDF"){
                const editedRows = rows.filter((row) => row.uid !== params.row.uid)
                return setRows(editedRows);
            }
            
            const editedRows = rows.map((row) => {
                if(row.uid === params.row.uid) return{
                    ...row,
                    "activity": "remove",
                }
                else return row;
            })
            setRows(editedRows);
        }
    );

    const onSubmit = () => {
        if(selectedConstruction === '') return swal("Oops!", "Selecione uma Obra", "error");
        if(JSON.stringify(rows) === JSON.stringify(rowsCopy)) return swal("Oops!", "Nenhuma Modificação foi realizada!", "error");
        let formData = new FormData();
        let formSize = 0;
        rows.forEach((row) => {
            if(row.activity === undefined) return;
            else if(row.activity === "remove"){
                formSize++;
                formData.append(`formData_${formSize}`, JSON.stringify({"uid": row.uid, "activity": "remove"}));
            }
            else if(row.activity === "PDF"){
                formSize++;
                formData.append(`formData_${formSize}`, JSON.stringify({"nome_pdf": row.nome_pdf, "size": row.size.toString(), "size_text": row.size_text, "status": row.status, "activity": "PDF"}));
                formData.append(`uploadedFile_${formSize}`, row.file!);
            }
            else if(row.activity === "status"){
                formSize++;
                formData.append(`formData_${formSize}`, JSON.stringify({"uid": row.uid, "status": row.status, "activity": "status"}));
            }
        })
        
        formData.append("formData_size", formSize.toString());
        formData.append("formData_obra", selectedConstruction);
        formData.append("formData_elemento", selectedElement);
        formData.append("formData_date", getFormatDate());
        
        setIsLoading(true)

        pdfApi().updatePdfElements(formData)
        .then(async () => {
            setIsLoading(false)
            return swal({
                icon: 'success',
                title: 'Mudanças realizadas com sucesso',
            }).then(() => {
                window.location.reload()
            })
        }).catch((error) => {
            setIsLoading(false)
            console.log(error);
            swal("Oops!", "Ocorreu um erro Inesperado, contate o suporte!", "error");
        })
    }

    const onConstructionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedConstruction(event.target.value)
        setElementSelection((elementsMap?.elements === undefined) ? [] : Array.from(elementsMap.elements.values()).filter((element) => element.obra === event.target.value).map((element) => {return [element.uid, element.nome_elemento]}))
    }

    const onOptionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedElement(event.target.value)
        if(pdfs![selectedConstruction] === undefined || pdfs![selectedConstruction][event.target.value] === undefined ){
            setRows([]);
            setRowsCopy([]);
            return;
        }
        const selectedRows = Array.from(Object.values(pdfs![selectedConstruction][event.target.value]).map((pdf, i) => {return {...pdf, 'index': i}}));
        setRows(selectedRows);
        setRowsCopy(structuredClone(selectedRows));
    }

    const onPdfUploaded = (event:ChangeEvent<HTMLInputElement> | undefined) => {
        const getSizeText = (bytes:number)  => {
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
        }

        const file: File | undefined = event?.target.files![0];
        if(file === undefined) return;
        console.log(event!.target.value.replace('\\', "\\\\"))
        const newPdf: PDF = {
            "uid": crypto.randomUUID().toString(), 
            "index": rows.length,
            "nome_pdf": file.name,
            "obra": selectedConstruction,
            "elemento": selectedElement,
            "pdfUrl": URL.createObjectURL(file),
            "size": file.size.toString(),
            "size_text":getSizeText(file.size),
            "status": "inativo",
            "activity": "PDF",
            "file": file
        }
        const newRows = rows.concat(newPdf);
        setRows(newRows)    
    }

    const constructionSelection = (elementsMap?.constructions === undefined) ? [] : Array.from(elementsMap.constructions.values()).map((construction) => {return [construction.uid, construction.nome_obra]})

    const pageContent = () => {
        return (
            <>  
                <Section text="Selecionar Obra">
                    <InputSelectFieldEditSelector array={constructionSelection} label="Obra" onOptionSelected={onConstructionSelected} />
                </Section>

                <Section text="Selecionar Elemento">
                    <InputSelectFieldEditSelector array={elementSelection} label="Elemento" onOptionSelected={onOptionSelected} />
                </Section>
                
                <Section text='Adicionar PDF'>
                    <InputSection style={{'marginTop': '20px', 'marginBottom': '50px'}}>
                        <input id="img-input" type="file" accept="application/pdf" onChange={onPdfUploaded}/>
                    </InputSection>
                </Section>

                <form onSubmit={handleSubmit(onSubmit as any)}>
                    <Section text='Gerenciar PDFs' alignCenter={true}>
                        <ResetableTable columnRows={columns} tableRows={rows} reset={() => setRows(structuredClone(rowsCopy))}/>
                    </Section>
                
                    <SubmitButton text="Atualizar"/>
                </form>
            </>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 