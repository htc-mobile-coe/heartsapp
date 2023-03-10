import GooglePlacesService from './GooglePlacesService';

describe('GooglePlacesService', () => {
    const fetchMock = (returnBody?: object, mockFn: any) => {
        mockFn.mockImplementationOnce(() => {
            return new Promise(resolve => {
                resolve({
                    ok: true,
                    status: 200,
                    json: () => {
                        return returnBody ? returnBody : {};
                    },
                });
            });
        });
        global.fetch = mockFn;
    };
    it('Should not able to fetch location. when lat lng is invalid', async () => {
        const mockFn = jest.fn();
        fetchMock({ results: [] }, mockFn);

        const locationDetails = await GooglePlacesService.getPlaceDetailsFromCoordinate(
            -72.42532,
            80.235423,
        );
        expect(locationDetails).toBeUndefined();
    });
    it('Should  able to fetch location. when lat lng is valid', async () => {
        const mockFn = jest.fn();
        fetchMock({ results: [{ formatted_address: 'mock' }] }, mockFn);
        fetchMock(
            {
                result: {
                    formatted_address: 'mock',
                    address_components: [
                        { long_name: '600100', types: ['street_number'] },
                        { long_name: 'Winnetk', types: ['route'] },
                        { long_name: 'Los Angeles', types: ['locality'] },
                        {
                            long_name: '9400 S',
                            types: ['sublocality_level_3'],
                        },
                        {
                            long_name: 'Normandie',
                            types: ['sublocality_level_2'],
                        },
                        {
                            long_name: 'Ave #14',
                            types: ['sublocality_level_1'],
                        },
                        {
                            long_name: 'California',
                            types: ['administrative_area_level_1', 'political'],
                        },
                        {
                            long_name: 'United States',
                            types: ['country', 'political'],
                        },
                        { short_name: '600000', types: ['postal_code'] },
                    ],
                    geometry: { location: { lat: -72.42532, lng: 80.235423 } },
                },
            },
            mockFn,
        );

        const locationDetails = await GooglePlacesService.getPlaceDetailsFromCoordinate(
            -72.42532,
            80.235423,
        );
        expect(locationDetails).toEqual({
            latitude: -72.42532,
            longitude: 80.235423,
            postalCode: '600000',
            addressLine1: '600100, Winnetk',
            addressLine2: '9400 S',
            addressLine3: 'Normandie, Ave #14',
            city: 'Los Angeles',
            state: 'California',
            country: 'United States',
        });
    });
    it('Should not  able to fetch location. when place details is invalid', async () => {
        const mockFn = jest.fn();
        fetchMock({ results: [{ formatted_address: 'mock' }] }, mockFn);
        fetchMock(
            {
                result: null,
            },
            mockFn,
        );

        const locationDetails = await GooglePlacesService.getPlaceDetailsFromCoordinate(
            -72.42532,
            80.235423,
        );
        expect(locationDetails).toBeUndefined();
    });
});
