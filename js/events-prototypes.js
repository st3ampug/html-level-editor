// =====================================================================================

function NumObj(num, imgsrc) {
    if (imgsrc === undefined) // parameter was omitted in call
        imgsrc = "img/tiles/placeholder.png";

    this.num = num;
    this.imgsrc = imgsrc;
    this.selected = false;
    this.used = [];
}
NumObj.prototype.select = function() {
    this.selected = true;
};
NumObj.prototype.unselect = function() {
    this.selected = false;
};
NumObj.prototype.use = function(coords) {
    this.used = coords;
};
NumObj.prototype.unuse = function() {
    this.used = [];
};

// =====================================================================================

function TileObj(num, coords) {
    if (coords === undefined) // parameter was omitted in call
        coords = [];

    this.num = num;
    this.coords = coords;
}

// =====================================================================================

function BoardObj() {
    this.grid = createArray(4, 5);
    this.entries = 0;
}
BoardObj.prototype.add = function(r, c, numObj) {
    this.grid[r][c] = numObj;
    this.entries = this.entries + 1;
    // entries remain 0, INVESTIGATE
}
BoardObj.prototype.remove = function(r, c) {
    this.grid[r][c] = -1;
    this.entries = this.entries - 1;
}
BoardObj.prototype.checkFull = function() {
    if(this.entries == 20) {
        return true;
    } else {
        return false;
    }
};

// =====================================================================================


function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

// =====================================================================================