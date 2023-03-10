import Variables from './variables';

describe('Style Variables', () => {
    it('buttonPrimaryBg should be brandPrimary', () => {
        expect(Variables.buttonPrimaryBg).toEqual(Variables.brandPrimary);
    });
});
