import React from 'react';
import { storiesOf } from '@storybook/react-native';
import MultiSelectionDropDown from './index';

storiesOf('Multi Selection DropDown', module)
    .add(
        'Show MultiSelectionDropDown when  isExpanded false and recent seekers list is empty',
        () => (
            <MultiSelectionDropDown
                isExpanded={false}
                onRecentSeekerSelected={() => {}}
                onCheckBoxPress={() => {}}
                onDropDownPress={() => {}}
                seekersList={[]}
                selectedSeekers={[]}
            />
        ),
    )
    .add(
        'Show MultiSelectionDropDown when  isExpanded false and recent seekers list is not empty',
        () => (
            <MultiSelectionDropDown
                isExpanded={false}
                onRecentSeekerSelected={() => {}}
                onCheckBoxPress={() => {}}
                onDropDownPress={() => {}}
                seekersList={[
                    { id: 1, name: 'Hemadevi Peri' },
                    { id: 1, name: 'Sudharshan' },
                ]}
                selectedSeekers={[{ id: 1, name: 'Hemadevi Peri' }]}
            />
        ),
    )
    .add(
        'Show MultiSelectionDropDown when  isExpanded true and recent seekers list is empty',
        () => (
            <MultiSelectionDropDown
                isExpanded={true}
                onRecentSeekerSelected={() => {}}
                onCheckBoxPress={() => {}}
                onDropDownPress={() => {}}
                seekersList={[]}
                selectedSeekers={[]}
            />
        ),
    )
    .add(
        'Show MultiSelectionDropDown when  isExpanded true and recent seekers list is not empty',
        () => (
            <MultiSelectionDropDown
                isExpanded={true}
                onRecentSeekerSelected={() => {}}
                onCheckBoxPress={() => {}}
                onDropDownPress={() => {}}
                seekersList={[
                    { id: 1, name: 'Hemadevi Peri' },
                    { id: 1, name: 'Sudharshan' },
                ]}
                selectedSeekers={[{ id: 1, name: 'Hemadevi Peri' }]}
            />
        ),
    );
