import getAppTheme from './index';
import { Theme } from './ThemeSetup';

describe('getAppTheme', () => {
    const themeClassic = getAppTheme(Theme.classic);
    const peachClassic = getAppTheme(Theme.peach);

    it('classic theme buttonPrimaryBg should be brandPrimary', () => {
        expect(themeClassic.variables.buttonPrimaryBg).toEqual(
            Theme.classic.brandPrimary,
        );
    });

    it('peach theme buttonPrimaryBg should be brandPrimary', () => {
        expect(peachClassic.variables.buttonPrimaryBg).toEqual(
            Theme.peach.brandPrimary,
        );
    });
});
