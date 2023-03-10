import StorageService from './native/AppStorageService';
import { Theme, ThemeMode } from 'app/styles/theme/ThemeSetup';

class ThemeService {
    loadTheme = async () => {
        const mode = await StorageService.appTheme.getValue();
        return this.getSelectedTheme(mode ?? ThemeMode.peach);
    };

    saveTheme = mode => {
        StorageService.appTheme.setValue(mode);
    };

    getSelectedTheme = mode => {
        return {
            mode: mode,
            theme: Theme[mode],
        };
    };
}

export default new ThemeService();
