import React from 'react';
import { render } from 'TestUtils';
import {
    Text,
    MediumBoldText,
    BoldText,
    BolderText,
    MediumBoldItalicText,
} from './Text';
import { Text as NText } from 'react-native';

describe('Text ', () => {
    describe('#Text', () => {
        it('should render  Text', () => {
            const { container } = render(<Text />);
            expect(container.findByType(NText)).toBeDefined();
        });
        it('should render styles', () => {
            const { container } = render(
                <Text style={[{ color: '#000' }, { margin: 4 }]} />,
            );
            expect(container.findByType(NText)).toHaveStyle([
                {
                    fontFamily: 'Gotham-Book',
                },
                { color: '#000' },
                { margin: 4 },
            ]);
        });
    });
    describe('#MediumBoldText', () => {
        it('should render Text', () => {
            const { container } = render(<MediumBoldText />);
            expect(container.findByType(NText)).toBeDefined();
        });
        it('should render styles', () => {
            const { container } = render(
                <MediumBoldText style={[{ color: '#000' }, { margin: 4 }]} />,
            );
            expect(container.findByType(NText)).toHaveStyle([
                {
                    fontFamily: 'Gotham-Medium',
                },
                { color: '#000' },
                { margin: 4 },
            ]);
        });
    });

    describe('#BoldText', () => {
        it('should render Text', () => {
            const { container } = render(<BoldText />);
            expect(container.findByType(NText)).toBeDefined();
        });
        it('should render styles', () => {
            const { container } = render(
                <BoldText style={[{ color: '#000' }, { margin: 4 }]} />,
            );
            expect(container.findByType(NText)).toHaveStyle([
                {
                    fontFamily: 'Gotham-Bold',
                },
                { color: '#000' },
                { margin: 4 },
            ]);
        });
    });

    describe('#BolderText', () => {
        it('should render Text', () => {
            const { container } = render(<BolderText />);
            expect(container.findByType(NText)).toBeDefined();
        });
        it('should render styles', () => {
            const { container } = render(
                <BolderText style={[{ color: '#000' }, { margin: 4 }]} />,
            );
            expect(container.findByType(NText)).toHaveStyle([
                {
                    fontFamily: 'Gotham-Black',
                },
                { color: '#000' },
                { margin: 4 },
            ]);
        });
    });
    describe('#MediumBoldItalicText', () => {
        it('should render Text', () => {
            const { container } = render(<MediumBoldItalicText />);
            expect(container.findByType(NText)).toBeDefined();
        });
        it('should render styles', () => {
            const { container } = render(
                <MediumBoldItalicText
                    style={[{ color: '#000' }, { margin: 4 }]}
                />,
            );
            expect(container.findByType(NText)).toHaveStyle([
                {
                    fontFamily: 'Gotham-BoldItalic',
                },
                { color: '#000' },
                { margin: 4 },
            ]);
        });
    });
});
