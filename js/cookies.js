

function getCookie(cookieName){
    if(arguments.length != 1){
        throw new Error("function get cookie required one paramter is cookie name");
    }
    let cookies_arr = document.cookie.split(";");
    for(var i=0;i < cookies_arr.length;i++) {
        let cookie = cookies_arr[i].split("=");
        if(cookie[0].trim() == cookieName){
            return cookie[1]; 
        }
    }
    //throw new Error("No cookie called "+cookieName);
    return '';
}

function deleteCookie(cookieName){
    if(arguments.length != 1){
        throw new Error("function delete cookie required one paramter is cookie name");
    }
    if(!hasCookie(cookieName)){
        throw new Error("No cookie called "+cookieName);
    }
    var d = new Date();
    d.setTime(d.getTime() - (24*60*60*1000));
    d.toUTCString();
    document.cookie= cookieName+"=;expires="+d;
}

function hasCookie(cookieName){
    if(arguments.length != 1){
        throw new Error("function hasCookie required one paramter is cookie name");
    }
    //try{
        if (getCookie(cookieName) != ''){
            return true;
        }else{
            return false;
        }
    //}catch(e){
     //   return false;
    //}
}

function allCookieList(){
    if(arguments.length > 0){
        throw new Error("function allCookieList dont required any paramter");
    }
    let cookies_arr = document.cookie.split(";");
    let result = [];
    for(var i=0;i < cookies_arr.length;i++) {
        let cookie = cookies_arr[i].split("=");
        result[cookie[0]] = 1;//cookie[1];
    }
    return result;
}

function setCookie(cookieName,cookieValue,expiryDay = null){
    if(!(arguments.length == 2 || arguments.length == 3)){
        throw new Error("function setCookie require 2 paramter at least and 3 for maximum");
    }
    if(expiryDay == null) 
        document.cookie= cookieName+"="+cookieValue;
    else{
        var d = new Date();
        d.setTime(d.getTime() + (expiryDay*24*60*60*1000));
        d.toUTCString();
        // "Thu, 17 Dec 2020 16:46:42 GMT" // toGMTString return same output but this debracted
        document.cookie= cookieName+"="+cookieValue+";expires="+d;
    }
}


