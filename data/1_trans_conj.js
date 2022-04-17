const fs = require('fs');

const translate = require('sdapi').default.translate;
const conjugate = require('sdapi').default.conjugate;

async function transAndConj(words) {
    var allWords = [];
    var numWords = words.length;
    
    for (let i = 0; i < words.length; i++) {
        console.log("word " + i.toString() + " / " + numWords.toString() + "\r")
        var engWord = words[i];
        var engConj = await conjugate(engWord);

        var translations = await translate(engWord);
        var meanings = [];

        for (let j = 0; j < translations.length; j++) {
            let translation = translations[j];

            let part = translation['part'];
            let meaning = translation['meaning'];
            if (!meanings.includes(meaning) && meaning.length > 0 && (part === 'transitive verb' || part === 'intransitive verb')) {
                try {
                    translations[j]['spanConj'] = await conjugate(meaning);
                } catch (error) {
                    // do nothing
                }
                meanings.push(meaning);
            }
        }

        let currWord = {'engWord': engWord, 'engConj': engConj, 'translations': translations};
        allWords.push(currWord);
    }
    
    return allWords;
}

var wordList = fs.readFileSync('wordlist.txt').toString().split("\r\n");
wordList = wordList.slice(3,5);

transAndConj(wordList).then(aWords => {
    fs.writeFileSync('allwords.json', JSON.stringify(aWords));
});