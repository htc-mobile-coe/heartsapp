import React from 'react';
import ProfileImagePicker from './ProfileImagePicker';
import { TouchableOpacity, Image } from 'react-native';
import { MediumBoldText } from '../shared/Text';
import { fireEvent, find, render } from 'app/utils/TestUtils';

describe('ProfileImagePicker', () => {
    const deletePhoto = 'ProfileImagePicker__deletePhoto--touchableOpacity';
    const takePhoto = 'ProfileImagePicker__takePhoto--touchableOpacity';
    const choosePhoto = 'ProfileImagePicker__choosePhoto--touchableOpacity';
    const cancel = 'ProfileImagePicker__cancel--touchableOpacity';

    const Component = (props) => render(<ProfileImagePicker images={{}} {...props}
    />)
    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should have 4 TouchableOpacity component for Delete Photo, Take Photo, Choose Photo and Cancel option', () => {
        const { container } = Component({});
        expect(container.findAllByType(TouchableOpacity)).toHaveLength(4);
    });

    it('Should have 3 Image component for Delete Photo, Take Photo, and Choose Photo option', () => {
        const { container } = Component({});
        expect(container.findAllByType(Image)).toHaveLength(3);
    });

    it('Should have 4 MediumBoldText component for Delete Photo, Take Photo, Choose Photo and Cancel option', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toHaveLength(4);
    });

    it('Should call onDeletePhotoButtonPress when user clicks on Delete Photo', () => {
        const onDeletePhotoButtonPressMock = jest.fn();
        const { container } = Component({
            onDeletePhotoButtonPress: onDeletePhotoButtonPressMock,
        });
        fireEvent.press(find(container, deletePhoto), 'Press');

        expect(onDeletePhotoButtonPressMock).toHaveBeenCalled();
    });

    it('Should call takePhotoButtonPress when user clicks on Take Photo', () => {
        const onTakePhotoButtonPressMock = jest.fn();
        const { container } = Component({
            onTakePhotoButtonPress: onTakePhotoButtonPressMock,
        });
        fireEvent.press(find(container, takePhoto), 'Press');

        expect(onTakePhotoButtonPressMock).toHaveBeenCalled();
    });

    it('Should call choosePhotoButtonPress when user clicks on Choose Photo', () => {
        const onChoosePhotoButtonPressMock = jest.fn();
        const { container } = Component({
            onChoosePhotoButtonPress: onChoosePhotoButtonPressMock,
        });
        fireEvent.press(find(container, choosePhoto), 'Press');
        expect(onChoosePhotoButtonPressMock).toHaveBeenCalled();
    });

    it('Should call onCancelButtonPress when user clicks on Cancel', () => {
        const onCancelButtonPressMock = jest.fn();
        const { container } = Component({
            onCancelButtonPress: onCancelButtonPressMock,
        });
        fireEvent.press(find(container, cancel), 'Press');
        expect(onCancelButtonPressMock).toHaveBeenCalled();
    });
});
