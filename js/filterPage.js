

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
        `<div class='card'>
            <img src=/image/items/` + product.image + `>
            <div class='productName'>` + product.name + `</div>
            <div class='container'>
                <hr> 
                <p class='description'>` + product.description + `</p>
                <span>` + product.price + `</span>
                <button onclick='changeCurrency(this,`+product.price+`)' class='currencyBtn'>Change currency</button>
                <br>
                <br>
                <i onclick='heartHandler(this,` + product.id + `)' class='` + redClass + ` wishlist fa fa-heart'></i>
                <i onclick='cartHandler(this,` +  product.id + `)' class='` + blueClass + ` cart fa fa-shopping-cart'></i>
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
    document.getElementById("wishCountSpan").innerText = WishList.wishListItemsCount();
}

function cartHandler(icon, itemId) {
    icon.classList.add("blue");
    Cart.addCartItem(new CartItem(itemId));
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
            $("#priceFilterMinVal").val(ui.values[0]);
            $("#priceFilterMaxVal").val(ui.values[1]);
        },

    });

    $("#priceFilterMinVal").val($("#priceFilterSlider").slider("values", 0));
    $("#priceFilterMaxVal").val($("#priceFilterSlider").slider("values", 1));
}


function setCategoryFilter() {
   //document.getElementById("categoryFilter").innerHTML = "";

    for (var category of viewedProducts.getAllCategories()) {
        var categoryNode = document.createElement("div");
        categoryNode.innerHTML = `<input type="checkbox" id="` + category + `" checked />
                                  <label for="` + category + `">` + category + `</label>
                                  <span name="` + category + `">(` + viewedProducts.getProductsCountForCategory(category) + `)</span>`;
        document.getElementById("categoryFilter").appendChild(categoryNode);
    }
}

function refreshCategoryFilter() {
    ///refresh category checkBox
    for (var categoryCheckbox of document.querySelectorAll("#categoryFilter input[type='checkbox']"))
        if (viewedProducts.getProductsCountForCategory(categoryCheckbox.getAttribute("id")) == 0) {
            categoryCheckbox.checked = false;
            categoryCheckbox.disabled = true;
        } else
            categoryCheckbox.disabled = false;

    ///refresh category products count
    for (var categoryProductsCountSpan of document.querySelectorAll("#categoryFilter span"))
        categoryProductsCountSpan.innerHTML = "(" +
        viewedProducts.getProductsCountForCategory(categoryProductsCountSpan.getAttribute("name")) +
        ")";


}

//------------------ Add Events Listeners --------------------

addEventListener("onLoadProductsData", function () {
    viewedProducts.allProducts();
    displayProducts();
    setPriceFilter();
    setCategoryFilter();
});


document.getElementById("applyFilterBtn").onclick = function () {

    viewedProducts.allProducts();

    viewedProducts.filterDataByName(document.querySelector("#productNameFilterTxt").value);

    viewedProducts.filterDataByPrice(
        parseInt(document.querySelector("#priceFilterMinVal").value),
        parseInt(document.querySelector("#priceFilterMaxVal").value)
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

document.querySelector("#priceFilterMinVal").onchange = function () {
    setPriceFilter(
        this.value,
        document.querySelector("#priceFilterMaxVal").value
    );
}

document.querySelector("#priceFilterMaxVal").onchange = function () {
    setPriceFilter(
        document.querySelector("#priceFilterMinVal").value,
        this.value
    );
}