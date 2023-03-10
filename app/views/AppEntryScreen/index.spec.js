import React from 'react';
import { render, find } from '../../utils/TestUtils';
import CenterView from '../shared/CenterView';
import FastImage from 'react-native-fast-image';
import AppEntryScreen from './index';

describe('AppEntryScreen', () => {
    const loaderImage = 'appEntry_loader--image';
    const Component = (props) => {
        return render(<AppEntryScreen {...props} />);
    };
    it('Should exist', () => {
        const { container } = Component();
        expect(container).toBeDefined();
    });
    it('Should have 1 CenterView component', () => {
        const { container } = Component({
        });
        expect(container.findAllByType(CenterView)).toHaveLength(1);
    });
    it('Should have 1 FastImage component', () => {
        const { container } = Component({
        });
        expect(container.findAllByType(FastImage)).toHaveLength(1);
    });
    it('should render FastImage for displaying loader', () => {
        const source = { testUri: '../../../app/views/shared/Images/classic/loader.gif' }
        const { container } = Component({
            images: 'loader.gif',
        });
        expect(find(container, loaderImage)).toBeDefined();
        expect(find(container, loaderImage)).toHaveProp('source', source);
    });
    it('should have a style for FastImage component ', () => {
        const style = { width: '100%', aspectRatio: 4, resizeMode: 'contain' }
        const { container } = Component({
            style: style,
        });
        expect(find(container, loaderImage)).toHaveProp('style', style);
    });
});
