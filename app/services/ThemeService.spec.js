import ThemeService from './ThemeService';
import { ThemeMode } from 'app/styles/theme/ThemeSetup';

describe('ThemeService', () => {
    it('should be default theme mode is peach', async () => {
        const defaultTheme = await ThemeService.loadTheme();
        expect(defaultTheme.mode).toEqual(ThemeMode.peach);
    });

    it('should be get peach theme details', async () => {
        const mockTheme = ThemeService.getSelectedTheme(ThemeMode.peach);
        expect(mockTheme.mode).toEqual(ThemeMode.peach);
    });

    it('should be able to switch theme mode default classic to peach', async () => {
        ThemeService.saveTheme(ThemeMode.peach);
        const mockTheme = await ThemeService.loadTheme();
        expect(mockTheme.mode).toEqual(ThemeMode.peach);
    });
});
