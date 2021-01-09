//------------------ Generating Cards Functions --------------------

function createCard(product) {
    var blueClass = "";
    var redClass = "";
    for (var i in Cart.cartItems) {
        if (Cart.cartItems[i].Itemid == product.id) {
            blueClass = "blue";
        }
    }
    for (var j in WishList.wishListItems) {
        if (WishList.wishListItems[j] == product.id) {
            redClass = "red";
        }
    }
    
    
    return document.createElement("div").innerHTML =
        `<div class='card' onclick='itemPage("${product.image}","${product.name}","${product.description}")'>
            <img src=/image/items/` + product.image + `>
            <div class='productName'>` + product.name + `</div>
            <div class='_container'>
                <hr> 
                <p class='description'>` + product.description + `</p>
                <span>` + PreferredCurrency.symbol+ ` ` + (product.price * (+PreferredCurrency.factor)).toFixed(2) + `</span>
                <i onclick='heartHandler(event, this,` + product.id + `)' class='` + redClass + ` wishlist fa fa-heart'></i>
                <i onclick='cartHandler(event,this,` +  product.id + `)' class='` + blueClass + ` cart fa fa-shopping-cart'></i>
                <br>
            </div> 
        </div>`;


}

//this functin create item window on the fly 
function itemPage(image,name, desc){
   var popup = open("", "", "width=700,height=500");
   
        popup.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Product : ` + name.toUpperCase() + `</title>
            </head>
            <body style="text-align:center ;background-image: url('./image/backgroundtexture.jpg')">
                <img id ="myImg" style="height:300px; margin:auto" src="./image/items/` +image + ` " id="productIMG">
                <h1 id="name" style="color:#641E16; font-weight:bold ;font-family:courier" >` + name.toUpperCase() + `</h1>
                <hr style="width:70%">
                <div id="desc" style="color:#641E16 ;font-family:arial" > ` + desc.toUpperCase() + `</div>
            </body>
        </html>`);
    
}


function heartHandler(event,icon, itemId) {
    icon.classList.toggle("red");
    event.stopPropagation();
    if (icon.classList[3] == "red") {
        WishList.addWishListItem(itemId);
    } else {
        WishList.removeWishListItem(itemId);
    }
    document.getElementById("wishCountSpan").innerText = WishList.wishListItemsCount();
}

function cartHandler(event,icon, itemId) {
    event.stopPropagation();
    
    if (!((icon.classList["value"]).split(" ")).includes ("blue")){
        icon.classList.add("blue");
        Cart.addCartItem(new CartItem(itemId));
    }
    document.getElementById("cartCountSpan").innerText = Cart.cartItemsCount();
}




function displayProducts() {
    document.getElementById("cardContainer").innerHTML = "";
    for (viewedProduct of viewedProducts.data) {
        document.getElementById("cardContainer").insertAdjacentHTML(
            "beforeend", createCard(viewedProduct));
    }
}

//------------------ Filter Functions --------------------

function setPriceFilter(currMin, currMax) {
    currMin = currMin ? currMin : viewedProducts.getMinPrice();
    currMax = currMax ? currMax : viewedProducts.getMaxPrice();

    $("#priceFilterSlider").slider({
        range: true,
        min: viewedProducts.getMinPrice(),
        max: viewedProducts.getMaxPrice(),
        values: [currMin, currMax],
        slide: function (event, ui) {
            $("#priceFilterMinVal").val(+(ui.values[0] * PreferredCurrency.factor).toFixed(2));
            $("#priceFilterMaxVal").val(+(ui.values[1] * PreferredCurrency.factor).toFixed(2));
        },

    });

    $("#priceFilterMinVal").val(+($("#priceFilterSlider").slider("values", 0) * PreferredCurrency.factor).toFixed(2));
    $("#priceFilterMaxVal").val(+($("#priceFilterSlider").slider("values", 1) * PreferredCurrency.factor).toFixed(2));

    $(".filterCurrencySymbol").html("(" + PreferredCurrency.symbol + ")");

}

function setCategoryFilter() {
    document.getElementById("categoryFilter").innerHTML = "";

    for (var category of viewedProducts.getAllCategories()) {
        var categoryNode = document.createElement("div");
        var checked="checked";
        if ($C.getCookie("selectedCat")!="undefined"){
            console.log($C.getCookie("selectedCat"));
            console.log(category)
            checked=$C.getCookie("selectedCat")==category?"checked":"disabled";

        }
        
            categoryNode.innerHTML = `<input type="checkbox" id="` + category + `" `+checked+` />
                                  <label for="` + category + `">` + category + `</label>
                                  <span name="` + category + `">(` + viewedProducts.getProductsCountForCategory(category) + `)</span>`;
        document.getElementById("categoryFilter").appendChild(categoryNode);
    }
    
}

function refreshCategoryFilter() {
    ///refresh category checkBox
    // for (var categoryCheckbox of document.querySelectorAll("#categoryFilter input[type='checkbox']"))
    //     if (viewedProducts.getProductsCountForCategory(categoryCheckbox.getAttribute("id")) == 0) {
    //         //categoryCheckbox.checked = false;
    //         categoryCheckbox.disabled = true;
    //     } else
    //         categoryCheckbox.disabled = false;

    ///refresh category products count
    for (var categoryProductsCountSpan of document.querySelectorAll("#categoryFilter span"))
        categoryProductsCountSpan.innerHTML = "(" +
        viewedProducts.getProductsCountForCategory(categoryProductsCountSpan.getAttribute("name")) +
        ")";


}

function applyFilter() {

    viewedProducts.allProducts();

    viewedProducts.filterDataByName(document.querySelector("#productNameFilterTxt").value);
    
    viewedProducts.filterDataByPrice(
        parseInt(Math.floor(document.querySelector("#priceFilterMinVal").value / PreferredCurrency.factor)),
        parseInt(Math.ceil(document.querySelector("#priceFilterMaxVal").value / PreferredCurrency.factor))
    );

    refreshCategoryFilter();

    ///get checked categories for category filter
    var checkedCategories = [];
    for (var categoryDiv of document.getElementById("categoryFilter").children)
        if (categoryDiv.querySelector("input[type='checkbox']")?.checked)
            checkedCategories.push(categoryDiv.querySelector("label").innerHTML);

    if (checkedCategories.length == 0)
        for (var categoryCheckbox of document.querySelectorAll("#categoryFilter input[type='checkbox']"))
            categoryCheckbox.checked = true


    viewedProducts.filterDataByCategory(checkedCategories);

    displayProducts();
}

function resetFilter() {

    viewedProducts.allProducts();
    displayProducts();
    setPriceFilter();
    setCategoryFilter();

}
//--------------Currency Conversion Functions---------------

var PreferredCurrency = {
    id: "USD",
    symbol: "$",
    factor: 1
};
const key = "a372b2517afcf282ec51";

function changePricesCurrency(toType = "USD", currencySymbol) {

    var url = "https://free.currconv.com/api/v7/convert?q=USD_" + toType + "&compact=ultra&apiKey=" + key;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url)
    xhr.send("");

    xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE)
            if (xhr.status == 200) {
                PreferredCurrency.id = toType;
                PreferredCurrency.symbol = currencySymbol;
                PreferredCurrency.factor = JSON.parse(this.responseText)["USD_" + toType];
                $C.setCookie("preferredCurrency", JSON.stringify(PreferredCurrency));
                displayProducts();
                setPriceFilter();
                
            } else
                alert("failed to change currency");

    }

}

function generateCurrenciesList() {
    var url = "https://free.currconv.com/api/v7/currencies?apiKey=" + key;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url)
    xhr.send("");

    xhr.onreadystatechange = function () {
        if (this.readyState === this.DONE)
            if (xhr.status == 200) {
                var currenciesResult = JSON.parse(this.responseText).results;
                for (var currency in currenciesResult) {
                    var currencyOption = document.createElement("option");
                    currencyOption.innerHTML = currenciesResult[currency].currencyName;
                    currencyOption.id = currenciesResult[currency].id;
                    currencyOption.value = currenciesResult[currency].currencySymbol??currenciesResult[currency].id;
                    if(currencyOption.id == PreferredCurrency.id)
                        currencyOption.selected = 'selected';
  
                    document.querySelector("#currenciesSelect").appendChild(currencyOption);
                }
            } else
                alert("failed to add currencies [Error" + xhr.status +"]");

    }
}

//------------------ Add Events Listeners --------------------

// to ensure that data are already loaded from json file
addEventListener("onLoadProductsData", function () {
    viewedProducts.allProducts();
    setPriceFilter();
    setCategoryFilter();
    if ($C.getCookie("selectedCat")!="undefined"){
        viewedProducts.filterDataByCategory($C.getCookie("selectedCat"));
    }
    $C.deleteCookie("selectedCat");
    displayProducts();
});


document.getElementById("applyFilterBtn").onclick = applyFilter;

document.getElementById("resetFilterBtn").onclick = resetFilter;

document.querySelector("#priceFilterMinVal").onchange = function () {
    setPriceFilter(
        this.value / PreferredCurrency.factor,
        document.querySelector("#priceFilterMaxVal").value / PreferredCurrency.factor
    );
}

document.querySelector("#priceFilterMaxVal").onchange = function () {
    setPriceFilter(
        document.querySelector("#priceFilterMinVal").value / PreferredCurrency.factor,
        this.value / PreferredCurrency.factor
    );
}

document.querySelector("#currenciesSelect").onchange = function () {
    changePricesCurrency(this.options[this.selectedIndex].id, this.value);
}


//------------------ initiate things --------------------

!function (){
    if($C.hasCookie("preferredCurrency"))
        PreferredCurrency = JSON.parse($C.getCookie("preferredCurrency"));

    //to refresh currency factor
    if(PreferredCurrency.id != "USD")
        changePricesCurrency(PreferredCurrency.id, PreferredCurrency.symbol);
    
    generateCurrenciesList();
    
}();

