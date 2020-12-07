// this function converts a number like 321 into high/low / true/false signal with the format: [{#}] == [{1*(#+1)}{0}]. ex: [0][3][0][1] == [{1}{0}][{1111}{0}][{1}{0}][{11}{0}] == 0301 == 101111010110
function numToArray(num) {
	num = String(num);
	var arr = new Array;
	for (eachChar of num) {
		for (var i=0; i<=Number(eachChar); i++) {
			arr.push(1);
		};
		arr.push(0);
	};
	return arr;
};

// basically this function returns another function that should be called once every period with true/false depending on the input. you also need to provide a output function which gets called when a input is detected & parsed. for more info abt the conversion from binary to decimal and back see the comment on numToArray().
function newListener(outputFunction) {
    var dataStart = true;
    var recievedData = new Array;
    return function reciever(signal) {
        if (dataStart) {
            if (!signal) {
                dataStart = false;
            } else {
                return 1;
            };
        };
        if (signal) {
            recievedData[recievedData.length-1] += 1;
        } else {
            recievedData.push(-1);
        }
        area.innerText = recievedData.join("|");
        
    }
}

var areaStyle;
var area;
onload = function() {
    console.log("dokument da")
    area = document.getElementById("area")
    areaStyle = area.style
}




// sending that shit 3302113111030120
function startSender(num, freq) {
        
    // framrate debugging. debug tag: /*FRDBG*/
    var startDate = new Date();
    var frame = 0;

    var reciever = newListener();
    var senderArray = numToArray(num);
    var position = 0;
    return stopSender.id = setInterval(function(){
        if (position == senderArray.length) position = 0;
        /*FRDBG*/ 
        console.log("senderArray[position]",senderArray[position])
        console.log("areaStyle.backgroundColor",areaStyle.backgroundColor)
        if ((senderArray[position] && areaStyle.backgroundColor=="white") || (!senderArray[position] && areaStyle.backgroundColor=="black")) {
            frame++; 
        } else {
            startDate = new Date();
            frame = 0;
        }
        console.log("frame",frame)
        var off = (
        (
            (
                (
                    (new Date).valueOf()
                ) - 
                frame*(1000/freq)
            ) - 
            startDate.valueOf()
        ) / (1000/freq)
        );

        if (off>0.5||off<-0.5) {
            console.error(off)
        } else if (off>0.25||off<-0.25) {
            console.warn(off)
        } else {
            console.log(off)
        }
        /*FRDBG*/
        if (senderArray[position]) {
            areaStyle.backgroundColor="white"
        } else {
            areaStyle.backgroundColor="black"
        }
        reciever(senderArray[position++]);
    },1000/freq);
};

function stopSender(id) {
    if (!id) id = stopSender.id;
    return clearInterval(id);
};

// var SenderID = startSender(3302113111030120);
console.log("hello world")

var debugArray = [3,0,2,1,1,3,1,1,1,0,3,0,1,2,0,3,3,0,2,1,1,3,1,1,1,0,3,0,1,2,0,3,3,0,2,1,1,3,1,1,1,0,3,0,1,2,0,3,3,0,2,1,1,3,1,1,1,0,-1]
