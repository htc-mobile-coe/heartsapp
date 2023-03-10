import getTheme from '../../../native-base-theme/components';
import FirstTimeLandingScreen from '../../views/FirstTimeLandingScreen/FirstTimeLandingScreen.styles';
import MasterClassesScreen from '../../views/MasterClassesScreen/MasterClassVideoInformation/MasterClassVideoInformation.styles';
import SignInScreen from '../../views/SignInScreen/SignInScreen.styles';
import SignUpScreen from '../../views/SignUpScreen/SignUpScreen.styles';
import HelpDeskScreen from '../../views/HelpDeskScreen/HelpDeskScreen.styles';
import DataDoesNotMatchScreen from '../../views/DataDoesNotMatchScreen/DataDoesNotMatchScreen.styles';

const getAppTheme = variables => {
    return {
        ...getTheme(variables),
        ...FirstTimeLandingScreen,
        ...MasterClassesScreen,
        ...SignInScreen,
        ...SignUpScreen,
        ...HelpDeskScreen,
        ...DataDoesNotMatchScreen,
    };
};

export default getAppTheme;
