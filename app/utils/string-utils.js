import {
    isNil,
    isEqual,
    compact,
    map,
    isEmpty,
    size,
    repeat,
    split,
} from 'lodash';

export const getFirstLetter = (...letters) => {
    if (isNil(letters) || isEqual(letters.length, 0)) {
        return undefined;
    }
    const firstLetters = map(compact(letters), letter => {
        if (isEmpty(letter)) {
            return '';
        }
        return letter[0];
    });
    return firstLetters.join('');
};
export const getMaskedContent = (content, prefixCount, suffixCount) => {
    if (!isNil(prefixCount) && !isNil(suffixCount)) {
        const maskedContent =
            content.substring(0, prefixCount) +
            repeat('*', size(content) - (prefixCount + suffixCount)) +
            content.slice(-suffixCount);
        return maskedContent;
    }
    return content.substring(0, 1) + repeat('*', size(content) - 1);
};

export const getMaskedEmail = email => {
    const splitedValue = split(email, '@');
    const maskedEmail =
        getMaskedContent(splitedValue[0]) + '@' + splitedValue[1];
    return maskedEmail;
};
