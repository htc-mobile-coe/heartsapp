import React from 'react';
import { Text } from 'react-native';
import { render } from 'TestUtils';
import { OfflineNotice, mapStateToProps } from './OfflineNotice';

describe('OfflineNotice ', () => {
    const Component = (props) => {
        return render(<OfflineNotice t={jest.fn()} {...props} />);
    };

    it('should show the notice if internet is not connected', () => {
        const { container } = Component({
            isConnectedToNetwork: false,
            isApplicationServerReachable: false,
        });
        expect(container.findByType(Text)).toBeDefined();
    });

    it('should show the notice if appplication server is not reachable but internet is connected', () => {
        const { container } = Component({
            isConnectedToNetwork: true,
            isApplicationServerReachable: false,
        });
        expect(container.findByType(Text)).toBeDefined();
    });

    it('should not show Text content, when isApplicationServerReachable is connected', () => {
        const { container } = Component({
            isConnectedToNetwork: true,
            isApplicationServerReachable: true,
        });
        expect(container.findAllByType(Text)).toHaveLength(0);
    });
    it('should map State To Props', () => {
        expect(
            mapStateToProps({
                deviceState: {
                    isConnectedToNetwork: true,
                    isApplicationServerReachable: true,
                },
            }),
        ).toEqual({
            isConnectedToNetwork: true,
            isApplicationServerReachable: true,
        });
    });
});
