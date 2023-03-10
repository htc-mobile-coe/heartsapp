import remoteConfig from '@react-native-firebase/remote-config';
import { isNil, isUndefined, isEmpty } from 'lodash';
import { recordException } from './CrashlyticsService';

let initializeRemoteConfig = false;
let initializationInProgress = false;

export const initialize = async () => {
    try {
        initializationInProgress = true;
        await remoteConfig().fetchAndActivate();
        initializeRemoteConfig = false;
    } catch (e) {
        initializeRemoteConfig = true;
        recordException(e);
    }

    initializationInProgress = false;
};

const getIntValue = (key, defaultValue) => {
    const value = getValue(key, defaultValue);

    if (typeof value === 'string') {
        return parseInt(value, 10);
    }

    return value;
};

const getBoolValue = (key, defaultValue) => {
    const value = getValue(key, defaultValue);

    return JSON.parse(value);
};

const getJSONValue = (key, defaultValue) => {
    const value = getValue(key, defaultValue);

    if (typeof value === 'string') {
        return JSON.parse(value);
    }

    return value;
};

const getValue = (key, defaultValue) => {
    try {
        if (initializationInProgress) {
            return defaultValue;
        }

        if (initializeRemoteConfig) {
            // For some reason, remoteConfig is not initialized.
            // Initializing remoteConfig here.
            this.initialize();
            return defaultValue;
        }

        const value = remoteConfig()
            .getValue(key)
            .asString();

        if (isNil(value) || isUndefined(value) || isEmpty(value)) {
            return defaultValue;
        }

        return value;
    } catch (e) {
        return defaultValue;
    }
};

