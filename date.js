let today = new Date();
let dd = today.getDate();
let month = today.getMonth();
let yy = today.getFullYear();
let mm;
switch(month){
    case 0 :
        mm = "january";
        break;
    case 1 :
        mm = "Februari";
        break;
    case 2 :
        mm = "Maret";
        break;
    case 3 :
        mm = "April";
        break;
    case 4 :
        mm = "Mei";
        break;
    case 5 :
        mm = "Juni";
        break;
    case 6 :
        mm = "July";
        break;
    case 7 :
        mm = "Agustus";
        break;
    case 8 :
        mm = "September";
        break;
    case 9 :
        mm = "Oktober";
        break;
    case 10 :
        mm = "November";
        break;
    case 11 :
        mm = "Desember";
        break;
}

today = dd+'  '+mm+' '+yy;

module.exports = today;
