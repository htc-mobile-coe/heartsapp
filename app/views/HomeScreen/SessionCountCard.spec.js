import React from 'react';
import { render, find, findByProps } from '../../utils/TestUtils';
import SessionCountCard from './SessionCountCard';
import { Image } from 'react-native';
import { MediumBoldText, BoldText } from '../shared/Text';

describe('SessionCountCard', () => {
    const image = 'sessionCountCard--Image';
    const Component = (props) => render(<SessionCountCard {...props} />);

    it('Should have 1 MediumBoldText', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toHaveLength(1);
    });

    it('Should have 1 BoldText', () => {
        const { container } = Component({});
        expect(container.findAllByType(BoldText)).toHaveLength(1);
    });

    it('Should have 1 Image', () => {
        const { container } = Component({});
        expect(container.findAllByType(Image)).toHaveLength(1);
    });

    it('Should show value in BoldText', () => {
        const meditationSessionCountMock = '100';
        const { container } = Component({
            meditationSessionCount: meditationSessionCountMock,
        });
        expect(container.findByType(BoldText)).toHaveProp('children', meditationSessionCountMock);
    });

    it('Should render image', () => {
        const imageMock = require('./img/peach/life_style.png');
        const { container } = Component({
            imageSource: imageMock,
        });
        expect(container.findAllByType(Image)).toHaveLength(1);
        expect(findByProps(find(container, image), 'source', imageMock)).toBeDefined();
    });
});
