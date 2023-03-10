import FastImage from 'react-native-fast-image';
import React from 'react';
import { render } from 'TestUtils';
import AppBusyOverlay, {
    AppBusyOverlay as AppBusyOverlayComponent,
    mapStateToProps,
} from './AppBusyOverlay';

describe('AppBusyOverlay ', () => {
    const Component = (props) => render(<AppBusyOverlay {...props} />);

    it('should not render FastImage component if show is false', () => {
        const { container } = Component({ show: false });
        expect(container.findAllByType(FastImage)).toHaveLength(0);
    });

    it('should able to render FastImage for displaying loader', () => {
        const { container } = render(
            <AppBusyOverlayComponent
                show={true}
                images={'loader.gif'}
                styles={{}}
            />,
        );
        expect(container.findByType(FastImage)).toBeDefined();
    });

    it('should determine show based on appBusyStatus redux state', () => {
        expect(mapStateToProps({ appBusyStatus: { busy: true } })).toEqual({
            show: true,
        });
    });
});
