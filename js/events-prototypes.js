function NumObj(num, imgsrc) {
    if (imgsrc === undefined) // parameter was omitted in call
        imgsrc = "img/tiles/placeholder.png";

    this.num = num;
    this.imgsrc = imgsrc;
    this.selected = false;
    this.used = [];
}

function TileObj(num, coords) {
    if (coords === undefined) // parameter was omitted in call
        coords = [];

    this.num = num;
    this.coords = coords;
}

function BoardObj() {
    this.grid = createArray(4, 5);
    this.full = false;

    // make sure to include methods for this that checks and sets the full bool!
}


function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}