export const getMasterClassScreenConfig = () => {
    return getJSONValue('master_classes', {
        languages: [{ label: 'English', value: 'en' }],
        en: {
            heading: 'Heartfulness Masterclasses with Daaji',
            masterClassesProgressSummary: {
                id: 'masterClassesProgressSummary',
                firebaseEvent: 'masterClassesProgressSummary',
                introToMasterClassesPoints: [
                    'Learn to manage your life and your emotions the Heartfulness way.',
                    'You will be introduced to 4 core Heartfulness Practices during these Masterclasses by Daaji -Global Guide of Heartfulness.',
                ],
                meetDaajiButtonTitle: 'Meet Daaji',
                infoAboutDaaji:
                    'Known to many as Daaji, Kamlesh D. Patel is the fourth guide in the Heartfulness tradition of meditation.',
                introAboutDaaji:
                    'Embracing the many roles of a modern-dayteacher, he has that rare capacity that allows him to dive deep into the centre of his existencein the heart, and simultaneously have a scientificapproach to original research in the field ofmeditation, spirituality and human evolution.',
            },
            introductionToMasterClasses: {
                id: 'introductionAboutMasterClasses',
                firebaseEvent: 'introduction',
                title: 'Get Started',
                videoThumbnailURL: 'intro_to_masterclass',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/help_videos/English/Updating%20Personal%20Information.mp4',
                description:
                    'In the Introductory sessions, Daaji shares his wisdom, knowledge, and experience as a lifelong student of meditation and spirituality. His approach is scientific and practical. There are 3 masterclasses, each one focusing on an essential element of Heartfulness practice.',
                continue: 'Continue',
                duration: '00:49 min',
                learnMore: 'Learn More...',
                continueButtonTitle: 'Continue',
                toastMessage:
                    'Please view the "Get Started" video to proceed forward',
                showLanguagePicker: false,
                videoInfoTitle: 'Introduction',
                videoInfoSubTitle: 'Get started',
            },
            day1: {
                id: 'day1',
                firebaseEvent: 'day1',
                day: 'Day 1 / 3',
                title: 'Relax',
                videoThumbnailURL: 'day1Video',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day01/MP4_480pMC_English_Day01.mp4',
                description:
                    'Today, you will be guided through Heartfulness Relaxation, a',
                highlightedDescription:
                    'technique that promotes physical and mental calm,',
                endDescription:
                    'before learning how to meditate on the source of light in the heart.',
                duration: '46:31 min',
                learnMore: 'Learn More...',
                continueButtonTitle: 'Continue',
                toastMessage:
                    'Please view the "Day 1" video to proceed forward',
                showLanguagePicker: true,
                learnMoreTitle: 'Day 1 Relax',
                learnMoreHeading: 'Heartfulness Relaxation',
                learnMoreContent:
                    'Read through these guided suggestions and try them on yourself or read them aloud to help guide others. This practice works best when you turn off your phone and other devices that might distract you. Relaxation can be done at any time and is especially useful before beginning Heartfulness Meditation.',
                learnMorePoints: [
                    {
                        point:
                            'Sit comfortably and close your eyes very softly and very gently.',
                    },
                    {
                        point:
                            'Begin with your toes. Wiggle your toes. Now feel them relax.',
                    },
                    {
                        point:
                            'Feel the healing energy of Mother Earth move up into your toes, feet and ankles. Then up to your knees, relaxing the lower legs.',
                    },
                    {
                        point:
                            'Feel the healing energy move further up your legs. Relax your thighs.',
                    },
                    {
                        point:
                            'Now, deeply relax your hips, lower body and waist.',
                    },
                    {
                        point:
                            'Relax your back. From your tailbone to your shoulders, feel your entire back relaxing.',
                    },
                    {
                        point:
                            'Relax your chest and shoulders. Feel your shoulders simply melting away',
                    },
                    {
                        point:
                            'Relax your upper arms. Relax each muscle in your forearms, your hands and right to your fingertips. Relax your neck muscles. Move your awareness up to your face.',
                    },
                    {
                        point:
                            'Relax your jaw, mouth, nose, eyes, earlobes, facial muscles, forehead ... all the way to the top of your head.',
                    },
                    {
                        point:
                            'Feel your whole body completely Heartfulness relaxed.',
                    },
                    {
                        point:
                            'Scan your system from top to toe, and if there is any part of your body that is still tense, painful or unwell, feel it being immersed in the healing energy of Mother Earth for a little while longer.',
                    },
                    {
                        point:
                            'When you are ready, move your attention to your heart. Rest there for a little while.',
                    },
                    {
                        point:
                            'Feel immersed in the love and light in your heart. Remain still and quiet, and slowly become absorbed within.',
                    },
                    {
                        point:
                            'Remain absorbed for as long as you want, until you feel ready to come out.',
                    },
                ],
                videoInfoTitle: '01',
                videoInfoSubTitle:
                    'Heartfulness relaxation followed by meditation',
                progressSummaryToastMessage:
                    'Please view the "Get Started" video to proceed forward',
            },
            day2: {
                id: 'day2',
                firebaseEvent: 'day2',
                day: 'Day 2 / 3',
                title: 'Rejuvenate',
                videoThumbnailURL: 'day2Video',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day02/MP4_480pMC_English_Day02.mp4',
                description:
                    'Today you will be introduced and guided through the',
                highlightedDescription: 'Heartfulness Cleaning technique,',
                endDescription:
                    'a simple rejuvenation method intended to cleanse the mind and to let go of stress and heavy thoughts and emotions.',
                duration: '44:30 min',
                learnMore: 'Learn More...',
                continueButtonTitle: 'Continue',
                toastMessage:
                    'Please view the "Day 2" video to proceed forward',
                showLanguagePicker: true,
                learnMoreTitle: 'Day 2 Rejuvenate',
                learnMoreHeading: 'Heartfulness Rejuvenate',
                learnMoreContent:
                    'Do the cleaning practice at the end of your day’s work, preferably not too close to bedtime. This process will rejuvenate you and purify your system of any accumulated heaviness. There are a few steps to the process, so in the beginning it is best to practice them in the following sequence: ',
                learnMorePoints: [
                    {
                        point:
                            'Sit in a comfortable position with the intention to remove all the impressions accumulated during the day.',
                    },
                    {
                        point:
                            'Close your eyes and relax. Imagine all the complexities and impurities are leaving your entire system.',
                    },
                    {
                        point:
                            'Let them flow out from your back in the form of smoke, from the area between your tailbone (at the base of your spine) and the top of your head.',
                    },
                    {
                        point:
                            'Try to remain a witness to your thoughts.  Gently accelerate this process with confidence and determination.If your attention drifts and other thoughts come to mind, gently bring your focus back to the cleaning. ',
                    },
                    {
                        point:
                            'As the impressions are leaving from your back you will start to feel lighter. Continue this process for up to twenty to twenty-five minutes. When you feel light within, you can start the second part of the process.',
                    },
                    {
                        point:
                            'Feel a current of purity coming from the Source entering your system from the front. This current is flowing into your heart and throughout your system, saturating every particle. You have now returned to a more balanced state.',
                    },
                    {
                        point:
                            'Every particle of your body is emanating lightness, purity, and simplicity. Finish with the conviction that the cleaning has been completed effectively.',
                    },
                ],
                videoInfoTitle: '02',
                videoInfoSubTitle:
                    'Heartfulness cleaning followed by meditation',
                progressSummaryToastMessage:
                    'To unlock "Day 2" please wait for8 hrs. after completing "Day 1"',
            },
            day3: {
                id: 'day3',
                firebaseEvent: 'day3',
                day: 'Day 3 / 3',
                title: 'Connect',
                videoThumbnailURL: 'day3Video',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day03/MP4_480pMC_English_Day03.mp4',
                description:
                    'In the third and final Masterclass, you will learn how heart-based meditation allows you to',
                highlightedDescription: 'connect with your innerself,',
                endDescription:
                    'observe your deepest feelings, and weave your own destiny.',
                duration: '32:52 min',
                learnMore: 'Learn More...',
                continueButtonTitle: 'Continue',
                toastMessage:
                    'Please view the "Day 3" video to proceed forward',
                showLanguagePicker: true,
                learnMoreTitle: 'Day 3 Connect',
                learnMoreHeading: 'Heartfulness Connect',
                learnMoreContent:
                    'This prayer is offered at bedtime, as a way of connecting to the Source before sleep. This may take around ten to fifteen minutes. It is also offered before meditation in the morning.At bedtime, sit comfortably, gently close your eyes, and relax. Silently and slowly repeat the words of the prayer below.',
                learnMorePoints: [
                    {
                        point:
                            'Meditate for ten to fifteen minutes over the true meaning, feeling the words resonate in your heart rather than trying to analyze them.',
                    },
                    {
                        point:
                            'Let the meaning surface from within. Try to get lost in it. Go beyond the words and let the feeling come to you. ',
                    },
                    {
                        point:
                            'O Master! Thou art the real goal of human life. We are yet but slaves of wishes putting bar to our advancement. Thou art the only God and Power to bring us up to that stage.',
                    },
                    {
                        point:
                            'Now silently repeat these words a second time and go even deeper into this feeling.',
                    },
                    {
                        point:
                            'Allow yourself to be absorbed in the feeling beyond the words. Allow yourself to melt in this prayerfully meditative state as you go to sleep.',
                    },
                    {
                        point:
                            'In the morning, reconnect yourself by silently offering this prayer once before you start the Heartfulness Meditation',
                    },
                ],
                videoInfoTitle: '03',
                videoInfoSubTitle: 'Heartfulness prayer followed by meditation',
                progressSummaryToastMessage:
                    'To unlock "Day 3" please waitfor 8 hrs. after completing "Day 2"',
            },
            infoTitle: 'Meditation Guidelines',
            infoHeading: 'Here’s how you do it',
            infoFirstSectionTitle: 'Before Meditation',
            infofirstSectionPoints: [
                { point: 'Sit in a peaceful place.' },
                { point: 'Turn off all the notifications on your phone.' },
                {
                    point:
                        'Ask your family & friends not to disturbyou for an hour.',
                },
                { point: 'Take a few deep breaths.' },
            ],
            infoSecondSectionTitle: 'After Meditation',
            infoSecondSectionPoints: [
                {
                    point:
                        'On completing meditation take a few minutesto observe and anchor the experience.',
                },
                {
                    point:
                        'Keep a notebook and pen nearby to note your experiences after each masterclass.',
                },
                {
                    point:
                        'Avoid rushing after you have completed the session.',
                },
            ],
        },
    });
};

