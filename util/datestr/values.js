module.exports = {
    DD: (date) => date.getDate().toString().padStart(2, `0`),
    D: (date) => date.getDate().toString(),
    MM: (date) => (date.getMonth()+1).toString().padStart(2, `0`),
    M: (date) => (date.getMonth()+1).toString(),
    YYYY: (date) => date.getFullYear().toString(),
    YY: (date) => date.getFullYear().toString().slice(2),

    HH: (date) => date.getHours().toString().padStart(2, `0`),
    H: (date) => date.getHours().toString(),
    mm: (date) => date.getMinutes().toString().padStart(2, `0`),
    m: (date) => date.getMinutes().toString(),
    SS: (date) => date.getSeconds().toString().padStart(2, `0`),
    S: (date) => date.getSeconds().toString(),
    MS: (date) => date.getMilliseconds().toString().padStart(3, `0`),
}