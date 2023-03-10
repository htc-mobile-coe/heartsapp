import { Theme } from './ThemeSetup';

describe('Style Variables', () => {
    it('classic theme buttonPrimaryBg should be brandPrimary', () => {
        expect(Theme.classic.buttonPrimaryBg).toEqual(
            Theme.classic.brandPrimary,
        );
    });

    it('peach theme buttonPrimaryBg should be brandPrimary', () => {
        expect(Theme.peach.buttonPrimaryBg).toEqual(Theme.peach.brandPrimary);
    });
});
