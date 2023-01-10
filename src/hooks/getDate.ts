export const getFormatDate = () => {
    let date = new Date();
    let d = date.getDate();
    //Month from 0 to 11
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    let h = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    return (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y + ' ' + (h<=9 ? '0' + h : h) + ':' + (min<=9 ? '0' + min : min)  + ':' + (sec<=9 ? '0' + sec : sec);
}

export const getDate = (date:Date) => {
    let d = date.getDate();
    //Month from 0 to 11
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    return (d <= 9 ? '0' + d : d) + '/' + (m<=9 ? '0' + m : m) + '/' + y;
}

export const dateFromString = (strDate: string) => {
    let d = parseInt(strDate.substring(0, 2));
    //Month from 0 to 11
    let m = parseInt(strDate.substring(3, 5)) - 1;
    let y = parseInt(strDate.substring(6, 11));
    let date = new Date();
    date.setFullYear(y);
    date.setMonth(m);
    date.setDate(d);
    return date
}