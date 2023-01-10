export const firstLetterUpperCase = (text:string) => {
    if(text.indexOf("_") !== -1) text = text.replace("_", " ")
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}