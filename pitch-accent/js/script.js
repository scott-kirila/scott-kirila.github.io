tf.loadLayersModel('model/model.json').then(function(model) {
    window.model = model;
   });

// const model = await tf.loadLayersModel('model/model.json');
const button = document.getElementById("submit");

const kanaDict = {
    aa: ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ', 'が', 'ざ', 'だ', 'ば', 'ぱ', 'きゃ', 'しゃ', 'ちゃ', 'にゃ', 'ひゃ', 'みゃ', 'りゃ', 'ぎゃ', 'じゃ', 'びゃ', 'ぴゃ', ],
    ii: ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', 'り', 'ぎ', 'じ', 'ぢ', 'び', 'ぴ'],
    uu: ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'ゆ', 'る', 'ぐ', 'ず', 'づ', 'ぶ', 'ぷ', 'きゅ', 'しゅ', 'ちゅ', 'にゅ', 'ひゅ', 'みゅ', 'りゅ', 'ぎゅ', 'じゅ', 'びゅ', 'ぴゅ'],
    ee: ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', 'れ', 'げ', 'ぜ', 'で', 'べ', 'ぺ'],
    oo: ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'よ', 'ろ', 'ご', 'ぞ', 'ど', 'ぼ', 'ぽ', 'きょ', 'しょ', 'ちょ', 'にょ', 'ひょ', 'みょ', 'りょ', 'ぎょ', 'じょ', 'びょ', 'ぴょ'],
    special: ['np.nan', '<start>', '<end>', 'っ', 'ん', 'を']
};

function splitWord(word) {
    const chars = word.split('');
    let syllables = [];
    for ( let i = 0; i < chars.length; i++ ) {
        if ( ['ゃ', 'ゅ', 'ょ'].includes(chars[i + 1]) ) {
            syllables.push( chars[i] + chars[i + 1] );
        } else {
            syllables.push( chars[i] );
        }
    }
    return syllables;
}

function tokenizeSyllables(syllables) {
    let tokens = [1];
    for ( let i = 0; i < syllables.length; i++ ) {
        if ( kanaDict.special.includes(syllables[i]) ) {
            tokens.push( kanaDict.special.indexOf(syllables[i]) );
        } else if ( kanaDict.aa.includes(syllables[i]) ) {
            tokens.push(6);
        } else if ( kanaDict.ii.includes(syllables[i]) ) {
            tokens.push(7);
        } else if ( kanaDict.uu.includes(syllables[i]) ) {
            tokens.push(8);
        } else if ( kanaDict.ee.includes(syllables[i]) ) {
            tokens.push(9);
        } else if ( kanaDict.oo.includes(syllables[i]) ) {
            tokens.push(10);
        }
    }
    tokens.push(2);
    if ( tokens.length < 20) {
        for ( let i = tokens.length; i < 20; i++ ) {
            tokens.push(0);
        }
    }
    return tokens;
}

function processOutput(input, output) {
    const truncatedOutput = output.slice(1);
    let newOutput = '';

    for ( i = 0; i < input.length; i++ ) {
        if ( truncatedOutput[i] == 4 ) {
            newOutput += `<span style="color: red">${input[i]}</span>`;
        } else {
            newOutput += `<span style="color: black">${input[i]}</span>`;
        }
    }
    return newOutput;
}

function doTheThing() {
    let input = document.getElementById("kana").value;
    let processedInput = tokenizeSyllables(splitWord(input));
    window.model.predict([tf.tensor(processedInput).reshape([1, 20])]).array().then(function(scores){
        console.log(input);
        let fullPrediction = '';
        for ( i = 0; i < 20; i++ ) {
            let syllablePrediction = scores[0][i].indexOf(Math.max(...scores[0][i]));
            fullPrediction += syllablePrediction;
        }
        // console.log(fullPrediction);
        document.getElementById('result').innerHTML = processOutput(input, fullPrediction);
    });
}
// let processedInput = tokenizeSyllables('い');
// console.log(processedInput);
// doTheThing();
button.addEventListener('click', doTheThing);
