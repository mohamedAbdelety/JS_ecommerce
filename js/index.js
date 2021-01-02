//Retrieving data from JSON File
function ProductsStore() {
    if (ProductsStore.counter > 0)
        throw new Error("invalid creation of another ItemsStore instance");

    ProductsStore.counter++;

    var data = [];

    (function () {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "items.json");
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                that.data = JSON.parse(xhr.responseText);
            }
        }
    })();

    this.getItems = function () {
        return data;
    }

    this.getProductById = function (_prouctId) {
        for (var product of data)
            if (product.id == _prouctId)
                return product;
        throw "Product id not found in the ProductStore";
    }
}
ItemsStore.counter = 0;
var Item = function (_id, _name, _category, _image, _price, _quantity, _desc) {
    this.id = _id;
    this.name = _name;
    this.category = _category;
    this.image = _image;
    this.price = _price;
    this.quantity = _quantity;
    this.desc = _desc;
};
/*=============================================================================*/





//Cart Items Constructor ,cart object has only two attributes:
// Product ID and the number of product items in the cart
function CartItem(_Itemid, _quantity = 1) {
    this.Itemid = _Itemid;
    this.quantity = _quantity;
}
CartItem.prototype.increaseQuantity = function (increase = 1) {
    this.quantity += increase;
}
CartItem.prototype.decreaseQuantity = function (decrease = 1) {
    if (this.quantity > decrease) this.quantity -= decrease;
}
CartItem.prototype.CartItemPrice = function () {
    var that = this;
    return store.getProductById(that.Itemid).price * this.quantity;
}

/*=============================================================================*/


/*The cart object has all the items in cartItems array(array of cartItem objects) , this array will be
cloned in the cookies.cartCookie is updated on every change in the cartItems array
function to be used to handle UI
-addCartItem(): takes cartitem Object as input (thus it will be passed the cart item constructor)
-removeCartItem(): take item's ID as parameter
-removeAllCartItems():takes no parameters
-decreaseCartItemQuantity(): takes the item id and the quantity to be decreased by  
-increaseCartItemQuantity(): takes the item id and the quantity to be increased by 
*/
var Cart = {
    cartItems: [],

    CartItemById: function (_itemId) {
        for (var cartItem of this.cartItems)
            if (cartItem.Itemid == _itemId)
                return cartItem
        throw "Item id Not Found in the cart";
    },

    addCartItem: function (_newCartItem) {
        if (arguments.length != 1)
            throw "function must take only One parameter";
        if (_newCartItem.constructor != CartItem)
            throw "parameter should be of type CartItem";

        for (var cartItem of this.cartItems)
            if (cartItem.Itemid == _newCartItem.Itemid) {
                cartItem.increaseQuantity(_newCartItem.quantity);
                this.updateCartCookie();
                return;
            }

        this.cartItems.push(_newCartItem);
        this.updateCartCookie();
    },

    removeAllCartItems: function () {
        this.cartItems = [];
        this.updateCartCookie();
    },

    removeCartItem: function (_itemId) {
        for (var i in this.cartItems)
            if (this.cartItems[i].Itemid == _itemId) {
                this.cartItems.splice(i, 1);
                this.updateCartCookie();
                return;
            }
        throw "Item id Not Found in the cart";

    },

    decreaseCartItemQuantity: function (_itemId, _decrease = 1) {
        try {
            if (this.CartItemById(_itemId).quantity <= _decrease)
                this.removeCartItem(_itemId);
            else {
                this.CartItemById(_itemId).decreaseQuantity(_decrease);
                this.updateCartCookie();
            }
        } catch (e) {
            alert(e);
        }

    },

    increaseCartItemQuantity: function (_itemId, _increase = 1) {
        this.CartItemById(_itemId).increaseQuantity(_increase);
        this.updateCartCookie();
    },

    updateCartCookie: function () {
            var cookieStr = JSON.stringify(this.cartItems)
            var expireDate = new Date();
            expireDate.setMonth(expireDate.getMonth() + 1);
            $C.setCookie("cart", cookieStr, expireDate);
        }

        ,
    importFromCookie: function () {
        if ($C.hasCookie("cart")) {
            for (var cartItem of JSON.parse($C.getCookie("cart")))
                this.cartItems.push(new CartItem(cartItem.Itemid, cartItem.quantity));
        }

    },
    
    cartTotalPrice: function () {
        var sum = 0;
        for (var item of this.cartItems) {
            sum += item.CartItemPrice();
        }
        return sum;

    },

    cartItemsCount :function() {
        var result = 0;
        for (var cartItem of this.cartItems)
            result+= cartItem.quantity;
        return result;
    }
}
/*==========================================================================*/




/*Wish List*/
/*
-WishList.wishListItems: Array if all liked items IDs;
-likeItem(_itemId): function to like item
-unlikeItem(_itemId):function to unlike item
*/

var WishList = {
    wishListItems: [],
    addWishListItem: function (_itemId) {
        if (!this.wishListItems.includes(_itemId)) {
            this.wishListItems.push(_itemId);
            this.updateWishListCookie();
        }
    },

    removeWishListItem: function (_itemId) {
        this.wishListItems.splice(this.wishListItems.indexOf(_itemId), 1);
        this.updateWishListCookie();
    },

    removeAllWishListItems: function () {
        this.wishListItems = [];
        this.updateWishListCookie();
    },

    updateWishListCookie: function () {
        var LikedStr = JSON.stringify(this.wishListItems);
        var expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + 1);
        $C.setCookie("WishList", LikedStr, expireDate);
    },
    importFromCookie: function () {
        if ($C.hasCookie("WishList")) {
            for (var likedItem of JSON.parse($C.getCookie("WishList")))
                this.wishListItems.push(likedItem);
        }
    },
    wishListItemsCount :function() {
        return this.wishListItems.length;
    }
}


/*
-viewProduct object is used to view products in the store by calling
-viewedProducts.allProducts(): return array of all objects in the store
-viewedProducts.(minPrice, maxPrice, category, name): returns array of objects after applying the filter
*/
var viewedProducts = {
    data: [],

    allProducts: function () {
        this.data = store.getItems();
    },

    filter: function (minPrice, maxPrice, category, name) {
        this.allProducts();
        this.data = this.data.filter(function (product) {
            return (product.price > minPrice || !minPrice) &&
                (product.price < maxPrice || !maxPrice) &&
                (product.category == category || !category) &&
                (product.name.indexOf(name) != -1 || !name)
        })
    }

}


/*==================================================================================================*/
//initializing data
var store = new ProductsStore();


addEventListener("onLoadProductsData", function () {
    viewedProducts.allProducts();
    Cart.importFromCookie();
    WishList.importFromCookie();
});








//  //Testing

// Cart.removeAllCartItems();
// Cart.addCartItem(new CartItem(1,3));
// Cart.addCartItem(new CartItem(2,7));
// Cart.addCartItem(new CartItem(1,3));


// // WishList.removeAllWishListItems();
// WishList.addWishListItem(2);
// WishList.addWishListItem(3);
// WishList.removeWishListItem(2);


//