function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

switch (findGetParameter('l')) {
    case 'portuguese':
        var language = 'portuguese';
        break;
    case 'english':
        var language = 'english';
        break;
    default:
        var language = 'english';
        break;
}

$.getJSON("words/" + language + ".json", function (data) {
    var words = data.Words;
    var random = words[getRndInteger(0, words.length)].toUpperCase();
    const word = Array.from(random);
    console.log(random + ' | ' + language);

    let line = 1, lPoints = 0, locationWord = 0;
    var span = $('.row:nth-child(' + line + ') span');
    var result = $('.result');

    // NUMBER OF SQUARES AND LINES 
    let squaresNum = $('.container .row:nth-child(1) div').length;
    let linesNum = $('.container .row').length;

    var matchStats = 'running';
    console.log(matchStats)

    var clipboard;

    const results = [];

    // READS THE USER'S CLICK AND PASSES THE INFORMATION
    function keyboardClick(key) {
        if (matchStats == 'running') {
            var text = key.toUpperCase();

            keyboardType(0, text);
        }
    }

    function keyboardType(number, text) {
        // CHECK THE LOCATION OF THE NEXT WORD (AVOID CONSOLE ERROR)
        if (locationWord == 5) {
            return false;
        }
        else if (span.eq(number).text() == '') {
            span[number].innerHTML = text;
            locationWord = locationWord + 1;
        }
        else {
            locationWord = 0;
            var number = number + 1;
            keyboardType(number, text);
        }
    }

    // DELETE THE LAST CHARACTER TYPETED 
    function keyboardDelete() {
        const arr = [];
        let a;

        for (let i = 0; i < squaresNum; i++) {
            arr.push(span.eq(i).text());
        }

        var filtered = arr.filter(Boolean);

        filtered = filtered.slice(-1)[0];

        for (let i = 0; i < squaresNum; i++) {

            switch (i) {
                case 0:
                    a = 4;
                    break;
                case 1:
                    a = 3;
                    break;
                case 2:
                    a = 2;
                    break;
                case 3:
                    a = 1;
                    break;
                case 4:
                    a = 0;
                    break;
            }

            if (span.eq(a).text() == filtered) {
                span.eq(a).text("");
                locationWord = locationWord - 1;
                break;
            }
        }
    }

    // READS EVERYTHING THE USER WROTE, CHECKS, VALIDATES AND PASSES IT ON
    function keyboardEnter() {
        const arr = [], errorWord = [];

        // ANALYZES THE VALUE ENTERED BY THE USER
        for (let i = 0; i < squaresNum; i++) {
            arr.push(span.eq(i).text());
        }

        // GET ALL THE LETTERS TYPED
        var filtered = arr.filter(Boolean);

        // CHECK IF THIS WORD EXISTS IN THE VOCABULARY
        if (!words.includes(arr.join("").toLowerCase()) && matchStats == 'running' && filtered.length === 5) {
            getToast('word', 'Not in the word list!', 3000);
            return false;
        }

        if (filtered.length === 5) {
            // LOOP TO CHECK THE ORIGIN OF THE RESULTS
            for (let i = 0; i < squaresNum; i++) {
                if (arr[i] == word[i]) {
                    // WORD EXISTS AND CORRECT POSITION
                    span.eq(i).css("background-color", "var(--correct)");
                    span.eq(i).attr('id', 'correct');
                    results.push(3);
                }
                else if (word.includes(arr[i]) && arr[i] !== word[i] && span.eq(i).attr('id') !== 'correct') {
                    // WORD EXISTS AND WRONG POSITION 
                    span.eq(i).css("background-color", "var(--middle)");
                    span.eq(i).attr('id', 'middle');
                    results.push(2);
                }
                else {
                    // WORD DOES NOT EXIST 
                    span.eq(i).css("background-color", "var(--wrong)");
                    span.eq(i).attr('id', 'wrong');
                    results.push(1);

                    errorWord.push(arr[i]);
                }
            }

            // CHANGES THE COLOR OF KEYS THAT HAVE ALREADY BEEN USED 
            var keyboard = $('.keyboard .row div');
            for (let a = 0; a < keyboard.length; a++) {
                // REMOVE ENTER AND DELETE FROM KEYBOARD MAP 
                if (keyboard.eq(a).text() == "Enter" || keyboard.eq(a).text() == "") {
                }
                else {
                    for (let b = 0; b < errorWord.length; b++) {
                        if (errorWord[b] == keyboard.eq(a).text()) {
                            keyboard.eq(a).addClass('disable');
                        }
                    }
                }
            }

            // CHECK FOR LOSS OR VICTORY
            verifyVictory();
            verifyLosse();

            // GO TO NEXT LEVEL
            line = line + 1;
            span = $('.row:nth-child(' + line + ') span');
        }
        else {
            // LINE WAS NOT COMPLETE
            getToast('word', 'Complete the line!', 3000);
        }
    }

    // CHECK FOR LOSS
    function verifyLosse() {
        const value = [];
        var concat = '';
        for (let i = 0; i < (squaresNum + 1); i++) {
            value[i] = $('.container .row div span').eq(i).text();
            concat = concat + value[i];
        }

        if (concat !== random) {
            lPoints = lPoints + 1;
        }

        // IN CASE OF LOSS, SHOW THE USER THE RESPONSE WITH A TOAST
        if (lPoints == 5) {
            getToast('word', random, 15000);
            matchStats = 'losse';
        }
    }

    // VERIFY VICTORY
    function verifyVictory() {
        // COUNTS THE NUMBER OF POINTS THE USER GOT (1 POINT = 1 LINE)
        let vPoints = 0; for (let i = 0; i < linesNum; i++) {
            if (span.eq(i).attr('id') == 'correct') {
                vPoints = vPoints + 1;
            }
        }

        if (vPoints == 5) {
            var lineName, victoryTitle;
            // SET THE TITLE AND LINE REACHED VALUES 
            switch (line) {
                case 1:
                    lineName = '1st';
                    victoryTitle = 'Congratulations! That was amazing.';
                    break;
                case 2:
                    lineName = '2nd';
                    victoryTitle = 'Wow, you did well!';
                    break;
                case 3:
                    lineName = '3rd';
                    victoryTitle = 'Great work!';
                    break;
                case 4:
                    lineName = '4th';
                    victoryTitle = 'Bravo!';
                    break;
                case 5:
                    lineName = '5th';
                    victoryTitle = 'You did it! I knew you could.';
                    break;
            }

            // CHANGES AN ELEMENT OF THE DESCRIPTION TO THE LINE NUMBER THAT THE USER GOT RIGHT
            $('#victoryDesc').text($('#victoryDesc').text().replace('{{lineName}}', lineName));

            // CHANGES THE TITLE DEPENDING ON THE LINE NUMBER THAT THE USER GOT RIGHT
            $('#victoryTitle').text($('#victoryTitle').text().replace('{{victoryTitle}}', victoryTitle));

            var squares = $('#emotes span div');
            const clipboardArr = [];
            var trimed;

            for (i = 0; i < squares.length; i++) {
                // CLEAN WHITESPACE FROM THE RESULT
                trimed = clipboardArr.filter(function (entry) { return /\S/.test(entry); });

                // ADD LINE BREAK TO EACH LINE OF THE GAME
                switch (trimed.length) {
                    case 5:
                        clipboardArr.push("\n");
                        break;
                    case 10:
                        clipboardArr.push("\n");
                        break;
                    case 15:
                        clipboardArr.push("\n");
                        break;
                    case 20:
                        clipboardArr.push("\n");
                        break;
                    case 25:
                        clipboardArr.push("\n");
                        break;
                    case 30:
                        clipboardArr.push("\n"); break;
                }

                // SET THE COLOR OF THE SQUARES IN THE RESULTS MENU AND ADD THE RESULT CODE 
                if (results[i] == 3) {
                    squares.eq(i).css("background-color", "var(--correct)");
                    clipboardArr.push(3);
                }
                else if (results[i] == 2) {
                    squares.eq(i).css("background-color", "var(--middle)");
                    clipboardArr.push(2);
                }
                else if (results[i] == 1) {
                    squares.eq(i).css("background-color", "var(--wrong)");
                    clipboardArr.push(1);
                }
                else {
                    squares.eq(i).css("display", "none");
                }
            }

            // REPLACE THE CODES WITH THE EMOTES
            clipboard = clipboardArr.join("").trim();
            clipboard = clipboard.replaceAll("1", "⬛");
            clipboard = clipboard.replaceAll("2", "🟨");
            clipboard = clipboard.replaceAll("3", "🟩");

            // TEXT THAT SHOULD BE COPIED
            clipboard = "Word " + line + "/" + $('.container .row').length + "\n\n" + clipboard;

            // SET THE INVISIBLE INPUT WITH THE VALUE OF WHAT SHOULD BE COPIED
            $('#clipboard').val(clipboard);

            // MAKES THE RESULTS MENU INVISIBLE 
            result.css('display', 'grid');

            // SET THE MATCH STATUS AS WIN 
            matchStats = 'win';
        }
    }

    function closeResult() {
        result.css('display', 'none');
    }

    function copyResults() {
        $('#clipboard').select();
        document.execCommand('copy');
    }

    $('.keyboard-button').each(function () {
        $(this).on('click', function () {
            keyboardClick($(this).attr('button-value'));
        })
    });
    $('.keyboard-function').each(function () {
        $(this).on('click', function () {
            switch ($(this).attr('button-function')) {
                case 'delete':
                    keyboardDelete();
                    break;
                case 'enter':
                    keyboardEnter();
                    break;
                case 'closeResult':
                    closeResult();
                    break;
                case 'copyResult':
                    copyResults();
                    break;
            }
        })
    });

    // FIX KEYBOARD CLICKS 
    document.addEventListener("keydown", function (event) {
        event.preventDefault();
        switch (event.which) {
            // ALPHABET KEY ID 
            case 65:
                keyboardClick("A");
                break;
            case 66:
                keyboardClick("B");
                break;
            case 67:
                keyboardClick("C");
                break;
            case 68:
                keyboardClick("D");
                break;
            case 69:
                keyboardClick("E");
                break;
            case 70:
                keyboardClick("F");
                break;
            case 71:
                keyboardClick("G");
                break;
            case 72:
                keyboardClick("H");
                break;
            case 73:
                keyboardClick("I");
                break;
            case 74:
                keyboardClick("J");
                break;
            case 75:
                keyboardClick("K");
                break;
            case 76:
                keyboardClick("L");
                break;
            case 77:
                keyboardClick("M");
                break;
            case 78:
                keyboardClick("N");
                break;
            case 79:
                keyboardClick("O");
                break;
            case 80:
                keyboardClick("P");
                break;
            case 81:
                keyboardClick("Q");
                break;
            case 82:
                keyboardClick("R");
                break;
            case 83:
                keyboardClick("S");
                break;
            case 84:
                keyboardClick("T");
                break;
            case 85:
                keyboardClick("U");
                break;
            case 86:
                keyboardClick("V");
                break;
            case 87:
                keyboardClick("W");
                break;
            case 88:
                keyboardClick("X");
                break;
            case 89:
                keyboardClick("Y");
                break;
            case 90:
                keyboardClick("Z");
                break;
            case 8:
                // DELETE ID 
                keyboardDelete();
                break;
            case 13:
                // ENTER ID 
                keyboardEnter();
                break;
            case 116:
                // RELOAD PAGE IN f5 
                location.reload();
                break;
        }
    })

    // GET A RANDOM VALUE WITH MINIMUM AND MAXIMUM 
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // SEND THE TOAST WITH THE MESSAGE CHOSEN ON THE SCREEN 
    function getToast(replace, text, time) {
        $('#toast p').text($('#toast p').text().replace('{{' + replace + '}}', text));

        $('#toast').css("display", "grid");

        setTimeout(function () { $('#toast').css("display", "none"); $('#toast p').text($('#toast p').text().replace(text, '{{' + replace + '}}')); }, time);
    }
});

function changeDisplay(id) {
    var obj = $('#' + id);

    if (obj.hasClass('invisible')) {
        obj.removeClass('invisible');
    } else {
        obj.addClass('invisible');
    }
}

function changeLanguage(l) {
    window.location = window.location.origin + window.location.pathname + '?l=' + l;
}

$(document).ready(function () {
    var country;
    if (findGetParameter('l') == 'english') {
        country = 'brazil';
    } else if (findGetParameter('l') == 'english') {
        country = 'unitedstates'
    } else {
        country = 'unitedstates'
    }
    $('#flag').attr('src', $('#flag').attr('src').replace('unitedstates', country));
});