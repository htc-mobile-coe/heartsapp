import CommonColor from '../../../native-base-theme/variables/platform';

const Variables = {
    ...CommonColor,

    brandPrimary: '#1DA1F2',
    primaryBackground: '#fff',
    backgroundGradient: ['#93D3FF', '#E0F0FA'],

    get buttonPrimaryBg() {
        return this.brandPrimary;
    },

    normalTextColor: '#20243B',
    lightTextColor: '#414141',
    lightGrayColor: '#727270',

    get smallFontSize() {
        return this.fontSizeBase * 0.8;
    },

    thinFont: 'Gotham-Thin',
    extraLightFont: 'Gotham-ExtraLight',
    lightFont: 'Gotham-Light',
    normalFont: 'Gotham-Book',
    mediumFont: 'Gotham-Medium',
    boldFont: 'Gotham-Bold',
    blackFont: 'Gotham-Black',
    ultraFont: 'Gotham-Ultra',
    boldItalicFont: 'Gotham-BoldItalic',

    cardBorderRadius: 5,

    containerBgColor: 'transparant',
};

export default Variables;