export const getBasicPracticesConfig = () => {
    return getJSONValue('ng_basic_practices', {
        languages: [{ label: 'English', value: 'en' }],
        en: {
            heading: 'Daily Practices',
            relaxation: {
                id: 'RELAXATION',
                firebaseEvent: 'RELAX',
                titlePart2: 'Relaxation',
                previewImageURL: 'relaxation',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Relaxation/Heartfulness%20Relaxation_English.mp4',
                duration: '06:24 min',
            },
            meditation: {
                id: 'MEDITATION',
                firebaseEvent: 'MEDITATE',
                titlePart2: 'Meditation',
                previewImageURL: 'meditation',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Meditation/Heartfulness%20Meditation_English.mp4',
                duration: '22:57 min',
            },
            cleaning: {
                id: 'CLEANING',
                firebaseEvent: 'CLEANING',
                titlePart2: 'Cleaning',
                previewImageURL: 'cleaning',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Cleaning/Heartfulness%20Cleaning_English.mp4',
                duration: '23:04 min',
            },
            prayer: {
                id: 'PRAYER',
                firebaseEvent: 'PRAYER',
                titlePart2: 'Prayer',
                previewImageURL: 'prayer',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                duration: '03:56 min',
            },
        },
    });
};

export const getLifeStyleConfig = () => {
    return getJSONValue('ng_life_style_screen', {
        languages: [{ label: 'English', value: 'en' }],
        en: {
            heading: 'Life Style',
            introduction: {
                id: 'INTRODUCTION',
                titlePart2: 'Introduction',
                previewImageURL: 'introduction',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Relaxation/Heartfulness%20Relaxation_English.mp4',
                duration: '06:24 min',
                firebaseEvent: 'INTRODUCTION',
            },
            stressDetox: {
                id: 'STRESS_DETOX',
                titlePart2: 'Stress Detox',
                previewImageURL: 'stressDetox',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Meditation/Heartfulness%20Meditation_English.mp4',
                duration: '22:57 min',
                firebaseEvent: 'STRESS',
            },
            fearDetox: {
                id: 'FEAR_DETOX',
                titlePart2: 'Fear Detox',
                previewImageURL: 'fearDetox',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Cleaning/Heartfulness%20Cleaning_English.mp4',
                duration: '23:04 min',
                firebaseEvent: 'FEAR_DETOX',
            },
            angerDetox: {
                id: 'ANGER_DETOX',
                titlePart2: 'Anger Detox',
                previewImageURL: 'angerDetox',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                duration: '03:56 min',
                firebaseEvent: 'ANGER',
            },
            sleep: {
                id: 'SLEEP',
                titlePart2: 'Sleep',
                previewImageURL: 'sleep',
                videoURL:
                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                duration: '03:56 min',
                firebaseEvent: 'SLEEP',
            },
        },
    });
};

