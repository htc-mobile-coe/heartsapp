export default (attributes, bulletIndex) => {
    let listChar = '1';
    for(i = 0; i < attributes.length; i++){
        if(attributes[i].key === 'ListCharacter'){
            listChar = attributes[i].value;
            break;
        }
    }

    let num = bulletIndex + 1;
    let bullet = num.toString();

    if (listChar === 'i') {
        bullet = romanize(num).toLowerCase();
    } else if (listChar === 'I') {
        bullet = romanize(num);
    } else if (listChar === 'a') {
        bullet = alphabetize(num);
    } else if (listChar === 'A') {
        bullet = alphabetize(num).toUpperCase();
    }

    return bullet + ".";
}

romanize = (num) => {
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;

    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }

    return roman;
};

alphabetize = (num) => {
    var index = (num - 1) % 26;
    return alphabets = "a b c d e f g h i j k l m n o p q r s t u v w x y z".split(" ")[index];
};