import React from 'react';
import { storiesOf } from '@storybook/react-native';
import PaymentScreen from './PaymentScreen';

storiesOf('Payment Screen', module)
    .add('Payment Gateway', () => (
        <PaymentScreen
            url={'https://google.in'}
            isPaymentInProgress={true}
            isPaymentSuccess={false}
            onActivityIndicatorVisibilityChange={() => {}}
            transactionMessage={'Receipt sent to your email wwwww@gmaa.com'}
            transactionTitle={'Thanks you'}
        />
    ))
    .add('Success Screen', () => (
        <PaymentScreen
            isPaymentInProgress={false}
            isPaymentSuccess={true}
            onActivityIndicatorVisibilityChange={() => {}}
            transactionMessage={'Receipt sent to your email wwwww@gmaa.com'}
            transactionTitle={'Thanks you'}
        />
    ))
    .add('Failed Screen', () => (
        <PaymentScreen
            isPaymentInProgress={false}
            isPaymentSuccess={false}
            onActivityIndicatorVisibilityChange={() => {}}
            transactionMessage={
                "Can't complete payment. Any amount deducted will be refunded in 3-5 bussiness days"
            }
        />
    ));
