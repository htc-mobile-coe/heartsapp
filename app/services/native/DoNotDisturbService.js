import { NativeModules } from 'react-native';

export const requestDoNotDisturbPermission = async () => {
    await NativeModules.DeviceCapabilitiesService.requestDoNotDisturbPermission(
        {},
    );
};

export const enableDoNotDisturbMode = async () => {
    await NativeModules.DeviceCapabilitiesService.enableDoNotDisturbMode({});
};

export const disableDoNotDisturbMode = async () => {
    await NativeModules.DeviceCapabilitiesService.disableDoNotDisturbMode({});
};

export const hasDoNotDisturbPermission = async () => {
    return await NativeModules.DeviceCapabilitiesService.hasDoNotDisturbPermission(
        {},
    );
};
