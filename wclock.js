var clock = {
    letters: [
        ['e','s','H','i','s','t','G','f','ü','n','f'],

        ['z','e','h','n','z','w','a','n','z','i','g'],

        ['v','i','e','r','t','e','l','E','v','o','r'],

        ['n','a','c','h','Ä','h','a','l','b','X','I'],

        ['z','w','e','i','n','s','i','e','b','e','n'],

        ['e','l','f','ü','n','f','z','w','ö','l','f'],

        ['z','e','h','n','e','u','n','d','r','e','i'],

        ['a','c','h','t','P','L','s','e','c','h','s'],

        ['v','i','e','r','u','h','r','S','Y','N','C'],
    ],
    // : {z:,s:,l:},
    words: {
        // START
        es:         {l:0,c:0,len:2},
        ist:        {l:0,c:3,len:3},
        // MINUTES
        fünf:       {l:0,c:7,len:4},
        zehn:       {l:1,c:0,len:4},
        viertel:    {l:2,c:0,len:7},
        zwanzig:    {l:1,c:4,len:7},
        vor:        {l:2,c:8,len:3},
        nach:       {l:3,c:0,len:4},
        halb:       {l:3,c:5,len:4},
        // HOURS
        '1':        {l:4,c:2,len:4},
        '2':        {l:4,c:0,len:4},
        '3':        {l:6,c:7,len:4},
        '4':        {l:8,c:0,len:4},
        '5':        {l:5,c:2,len:4},
        '6':        {l:7,c:6,len:5},
        '7':        {l:4,c:5,len:6},
        '8':        {l:7,c:0,len:4},
        '9':        {l:6,c:3,len:4},
        '10':       {l:6,c:0,len:4},
        '11':       {l:5,c:0,len:3},
        '12':       {l:5,c:6,len:5},
        // END
        uhr:        {z:8,s:4,l:3},

        hour: -1,
        get thisHour() {
            var hour = clock.words.hour
            if (hour > 12) hour -= 12
            if (hour == 0) hour = 12
            return clock.words[hour];
        },
        get nextHour() {
            var hour = clock.words.hour
            hour++
            if (hour > 12) hour -= 12
            if (hour == 0) hour = 12
            return clock.words[hour];
        }
    }
}



var analogClock = {
    // mat[] = min/5
    // mat[][] = converterMatrixBinTable
    converterMatrixBinTable: [clock.words.fünf, clock.words.zehn, clock.words.viertel, clock.words.zwanzig, clock.words.vor, clock.words.nach, clock.words.halb, clock.words.thisHour, clock.words.nextHour, clock.words.uhr],
    converterMatrix: [
        "0000000101",
        "1000010100",
        "0100010100",
        "0010010100",
        "0001010100",
        "1000101010",
        "0000001010",
        "1000011010",
        "0001100010",
        "0010100010",
        "0100100010",
        "1000100010",
    ],
    timeToWords: function(hh,mm) {
        clock.words.hour = hh;
        var arrid = Math.floor(mm/5);
        var resultStringBin = analogClock.converterMatrix[arrid];
        var resultArray = [clock.words.es, clock.words.ist];
        for (var eachLetterID in resultStringBin) {
            if (resultStringBin[eachLetterID] == 1) {
                resultArray.push(analogClock.converterMatrixBinTable[eachLetterID]);
            }
        }
        return resultArray;
    }
}

function cloneMatrix(matrix) {
    var newMatrix = new Array;
    for (var eachMatrix1ID in matrix) {
        newMatrix[eachMatrix1ID] = new Array;
        for (var eachMatrix2ID in matrix[eachMatrix1ID]) {
            newMatrix[eachMatrix1ID][eachMatrix2ID] = matrix[eachMatrix1ID][eachMatrix2ID]
        }
    }
    return newMatrix;
}

function matrixToHTML(matrix) {
    var newMatrix = new Array;
    for (var eachMatrix1ID in matrix) {
        newMatrix[eachMatrix1ID] = matrix[eachMatrix1ID].join(" ");
    }
    return newMatrix.join("<br>").toUpperCase();
}

function addWord(wordObj, clockMatrix) {
    for (var i=0; i<wordObj.len;i++) {
        clockMatrix[wordObj.l][wordObj.c] = "<b>" + clockMatrix[wordObj.l][wordObj.c] + "</b>"
    }
    return clockMatrix;
}
function setClock(hh,mm,consoleMode) {
    if (hh == undefined && mm == undefined) {
        var unparsedTime = document.getElementById('input').value
        hh = unparsedTime.split(":")[0]
        mm = unparsedTime.split(":")[1]
        consoleMode = false
    }
    var clockMatrix = cloneMatrix(clock.letters)
    var resultArray = analogClock.timeToWords(hh,mm)
    for (eachWord of resultArray) {
        addWord(eachWord,clockMatrix)
    }

    if (consoleMode) 
    return matrixToHTML(clockMatrix)
    document.getElementById("clock").innerHTML = matrixToHTML(clockMatrix)
    
}

function test() {
    alert("hi")
}