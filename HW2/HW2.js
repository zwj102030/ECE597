#!/usr/bin/env node
var b = require('bonescript');
var leds =    ["P9_11", "P9_13", "P9_15", "P9_17"];
var buttons = ["P9_12", "P9_14", "P9_16", "P9_18"];
var map = {"P9_12": "P9_11", "P9_14": "P9_13", "P9_16": "P9_15", "P9_18": "P9_17", };
var size =12;
var row[size];






var i=0,j=0,m=3,n=3,dir;
console.log ("Setting up:\n");
 
  var x = new Array(size);
  for (var i = 0; i < size; i++) {
    x[i] = new Array(size);
        for (var j = 0; j < size; j++)
        {
         B[i][j]   =" ";
        }
  }
  for (i=0; i<size; i++) {
        B[0][i]='.';
            B[i][0]='.';
        }

for(var i in leds) 
{
    b.pinMode(leds[i], b.OUTPUT);
}
for(var i in buttons) 
{
    b.pinMode(buttons[i], b.INPUT, 7, 'pulldown');
}

for(var i in leds) 
{
    b.digitalWrite(leds[i], 0);
}

for (var i in leds)
{
    console.log("buttons[" + i + "] = " + buttons[i]);
    b.attachInterrupt(buttons[i], true, b.CHANGE, toggle);
}

console.log("Loaded");


function toggle(x) 
   {
        b.digitalWrite(map[x.pin.key], x.value);
	//console.log(" ");
 for (i=0; i<size; i++)
    {
        for (j=0; j<size; j++)
        {
            console.log(board[i][j]);
        }
      //  console.log(" ");
    }
	dir =x.value;
	 switch (dir)
    {
        case 'P9_12':
            if ((x&&y)==1) {y=y-1;
            };
            break;
            
        case 'P9_16':
            if ((x&&y)==1) {x=x-1;};break;
            
        case 'P9_18':
            if ((x&&y)==1) {y=y+1;};break;
            
        case 'P9_14':
            if ((x&&y)==1) {x=x+1;};break;
	case 'C':
	    for (i=0; i<size; i++) {
        for (j=0; j<size; j++) {
            B[i][j]=' ';
        }
    	}
   	 for (i=0; i<size; i++) {
        B[0][i]='.';
            B[i][0]='.';
        }
	break;
    }
            B[y][x]='x';
    getMatrixColorEnabledAtPoint(2,3,'green');
      //  console.log(x.pin.key);
        //console.log(map[x.pin.key]);
    }





MatrixIOController = function(delegate, websocketAddress)
{
    this.delegate = delegate
    this.i2cAddress = '0x70'
    this.fakeStatus = true;

    this.connect(websocketAddress)
}

MatrixIOController.COLOR_GREEN = 'green'
MatrixIOController.COLOR_RED = 'red'


    reloadMatrix: function()
    {
        this.socket.emit("matrix", this.i2cAddress)
    },

 getMatrixColorEnabledAtPoint: function(i, j, color)
    {
        var rowIdx = this.computeRowIndex(i, color),
            rowColorMask = this.matrixData[rowIdx],
            rowMask = 1 << j

        return rowColorMask & rowMask
    },

    setMatrixColorEnabledAtPoint: function(i, j, color, enabled)
    {
        var rowIdx = this.computeRowIndex(i, color),
            oldRowData = this.matrixData[rowIdx],
            rowColorMask = 1 << j,
            newRowData = (enabled ? oldRowData | rowColorMask : oldRowData & ~rowColorMask)

        this.matrixData[rowIdx] = newRowData
        this.sendRowUpdate(rowIdx)
    },

    sendRowUpdate: function(rowIdx)
    {
        var newRowData = this.matrixData[rowIdx],
            newRowHex = '0x' + newRowData.toString(16),
            i2cSetMessage = { i2cNum: this.i2cAddress, i: rowIdx, disp: newRowHex }

        this.socket.emit('i2cset', i2cSetMessage)
    },

    computeRowIndex: function(i, color)
    {
        return (color === MatrixIOController.COLOR_GREEN ? i * 2 : i * 2 + 1)
    }
}

function pseudoUUID()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

Snapshot = function(uuid)
{
    this.uuid = uuid || pseudoUUID()
}

Snapshot.prototype = {
    save: function(obj)
    {
        localStorage.setItem(this.uuid, JSON.stringify(obj))
    },

    get: function()
    {
        return JSON.parse(localStorage.getItem(this.uuid))
    },

    remove: function()
    {
        localStorage.removeItem(this.uuid)
    },
}