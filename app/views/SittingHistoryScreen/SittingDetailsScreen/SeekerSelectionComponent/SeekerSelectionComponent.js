import React, { Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { View } from 'native-base';
import { TouchableOpacity, Image, ScrollView } from 'react-native';
import { MediumBoldText, Text } from '../../../shared/Text';
import { styles as SeekerSelectionComponentStyle } from './SeekerSelectionComponent.styles';
import SeekerSelectionComponentImages from './img';
import FilterForm from './FilterForm';
import SittingDetailsHeader from '../SittingDetailsHeader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Info as InfoIcon } from '../../../shared/Icon';
import {
    nameRegExp,
    internationalPhoneRegExp,
    specialCharactersRegExp,
} from '../../../../shared/Validations';
import { isNil } from 'lodash';

class SeekerSelectionComponent extends React.Component {
    _renderBarcodeScanButton = () => {
        const {
            t,
            onBarcodeScannerButtonPress,
            onBarcodeScannerInfoPress,
            images,
            styles,
        } = this.props;
        return (
            <View style={styles.barcodeScanButtonContainer}>
                <View style={styles.barcodeScanTitleView}>
                    <MediumBoldText testID="seekerSelectionComponent__addSeekersByScan--text">
                        {t('seekerSelectionComponent:addSeekersByScan')}
                    </MediumBoldText>
                    <TouchableOpacity onPress={onBarcodeScannerInfoPress}>
                        <InfoIcon style={styles.infoIcon} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.barcodeScanButtonStyle}
                    onPress={onBarcodeScannerButtonPress}
                    testID="seekerSelectionComponent__barcodeScan--touchableOpacity">
                    <Image style={styles.barcodeIcon} source={images.srcmId} testID="seekerSelectionComponent__barcode--image"/>
                    <MediumBoldText style={styles.barcodeScanButtonText} testID="seekerSelectionComponent__srcmId--text">
                        {t('seekerSelectionComponent:srcmId')}
                    </MediumBoldText>
                </TouchableOpacity>
            </View>
        );
    };

    _handleSubmitPress = (values, { resetForm }) => {
        const { onSearchButtonPress } = this.props;
        onSearchButtonPress(values);
    };

    _renderForm = formikProps => {
        const { values, handleChange, handleSubmit, errors } = formikProps;

        return (
            <View>
                <Fragment>
                    <FilterForm
                        values={values}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        errors={errors}
                    />
                </Fragment>
            </View>
        );
    };

    _getValidationSchema = () => {
        const { t } = this.props;
        return Yup.object().shape({
            name: Yup.object().shape({
                searchText: Yup.string().matches(
                    nameRegExp,
                    t('validations:invalidValue'),
                ),
            }),
            abhyasiId: Yup.object().shape({
                searchText: Yup.string()
                    .matches(
                        specialCharactersRegExp,
                        t('validations:invalidValue'),
                    )
                    .max(
                        255,
                        t('validations:maxAllowedCharacters', { max: 255 }),
                    ),
            }),
            phoneNo: Yup.object().shape({
                searchText: Yup.string().matches(
                    internationalPhoneRegExp,
                    t('validations:invalidMobileNo'),
                ),
            }),
            email: Yup.object().shape({
                searchText: Yup.string()
                    .email(t('validations:invalidEmail'))
                    .max(
                        255,
                        t('validations:maxAllowedCharacters', { max: 255 }),
                    ),
            }),
            city: Yup.object().shape({
                searchText: Yup.object().shape({
                    formattedAddress: Yup.string().max(
                        255,
                        t('validations:maxAllowedCharacters', { max: 255 }),
                    ),
                })
            }),
            errorMessage: Yup.string().when(
                ['name', 'abhyasiId', 'phoneNo', 'email', 'city'],
                {
                    is: (name, abhyasiId, phoneNo, email, city) =>
                        isNil(name.searchText) &&
                        isNil(abhyasiId.searchText) &&
                        isNil(phoneNo.searchText) &&
                        isNil(email.searchText) &&
                        isNil(city.searchText.formattedAddress),
                    then: Yup.string().required(
                        t('seekerSelectionComponent:formValidation'),
                    ),
                    otherwise: Yup.string(),
                },
            ),
        });
    };

    _renderFormikForm = () => {
        const { t } = this.props;

        return (
            <Formik
                children={this._renderForm}
                initialValues={{
                    name: {
                        id: 'NAME',
                        label: t('seekerSelectionComponent:name'),
                        searchText: '',
                    },
                    abhyasiId: {
                        id: 'ABHYASI_ID',
                        label: t('seekerSelectionComponent:abhyasiId'),
                        searchText: '',
                    },
                    phoneNo: {
                        id: 'PHONE_NO',
                        label: t('seekerSelectionComponent:phoneNo'),
                        searchText: '',
                    },
                    email: {
                        id: 'EMAIL',
                        label: t('seekerSelectionComponent:email'),
                        searchText: '',
                    },
                    city: {
                        id: 'CITY',
                        label: t('seekerSelectionComponent:city'),
                        searchText: '',
                    },
                }}
                onSubmit={this._handleSubmitPress}
                validationSchema={this._getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize
            />
        );
    };

    render() {
        const {
            t,
            onBackPress,
            onSelectedSeekersPress,
            selectedSeekersCount,
            styles,
        } = this.props;

        return (
            <View style={styles.containerView}>
                <SittingDetailsHeader
                    title={t('seekerSelectionComponent:addSeeker')}
                    onBackPress={onBackPress}
                    onSelectedSeekersPress={onSelectedSeekersPress}
                    selectedSeekersCount={selectedSeekersCount}
                    showRightIcon={true}
                />

                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.bodyContainer}>
                        {this._renderBarcodeScanButton()}

                        <View style={styles.searchOptionsContainer}>
                            <View style={styles.searchOptionsTitleView}>
                                <MediumBoldText testID="seekerSelectionComponent__searchSeekersBy--text">
                                    {t(
                                        'seekerSelectionComponent:searchSeekersBy',
                                    )}
                                </MediumBoldText>
                                <Text style={styles.atLeastOneLabel} testID="seekerSelectionComponent__atLeastOne--text">
                                    {t('seekerSelectionComponent:atLeastOne')}
                                </Text>
                            </View>
                            {this._renderFormikForm()}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        SeekerSelectionComponent,
        SeekerSelectionComponentStyle,
        SeekerSelectionComponentImages,
    ),
);
