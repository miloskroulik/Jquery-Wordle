/*     var span = document.getElementsByTagName("span"); */
var random = "VIEGO";
const word = Array.from(random);

let line = 1;
var span = $('.row:nth-child('+line+') span');
var result = $('.result');

function keyboardClick(key){
    var text = key.toUpperCase();

    keyboardType(0,text);
}

function keyboardType(number,text){
    if(span.eq(number).text() == ''){
        span[number].innerHTML = text;
    }
    else{
        var number = number + 1;
        keyboardType(number,text);
    }
}

function keyboardDelete(){
    const arr = [];
    let a;

    for(let i = 0; i < 5; i++){
        arr.push(span.eq(i).text());
    }

    var filtered = arr.filter(Boolean);

    filtered = filtered.slice(-1)[0];

    for(let i = 0; i < 5; i++){
        
        switch(i){
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

        if(span.eq(a).text() == filtered){
            span.eq(a).text("");
            break;
        }
    }
}

function keyboardEnter(){
    const arr = [];

    for(let i = 0; i < 5; i++){
        arr.push(span.eq(i).text());
    }

    var filtered = arr.filter(Boolean);
    if(filtered.length === 5){
        // LOOP PARA VERIFICAR A PROCEDÊNCIA DOS RESULTADOS
        for(let i = 0; i < 5; i++){
            if(arr[i] == word[i]){
                // PALAVRA EXISTE E POSIÇÃO CORRETA
                span.eq(i).css("background-color", "var(--correct)");
                span.eq(i).attr('id', 'correct');
            }
            else if(word.includes(arr[i]) && arr[i] !== word[i] && span.eq(i).attr('id') !== 'correct'){
                // PALAVRA EXISTE E POSIÇÃO ERRADA
                span.eq(i).css("background-color", "var(--middle)");
            }
            else{
                // PALAVRA NÃO EXISTE
                span.eq(i).css("background-color", "var(--wrong)");
            }
        }

        verifyVictory();

        // PASSAR PARA O PRÓXIMO LEVEL
        line = line + 1;
        span = $('.row:nth-child('+line+') span');
    }
    else{
        console.log("Complete toda a linha");
    }
}

function verifyVictory() {
    let vPoints = 0;

    for(let i = 0; i < 5; i++){
        if(span.eq(i).attr('id') == 'correct'){
            vPoints = vPoints + 1;
        }
    }

    if(vPoints == 5){
        console.log("Parabéns. Você ganhou, a palavra era: "+random);
        console.log(line);
        result.css('display', 'block');
    }
}

function closeResult(){
    result.css('display', 'none');
}