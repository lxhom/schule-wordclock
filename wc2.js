
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
            es: {z:0,s:0,l:2},
            ist: {z:0,s:3,l:3},
            // MINUTES
            fünf: {z:0,s:7,l:4},
            zehn: {z:1,s:0,l:4},
            viertel: {z:2,s:0,l:7},
            zwanzig: {z:1,s:4,l:7},
            vor: {z:2,s:8,l:3},
            nach: {z:3,s:0,l:4},
            halb: {z:3,s:5,l:4},
            // HOURS
            ein: {z:4,s:2,l:3}, // honestly fuck german what a shitty language why the FUCK is it "Es ist fünf nach EINS", "es ist zehn nach EINS" and so on and so fourth and then theres "its 1pm/am" which is "Es ist EIN uhr" what the fuck where did that 's' go this makes no fucking sense at all who the fuck thought this was a good idea
            '1': {z:4,s:2,l:4},
            '2': {z:4,s:0,l:4},
            '3': {z:6,s:7,l:4},
            '4': {z:8,s:0,l:4},
            '5': {z:5,s:2,l:4},
            '6': {z:7,s:6,l:5},
            '7': {z:4,s:5,l:6},
            '8': {z:7,s:0,l:4},
            '9': {z:6,s:3,l:4},
            '10': {z:6,s:0,l:4},
            '11': {z:5,s:0,l:3},
            '12': {z:5,s:6,l:5},
            // END
            uhr: {z:8,s:4,l:3},
        }
    }
    
    
    var analogClock = {
        // mat[] = min/5
        // mat[][] = converterMatrixBinTable
        converterMatrixBinTable: [clock.words.fünf, clock.words.zehn, clock.words.viertel, clock.words.zwanzig, clock.words.vor, clock.words.nach, clock.words.halb, clock.words.uhr], //clock.words.thisHour, clock.words.nextHour,
        converterMatrix: [
            "00000001", // 10
            "10000100", // 10
            "01000100", // 10
            "00100100", // 10
            "00010100", // 10
            "10001010", // 01
            "00000010", // 01
            "10000110", // 01
            "00011000", // 01
            "00101000", // 01
            "01001000", // 01
            "10001000", // 01
        ],
        timeToWords: function(hh,mm) {
            var arrid = Math.floor(mm/5);
            var resultStringBin = analogClock.converterMatrix[arrid];
            var resultArray = new Array;
            for (var eachLetterID in resultStringBin) {
                if (resultStringBin[eachLetterID] == 1) {
                    resultArray.push(analogClock.converterMatrixBinTable[eachLetterID]);
                }
            }
            resultArray.push(clock.words.es)
            resultArray.push(clock.words.ist)
            if (arrid >= 5) hh++
            if (hh > 12) hh -= 12
            if (hh == 0) hh = 12
            if (hh == 1 && arrid == 00) {
                resultArray.push(clock.words.ein)
            } else {
                resultArray.push(clock.words[hh])
            } // see comment on clock.words.ein
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
        clockMatrix[wordObj.z][wordObj.s] = "<b>" + clockMatrix[wordObj.z][wordObj.s]
        clockMatrix[wordObj.z][wordObj.s+wordObj.l-1] = clockMatrix[wordObj.z][wordObj.s+wordObj.l-1] + "</b>"
    
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
    