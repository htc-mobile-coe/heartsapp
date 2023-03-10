import {
    initialize,
    getMaxNoOfRecommendedMeditationSessionsInTimePeriod,
    getTimePeriodOfMaxRecommendedMeditationSessionsInDays,
    getSeekerOnlineMetricsConfig,
    getDonationID,
    getAccountInfoEmailID,
    restrictForeignCurrencyDonation,
    getWeeklyInspirationScreenSource,
    getWeeklyInspirationErrorHTMLContent,
    getMorningMeditationReminderNotificationContent,
    getEveningCleaningReminderNotificationContent,
    getMeditateWithTrainerReminderNotificationContent,
    getMeditationRemindersSettingsConfig,
    getMasterClassScreenConfig,
    getLifeStyleConfig,
    getMasterClassReminderNotificationContent,
    whatsNewPopupConfig,
    getWeeklyInspirationPublicationDay,
    getBasicPracticesConfig,
    getLocateScreenSource,
    getRecurringDonationSource,
    getTrainersSectionSource,
    getTrainersSectionEventsTrackerSource,
    getDonationURL,
    getOfflineSeekerSearchLimit,
    getOfflineSeekerSearchRestrictionInSeconds,
    getWhatsapp,
    getHeartInTuneAppDownloadPopupConfig,
} from './RemoteConfigService';
import remoteConfig from '@react-native-firebase/remote-config';

