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
var finalTable = document.getElementById(FINALTABLE);

// function TileObj(num, coords) {
//     if (coords === undefined) // parameter was omitted in call
//         coords = [];

//     this.num = num;
//     this.coords = coords;
// }

var tileContainer = [
    new NumObj("0", IMGPATH + "0" + IMGEXTENSION),
    new NumObj("1", IMGPATH + "1" + IMGEXTENSION),
    new NumObj("2", IMGPATH + "2" + IMGEXTENSION),
    new NumObj("3", IMGPATH + "3" + IMGEXTENSION),
    new NumObj("4", IMGPATH + "4" + IMGEXTENSION),
    new NumObj("5", IMGPATH + "5" + IMGEXTENSION),
    new NumObj("6", IMGPATH + "6" + IMGEXTENSION),
    new NumObj("7", IMGPATH + "7" + IMGEXTENSION),
    new NumObj("8", IMGPATH + "8" + IMGEXTENSION),
    new NumObj("9", IMGPATH + "9" + IMGEXTENSION),
    new NumObj("10", IMGPATH + "10" + IMGEXTENSION),
    new NumObj("11", IMGPATH + "11" + IMGEXTENSION),
    new NumObj("12", IMGPATH + "12" + IMGEXTENSION),
    new NumObj("13", IMGPATH + "13" + IMGEXTENSION),
    new NumObj("14", IMGPATH + "14" + IMGEXTENSION),
    new NumObj("15", IMGPATH + "15" + IMGEXTENSION),
    new NumObj("16", IMGPATH + "16" + IMGEXTENSION),
    new NumObj("17", IMGPATH + "17" + IMGEXTENSION),
    new NumObj("18", IMGPATH + "18" + IMGEXTENSION),
    new NumObj("19", IMGPATH + "19" + IMGEXTENSION),
];
var initBoard = new BoardObj();
var finalBoard = new BoardObj();

var lastSelected = new TileObj(-1);
var currentSelected = new TileObj(-1);
var usedTilesInit = [];
var usedTilesFinal = [];

// TODO
// redesign logic around the following:
// selecting a number (selected and used need to be set at appropriate times, just need to loop through the array to check what the state is)
// what happens when clicking on a table cell (current number in the cell should be easier to determine with the data set up in the new way)
// deleting a number from it's previous cell should be easier, since the number knows which coord it is displayed at!

// =====================================================================================

// Event Listeners =====================================================================

window.addEventListener('load', function(){
    console.log("onload");

    containerTable.addEventListener('click', function(ev) {
        if(ev.target.tagName.toLowerCase() == "img") {
            var lastnum = returnCurrentSelectedNum();
            var clickednum = returnTileNumberFromContainerClick(ev.target.parentNode.id.toString());

            selectNumberFromContainer(clickednum);
            if(lastnum != -1)
                modifyTh(HEADERTILEPARTIAL + lastnum);
            modifyTh(HEADERTILEPARTIAL + clickednum);
        }
        if(ev.target.tagName.toLowerCase() == "td") {
            console.log(ev.target.tagName.toLowerCase() + " >> " + ev.target.parentNode.id);
        }
        if(ev.target.tagName.toLowerCase() == "tr") {
            console.log(ev.target.id);
        }

        console.log(CONTAINERTABLE + " click");
    });

    initTable.addEventListener('click', function(ev) {
        var coords = getClickCoordsFromEventTarget(ev.target);
        console.log(coords);

        if(coords.length == 2) {
            if(coords[0] != -1 && coords[1] != -1) {
                var n = returnCurrentSelectedNum();
                if (n != -1) {
                    // check that the curr coords have a num
                    if(initBoard.grid[coords[0]][coords[1]] == -1 || typeof initBoard.grid[coords[0]][coords[1]] == undefined) {
                        initBoard.remove(coords[0], coords[1]);
                        changeTdImgSrc(INITPARTIAL + PICPARTIAL, coords, PLACEHOLDER + IMGEXTENSION);
                    }

                    // do this when there is no num, or it has been removed
                    initBoard.add(coords[0], coords[1], tileContainer[n]);
                    changeTdImgSrc(INITPARTIAL + PICPARTIAL, coords, tileContainer[n].imgsrc);
                }
            }
        }
        
        
        // to solve:
        // clicking with a number selected that is already on a board, on a number that is already on the board
        // currently, the number gets replaced by the new, but the selected number's old entry remains and the array still has the entry as well

        

        console.log(INITTABLE + " click");
    });

    finalTable.addEventListener('click', function(ev) {
        // TODO
        

        console.log(FINALTABLE + " click");
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



function spliceTileFromArray(objarray, elemnum) {
    objarray.splice(elemnum, 1);
}

function setLastSelected(obj) {
    lastSelected = obj;
}
function setCurrentSelected(obj) {
    currentSelected = obj;
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







function changeTdImgSrc(partialid, coords, src) {
    var img = document.getElementById(partialid + coords[0] + coords[1]);
    img.setAttribute("src", src);
}

function getCoordsFromId(id, partial) {
    var partiallength = partial.length;
    var coords = [];
    coords.push(id.slice(partiallength, partiallength + 1));
    coords.push(id.slice(partiallength + 1, partiallength + 2));

    return coords;
}

function getClickCoordsFromEventTarget(target) {
    if(target.tagName.toLowerCase() == "img") {
        return getCoordsFromId(target.parentNode.id, INITPARTIAL);
    }
    if(target.tagName.toLowerCase() == "td") {
        return getCoordsFromId(target.id, INITPARTIAL);
    }
    return [-1, -1];
}

function modifyTh(id) {
    var elem = document.getElementById(id);
    if(elem.getAttribute(SELECTED) != SELECTED)
        elem.setAttribute(SELECTED, SELECTED);
    else
        elem.setAttribute(SELECTED, NOTSELECTED);
}

function returnCurrentSelectedNum() {
    for(var i = 0; i < tileContainer.length; i++) {
        if(tileContainer[i].selected)
            return tileContainer[i].num;
    }
    return -1;
}

function returnTileNumberFromContainerClick(id) {
    var partiallength = ROWTILEPARTIAL.length;
    var num = id.slice(partiallength);
    return num;
}

function selectNumberFromContainer(num) {
    for(var i = 0; i < tileContainer.length; i++) {
        if(tileContainer[i].num == num)
            tileContainer[i].select();
        else
            tileContainer[i].unselect();
    }
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

function constructJson() {
    // TODO
    // if all inputs have values
    // if both arrays have length = 18 (1-19, x (=0) is for replacing 1 tile!)
    // use input values for header and info partial
    // check both arrays for numbers and the 0, use init and final array coords...
    var output = {

    }
}

// =====================================================================================