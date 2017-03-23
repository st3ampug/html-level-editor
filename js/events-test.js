// Variables ===========================================================================

const SELECTED =            "selected";
const NOTSELECTED =         "no";
const IMGPATH =             "img/tiles/"
const IMGEXTENSION =        ".png";
const CONTAINERTABLE =      "containerTable";
const INITTABLE =           "initTable";
const FINALTABLE =          "finalTable";
const HEADERTILEPARTIAL =   "headerTile";
const ROWTILEPARTIAL =      "rowTile";
const PLACEHOLDER =         "placeholder";
const INITROWPARTIAL =      "initRow";
const INITPARTIAL =         "init";
const FINALPARTIAL =        "final";
const PICPARTIAL =          "Pic";
const SAVEJSONBUTTON =      "saveJson";
const SAVEMODALDIV =        "saveJsonModalMainDiv";
const VERSION =             "version";
const BUILD =               "build";
const LEVELID =             "levelId";
const LEVELNAME =           "levelName";
const LEVELDSCRIPTION =     "levelDescription";
const LEVELMAP =            "levelMap";

var containerTable = document.getElementById(CONTAINERTABLE);
var initTable = document.getElementById(INITTABLE);
var finalTable = document.getElementById(FINALTABLE);

var saveJsonButton = document.getElementById(SAVEJSONBUTTON);  
var saveJsonModal = document.getElementById(SAVEMODALDIV);

var versionField = document.getElementById(VERSION);
var buildField = document.getElementById(BUILD);
var levelIdField = document.getElementById(LEVELID);
var levelNameField = document.getElementById(LEVELNAME);
var levelDescriptionField = document.getElementById(LEVELDSCRIPTION);
var levelMapField = document.getElementById(LEVELMAP);



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
        var coords = getClickCoordsFromEventTarget(ev.target, INITPARTIAL);
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
        var coords = getClickCoordsFromEventTarget(ev.target, FINALPARTIAL);
        console.log(coords);

        if(coords.length == 2) {
            if(coords[0] != -1 && coords[1] != -1) {
                var n = returnCurrentSelectedNum();
                if (n != -1) {
                    // check that the curr coords have a num
                    if(finalBoard.grid[coords[0]][coords[1]] == -1 || typeof finalBoard.grid[coords[0]][coords[1]] == undefined) {
                        finalBoard.remove(coords[0], coords[1]);
                        changeTdImgSrc(FINALPARTIAL + PICPARTIAL, coords, PLACEHOLDER + IMGEXTENSION);
                    }

                    // do this when there is no num, or it has been removed
                    finalBoard.add(coords[0], coords[1], tileContainer[n]);
                    changeTdImgSrc(FINALPARTIAL + PICPARTIAL, coords, tileContainer[n].imgsrc);
                }
            }
        }
        
        
        // to solve:
        // clicking with a number selected that is already on a board, on a number that is already on the board
        // currently, the number gets replaced by the new, but the selected number's old entry remains and the array still has the entry as well


        console.log(FINALTABLE + " click");
    });

    saveJsonButton.addEventListener('click', function(ev) {
        saveJsonModal.innerText = JSON.stringify(constructJson(), null, 2);
    });
});

// =====================================================================================

// Helpers =============================================================================

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

function getClickCoordsFromEventTarget(target, partial) {
    if(target.tagName.toLowerCase() == "img") {
        return getCoordsFromId(target.parentNode.id, partial);
    }
    if(target.tagName.toLowerCase() == "td") {
        return getCoordsFromId(target.id, partial);
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

function returnCoordsForNumber(gridobj, num) {
    for(var r = 0; r < gridobj.maxrow; r++){
        for(var c = 0; c < gridobj.maxcolumn; c++){
            if(gridobj.grid[r][c].num == num)
                return [r, c];
        }
    }
    return [-1, -1];
}

function ensureNullForZeroNum(num) {
    if(num == "0")
        return null;
    else
        return num;
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
    var boxtype = "number";

    var output = {
        header: {
            version: versionField.value,
            build: buildField.value
        },
        info: {
            id: levelIdField.value,
            name: levelNameField.value,
            description: levelDescriptionField.value,
            map: levelMapField.value,
            size: {
                columns: 4,
                rows: 5
            }
        },
        tiles: []
    }

    for(var i = 0; i < tileContainer.length; i++) {
        var initCoords = returnCoordsForNumber(initBoard, tileContainer[i].num);
        var finalCoords = returnCoordsForNumber(finalBoard, tileContainer[i].num);

        output.tiles.push({
            box_type: boxtype,
            value: ensureNullForZeroNum(tileContainer[i].num),
            init_coords: {
                row: initCoords[0],
                column: initCoords[1]
            },
            final_coords: {
                row: finalCoords[0],
                column: finalCoords[1]
            }
        });
    }

    return output;
}

// =====================================================================================