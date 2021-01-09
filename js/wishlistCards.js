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
            <div class='_container'>
                <hr> 
                <p class='description'>` + product.description + `</p>
                <span>` + product.price + `</span>
                <button onclick='changeCurrency(this,`+product.price+`)' class='currencyBtn'>Change currency</button>
                <br>
                <br>
                <i onclick='heartHandler(this,` + product.id + `)' class='` + redClass + ` wishlist fa fa-heart'></i>
                <i onclick='cartHandler(this,` +  product.id + `)' class='` + blueClass + ` cart fa fa-cart-plus'></i>
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
        //removing card in case of unlike
        $(icon).parent().parent().fadeOut(1000);        
    }
    document.getElementById("wishCountSpan").innerText = WishList.wishListItemsCount();
   
}

function cartHandler(icon, itemId) {
   if (!((icon.classList["value"]).split(" ")).includes ("blue")){
        icon.classList.add("blue");
        Cart.addCartItem(new CartItem(itemId));
    }
    document.getElementById("cartCountSpan").innerText = Cart.cartItemsCount();
}

function displayWishlistCards(){
    console.log(WishList.wishListItems.length);
    for (var itemID of WishList.wishListItems) {
        var item = store.getProductById(itemID);
        document.getElementById("cardContainer").insertAdjacentHTML(
            "beforeend", createCard(item)
        ) ;
     }
}

addEventListener("onLoadProductsData", function () {
    displayWishlistCards();
});


