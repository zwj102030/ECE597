#!/usr/bin/env node
var b = require('bonescript');
var leds =    ["P9_11", "P9_13", "P9_15", "P9_17"];
var buttons = ["P9_12", "P9_14", "P9_16", "P9_18"];
var map = {"P9_12": "P9_11", "P9_14": "P9_13", "P9_16": "P9_15", "P9_18": "P9_17", };

var row[11];

var i=0,j=0,m=3,n=3,dir;
console.log ("Setting up:\n");
 
  var x = new Array(11);
  for (var i = 0; i < 11; i++) {
    x[i] = new Array(11);
        for (var j = 0; j < 11; j++)
        {
         B[i][j]   =" ";
        }
  }
  for (i=0; i<11; i++) {
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
 for (i=0; i<11; i++)
    {
        for (j=0; j<11; j++)
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
	    for (i=0; i<11; i++) {
        for (j=0; j<11; j++) {
            B[i][j]=' ';
        }
    	}
   	 for (i=0; i<11; i++) {
        B[0][i]='.';
            B[i][0]='.';
        }
	break;
    }
            B[y][x]='x';

      //  console.log(x.pin.key);
        //console.log(map[x.pin.key]);
    }


