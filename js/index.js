function ItemsStore() {
    if (ItemsStore.counter > 0)
        throw new Error("invalid creation of another ItemsStore instance");
    var data = [];
    var that = this;
    (function initializeItems() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "items.json");
        xhr.send("");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    that.data = JSON.parse(xhr.responseText);
                    console.log(that);
                } else 
                    alert(xhr.statusText);
            }
        }
    })();
   this.getItems=  function () {
        return this.data;
    }
    ItemsStore.counter++;
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
}


var store = new ItemsStore();