    var socket;
    var firstconnect = true,
        i2cNum  = "0x70",
		dispr = [],
		dispg = [];

// Create a matrix of LEDs inside the <table> tags.
var matrixData;
for(var j=7; j>=0; j--) {
	matrixData += '<tr>';
	for(var i=0; i<8; i++) {
	    matrixData += '<td><div class="LED" id="id'+i+'_'+j+
		'" onclick="LEDclick('+i+','+j+')">'+
		i+','+j+'</div></td>';
	    }
	matrixData += '</tr>';
}
$('#matrixLED').append(matrixData);

// The slider controls the overall brightness
$("#slider1").slider({min:0, max:15, slide: function(event, ui) {
	socket.emit("i2cset",  {i2cNum: i2cNum, i: ui.value+0xe0, disp: 1});
    }});

// Send one column when LED is clicked.
function LEDclick(i, j) {
//	alert(i+","+j+" clicked");
    //disp[i] ^= 0x1<<j;
    //socket.emit('i2cset', {i2cNum: i2cNum, i: 2*i, 
			     //disp: '0x'+disp[i].toString(16)});
	// socket.emit('i2c', i2cNum);
    // Toggle bit on display
    
    $('#id' + i + '_' + j).removeClass('orange');
    $('#id' + i + '_' + j).removeClass('green');
    $('#id' + i + '_' + j).removeClass('red');
    var val = 1*( (dispg[i]  >>j) & 1 ) + ( (dispr[i]  >>j) & 1 ) *2;
    dispg[i] |= 0x1<<j;
	dispr[i] |= 0x1<<j;
    if (val == 1) {
    	dispr[i] ^= 0x0<<j;
    	dispg[i] ^= 0x0<<j;
        $('#id' + i + '_' + j).addClass('orange');
    } else if (val == 2) {
    	dispr[i] ^= 0x1<<j;
    	dispg[i] ^= 0x1<<j;
    } else if (val == 3) {
    	dispr[i] ^= 0x0<<j;
    	dispg[i] ^= 0x1<<j;
    	$('#id' + i + '_' + j).addClass('red');
    } else {
    	dispg[i] ^= 0x0<<j;
    	dispr[i] ^= 0x1<<j;
        $('#id' + i + '_' + j).addClass('green');
    } 
    socket.emit('i2cset', {i2cNum: i2cNum, i: 2*i, 
				disp: '0x'+dispg[i].toString(16)});
	socket.emit('i2cset', {i2cNum: i2cNum, i: 2*i+1, 
				disp: '0x'+dispr[i].toString(16)});


// var val = 1*( (dispg[i]  >>j) & 1 ) + ( (dispr[i]  >>j) & 1 ) *2;
// 
//     dispg[i] |= 0x1<<j;
// 	dispr[i] |= 0x1<<j;
// 	
// 	if(val ==2 || val ==3)
// 		dispg[i] ^= 0x1<<j;
// 	if(val ==0 || val ==2)
// 		dispr[i] ^= 0x1<<j;
// 	
// 	
//     socket.emit('i2cset', {i2cNum: i2cNum, i: 2*i, 
// 			     disp: '0x'+dispg[i].toString(16)});
//     socket.emit('i2cset', {i2cNum: i2cNum, i: 2*i+1, 
// 			     disp: '0x'+dispr[i].toString(16)});
// 
// 	$('#id' + i + '_' + j).removeClass('grn1');
// 	$('#id' + i + '_' + j).removeClass('red2');
// 	$('#id' + i + '_' + j).removeClass('org3');
// 	$('#id' + i + '_' + j).removeClass('noClolor');
// 
// 	if(val ==0)
// 		$('#id' + i + '_' + j).addClass('grn1');
// 	else if(val ==1)
// 		$('#id' + i + '_' + j).addClass('org3');
// 	else if(val ==2)
// 		$('#id' + i + '_' + j).addClass('noColor');
// 	else if(val ==3)
// 		$('#id' + i + '_' + j).addClass('red2');
}

    function connect() {
      if(firstconnect) {
        socket = io.connect(null);

        // See https://github.com/LearnBoost/socket.io/wiki/Exposed-events
        // for Exposed events
        socket.on('message', function(data)
            { status_update("Received: message " + data);});
        socket.on('connect', function()
            { status_update("Connected to Server"); });
        socket.on('disconnect', function()
            { status_update("Disconnected from Server"); });
        socket.on('reconnect', function()
            { status_update("Reconnected to Server"); });
        socket.on('reconnecting', function( nextRetry )
            { status_update("Reconnecting in " + nextRetry/1000 + " s"); });
        socket.on('reconnect_failed', function()
            { message("Reconnect Failed"); });

        socket.on('matrix',  matrix);

    socket.emit('i2cset', {i2cNum: i2cNum, i: 0x21, disp: 1}); // Start oscillator (p10)
    socket.emit('i2cset', {i2cNum: i2cNum, i: 0x81, disp: 1}); // Disp on, blink off (p11)
    socket.emit('i2cset', {i2cNum: i2cNum, i: 0xe7, disp: 1}); // Full brightness (page 15)
    /*
	i2c_smbus_write_byte(file, 0x21); 
	i2c_smbus_write_byte(file, 0x81);
	i2c_smbus_write_byte(file, 0xe7);
    */
        // Read display for initial image.  Store in disp[]
        socket.emit("matrix", i2cNum);

        firstconnect = false;
      }
      else {
        socket.socket.reconnect();
      }
    }

    function disconnect() {
      socket.disconnect();
    }

    // When new data arrives, convert it and display it.
    // data is a string of 16 values, each a pair of hex digits.
    function matrix(data) {
        var i, j,
        dispg = [],
        dispr = [];
        //        status_update("i2c: " + data);
        // Make data an array, each entry is a pair of digits
        data = data.split(" ");
        //        status_update("data: " + data);
        // Every other pair of digits are Green. The others are red.
        // Ignore the red.
        // Convert from hex.
        for (i = 0; i < data.length; i += 2) {
            dispr[(i-1) / 2] = parseInt(data[i], 16);
            dispg[i / 2] = parseInt(data[i], 16);
        }
        //        status_update("disp: " + disp);
        // i cycles through each column
        for (i = 0; i < dispg.length; i++) {
            // j cycles through each bit
            for (j = 0; j < 8; j++) {
                var val = 1*( (dispg[i]  >>j) & 1 ) + ( (dispr[i]  >>j) & 1 ) *2;
                // $('#id' + i + '_' + j).removeClass('orange');
//     			$('#id' + i + '_' + j).removeClass('green');
//     			$('#id' + i + '_' + j).removeClass('red');
                if (val === 1 ) {
					$('#id' + i + '_' + j).addClass('green');
				} else if (val === 2) {
					$('#id' + i + '_' + j).addClass('red');
				} else if (val === 3) {
					$('#id' + i + '_' + j).addClass('orange');
				} else{
					$('#id' + i + '_' + j).removeClass('orange');
    				$('#id' + i + '_' + j).removeClass('green');
    				$('#id' + i + '_' + j).removeClass('red');
				}
                
            }
        }
        
    }

    function status_update(txt){
	$('#status').html(txt);
    }

    function updateFromLED(){
      socket.emit("matrix", i2cNum);    
    }

connect();

$(function () {
    // setup control widget
    $("#i2cNum").val(i2cNum).change(function () {
        i2cNum = $(this).val();
    });
});
