import {
    getFirstLetter,
    getMaskedContent,
    getMaskedEmail,
} from './string-utils';
describe('StringUtils', () => {
    it('should able to get two string first letter', () => {
        const value = getFirstLetter('John', 'Peter');
        expect(value).toEqual('JP');
    });
    it('should able to get string first letter', () => {
        const value = getFirstLetter('John');
        expect(value).toEqual('J');
    });

    it('should able to get masked string content when prefixCount and suffixCount is available', () => {
        const value = getMaskedContent('+919486969553', 2, 3);
        expect(value).toEqual('+9********553');
    });

    it('should able to get masked string content when prefixCount and suffixCount is not available', () => {
        const value = getMaskedContent('HP@gmail.com');
        expect(value).toEqual('H***********');
    });
    it('should able to get masked string content when prefixCount and suffixCount are null', () => {
        const value = getMaskedContent('HP@gmail.com', null, null);
        expect(value).toEqual('H***********');
    });
    it('should able to get masked email', () => {
        const value = getMaskedEmail('HP@br.in');
        expect(value).toEqual('H*@br.in');
    });
});
