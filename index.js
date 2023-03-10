import { AppRegistry, LogBox } from 'react-native';
import App from './app';
import { setBackgroundMessageHandler } from './app/services/firebase/MessagingService';
//Uncomment the below import to run storybook
// import App from './storybook';

AppRegistry.registerComponent('heartsapp', () => App);
setBackgroundMessageHandler();
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