export const getPrivacyPolicy = () => {
    return getValue('policy', '');
};

export const getTermsAndConditions = () => {
    return getValue('terms', '');
};

export const getContactUsNumber = () => {
    return getValue('contact_us_number', '+916304119689');
};

export const getTollFreeNumber = () => {
    return getValue('toll_free_number', '1800123123789');
};

export const getWhatsapp = () => {
    return getValue('whatsapp', '+916304119689');
};

export const getHelpAndSupportEmailID = () => {
    return getValue('help_and_support_email_id', 'support@heartsapp.org');
};

export const getAccountInfoEmailID = () => {
    return getValue(
        'contact_for_getting_bank_details_for_donation',
        'info.accounts@sahajmarg.org',
    );
};

export const getMinimumSupportedVersion = () => {
    return getValue('minimum_supported_version', '2.1.9');
};

export const getTimeGapBetweenMasterClassesInSeconds = () => {
    return getIntValue(
        'time_gap_between_master_classes_in_seconds',
        8 * 60 * 60,
    );
};

export const getSeekerConnectWaitTime = () => {
    return getJSONValue('seeker_connect_wait_time', {
        valueInSeconds: 4 * 60,
        displayText: 'four minutes',
    });
};

export const getLocateScreenSource = () => {
    return getValue(
        'locate_screen_source',
        'https://heartspots.heartfulness.org/m',
    );
};
export const getLocateTrainerErrorHTMLContent = () => {
    return getValue(
        'locate_trainer_error_html_content',
        `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <title>Not found</title>
                        <style>
                            h1 {
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: 16px;
                                text-align: center;
                                padding: 30px 0 0 0;
                            }
                            p {
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: 16px;
                                text-align: center;
                                padding: 0 0 30px 0;
                            }
                        </style>
                        </head>
                        <body>
                        <div class="issue">
                        <h1>Currently Unavailable</h1>
                        <p>Something went wrong. Please check your connectivity</p>
                        </div>
                        </body>
                        </html>`,
    );
};
export const getMaxMeditationSessionDurationInSeconds = () => {
    return getIntValue('max_meditation_session_duration_in_seconds', 35 * 60);
};

