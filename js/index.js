function ProductsStore() {
    if (ProductsStore.counter > 0)
        throw new Error("invalid creation of another ItemsStore instance");

    ProductsStore.counter++;

    var data = [];

    var that = this;

    (function initializeItems() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "items.json");
        xhr.send("");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    data = JSON.parse(xhr.responseText);
                    viewedProducts.allProducts();
                } else
                    alert(xhr.statusText);
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

ProductsStore.counter = 0;

function Product(_id, _name, _category, _image, _price, _quantity, _desc) {
    this.id = _id;
    this.name = _name;
    this.category = _category;
    this.image = _image;
    this.price = _price;
    this.quantity = _quantity;
    this.desc = _desc;
};

function CartItem(_Itemid, _quantity = 1) {
    this.Itemid = _Itemid;
    this.quantity = _quantity;

    this.increaseQuantity = function (increase = 1) {
        this.quantity += increase;
    }

    this.decreaseQuantity = function (decrease = 1) {
        if (this.quantity > decrease) this.quantity -= decrease;
    }

    this.CartItemPrice = function () {
        var that = this;
        return store.getProductById(that.Itemid).price * this.quantity;
    }


}


//use this function in Cart page 
var Cart = {
    cartItems: [],

    CartItemById: function (_itemId) {
        for (var cartItem of this.cartItems)
            if (cartItem.Itemid == _itemId)
                return cartItem
        throw "Item id Not Found in the cart";
    },

    addCartItem: function (_newCartItem) {
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

    }
}

//use this object to get data in the products page 
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



var store = new ProductsStore();
Cart.importFromCookie();
