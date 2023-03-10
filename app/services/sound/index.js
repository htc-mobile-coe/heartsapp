import Sound from 'react-native-sound';
import { Alert } from 'react-native';
import { isNil, isUndefined } from 'lodash';

Sound.setCategory('Playback', true);

const pleaseStartMeditation = new Sound(require('./psm_m.mp3'), error => {
    if (!isNil(error)) {
        Alert.alert('PSM.mp3 file error', error.message);
    }
});
export const playPleaseStartMeditation = callback => {
    pleaseStartMeditation.play(() => {
        pleaseStartMeditation.stop();
        if (!isUndefined(callback)) {
            callback();
            callback = undefined;
        }
    });
};

const thatsAll = new Sound(require('./tha_m.mp3'), error => {
    if (!isNil(error)) {
        Alert.alert('TA.mp3 file error', error.message);
    }
});
export const playThatsAll = () => {
    thatsAll.play(() => thatsAll.stop());
};

/* guide audio */
const guidedRelaxation = new Sound(
    require('./guided_relaxation.mp3'),
    error => {
        if (!isNil(error)) {
            Alert.alert('guided_relaxation.mp3 file error', error.message);
        }
    },
);

export const isGuidedRelaxationPlaying = () => {
    return guidedRelaxation.isPlaying();
};

export const playGuidedRelaxation = callback => {
    if (guidedRelaxation.isPlaying()) {
        return;
    }
    guidedRelaxation.play(() => {
        guidedRelaxation.stop();
        if (!isUndefined(callback)) {
            callback();
            callback = undefined;
        }
    });
};

export const stopIfPlayingGuidedRelaxation = () => {
    if (guidedRelaxation.isPlaying()) {
        guidedRelaxation.stop();
    }
};

const appleRing = new Sound(require('./apple_ring.mp3'), error => {
    if (!isNil(error)) {
        Alert.alert('apple_ring.mp3 file error', error.message);
    }
});

export const playAppleRing = () => {
    appleRing.play();
    appleRing.setNumberOfLoops(3);
};

export const stopAppleRing = () => {
    appleRing.stop();
};

const beep = new Sound(require('./beep.wav'), error => {
    if (!isNil(error)) {
        Alert.alert('beep.wav file error', error.message);
    }
});
export const playBeep = () => {
    beep.play(() => beep.stop());
};

const beep2 = new Sound(require('./beep2.mp3'), error => {
    if (!isNil(error)) {
        Alert.alert('beep2.mp3 file error', error.message);
    }
});
export const playBeep2 = () => {
    beep2.play(() => beep2.stop());
};