export const getMicroDonationCurrencyConfig = () => {
    return getJSONValue(
        'micro_donation_currency_config',
        require('../../shared/Currency.json'),
    );
};

export const getSeekerOnlineMetricsConfig = () => {
    return getJSONValue('onlineMetrics', {
        noOfSeekersTakingSitting: 0,
        noOfSittingsCompleted: 6600,
        noOfSittingsCompletedLastUpdatedTimestamp: {
            nanos: 0,
            seconds: 1605764853,
        },
    });
};

export const getMaxNoOfRecommendedMeditationSessionsInTimePeriod = () => {
    return getIntValue(
        'max_no_of_recommended_meditation_sessions_in_time_period',
        3,
    );
};

export const getTimePeriodOfMaxRecommendedMeditationSessionsInDays = () => {
    return getIntValue(
        'time_period_of_max_recommended_meditation_sessions_in_days',
        7,
    );
};

export const getDonationID = () => {
    return getIntValue('donation_ID', 2);
};

export const restrictForeignCurrencyDonation = () => {
    return getBoolValue('restrict_foreign_currency_donation', true);
};

export const getWeeklyInspirationScreenSource = () => {
    return getValue(
        'weekly_inspiration_url',
        'https://heartfulnessmagazine.com/a-word-a-thought-a-question/m/',
    );
};
export const getWeeklyInspirationPublicationDay = () => {
    return getValue('weekly_inspiration_publishing_day', 'Thursday');
};
export const getWeeklyInspirationErrorHTMLContent = () => {
    return getValue(
        'weekly_inspiration_error_html_content',
        `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <title>Not found</title>
                        <style>
                            h1 {
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: 16px;
                                text-align: center;
                                padding: 30px 0 0 0;
                            }
                            p {
                                font-family: Arial, Helvetica, sans-serif;
                                font-size: 16px;
                                text-align: center;
                                padding: 0 0 30px 0;
                            }
                        </style>
                        </head>
                        <body>
                        <div class="issue">
                        <h1>Currently Unavailable</h1>
                        <p>Something went wrong. Please check your connectivity</p>
                        </div>
                        </body>
                        </html>`,
    );
};

export const getMeditationRemindersSettingsConfig = () => {
    return getJSONValue('meditation_reminders_settings', {
        isMorningMeditationReminderEnabled: true,
        morningMeditationTime: 21600,
        isEveningMeditationReminderEnabled: true,
        eveningCleaningTime: 68400,
        isReminderForNextSittingEnabled: true,
        nextSittingReminderIntervalInDays: 7,
    });
};

