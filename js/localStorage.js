

function LS(storageName) {
    this.storage = storageName;
    this.items = JSON.parse(localStorage.getItem(this.storage)) || [];
    // this.guid = this.guid.bind(this);

    this.getAllItems = function () {
        return this.items || [];
    }
    this.addItem = function (item) {
        this.items.push(Object.assign({}, { item: item, id: this.guid() }));
        localStorage.setItem(this.storage, JSON.stringify(this.items));
    }
    this.findItemById = function (id, success) {
        var result = false;
        var find = function (arr, success) {
            arr.forEach(function (item) {
                if (item.id == id) {
                    success(item);
                    result = true;
                } else if (item.child instanceof Array) {
                    find(item.child, success);
                }
            });
            return result;
        }
        return find(this.items, success);
    }
    this.addChildItem = function (parentId, note) {
        var self = this;
        this.findItemById(parentId, function (item) {
            if (item.hasOwnProperty('child') && item.child.length > 0) {
                item.child.push({ item: note, id: self.guid() });
            } else {
                item.child = [{ item: note, id: self.guid() }];
            }
        });
        localStorage.setItem(this.storage, JSON.stringify(this.items));
        return true;
    }
    this.deleteItemById = function (itemId) {
        var result = false;
        var findAndDelete = function (arr, id) {
            arr.forEach(function (item, index) {
                if (item.id == id) {
                    arr.splice(index, 1);
                    result = true;
                    return true;
                } else if (item.child instanceof Array) {
                    findAndDelete(item.child, id);
                }
            });
            return result;
        }
        if (findAndDelete(this.items, itemId)) {
            localStorage.setItem(this.storage, JSON.stringify(this.items));
            return true
        }
    }
    this.searchByText = function (text) {
        var result = [];
        var searchText = function (arr, search) {
            arr.forEach(function (item) {
                if (item.item.toLowerCase().includes(search)) {
                    result.push(item);
                } else if (item.child instanceof Array) {
                    searchText(item.child, search);
                }
            });
        }
        searchText(this.items, text);
        return result;
    }
    this.updateItemValue = function (updatedText, id) {
        this.findItemById(id, function (item) {
            item.item = updatedText;
        });
        localStorage.setItem(this.storage, JSON.stringify(this.items));
        return true;
    }

    this.guid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4();
    }

}