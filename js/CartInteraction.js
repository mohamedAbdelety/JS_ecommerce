onload = function(){
        
function intiTable(){
    document.getElementById("cartCountSpan").innerText = Cart.cartItemsCount();
    var CartRow = '';
    var product;
    $("#cartTableBody").html("");
    if(Cart.cartItems.length == 0){
        CartRow = `
                <tr>
                    <td colspan="8">
                        No items in cart to show it.
                    </td>
                </tr>
            `;
            $("#cartTableBody").html(CartRow);
    }else{
        for(var i =0;i<Cart.cartItems.length;i++){
            product = store.getProductById(Cart.cartItems[i].Itemid);
            CartRow = `
                <tr>
                    <td>${product.name}</td>
                    <td title="${product.description}">${product.description.substr(0,45)}</td>
                    <td>
                        <a href="image/items/${product.image}">
                            <img src="image/items/${product.image}" width="100px">
                        </a>
                    </td>
                    <td>
                        <button class="mybtn btn-red decrease-cart-quantity">
                            <i class="fa fa-minus"></i>
                        </button>
                        <input type="number" class="quant-field" data-product-id="${Cart.cartItems[i].Itemid}" data-price="${product.price}" data-max="${product.quantity}" value="${Cart.cartItems[i].quantity}" disabled>
                        <button class="mybtn btn-green increase-cart-quantity">
                            <i class="fa fa-plus"></i>
                        </button>
                    </td>
                    <td class="ava">${product.quantity - Cart.cartItems[i].quantity}</td>
                    <td>${product.price}</td>
                    <td class="total-row-price">${Cart.cartItems[i].CartItemPrice()}</td>
                    <td>
                        <button data-remove-product="${product.name}" data-remove="${Cart.cartItems[i].Itemid}" class="mybtn btn-delete removeCartBtn">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            $("#cartTableBody").append(CartRow);
        }
    }
    $("#cartTableBody").append(`
        <tr>
            <td colspan="2">
                Total Quantity
            </td>
            <td id="totalCartCount" colspan="2">
                ${Cart.cartItemsCount()}
            </td>
            <td colspan="2">
                Total price
            </td>
            <td id="totalCartPrice" colspan="2">
                ${Cart.cartTotalPrice()}
            </td>
        </tr>
    `);

}
intiTable();
   
    

// call removeItem from cart
$(".removeCartBtn").on("click",function(){
    var check = confirm("are you sure to delete "+$(this).attr("data-remove-product")+" from Cart");
    if(check){
        Cart.removeCartItem($(this).attr("data-remove"));
        $(this).parent().parent().remove();
        updateDispalyTotalpart();
        document.getElementById("cartCountSpan").innerText = Cart.cartItemsCount();
    }
});

$("#emptycart").on("click",function(){
    var check = confirm("are you sure to delete all items in cart");
    if(check){
        Cart.removeAllCartItems();
        intiTable();
    }
});



$("#saveCart").on("click",function(){
    var CartItemArr = [];
    var itemsForm = document.getElementsByClassName("quant-field");
    for(var i = 0; i < itemsForm.length; i++){
        if(+itemsForm[i].value > 0){
            CartItemArr.push(new CartItem(itemsForm[i].getAttribute("data-product-id"),+itemsForm[i].value));
        }else{
            //remove
            itemsForm[i].classList.add("removeit");
        }
    }
    $(".removeit").parent().parent().remove();
    Cart.saveCartUpdate(CartItemArr);
    document.getElementById("cartCountSpan").innerText = Cart.cartItemsCount();
    alert("Succeful update");
});



function updateDispalyTotalpart(){
    var t_price = 0;
    var t_count = 0;
    var itemsForm = document.getElementsByClassName("quant-field");
    for(var i = 0; i < itemsForm.length; i++){
        
        t_count += +itemsForm[i].value;
        t_price += +itemsForm[i].getAttribute("data-price") * +itemsForm[i].value;
        
    }
    $('#totalCartCount').text(t_count);
    $('#totalCartPrice').text(t_price);
}

$(".increase-cart-quantity").on("click",function(){
    var oldValue = +$(this).prev().val();
    if(oldValue < $(this).prev().attr("data-max")){
        $(this).prev().val(oldValue + 1);
        var oldava = +$(this).parent().siblings(".ava").text();
        $(this).parent().siblings(".ava").text(oldava - 1);
        var newtotal = +$(this).prev().val() * +   +$(this).prev().attr("data-price");
        $(this).parent().siblings(".total-row-price").text(newtotal); 
        updateDispalyTotalpart();
    }
});

$(".decrease-cart-quantity").on("click",function(){
    var oldValue = +$(this).next().val();
    if(oldValue > 0){
        $(this).next().val(oldValue - 1);
        var oldava = +$(this).parent().siblings(".ava").text();
        $(this).parent().siblings(".ava").text(oldava + 1);
        var newtotal = +$(this).next().val() * +   +$(this).next().attr("data-price");
        $(this).parent().siblings(".total-row-price").text(newtotal);
        $('.totalCartCount').text(Cart.cartItemsCount());
        $('.totalCartPrice').text(Cart.cartTotalPrice());
        updateDispalyTotalpart();
    }
});


/// printing
$("#printcart").on("click",function(){
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
    mywindow.document.write('<html><head><title>' + document.title  + '</title><link rel="stylesheet" media="screen" media="print" type="text/css" href="css/print.css">');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1><br<br>');
    mywindow.document.write(document.getElementById("cartTable").outerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    //mywindow.close();
    return true;
});

   
}