export const getMorningMeditationReminderNotificationContent = () => {
    return getJSONValue('morning_meditaion_reminder_notification_content', {
        languages: [{ label: 'English', value: 'en' }],
        en: {
            1: {
                id: '1',
                title: "It's time for Morning Meditation",
                description:
                    'Like a tree needs water and sunlight at every stage of its lifecycle, Heartfulness practices can nourish us at every stage of our journey if we practice them consistently',
            },
            2: {
                id: '2',
                title: "It's time for Morning Meditation",
                description:
                    'Willpower and interest are the key to success in meditation',
            },
            3: {
                id: '3',
                title: "It's time for Morning Meditation",
                description:
                    'Consistent meditation helps to achieve an internal state of calm',
            },
            4: {
                id: '4',
                title: "It's time for Morning Meditation",
                description:
                    'It only takes 2-5 minutes of regular meditation to achieve a state of inner peace',
            },
            5: {
                id: '5',
                title: "It's time for Morning Meditation",
                description:
                    'A consistent meditation practice supports mental, emotional, and physical wellness',
            },
            6: {
                id: '6',
                title: "It's time for Morning Meditation",
                description: 'Feeling stressed? Pause and meditate',
            },
            7: {
                id: '7',
                title: "It's time for Morning Meditation",
                description:
                    'Heartfulness Meditation increases the intuitive strength of the heart',
            },
            8: {
                id: '8',
                title: "It's time for Morning Meditation",
                description:
                    'The more we meditate, the longer we carry that deep meditative state throughout our day, even with our eyes open!',
            },
            9: {
                id: '9',
                title: "It's time for Morning Meditation",
                description:
                    'A consistent meditation practice sharpens focus, increases clarity, and refines intellect',
            },
            10: {
                id: '10',
                title: "It's time for Morning Meditation",
                description:
                    'We must make intuitive choices that enable us to meet and fulfill our deepest capacities',
            },
            11: {
                id: '11',
                title: "It's time for Morning Meditation",
                description: 'Fall in love with yourself through meditation',
            },
            12: {
                id: '12',
                title: "It's time for Morning Meditation",
                description:
                    'A meditative practice and a conscious lifestyle go hand in hand',
            },
            13: {
                id: '13',
                title: "It's time for Morning Meditation",
                description:
                    'Pause. Are you meditating on your bed? Move to a separate chair or spot on the floor',
            },
            14: {
                id: '14',
                title: "It's time for Morning Meditation",
                description:
                    'One should strive to carry deep meditative state all the time',
            },
            15: {
                id: '15',
                title: "It's time for Morning Meditation",
                description:
                    'Daily practise increases greater levels of relaxation, calm, emotional maturity and focus',
            },
            16: {
                id: '16',
                title: "It's time for Morning Meditation",
                description: 'Increase mental regulation with daily practise',
            },
            17: {
                id: '17',
                title: "It's time for Morning Meditation",
                description:
                    'Peace of mind, joyfulness,lightness, subtlety, expansion of consciousness, egoless-ness, humility, simplicity, purity, a sense of liberation can be synonyms for meditation',
            },
            18: {
                id: '18',
                title: "It's time for Morning Meditation",
                description:
                    'Refine your intellect and identity with everyday meditation',
            },
            19: {
                id: '19',
                title: "It's time for Morning Meditation",
                description:
                    'Embark upon a new life of balance, excellence and higher aspiration with meditation',
            },
            20: {
                id: '20',
                title: "It's time for Morning Meditation",
                description:
                    'Meditation on heart is all about falling in love with yourself',
            },
            21: {
                id: '21',
                title: "It's time for Morning Meditation",
                description:
                    'Your willingness is the only requirement to benefit from Heartfulness based meditation',
            },
            22: {
                id: '22',
                title: "It's time for Morning Meditation",
                description:
                    'It is good to have a doubt.Why dont you experience meditation yourself',
            },
            23: {
                id: '23',
                title: "It's time for Morning Meditation",
                description: 'Meditation is a tool for self improvement',
            },
            24: {
                id: '24',
                title: "It's time for Morning Meditation",
                description:
                    'A conscious lifestyle and positive regenerative values will complement a meditative practice',
            },
            25: {
                id: '25',
                title: "It's time for Morning Meditation",
                description:
                    'Willingness is a key to success in meditation like any other endevour',
            },
        },
    });
};

export const getEveningCleaningReminderNotificationContent = () => {
    return getJSONValue('evening_cleaning_reminder_notification_content', {
        languages: [{ label: 'English', value: 'en' }],
        en: {
            1: {
                id: '1',
                title: "It's time for Evening Cleaning",
                description:
                    'Like a tree needs water and sunlight at every stage of its lifecycle, Heartfulness practices can nourish us at every stage of our journey if we practice them consistently',
            },
            2: {
                id: '2',
                title: "It's time for Evening Cleaning",
                description:
                    'Feeling anxious? Close your eyes and let that anxiousness leave your body',
            },
            3: {
                id: '3',
                title: "It's time for Evening Cleaning",
                description:
                    'Feeling frustrated? Try five minutes of Heartfulness Cleaning. Imagine that frustration leaving your body like smoke',
            },
            4: {
                id: '4',
                title: "It's time for Evening Cleaning",
                description:
                    'Are you cleaning at bedtime? Try cleaning before sunset',
            },
            5: {
                id: '5',
                title: "It's time for Evening Cleaning",
                description:
                    'The more you connect with the light within, the more that light will shine upon others',
            },
        },
    });
};

