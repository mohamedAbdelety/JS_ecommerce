function changeCurrency(currencyBTN,value,toType = "EGP"){   
    const data = "from-type=USD&to-type="+toType+"&from-value="+value;
    var result;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            result =  (JSON.parse(this.responseText)).result;
            currencyBTN.previousElementSibling.innerHTML = result;
        }
    });

    xhr.open("POST", "https://community-neutrino-currency-conversion.p.rapidapi.com/convert");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("x-rapidapi-key", "a6f4cc568amshba9252335e65ecap1ca917jsna09b6d9e898b");
    xhr.setRequestHeader("x-rapidapi-host", "community-neutrino-currency-conversion.p.rapidapi.com");

    xhr.send(data);
    
    

} 

