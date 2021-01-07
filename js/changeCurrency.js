var preferredCurrency = {
    name: "USD",
    factor: 1
};

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

function changePricesCurrency(toType = "EGP") {
    const key = "a372b2517afcf282ec51";
    var url = "https://free.currconv.com/api/v7/convert?q=USD_" + toType + "&compact=ultra&callback=sampleCallback&apiKey=" + key;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url)
    xhr.send("");

    xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE)
            if (xhr.status == 200) {
                preferredCurrency.name = toType;
                preferredCurrency.factor = parseFloat(this.responseText.split('{')[1].split('}')[0].split(':')[1]);;
                $C.setCookie("preferredCurrency", JSON.stringify(preferredCurrency));
                displayProducts();
                setPriceFilter();
            } else
                alert("failed to change currency");

    }

}


document.querySelector("#currenciesSelect").onchange = function () {
    if (this.value == "USD") {
        preferredCurrency.name = "USD";
        preferredCurrency.factor = 1;
        $C.setCookie("preferredCurrency", JSON.stringify(preferredCurrency));
        displayProducts();
        setPriceFilter();

    } else
        changePricesCurrency(this.value);
}