export const getMeditateWithTrainerReminderNotificationContent = () => {
    return getJSONValue('meditate_with_trainer_reminder_notification_content', {
        languages: [{ label: 'English', value: 'en' }],
        en: {
            1: {
                id: '1',
                title: "It's time for Meditate with Trainer",
                description:
                    'Transmission from trainer can induce relaxed state of body and mind',
            },
            2: {
                id: '2',
                title: "It's time for Meditate with Trainer",
                description:
                    'Transmission from trainer can be felt as a vibration in the heart',
            },
            3: {
                id: '3',
                title: "It's time for Meditate with Trainer",
                description:
                    'Transmission based Meditation can decrease stress and induce relaxed state of body and mind quickly',
            },
            4: {
                id: '4',
                title: "It's time for Meditate with Trainer",
                description:
                    'Meditation with Transmission,expands your consciousness and relaxes your body',
            },
            5: {
                id: '5',
                title: "It's time for Meditate with Trainer",
                description:
                    'Meditation with Transmission heightens your awareness and perception',
            },
            6: {
                id: '6',
                title: "It's time for Meditate with Trainer",
                description:
                    'Meditation with Transmission takes you into wakeful deep sleep experience',
            },
        },
    });
};

export const getMasterClassReminderNotificationContent = () => {
    return getJSONValue('master_class_reminder_notification_content', {
        languages: [{ label: 'English', value: 'en' }],
        en: {
            day1: {
                id: 'day1',
                title: 'Masterclasses - Day 2',
                description:
                    'A guided session to teach you how to detox your mind and help you let go of stress and complex emotions',
            },
            day2: {
                id: 'day2',
                title: 'Masterclasses - Day 3',
                description:
                    'A guided session to help you learn to connect with your inner self and weave your own destiny',
            },
        },
    });
};

export const whatsNewPopupConfig = () => {
    return getJSONValue('version_update', {
        languages: [{ label: 'English', value: 'en' }],
        en: {
            appStore: {
                latestVersionNumber: 'v-3.9.10',
                url:
                    'https://apps.apple.com/us/app/heartsapp-by-heartfulness/id1438627629',

                description: [
                    {
                        point: '1. Guided steps for onboarding new users',
                    },
                    {
                        point: '2. Enriched home screen ',
                    },
                    {
                        point: '3. Provision for exiting meditation',
                    },
                    {
                        point: '4. Reminder for meditation and guided practice',
                    },
                    {
                        point: '5. Other Bug fixes',
                    },
                    {
                        point: '6. Backend fixes',
                    },
                ],
            },
            playStore: {
                latestVersionNumber: 'v-3.9.6',
                url:
                    'https://play.google.com/store/apps/details?id=com.hfn.unified&hl=en_IN&gl=US',
                description: [
                    {
                        point: '1. Guided steps for onboarding new users',
                    },
                    {
                        point: '2. Enriched home screen ',
                    },
                    {
                        point: '3. Provision for exiting meditation',
                    },
                    {
                        point: '4. Reminder for meditation and guided practice',
                    },
                    {
                        point: '5. Other Bug fixes',
                    },
                ],
            },
        },
    });
};

export const getRecurringDonationSource = () => {
    return getValue(
        'recurring_donation_source',
        'https://donations.heartfulness.org/everydropcounts-mobile/',
    );
};

export const getTrainersSectionSource = () => {
    return getValue(
        'trainers_section_source',
        'https://my.heartfulness.org/embedded',
    );
};

export const getTrainersSectionEventsTrackerSource = () => {
    return getValue('trainers_event_source', 'https://events-tracker.web.app/');
};
export const getDonationURL = () => {
    return getValue('donation_url', 'https://donations.heartfulness.org/');
};
export const getOfflineSeekerSearchLimit = () => {
    return getIntValue('offline_seeker_search_limit', 10);
};

export const getOfflineSeekerSearchRestrictionInSeconds = () => {
    return getIntValue('offline_seeker_search_restriction_in_seconds', 15 * 60);
};

export const getHeartInTuneAppDownloadPopupConfig = () => {
    return getValue(
        'heart_in_tune_app_download_popup',
        'https://heartfulness.app.link/migrate-to-hfnapp',
    );
};