describe('RemoteConfigService', () => {
    beforeAll(async () => {
        await initialize();
    });

    describe('#getMaxNoOfRecommendedMeditationSessionsInTimePeriod', () => {
        it('should return default value if nothing is set in remote config', () => {
            expect(
                getMaxNoOfRecommendedMeditationSessionsInTimePeriod(),
            ).toEqual(3);
        });

        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce('12');
            expect(
                getMaxNoOfRecommendedMeditationSessionsInTimePeriod(),
            ).toEqual(12);
        });
    });

    describe('#getTimePeriodOfMaxRecommendedMeditationSessionsInDays', () => {
        it('should return default value if nothing is set in remote config', () => {
            expect(
                getTimePeriodOfMaxRecommendedMeditationSessionsInDays(),
            ).toEqual(7);
        });

        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce('12');
            expect(
                getTimePeriodOfMaxRecommendedMeditationSessionsInDays(),
            ).toEqual(12);
        });
    });

    describe('#getSeekerOnlineMetricsConfig', () => {
        it('should return default value if nothing is set in remote config', () => {
            expect(getSeekerOnlineMetricsConfig()).toEqual({
                noOfSeekersTakingSitting: 0,
                noOfSittingsCompleted: 6600,
                noOfSittingsCompletedLastUpdatedTimestamp: {
                    nanos: 0,
                    seconds: 1605764853,
                },
            });
        });

        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        noOfSeekersTakingSitting: 1,
                        noOfSittingsCompleted: 6700,
                        noOfSittingsCompletedLastUpdatedTimestamp: {
                            nanos: 100,
                            seconds: 12345,
                        },
                    }),
                );
            expect(getSeekerOnlineMetricsConfig()).toEqual({
                noOfSeekersTakingSitting: 1,
                noOfSittingsCompleted: 6700,
                noOfSittingsCompletedLastUpdatedTimestamp: {
                    nanos: 100,
                    seconds: 12345,
                },
            });
        });
    });

    describe('#getDonationID', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce('2');
            expect(getDonationID()).toEqual(2);
        });
    });

    describe('#getAccountInfoEmailID', () => {
        const email = 'info.accounts@sahajmarg.org';
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(email);
            expect(getAccountInfoEmailID()).toEqual(email);
        });
    });

    describe('#getWhatsapp', () => {
        const whatsapp = '+916304119689';
        it('should return value get in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(whatsapp);
            expect(getWhatsapp()).toEqual(whatsapp);
        });
    });

    describe('#restrictForeignCurrencyDonation ', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(true);
            expect(restrictForeignCurrencyDonation()).toEqual(true);
        });
    });

    describe('#getWeeklyInspirationScreenSource', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    'https://heartspots.heartfulness.org/',
                );
            expect(getWeeklyInspirationScreenSource()).toEqual(
                'https://heartspots.heartfulness.org/',
            );
        });
    });

    describe('#getWeeklyInspirationPublicationDay', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce('Thursday');
            expect(getWeeklyInspirationPublicationDay()).toEqual('Thursday');
        });
    });
    describe('#getWeeklyInspirationErrorHTMLContent', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce('<div ></div>');
            expect(getWeeklyInspirationErrorHTMLContent()).toEqual(
                '<div ></div>',
            );
        });
    });
    describe('#getMorningMeditationReminderNotificationContent', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getMorningMeditationReminderNotificationContent()).toEqual({
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
                        description:
                            'Fall in love with yourself through meditation',
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
                        description:
                            'Increase mental regulation with daily practise',
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
                        description:
                            'Meditation is a tool for self improvement',
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
                languages: [{ label: 'English', value: 'en' }],
            });
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        en: {
                            1: {
                                id: '1',
                                title: "It's time for Morning Meditation",
                                description: 'Good Morning',
                            },
                            2: {
                                id: '2',
                                title: "It's time for Morning Meditation",
                                description: 'Have a nice day',
                            },
                            3: {
                                id: '3',
                                title: "It's time for Morning Meditation",
                                description:
                                    'Brilliant things happen in calm minds',
                            },
                        },
                    }),
                );
            expect(getMorningMeditationReminderNotificationContent()).toEqual({
                en: {
                    1: {
                        id: '1',
                        title: "It's time for Morning Meditation",
                        description: 'Good Morning',
                    },
                    2: {
                        id: '2',
                        title: "It's time for Morning Meditation",
                        description: 'Have a nice day',
                    },
                    3: {
                        id: '3',
                        title: "It's time for Morning Meditation",
                        description: 'Brilliant things happen in calm minds',
                    },
                },
            });
        });
    });

    describe('#getEveningCleaningReminderNotificationContent', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getEveningCleaningReminderNotificationContent()).toEqual({
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
                languages: [{ label: 'English', value: 'en' }],
            });
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        en: {
                            1: {
                                id: '1',
                                title: "It's time for Evening Cleaning",
                                description: 'Good Evening',
                            },
                            2: {
                                id: '2',
                                title: "It's time for Evening Cleaning",
                                description:
                                    'Brilliant things happen in calm minds',
                            },
                            3: {
                                id: '3',
                                title: "It's time for Evening Cleaning",
                                description: 'Positive Thoughts',
                            },
                        },
                        languages: [{ label: 'English', value: 'en' }],
                    }),
                );
            expect(getEveningCleaningReminderNotificationContent()).toEqual({
                en: {
                    1: {
                        id: '1',
                        title: "It's time for Evening Cleaning",
                        description: 'Good Evening',
                    },
                    2: {
                        id: '2',
                        title: "It's time for Evening Cleaning",
                        description: 'Brilliant things happen in calm minds',
                    },
                    3: {
                        id: '3',
                        title: "It's time for Evening Cleaning",
                        description: 'Positive Thoughts',
                    },
                },
                languages: [{ label: 'English', value: 'en' }],
            });
        });
    });

    describe('#getMeditateWithTrainerReminderNotificationContent', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getMeditateWithTrainerReminderNotificationContent()).toEqual(
                {
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
                    languages: [{ label: 'English', value: 'en' }],
                },
            );
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        en: {
                            1: {
                                id: '1',
                                title: "It's time for Meditate with Trainer",
                                description: 'Have a nice day',
                            },
                            2: {
                                id: '2',
                                title: "It's time for Meditate with Trainer",
                                description:
                                    'Brilliant things happen in calm minds',
                            },
                            3: {
                                id: '3',
                                title: "It's time for Meditate with Trainer",
                                description: 'Positive Thoughts',
                            },
                        },
                        languages: [{ label: 'English', value: 'en' }],
                    }),
                );
            expect(getMeditateWithTrainerReminderNotificationContent()).toEqual(
                {
                    en: {
                        1: {
                            id: '1',
                            title: "It's time for Meditate with Trainer",
                            description: 'Have a nice day',
                        },
                        2: {
                            id: '2',
                            title: "It's time for Meditate with Trainer",
                            description:
                                'Brilliant things happen in calm minds',
                        },
                        3: {
                            id: '3',
                            title: "It's time for Meditate with Trainer",
                            description: 'Positive Thoughts',
                        },
                    },
                    languages: [{ label: 'English', value: 'en' }],
                },
            );
        });
    });

    describe('#getMeditationRemindersSettingsConfig', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getMeditationRemindersSettingsConfig()).toEqual({
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 68400,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 7,
            });
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        isMorningMeditationReminderEnabled: true,
                        morningMeditationTime: 21600,
                        isEveningMeditationReminderEnabled: true,
                        eveningCleaningTime: 68400,
                        isReminderForNextSittingEnabled: true,
                        nextSittingReminderIntervalInDays: 7,
                    }),
                );
            expect(getMeditationRemindersSettingsConfig()).toEqual({
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 68400,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 7,
            });
        });
    });

    describe('#getMasterClassScreenConfig', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getMasterClassScreenConfig()).toEqual({
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
                        highlightedDescription:
                            'Heartfulness Cleaning technique,',
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
                        videoInfoSubTitle:
                            'Heartfulness prayer followed by meditation',
                        progressSummaryToastMessage:
                            'To unlock "Day 3" please waitfor 8 hrs. after completing "Day 2"',
                    },
                    infoTitle: 'Meditation Guidelines',
                    infoHeading: 'Here’s how you do it',
                    infoFirstSectionTitle: 'Before Meditation',
                    infofirstSectionPoints: [
                        { point: 'Sit in a peaceful place.' },
                        {
                            point:
                                'Turn off all the notifications on your phone.',
                        },
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
                languages: [{ label: 'English', value: 'en' }],
            });
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        en: {
                            heading: 'Heartfulness Masterclasses with Daaji',
                            aboutHeartfulness: {
                                id: 'INTRO_TO_HEARTFULNESS',
                                titlePart2: 'About Heartfulness',
                                previewImageURL: 'intro_to_heartfulness',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Intro_To_Heartfulness/About%20Heartfulness.mp4',
                            },
                            introductionToMasterClasses: {
                                id: 'introductionAboutMasterClasses',
                                titlePart2: 'Introduction',
                                previewImageURL: 'intro_to_masterclass',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/help_videos/English/Updating%20Personal%20Information.mp4',
                                description:
                                    'In this video, Daaji, the global guide of Heartfulness, introduces viewers to the four techniques of the Heartfulness practice and to transmission, the energy unique to Heartfulness.',
                                continue: 'Continue',
                            },
                            day1: {
                                id: 'day1',
                                titlePart1: 'Day 1',
                                titlePart2: 'Relax',
                                previewImageURL: 'day1Video',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day01/MP4_480pMC_English_Day01.mp4',
                                description:
                                    'In this first masterclass, you will be guided through Heartfulness Relaxation, a technique that promotes physical and mental calm, before learning how to meditate on the source of light in the heart.',
                            },
                            day2: {
                                id: 'day2',
                                titlePart1: 'Day 2',
                                titlePart2: 'Rejuvenate',
                                previewImageURL: 'day2Video',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day02/MP4_480pMC_English_Day02.mp4',
                                description:
                                    'In this second masterclass, Daaji will intriduce and guide you through the Heartfulness Cleaning technique, a simple rejuvenation method intended to cleanse the mind and to let go of stress and heavy thoughts and emotions',
                            },
                            day3: {
                                id: 'day3',
                                titlePart1: 'Day 3',
                                titlePart2: 'Connect',
                                previewImageURL: 'day3Video',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day03/MP4_480pMC_English_Day03.mp4',
                                description:
                                    'In the third and final masterclass, you will learn how heart-based meditation allows you to connect with your innermost self, observe your deepest feelings, and weave your own destiny.',
                            },
                            infoTitle: 'Meditation Guidelines',
                            infoHeading: 'Here’s how you do it',
                            infoFirstSectionTitle: 'Before Meditation',
                            infofirstSectionPoints: [
                                { point: 'Sit in a peaceful place.' },
                                {
                                    point:
                                        'Turn off all the notifications on your phone.',
                                },
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
                    }),
                );
            expect(getMasterClassScreenConfig()).toEqual({
                en: {
                    heading: 'Heartfulness Masterclasses with Daaji',
                    aboutHeartfulness: {
                        id: 'INTRO_TO_HEARTFULNESS',
                        titlePart2: 'About Heartfulness',
                        previewImageURL: 'intro_to_heartfulness',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Intro_To_Heartfulness/About%20Heartfulness.mp4',
                    },
                    introductionToMasterClasses: {
                        id: 'introductionAboutMasterClasses',
                        titlePart2: 'Introduction',
                        previewImageURL: 'intro_to_masterclass',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/help_videos/English/Updating%20Personal%20Information.mp4',
                        description:
                            'In this video, Daaji, the global guide of Heartfulness, introduces viewers to the four techniques of the Heartfulness practice and to transmission, the energy unique to Heartfulness.',
                        continue: 'Continue',
                    },
                    day1: {
                        id: 'day1',
                        titlePart1: 'Day 1',
                        titlePart2: 'Relax',
                        previewImageURL: 'day1Video',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day01/MP4_480pMC_English_Day01.mp4',
                        description:
                            'In this first masterclass, you will be guided through Heartfulness Relaxation, a technique that promotes physical and mental calm, before learning how to meditate on the source of light in the heart.',
                    },
                    day2: {
                        id: 'day2',
                        titlePart1: 'Day 2',
                        titlePart2: 'Rejuvenate',
                        previewImageURL: 'day2Video',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day02/MP4_480pMC_English_Day02.mp4',
                        description:
                            'In this second masterclass, Daaji will intriduce and guide you through the Heartfulness Cleaning technique, a simple rejuvenation method intended to cleanse the mind and to let go of stress and heavy thoughts and emotions',
                    },
                    day3: {
                        id: 'day3',
                        titlePart1: 'Day 3',
                        titlePart2: 'Connect',
                        previewImageURL: 'day3Video',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Master_Classes/English/Day03/MP4_480pMC_English_Day03.mp4',
                        description:
                            'In the third and final masterclass, you will learn how heart-based meditation allows you to connect with your innermost self, observe your deepest feelings, and weave your own destiny.',
                    },
                    infoTitle: 'Meditation Guidelines',
                    infoHeading: 'Here’s how you do it',
                    infoFirstSectionTitle: 'Before Meditation',
                    infofirstSectionPoints: [
                        { point: 'Sit in a peaceful place.' },
                        {
                            point:
                                'Turn off all the notifications on your phone.',
                        },
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
        });
    });
    describe('#getLifeStyleConfig', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getLifeStyleConfig()).toEqual({
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
                languages: [{ label: 'English', value: 'en' }],
            });
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        en: {
                            heading: 'Life Style',
                            introduction: {
                                id: 'INTRODUCTION',
                                titlePart2: 'Introduction',
                                previewImageURL: 'introduction',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Relaxation/Heartfulness%20Relaxation_English.mp4',
                                duration: '06:24 min',
                            },
                            stressDetox: {
                                id: 'STRESS_DETOX',
                                titlePart2: 'Stress Detox',
                                previewImageURL: 'stressDetox',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Meditation/Heartfulness%20Meditation_English.mp4',
                                duration: '22:57 min',
                            },
                            fearDetox: {
                                id: 'FEAR_DETOX',
                                titlePart2: 'Fear Detox',
                                previewImageURL: 'fearDetox',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Cleaning/Heartfulness%20Cleaning_English.mp4',
                                duration: '23:04 min',
                            },
                            angerDetox: {
                                id: 'ANGER_DETOX',
                                titlePart2: 'Anger Detox',
                                previewImageURL: 'angerDetox',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                                duration: '03:56 min',
                            },
                            sleep: {
                                id: 'SLEEP',
                                titlePart2: 'Sleep',
                                previewImageURL: 'sleep',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                                duration: '03:56 min',
                            },
                        },
                    }),
                );
            expect(getLifeStyleConfig()).toEqual({
                en: {
                    heading: 'Life Style',
                    introduction: {
                        id: 'INTRODUCTION',
                        titlePart2: 'Introduction',
                        previewImageURL: 'introduction',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Relaxation/Heartfulness%20Relaxation_English.mp4',
                        duration: '06:24 min',
                    },
                    stressDetox: {
                        id: 'STRESS_DETOX',
                        titlePart2: 'Stress Detox',
                        previewImageURL: 'stressDetox',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Meditation/Heartfulness%20Meditation_English.mp4',
                        duration: '22:57 min',
                    },
                    fearDetox: {
                        id: 'FEAR_DETOX',
                        titlePart2: 'Fear Detox',
                        previewImageURL: 'fearDetox',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Cleaning/Heartfulness%20Cleaning_English.mp4',
                        duration: '23:04 min',
                    },
                    angerDetox: {
                        id: 'ANGER_DETOX',
                        titlePart2: 'Anger Detox',
                        previewImageURL: 'angerDetox',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                        duration: '03:56 min',
                    },
                    sleep: {
                        id: 'SLEEP',
                        titlePart2: 'Sleep',
                        previewImageURL: 'sleep',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                        duration: '03:56 min',
                    },
                },
            });
        });
    });
    describe('#getBasicPracticesConfig', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getBasicPracticesConfig()).toEqual({
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
                languages: [{ label: 'English', value: 'en' }],
            });
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        en: {
                            heading: 'Guided Practices',
                            relaxation: {
                                id: 'RELAXATION',
                                titlePart2: 'Relaxation',
                                previewImageURL: 'relaxation',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Relaxation/Heartfulness%20Relaxation_English.mp4',
                                duration: '06:24 min',
                            },
                            meditation: {
                                id: 'MEDITATION',
                                titlePart2: 'Meditation',
                                previewImageURL: 'meditation',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Meditation/Heartfulness%20Meditation_English.mp4',
                                duration: '22:57 min',
                            },
                            cleaning: {
                                id: 'CLEANING',
                                titlePart2: 'Cleaning',
                                previewImageURL: 'cleaning',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Cleaning/Heartfulness%20Cleaning_English.mp4',
                                duration: '23:04 min',
                            },
                            prayer: {
                                id: 'PRAYER',
                                titlePart2: 'Prayer',
                                previewImageURL: 'prayer',
                                videoURL:
                                    'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                                duration: '03:56 min',
                            },
                        },
                    }),
                );
            expect(getBasicPracticesConfig()).toEqual({
                en: {
                    heading: 'Guided Practices',
                    relaxation: {
                        id: 'RELAXATION',
                        titlePart2: 'Relaxation',
                        previewImageURL: 'relaxation',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Relaxation/Heartfulness%20Relaxation_English.mp4',
                        duration: '06:24 min',
                    },
                    meditation: {
                        id: 'MEDITATION',
                        titlePart2: 'Meditation',
                        previewImageURL: 'meditation',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Meditation/Heartfulness%20Meditation_English.mp4',
                        duration: '22:57 min',
                    },
                    cleaning: {
                        id: 'CLEANING',
                        titlePart2: 'Cleaning',
                        previewImageURL: 'cleaning',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Cleaning/Heartfulness%20Cleaning_English.mp4',
                        duration: '23:04 min',
                    },
                    prayer: {
                        id: 'PRAYER',
                        titlePart2: 'Prayer',
                        previewImageURL: 'prayer',
                        videoURL:
                            'https://storage.googleapis.com/content-service-prod-storage/static/Videos/Basic_Practices/English/Prayer/Guided%20Heartfulness%20Prayer.mp4',
                        duration: '03:56 min',
                    },
                },
            });
        });
    });
    describe('#getMasterClassReminderNotificationContent', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getMasterClassReminderNotificationContent()).toEqual({
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
                languages: [{ label: 'English', value: 'en' }],
            });
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        en: {
                            day1: {
                                id: 'day1',
                                title: 'Masterclasses: Day 2',
                                description:
                                    'This session to teach you how to detox your mind and help you let go of stress and complex emotions',
                            },
                            day2: {
                                id: 'day2',
                                title: 'Masterclasses: Day 3',
                                description:
                                    'This session to help you learn to connect with your inner self and weave your own destiny',
                            },
                        },
                        languages: [{ label: 'English', value: 'en' }],
                    }),
                );
            expect(getMasterClassReminderNotificationContent()).toEqual({
                en: {
                    day1: {
                        id: 'day1',
                        title: 'Masterclasses: Day 2',
                        description:
                            'This session to teach you how to detox your mind and help you let go of stress and complex emotions',
                    },
                    day2: {
                        id: 'day2',
                        title: 'Masterclasses: Day 3',
                        description:
                            'This session to help you learn to connect with your inner self and weave your own destiny',
                    },
                },
                languages: [{ label: 'English', value: 'en' }],
            });
        });
    });
    describe('#getLocateScreenSource', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    'https://heartspots.heartfulness.org/m',
                );
            expect(getLocateScreenSource()).toEqual(
                'https://heartspots.heartfulness.org/m',
            );
        });
    });

    describe('#whatsNewPopupConfig', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(whatsNewPopupConfig()).toEqual({
                en: {
                    appStore: {
                        latestVersionNumber: 'v-3.9.10',
                        url:
                            'https://apps.apple.com/us/app/heartsapp-by-heartfulness/id1438627629',
                        description: [
                            {
                                point:
                                    '1. Guided steps for onboarding new users',
                            },
                            {
                                point: '2. Enriched home screen ',
                            },
                            {
                                point: '3. Provision for exiting meditation',
                            },
                            {
                                point:
                                    '4. Reminder for meditation and guided practice',
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
                                point:
                                    '1. Guided steps for onboarding new users',
                            },
                            {
                                point: '2. Enriched home screen ',
                            },
                            {
                                point: '3. Provision for exiting meditation',
                            },
                            {
                                point:
                                    '4. Reminder for meditation and guided practice',
                            },
                            {
                                point: '5. Other Bug fixes',
                            },
                        ],
                    },
                },
                languages: [{ label: 'English', value: 'en' }],
            });
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    JSON.stringify({
                        en: {
                            appStore: {
                                latestVersionNumber: 'v-3.9.10',
                                url:
                                    'https://apps.apple.com/us/app/heartsapp-by-heartfulness/id1438627629',
                                description: [
                                    {
                                        point:
                                            '1. Guided steps for onboarding new users',
                                    },
                                    {
                                        point: '2. Enriched home screen ',
                                    },
                                    {
                                        point:
                                            '3. Provision for exiting meditation',
                                    },
                                    {
                                        point:
                                            '4. Reminder for meditation and guided practice',
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
                                        point:
                                            '1. Guided steps for onboarding new users',
                                    },
                                    {
                                        point: '2. Enriched home screen ',
                                    },
                                    {
                                        point:
                                            '3. Provision for exiting meditation',
                                    },
                                    {
                                        point:
                                            '4. Reminder for meditation and guided practice',
                                    },
                                    {
                                        point: '5. Other Bug fixes',
                                    },
                                ],
                            },
                        },
                        languages: [{ label: 'English', value: 'en' }],
                    }),
                );
            expect(whatsNewPopupConfig()).toEqual({
                en: {
                    appStore: {
                        latestVersionNumber: 'v-3.9.10',
                        url:
                            'https://apps.apple.com/us/app/heartsapp-by-heartfulness/id1438627629',
                        description: [
                            {
                                point:
                                    '1. Guided steps for onboarding new users',
                            },
                            {
                                point: '2. Enriched home screen ',
                            },
                            {
                                point: '3. Provision for exiting meditation',
                            },
                            {
                                point:
                                    '4. Reminder for meditation and guided practice',
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
                                point:
                                    '1. Guided steps for onboarding new users',
                            },
                            {
                                point: '2. Enriched home screen ',
                            },
                            {
                                point: '3. Provision for exiting meditation',
                            },
                            {
                                point:
                                    '4. Reminder for meditation and guided practice',
                            },
                            {
                                point: '5. Other Bug fixes',
                            },
                        ],
                    },
                },
                languages: [{ label: 'English', value: 'en' }],
            });
        });
    });

    describe('#getRecurringDonationSource', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    'https://donations.heartfulness.org/everydropcounts-mobile/',
                );
            expect(getRecurringDonationSource()).toEqual(
                'https://donations.heartfulness.org/everydropcounts-mobile/',
            );
        });
    });
    describe('#getTrainersSectionSource', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    'https://gatsby-qa-site-my.firebaseapp.com/embedded/register',
                );
            expect(getTrainersSectionSource()).toEqual(
                'https://gatsby-qa-site-my.firebaseapp.com/embedded/register',
            );
        });
    });
    describe('#getDonationURL', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    'https://dontaions.heartfulness.org/',
                );
            expect(getDonationURL()).toEqual(
                'https://dontaions.heartfulness.org/',
            );
        });
    });
    describe('#getTrainersSectionEventsTrackerSource', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    'https://gatsby-qa-site-my.firebaseapp.com/embedded/events',
                );
            expect(getTrainersSectionEventsTrackerSource()).toEqual(
                'https://gatsby-qa-site-my.firebaseapp.com/embedded/events',
            );
        });
    });

    describe('#getOfflineSeekerSearchLimit', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce('10');
            expect(getOfflineSeekerSearchLimit()).toEqual(10);
        });
    });

    describe('#getOfflineSeekerSearchRestrictionInSeconds', () => {
        it('should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asNumber.mockReturnValueOnce(900);
            expect(getOfflineSeekerSearchRestrictionInSeconds()).toEqual(900);
        });
    });

    describe('#getHeartInTuneAppDownloadPopupConfig', () => {
        it('Should return default value if nothing is set in remote config', () => {
            expect(getHeartInTuneAppDownloadPopupConfig()).toEqual(
                'https://heartfulness.app.link/migrate-to-hfnapp',
            );
        });
        it('Should return value set in firebase remote config', () => {
            remoteConfig()
                .getValue()
                .asString.mockReturnValueOnce(
                    'https://heartfulness.app.link/migrate-to-hfnapp',
                );
            expect(getHeartInTuneAppDownloadPopupConfig()).toEqual(
                'https://heartfulness.app.link/migrate-to-hfnapp',
            );
        });
    });
});
