function createCard(product) {
    var blueClass = "";
    var redClass = "";
    for (var i in Cart.cartItems) {
        console.log(i);
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
        `<div class='card'>
            <img src=/image/items/` + product.image + `>
            <div class='productName'>` + product.name + `</div>
            <div class='container'>
                <hr> 
                <p class='description'>` + product.description + `</p>
                <span>` + product.price + `</span>
                <button class='currencyBtn'>Change currency</button>
                <br>
                <br>
                <i onclick='heartHandler(this," + id + ")' class='` + redClass + `" wishlist fas fa-heart'></i>
                <i onclick='cartHandler(this," + id + ")' class='` + blueClass + `" cart fas fa-shopping-cart'></i>
                <br>
            </div> 
        </div>`;
    

}

function heartHandler(icon, itemId) {
    icon.classList.toggle("red");
    if (icon.classList[3] == "red") {
        WishList.addWishListItem(itemId);
    } else {
        WishList.removeWishListItem(itemId);
    }
}

function cartHandler(icon, itemId) {
    icon.classList.add("blue");
    Cart.addCartItem(new CartItem(itemId));

}

function displayProducts() {
    document.getElementById("cardContainer").innerHTML = "";
    for (viewedProduct of viewedProducts.data) {
        document.getElementById("cardContainer").insertAdjacentHTML(
            "beforeend", createCard(viewedProduct));
    }
}

//----------------------------------------------------------------------


addEventListener("onLoadProductsData", function () {
    viewedProducts.allProducts();
    displayProducts();
    setPriceFilter(viewedProducts.getMinPrice(), viewedProducts.getMaxPrice());
    setCategoryFilter();
});

function setPriceFilter(minPrice, maxPrice) {
    $("#priceFilterSlider").slider({
        range: true,
        min: minPrice,
        max: maxPrice,
        values: [minPrice, maxPrice],
        slide: function (event, ui) {
            $("#priceFilterMinVal").val("$" + ui.values[0]);
            $("#priceFilterMaxVal").val("$" + ui.values[1]);
        },

    });

    $("#priceFilterMinVal").val("$" + $("#priceFilterSlider").slider("values", 0));
    $("#priceFilterMaxVal").val("$" + $("#priceFilterSlider").slider("values", 1));
}

function setCategoryFilter() {
    document.getElementById("categoryFilter").innerHTML = "";

    for (var category of viewedProducts.getCategories()) {
        var categoryNode = document.createElement("div");
        categoryNode.innerHTML = `<label for=` + category + `>` + category + `</label>
                                  <input type="checkbox" id="` + category + `" />`;
        document.getElementById("categoryFilter").appendChild(categoryNode);
    }
}

document.getElementById("applyFilterBtn").onclick = function () {

    var checkedCategories = [];

    for (var categoryDiv of document.getElementById("categoryFilter").children) 
        if(categoryDiv.lastChild.checked)
            checkedCategories.push(categoryDiv.firstChild.innerHTML);
    
    viewedProducts.filter(
        $("#priceFilterSlider").slider("values", 0),
        $("#priceFilterSlider").slider("values", 1),
        checkedCategories
    );
    displayProducts();

}