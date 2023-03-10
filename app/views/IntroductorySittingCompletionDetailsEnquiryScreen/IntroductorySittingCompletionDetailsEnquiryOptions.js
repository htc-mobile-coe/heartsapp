import i18n from 'i18next';
import { MASTERCLASS_VIDEOS } from 'app/shared/Constants';

export const IntroductorySittingDaysCompletionEnquiryOptions = [
    {
        id: MASTERCLASS_VIDEOS.DAY1,
        label: i18n.t(
            'introductorySittingCompletionDetailsEnquiryScreen:firstDay',
        ),
    },
    {
        id: MASTERCLASS_VIDEOS.DAY2,
        label: i18n.t(
            'introductorySittingCompletionDetailsEnquiryScreen:twoDays',
        ),
    },
    {
        id: MASTERCLASS_VIDEOS.DAY3,
        label: i18n.t(
            'introductorySittingCompletionDetailsEnquiryScreen:threeDays',
        ),
    },
];

export const ApproximateIntroductorySittingCompletionTimeOptions = [
    {
        id: 1,
        monthOfCompletion: 1,
        label: i18n.t(
            'introductorySittingCompletionDetailsEnquiryScreen:withinOneMonth',
        ),
    },
    {
        id: 2,
        monthOfCompletion: 3,
        label: i18n.t(
            'introductorySittingCompletionDetailsEnquiryScreen:withinThreeMonths',
        ),
    },
    {
        id: 3,
        monthOfCompletion: 6,
        label: i18n.t(
            'introductorySittingCompletionDetailsEnquiryScreen:withinSixMonths',
        ),
    },
    {
        id: 4,
        monthOfCompletion: 12,
        label: i18n.t(
            'introductorySittingCompletionDetailsEnquiryScreen:withinAYear',
        ),
    },
    {
        id: 5,
        monthOfCompletion: 13,
        label: i18n.t(
            'introductorySittingCompletionDetailsEnquiryScreen:overAYear',
        ),
    },
];
