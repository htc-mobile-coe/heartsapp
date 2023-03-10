import React from 'react';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import SessionCountCard from './SessionCountCard';
import { Image } from 'react-native';
import { Text, BoldText } from '../shared/Text';

describe('SessionCountCard', () => {
    const sessionCuntCardImage = 'sessionCountCard--Image';

    const Component = props => {
        return render(<SessionCountCard {...props} />);
    };

    it('Should have 1 Text component for title', () => {
        const { container } = Component();
        expect(container.findByType(Text)).toBeDefined();
    });

    it('Should have 1 BoldText component for session count', () => {
        const { container } = Component();
        expect(container.findByType(BoldText)).toBeDefined();
    });

    it('Should have 1 Image component', () => {
        const { container } = Component();
        expect(container.findByType(Image)).toBeDefined();
    });

    it('Should show meditationSessionCount value in BoldText', () => {
        const { container } = Component({
            meditationSessionCount: '25',
        });
        expect(container.findByType(BoldText)).toHaveProp('children', '25');
    });

    it('Should render Image source', () => {
        const imageSourceMock = require('./img/peach/meditation.png');
        const { container } = Component({
            imageSource: imageSourceMock,
        });

        expect(find(container, sessionCuntCardImage)).toBeDefined();

        expect(find(container, sessionCuntCardImage)).toHaveProp('source',
            imageSourceMock,
        );
    });
});
