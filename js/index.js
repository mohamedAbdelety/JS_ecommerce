function ItemsStore() {
    if (ItemsStore.counter > 0)
        throw new Error("invalid creation of another ItemsStore instance");
    var data = [];
    var that = this;
    (function initializeItems() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "items.json");
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                that.data = JSON.parse(xhr.responseText);
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