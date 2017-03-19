// Variables ===========================================================================

const SELECTED = "selected";
const NOTSELECTED = "no";
const IMGPATH = "img/tiles/"
const IMGEXTENSION = ".png";
const CONTAINERTABLE = "containerTable";
const INITTABLE = "initTable";
const FINALTABLE = "finalTable";
const HEADERTILEPARTIAL = "headerTile";
const ROWTILEPARTIAL = "rowTile";
const PLACEHOLDER = "placeholder";
const INITROWPARTIAL = "initRow";
const INITPARTIAL = "init";
const FiNALPARTIAL = "final";
const PICPARTIAL = "Pic";

var containerTable = document.getElementById(CONTAINERTABLE);
var initTable = document.getElementById(INITTABLE);

function TileObj(num, coords) {
    if (coords === undefined) // parameter was omitted in call
        coords = [];

    this.num = num;
    this.coords = coords;
}

var lastSelected = new TileObj(-1);
var currentSelected = new TileObj(-1);
var usedTilesInit = [];
var usedTilesFinal = [];

// =====================================================================================

// Event Listeners =====================================================================

window.addEventListener('load', function(){
    console.log("onload");

    containerTable.addEventListener('click', function(ev) {
        if(ev.target.tagName.toLowerCase() == "img") {
            var tile = new TileObj(returnTileNumber(ev.target.parentNode.id.toString()));

            // setting selection
            setCurrentSelected(tile);
            unSelectLast();
            selectTh(HEADERTILEPARTIAL + tile.num);
            setLastSelected(tile);
        }
        if(ev.target.tagName.toLowerCase() == "td") {
            console.log(ev.target.tagName.toLowerCase() + " >> " + ev.target.parentNode.id);
        }
        if(ev.target.tagName.toLowerCase() == "tr") {
            console.log(ev.target.id);
        }

        console.log("containerTable click");
    });

    initTable.addEventListener('click', function(ev) {
        var coords = [];
        if(ev.target.tagName.toLowerCase() == "img") {
            coords = getCoordsFromId(ev.target.parentNode.id, INITPARTIAL);
            console.log(coords);
        }
        if(ev.target.tagName.toLowerCase() == "td") {
            coords = getCoordsFromId(ev.target.id, INITPARTIAL);
            console.log(coords);
        }
        

        if(currentSelected.num != -1) {
            var elemnum = checkTileUsage(usedTilesInit);

            if(coords.length == 2) {
                checkAndSpliceCurrentNumFromArray(usedTilesInit, coords);
                changeTdImgSrc(INITPARTIAL + PICPARTIAL, coords, IMGPATH + currentSelected.num + IMGEXTENSION);

                if(elemnum == -1) {
                    changeTdImgSrc(INITPARTIAL + PICPARTIAL,coords, IMGPATH + currentSelected.num + IMGEXTENSION);
                    usedTilesInit.push(new TileObj(currentSelected.num, coords));
                } else {
                    changeTdImgSrc(INITPARTIAL + PICPARTIAL, usedTilesInit[elemnum].coords, IMGPATH + PLACEHOLDER + IMGEXTENSION);
                    //usedTilesInit = usedTilesInit.slice(elemnum, 1);
                    spliceTileFromArray(usedTilesInit, elemnum);

                    changeTdImgSrc(INITPARTIAL + PICPARTIAL, coords, IMGPATH + currentSelected.num + IMGEXTENSION)
                    usedTilesInit.push(new TileObj(currentSelected.num, coords));
                }
            }
        }
        console.log(usedTilesInit);

        console.log("initTable click");
    });
});

// =====================================================================================

// Helpers =============================================================================

function compareObjects(a1, a2) {
    var numEquals = false;
    var lengthEquals = false;
    var elemsEqual = true;

    if(String(a1.num) == (String(a2.num))) {
        numEquals = true;
    }
    if(a1.coords.length == a2.coords.length) {
        lengthEquals = true;

        for(var i=0; i < a1.coords.length; i++) {
            for(var j = 0; j < a2.coords.length; j++) {
                if(!a1.coords[i].equals(a2.coords[j])) {
                    elemsEqual = false;
                }
            }
        }
    }

    if(numEquals && lengthEquals && elemsEqual)
        return true;
    else
        return false;
}

// function getUsedPlace(obj, num) {
//     if(obj.num == num) {
//         return true;
//     }
//     return false;
// }

function checkAndSpliceCurrentNumFromArray(objarray, coords) {
    for(var i = 0; i < objarray.length; i++) {
        if(objarray[i].coords.equals(coords))
            objarray.splice(i, 1);
    }
}

function changeTdImgSrc(partialid, coords, src) {
    var img = document.getElementById(partialid + coords[0] + coords[1]);
    img.setAttribute("src", src);
}

function spliceTileFromArray(objarray, elemnum) {
    objarray.splice(elemnum, 1);
}

function setLastSelected(obj) {
    lastSelected = obj;
}
function setCurrentSelected(obj) {
    currentSelected = obj;
}

function selectTh(id) {
    var elem = document.getElementById(id);
    if(elem.getAttribute(SELECTED) != SELECTED)
        elem.setAttribute(SELECTED, SELECTED);
    else
        elem.setAttribute(SELECTED, NOTSELECTED);
}

function unSelectLast() {
    if(lastSelected.num != -1) {
        var elem = document.getElementById(HEADERTILEPARTIAL + lastSelected.num);
        elem.setAttribute(SELECTED, NOTSELECTED);
    }
}

function returnTileNumber(id) {
    var partiallength = ROWTILEPARTIAL.length;
    var num = id.slice(partiallength);
    return num;
}

function getCoordsFromId(id, partial) {
    var partiallength = partial.length;
    var coords = [];
    coords.push(id.slice(partiallength, partiallength + 1));
    coords.push(id.slice(partiallength + 1, partiallength + 2));

    return coords;
}

function checkTileUsage(tilearray) {
    for(var i = 0; i < tilearray.length; i++) {
        //if(tilearray[i].equals(currentSelected))
        //if(getUsedPlace(tilearray[i], currentSelected.num))
        if(tilearray[i].num == currentSelected.num)
            return i;
    }
    return -1;
}

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

// =====================================================================================