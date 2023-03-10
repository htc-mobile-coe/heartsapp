import classic from './classic';
import peach from './peach';
import { ThemeMode } from 'app/styles/theme/ThemeSetup';

const images = mode => {
    switch (mode) {
        case ThemeMode.peach:
            return peach;
        default:
            return classic;
    }
};

export default images;
