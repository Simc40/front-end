import React, { ChangeEvent, useState } from "react"
import styled from 'styled-components'
import { FieldValues, UseFormSetValue } from "react-hook-form";
import Compressor from 'compressorjs';

const DivImgContainer = styled.div`
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Img = styled.img`
    @media screen and (max-width: 480px){
        width: 200px;
    }

    @media screen and (min-width: 481px){
        width: 300px;
    }
`;

const DivInputContainer = styled.div`
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const DivInfo = styled.div`
    margin-top: 20px;
    font-weight: bold;
    margin-bottom: 7.5px;
`;

export const InputPictureField = ({defaultSrc, setValue, name, ...props} : {defaultSrc:string, setValue:UseFormSetValue<FieldValues>, name:string}) => {

    const [src, setSrc] = useState(defaultSrc);

    const handleCompressedUpload = (e:ChangeEvent<HTMLInputElement>) => {
    const image: File = e.target.files![0];
    new Compressor(image, {
        quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
        success: (compressedResult) => {
            // compressedResult has the compressed file.
            // Use the compressed file to upload the images to your server.        
            setSrc(URL.createObjectURL(image))
            getBase64(compressedResult)
            .then((result: string) => {
                setValue(name, result)
            })
        },
        });
    };

    const getBase64 = (file:Blob | File) => {
        return new Promise<string>(resolve => {
            let fileInfo;
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                // Make a fileInfo Object
                console.log("Called", reader);
                const baseURL:string = (reader.result === undefined || reader.result == null) ? defaultSrc : reader.result.toString();
                console.log(baseURL);
                resolve(baseURL);
        };
            console.log(fileInfo);
        });
  };
//   (watch(name) === undefined) ? defaultSrc : watch(name)
    return (
        <div>
            <DivImgContainer><Img className="form-control" alt="" src={src} {...props}/></DivImgContainer>
            <DivInputContainer><input id="img-input" type="file" accept="image/*" name={name} onChange={handleCompressedUpload}/></DivInputContainer>
            <DivInfo></DivInfo>
        </div>
    )
}