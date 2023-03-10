import React from 'react';
import { SeekerSearchResultContainer } from './index';
import SeekerSearchResult from './SeekerSearchResult';
import { Toast } from 'native-base';
import { render, fireEvent, findByProps } from 'app/utils/TestUtils';

describe('SeekerSearchResultContainer', () => {
    const Component = props => {
        return render(<SeekerSearchResultContainer t={() => {}} {...props} />);
    };

    const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => {});

    let isSeekerSelectedMock = jest.fn();
    const prepare = value => {
        isSeekerSelectedMock = jest.fn().mockImplementation(() => value);
    };

    afterEach(() => {
        toastMock.mockClear();
        if (isSeekerSelectedMock) {
            isSeekerSelectedMock.mockClear();
            isSeekerSelectedMock = undefined;
        }
    });
    it('Should have SeekerSearchResult in container ', () => {
        const { container } = Component({});
        expect(container.findAllByType(SeekerSearchResult)).toHaveLength(1);
    });

    it('Should call back press event when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({ onBackPress: onBackPressMock });
        fireEvent(container.findByType(SeekerSearchResult), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should call onListItemSelected and save selectedItem into state when list item is pressed', () => {
        const searchResultMock = [
            {
                name: 'Abhyasi 12',
                email: 'abhyasi.12@mailinator.com',
                phoneNo: '+91 99623 88246',
                firebase_uid: 'Fu34K2zJpFZQFtD3WgIAaAj9q5x1',
                isSelected: false,
            },
            {
                name: 'Abhyasi 15',
                email: 'abhyasi.15@mailinator.com',
                phoneNo: '+91 99623 88246',
                firebase_uid: 'Fu34K2zcJpFZQFtD3WgIAaAj9q5x1',
                isSelected: false,
            },
        ];
        prepare(false);
        const { container } = Component({
            searchResult: searchResultMock,
            isSeekerSelected: isSeekerSelectedMock,
        });
        fireEvent(container.findByType(SeekerSearchResult), 'ListItemSelected', 0, {
            name: 'Abhyasi 12',
            email: 'abhyasi.12@mailinator.com',
            phoneNo: '+91 99623 88246',
            firebase_uid: 'Fu34K2zJpFZQFtD3WgIAaAj9q5x1',
            isSelected: false,
        });
        
        expect(isSeekerSelectedMock).toBeCalledWith(
            'Fu34K2zJpFZQFtD3WgIAaAj9q5x1',
        );
        expect(findByProps(container, 'selectedSeekers', {
            name: 'Abhyasi 12',
            email: 'abhyasi.12@mailinator.com',
            phoneNo: '+91 99623 88246',
            firebase_uid: 'Fu34K2zJpFZQFtD3WgIAaAj9q5x1',
            isSelected: true,
        },)).toBeDefined();
    });
    it('Should call onListItemSelected  when selected list item is already present in selected seekerslist ', () => {
        const searchResultMock = [
            {
                name: 'Abhyasi 12',
                email: 'abhyasi.12@mailinator.com',
                phoneNo: '+91 99623 88246',
                seekerId: 'Fu14K2zJpFZQFtD3WgIAaAj9q5x1',
                isSelected: false,
            },
            {
                name: 'Abhyasi 15',
                email: 'abhyasi.15@mailinator.com',
                phoneNo: '+91 99623 88246',
                seekerId: 'Fu24K2zJpFZQFtD3WgIAaAj9q5x1',
                isSelected: false,
            },
        ];
        prepare(true);
        const { container } = Component({
            searchResult: searchResultMock,
            isSeekerSelected: isSeekerSelectedMock,
        });
        fireEvent(container.findByType(SeekerSearchResult), 'ListItemSelected', 0, {
            name: 'Abhyasi 16',
            email: 'abhyasi.16@mailinator.com',
            phoneNo: '+91 99823 88246',
            firebase_uid: 'Fu34K2zJpFZQFtD3WgIAaAj9q5x1',
            isSelected: false,
        });
        expect(isSeekerSelectedMock).toBeCalledWith(
            'Fu34K2zJpFZQFtD3WgIAaAj9q5x1',
        );
        expect(toastMock).toBeCalled();
    });
    it('Should set selectedSeekers state value when searchResult has some records with isSelected true', () => {
        const selectedSeekersMock = [
            {
                name: 'Abhyasi 12',
                email: 'abhyasi.12@mailinator.com',
                phoneNo: '+91 99623 88246',
                seekerId: 'HFN 228971',
                isSelected: true,
            },
            {
                name: 'Abhyasi 14',
                email: 'abhyasi.14@mailinator.com',
                phoneNo: '+91 88736 88987',
                seekerId: 'HFN 228998',
                isSelected: false,
            },
        ];

        const { container } = Component({
            searchResult: selectedSeekersMock,
        });
        expect(findByProps(container, 'selectedSeekers', [
            {
                email: 'abhyasi.12@mailinator.com',
                isSelected: true,
                name: 'Abhyasi 12',
                phoneNo: '+91 99623 88246',
                seekerId: 'HFN 228971',
            },
        ])).toBeDefined();
    });

    it('Should call onAddSeekerButtonPress when add seeker button is pressed', () => {
        const onAddSeekerButtonPressMock = jest.fn();
        const selectedSeekersMock = [
            {
                name: 'Abhyasi 12',
                email: 'abhyasi.12@mailinator.com',
                phoneNo: '+91 99623 88246',
                seekerId: 'HFN 228971',
                isSelected: true,
            },
        ];

        const { container } = Component({
            onAddSeekerButtonPress: onAddSeekerButtonPressMock,
            searchResult: selectedSeekersMock,
            selectedSeekersCount: 4,
        });
        fireEvent(container.findByType(SeekerSearchResult), 'AddSeekerButtonPress');
        expect(onAddSeekerButtonPressMock).toHaveBeenCalledWith(
            selectedSeekersMock,
        );
    });

    it('Should call onRegisterNewSeekerPress when add seeker button is pressed', () => {
        const onRegisterNewSeekerPressMock = jest.fn();

        const { container } = Component({
            onRegisterNewSeekerPress: onRegisterNewSeekerPressMock,
        });
        fireEvent(container.findByType(SeekerSearchResult), 'RegisterNewSeekerPress');
        expect(onRegisterNewSeekerPressMock).toHaveBeenCalledWith();
    });
    it('Should not call onAddSeekerButtonPress when add seeker button is pressed when total selected seekers count is 10', () => {
        const onAddSeekerButtonPressMock = jest.fn();
        const selectedSeekersMock = [
            {
                name: 'Abhyasi 12',
                email: 'abhyasi.12@mailinator.com',
                phoneNo: '+91 99623 88246',
                seekerId: 'HFN 228971',
                isSelected: true,
            },
        ];
        const { container } = Component({
            onAddSeekerButtonPress: onAddSeekerButtonPressMock,
            searchResult: selectedSeekersMock,
            selectedSeekersCount: 10,
        });
        fireEvent(container.findByType(SeekerSearchResult), 'AddSeekerButtonPress');
        expect(onAddSeekerButtonPressMock).not.toBeCalled();
        expect(toastMock).toBeCalled();
    });
    it('Should able be to set hideRightResultButton to false when selectedSeekersCount is greater than zero', () => {
        const { container } = Component({
            selectedSeekersCount: 1,
        });
        expect(container.findByType(SeekerSearchResult)).toHaveProp('hideRightResultButton', false);
    });
    it('Should able be to set  hideRightResultButton to true when selectedSeekersCount is less than or equal to zero', () => {
        const { container } = Component({
            selectedSeekersCount: 0,
        });
        expect(container.findByType(SeekerSearchResult)).toHaveProp('hideRightResultButton', true);
    });
});
