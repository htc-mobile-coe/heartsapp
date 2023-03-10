import React from 'react';
import SittingDetailsScreen from './SittingDetailsScreen';
import ScreenContainer from '../../shared/ScreenContainer';
import { SITTING_DETAILS_CONTAINER_TYPE } from './SittingDetailsContainerType';
import AddOfflineSittingDetails from './AddOfflineSittingDetails';
import SeekerSelectionComponent from './SeekerSelectionComponent';
import SeekerBarcodeScannedResult from './SeekerBarcodeScannedResult';
import SeekerSearchResult from './SeekerSearchResult';
import SelectedSeekers from './SelectedSeekers';
import { render } from 'app/utils/TestUtils';
import moment from 'moment';

describe('SittingDetailsScreen', () => {
    const selectedSeekersMock = [
        {
            id: 1,
            name: 'Hema Devi Peri',
            email: 'Hemadevipadma@Mail.com',
            phoneNo: '+91 99623 88246',
            seekerId: 'HFN 228970',
        },
        {
            id: 2,
            name: 'Vijayan Pambhatla',
            email: 'vijayanpambhatla@Mail.com',
            phoneNo: '+91 99623 88246',
            seekerId: 'HFN 228971',
        },
        {
            id: 3,
            name: 'Sudharsan L',
            email: 'sudharsanl@Mail.com',
            phoneNo: '+91 99623 88246',
            seekerId: 'HFN 228972',
        },
    ];
    const valuesMock = {
        date: moment(),
        startTime: moment(),
        endTime: moment(),
        duration: '',
        numberOfPeople: 1,
        seekerList: [],
        comments: '',
    };
    const Component = props => {
        return render(<SittingDetailsScreen
            selectedSeekers={selectedSeekersMock}
            offlineSessionDetails={valuesMock}
            {...props}
        />);
    };

    it('Should render a ScreenContainer component', () => {
        const { container } = Component();
        expect(container.findByType(ScreenContainer)).toBeDefined();
    });

    it('Should render a AddOfflineSittingDetails component when containerType is ADD_OFFLINE_SITTING_DETAILS', () => {
        const { container } = Component({
            containerType:
                SITTING_DETAILS_CONTAINER_TYPE.ADD_OFFLINE_SITTING_DETAILS,
        });
        expect(container.findByType(AddOfflineSittingDetails)).toBeDefined();
    });

    it('Should render a SeekerSelectionComponent component when containerType is SEEKER_SELECTION_COMPONENT', () => {
        const { container } = Component({
            containerType:
                SITTING_DETAILS_CONTAINER_TYPE.SEEKER_SELECTION_COMPONENT,
        });
        expect(container.findByType(SeekerSelectionComponent)).toBeDefined();
    });

    it('Should render a SeekerBarcodeScannedResult component when containerType is SEEKER_BARCODE_SCANNED_RESULT', () => {
        const { container } = Component({
            containerType:
                SITTING_DETAILS_CONTAINER_TYPE.SEEKER_BARCODE_SCANNED_RESULT,    
            barcodeSearchedResult: {selectedSeekersMock}
        });
        expect(container.findByType(SeekerBarcodeScannedResult)).toBeDefined();
    });

    it('Should render a SeekerSearchResult component when containerType is SEEKER_SEARCH_RESULT', () => {
        const { container } = Component({
            containerType: SITTING_DETAILS_CONTAINER_TYPE.SEEKER_SEARCH_RESULT,
        });
        expect(container.findByType(SeekerSearchResult)).toBeDefined();
    });

    it('Should render a SelectedSeekers component when containerType is SELECTED_SEEKERS', () => {
        const { container } = Component({
            containerType: SITTING_DETAILS_CONTAINER_TYPE.SELECTED_SEEKERS,
        });
        expect(container.findByType(SelectedSeekers)).toBeDefined();
    });
});
