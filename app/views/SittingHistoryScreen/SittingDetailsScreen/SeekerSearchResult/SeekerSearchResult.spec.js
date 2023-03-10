import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import SeekerSearchResult from './SeekerSearchResult';
import SearchResultListItem from './SearchResultListItem';
import SittingDetailsHeader from '../SittingDetailsHeader';

describe('SeekerSearchResult', () => {
    const searchOptionsMock = [
        {
            id: 'NAME',
            label: 'Name',
            searchText: 'Hema',
        },
        {
            id: 'ABHYASI_ID',
            label: 'Abhyasi ID',
            searchText: '',
        },
    ];
    const addSeekerButton = 'seekerSearchResult__addSeeker--button';
    const registerNewSeekerButton =
        'seekerSearchResult__registerNewSeeker--button';
    const noSeekersFoundView = 'seekerSearchResult_addSeeker--view';
    const addSeekerImage = 'seekerSearchResult__addSeeker--image';
    const noOfSeekersText = 'seekerSearchResult__noOfSeekers--text';
    const noSeekersFoundText = 'seekerSearchResult__noSeekersFound--text';
    const searchResultMock = [
        {
            id: 1,
            name: 'Hemadevi Peri',
            email: 'Hemadevipadma@Mail.com',
            phoneNo: '+91 99623 88246',
            seekerId: 'HFN 228971',
            isSelected: true,
        },
    ];

    const Component = props => {
        return render(<SeekerSearchResult t={() => {}} {...props} />);
    };
    
    it('Should render 1 SittingDetailsHeader component', () => {
        const { container } = Component({
            searchResult: searchResultMock,
            selectedSeekers: [],
        });
        expect(container.findAllByType(SittingDetailsHeader)).toHaveLength(1);
    });
    it('Should call onBackPress when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            searchResult: searchResultMock,
            selectedSeekers: [],
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(SittingDetailsHeader), 'BackPress');
        expect(onBackPressMock).toBeCalled();
    });
    it('Should call onSelectedSeekersPress when selected seekers icon is pressed', () => {
        const onSelectedSeekersPressMock = jest.fn();
        const { container } = Component({
            searchResult: searchResultMock,
            selectedSeekers: [],
            onSelectedSeekersPress: onSelectedSeekersPressMock,
        });
        fireEvent(container.findByType(SittingDetailsHeader), 'SelectedSeekersPress');
        expect(onSelectedSeekersPressMock).toBeCalled();
    });
    it('Should not render No seekers found view when search result is not empty', () => {
        const { queryByTestId } = Component({
            isSearchResultEmpty: false,
            searchResult: searchResultMock,
            selectedSeekers: [{}],
        });
        expect(queryByTestId(noSeekersFoundView)).toBeNull();
    });

    it('Should render No seekers found view when search result is empty', () => {
        const { container } = Component({
            isSearchResultEmpty: true,
            searchResult: [],
            selectedSeekers: [],
        });
        expect(find(container, noSeekersFoundView)).toBeDefined();
    });

    it('Should render noOfSeekersText component when searchResult item is available', () => {
        const searchResultMock1 = [
            {
                id: 1,
                name: 'Hemadevi Peri',
                email: 'Hemadevipadma@Mail.com',
                phoneNo: '+91 99623 88246',
                seekerId: 'HFN 228971',
                isSelected: true,
            },
            {
                id: 2,
                name: 'Hemadevi Peri',
                email: 'Hemadevipadma@Mail.com',
                phoneNo: '+91 99623 88246',
                seekerId: 'HFN 228972',
                isSelected: false,
            },
        ];
        const { container } = Component({
            searchResult: searchResultMock1,
            selectedSeekers: [],
            searchOptions: searchOptionsMock,
        });
        expect(find(container, noOfSeekersText)).toBeDefined();
    });

    it('Should render noSeekersFoundText component when searchResult item is not available', () => {
        const tMock = jest.fn();
        const { container } = Component({
            searchResult: null,
            selectedSeekers: [],
            searchOptions: searchOptionsMock,
            t: tMock,
        });
        expect(find(container, noSeekersFoundText)).toBeDefined();
    });

    it('Should have a SearchResultListItem component to display the list items', () => {
        const onListItemSelectedMock = jest.fn();
        const { container } = Component({
            searchResult: searchResultMock,
            selectedSeekers: [],
            index: 1,
            onListItemSelected: onListItemSelectedMock,
            searchOptions: searchOptionsMock,
        });

        expect(container.findAllByType(SearchResultListItem)).toHaveLength(1);
    });

    it('Should render 1 Button component for Add Seeker button', () => {
        const { container } = Component({
            searchResult: searchResultMock,
            selectedSeekers: [
                {
                    id: 1,
                    name: 'Hemadevi Peri',
                    email: 'Hemadevipadma@Mail.com',
                    phoneNo: '+91 99623 88246',
                    seekerId: 'HFN 228971',
                    isSelected: true,
                },
            ],
        });
        expect(find(container, addSeekerButton)).toBeDefined();
    });

    it('Should call onAddSeekerButtonPress event when searchResult and selectedSeekers has some entires', () => {
        const onAddSeekerButtonPressMock = jest.fn();
        const { container } = Component({
            searchResult: searchResultMock,
            selectedSeekers: [
                {
                    id: 1,
                    name: 'Hemadevi Peri',
                    email: 'Hemadevipadma@Mail.com',
                    phoneNo: '+91 99623 88246',
                    seekerId: 'HFN 228971',
                    isSelected: true,
                },
            ],
            onAddSeekerButtonPress: onAddSeekerButtonPressMock,
        });

        fireEvent(find(container, addSeekerButton), 'Press');
        expect(find(container, addSeekerButton)).toBeDefined();
        expect(onAddSeekerButtonPressMock).toBeCalled();
    });

    it('Should call onRegisterNewSeekerPress event when searchResult has no data', () => {
        const onRegisterNewSeekerPressMock = jest.fn();
        const { container } = Component({
            searchResult: [],
            selectedSeekers: [],
            onRegisterNewSeekerPress: onRegisterNewSeekerPressMock,
        });

        expect(find(container, registerNewSeekerButton)).toBeDefined();
        fireEvent(find(container, registerNewSeekerButton), 'Press');
        expect(onRegisterNewSeekerPressMock).toBeCalled();
    });

    it('Should render addUser image', () => {
        const imageMock = require('./img/classic/addSeeker.png');
        const { container } = Component({
            searchResult: [],
            selectedSeekers: [],
            imageSource: imageMock,
            isSearchResultEmpty: true,
        });

        expect(find(container, addSeekerImage)).toHaveProp('source',
            imageMock,
        );
    });
});
