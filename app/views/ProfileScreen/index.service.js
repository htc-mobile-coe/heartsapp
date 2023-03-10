import { isNull } from 'lodash';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import {
    deleteProfilePicture,
    updateProfilePicture,
} from '../../services/grpc/ProfileService';

const _getErrorMessage = error => {
    if (!isNull(error.message)) {
        return error.message.split(':')[1];
    }
};

export const updateProfileImage = async (pictureData, pictureName, props) => {
    const { setHfnProfileImage } = props;

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const photoURL = await updateProfilePicture(
                pictureData,
                pictureName,
            );
            setHfnProfileImage(photoURL);
            return photoURL;
        } catch (err) {
            return _getErrorMessage(err);
        }
    }
};

export const deleteProfileImage = async props => {
    const { setHfnProfileImage } = props;
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            await deleteProfilePicture();
            setHfnProfileImage(undefined);
            return null;
        } catch (err) {
            return _getErrorMessage(err);
        }
    }
};
