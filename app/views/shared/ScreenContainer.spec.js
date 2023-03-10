import React from 'react';
import { render } from 'TestUtils';
import ScreenContainer from './ScreenContainer';
import { AppBusyOverlay } from './AppBusyOverlay';
import { ImageBackground, ScrollView, SafeAreaView } from 'react-native';

describe('ScreenContainer ', () => {
    const Component = (props) => {
        return render(<ScreenContainer images={{}} t={jest.fn()} {...props} />);
    };
    it('should have a SafeAreaView on base component', () => {
        const { container } = Component({
            enableSafeArea: true,
            spinnerColor: '#000',
        });
        expect(container.findByType(SafeAreaView)).toBeDefined();
    });
    it('should not have a SafeAreaView on base component', () => {
        const { container } = Component({
            enableSafeArea: false,
            spinnerColor: '#000',
        });
        expect(container.findAllByType(SafeAreaView)).toHaveLength(0);
    });
    it('should have a AppBusyOverlay', () => {
        const { container } = Component({
            enableScroll: false,
            spinnerColor: '#000',
        });
        expect(container.findByType(AppBusyOverlay)).toBeDefined();
    });
    it('should have a ScrollView', () => {
        const { container } = Component({
            enableScroll: true,
            spinnerColor: '#000',
            contentContainerStyle: { flex: 1 },
        });
        expect(container.findByType(ScrollView)).toBeDefined();
    });
    it('should have a ImageBackground', () => {
        const { container } = Component({
            enableScroll: false,
            spinnerColor: '#000',
        });
        expect(container.findByType(ImageBackground)).toBeDefined();
    });
    it('should not have a ImageBackground', () => {
        const { container } = Component({
            noBackground: true,
            spinnerColor: '#000',
        });
        expect(container.findAllByType(ImageBackground)).toHaveLength(0);
    });
});
