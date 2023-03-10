export const wait = millisecond =>
    new Promise(resolve => setTimeout(resolve, millisecond));
