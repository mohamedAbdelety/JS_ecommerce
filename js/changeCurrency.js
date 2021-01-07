

/*
function changePricesCurrency(toType = "EGP") {
    const data = "from-type=USD&to-type=" + toType + "&from-value=1";
    var result;
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("POST", "https://community-neutrino-currency-conversion.p.rapidapi.com/convert");
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("x-rapidapi-key", "a6f4cc568amshba9252335e65ecap1ca917jsna09b6d9e898b");
    xhr.setRequestHeader("x-rapidapi-host", "community-neutrino-currency-conversion.p.rapidapi.com");
    xhr.send(data);



    xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE)
            if (xhr.status == 200) {
                console.log(this.responseText);
                preferredCurrency.name = toType;
                preferredCurrency.factor = (JSON.parse(this.responseText)).result;
                $C.setCookie("preferredCurrency", JSON.stringify(preferredCurrency));
                displayProducts();
                // currencyBTN.previousElementSibling.innerHTML = result;
            } else
                alert("failed to change currency");

    }

}
*/



