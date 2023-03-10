import MeditationSessionCountService from './MeditationSessionCountService';
import * as UserOperation from '../../state/user/operations';
import { runAllPromises } from '../../utils/TestUtils';
import * as MeditationService from '../grpc/MeditationService';
import { AbhyasStage } from '../../shared/Constants';

describe('MeditationSessionCountService', () => {
    let getSittingsGivenCountMock;
    const dispatchMock = jest.fn();

    const getSeekerSittingCountMock = jest
        .spyOn(MeditationService, 'getSeekerSittingCount')
        .mockImplementation(() => {
            return 100;
        });
    const getPreceptorSittingCountMock = jest
        .spyOn(MeditationService, 'getPreceptorSittingCount')
        .mockImplementation(() => {
            return 100;
        });
    const setCountOfSittingsTakenMock = jest
        .spyOn(UserOperation, 'setCountOfSittingsTaken')
        .mockImplementation(() => {});
    const setCountOfSittingsGivenThroughHeartsAppMock = jest
        .spyOn(UserOperation, 'setCountOfSittingsGivenThroughHeartsApp')
        .mockImplementation(() => {});
    const setCountOfSittingsGivenOfflineMock = jest
        .spyOn(UserOperation, 'setCountOfSittingsGivenOffline')
        .mockImplementation(() => {});
    const getSittingsGivenCountResponse = response => {
        getSittingsGivenCountMock = jest
            .spyOn(MeditationService, 'getSittingsGivenCount')
            .mockImplementation(() => response);
    };
    afterEach(() => {
        dispatchMock.mockClear();
        getSeekerSittingCountMock.mockClear();
        getPreceptorSittingCountMock.mockClear();
        if (getSittingsGivenCountMock) {
            getSittingsGivenCountMock.mockClear();
            getSittingsGivenCountMock = undefined;
        }

        setCountOfSittingsTakenMock.mockClear();
        setCountOfSittingsGivenThroughHeartsAppMock.mockClear();
        setCountOfSittingsGivenOfflineMock.mockClear();
    });

    it('Should call getSeekerSittingCount when user is seeker and internet is available', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: true,
            },
            user: {
                authenticated: true,
                hfnProfile: {
                    stage: AbhyasStage.SEEKER,
                },
            },
        }));
        MeditationSessionCountService.initialize(dispatchMock, getStateMock);
        await MeditationSessionCountService.updateCountOfSittingsTaken();
        await runAllPromises();

        expect(getSeekerSittingCountMock).toHaveBeenCalled();
        expect(setCountOfSittingsTakenMock).toHaveBeenCalledWith(100);
    });

    it('Should not call getSeekerSittingCount when user is seeker and internet is not available', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: false,
            },
            user: {
                authenticated: true,
                hfnProfile: {
                    stage: AbhyasStage.SEEKER,
                },
            },
        }));
        MeditationSessionCountService.initialize(dispatchMock, getStateMock);
        await MeditationSessionCountService.updateCountOfSittingsTaken();
        await runAllPromises();

        expect(getSeekerSittingCountMock).not.toHaveBeenCalled();
        expect(setCountOfSittingsTakenMock).not.toHaveBeenCalledWith(100);
    });
    it('Should not call getSeekerSittingCount when user is seeker and is not loggedin', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: false,
            },
            user: {
                authenticated: false,
                hfnProfile: {
                    stage: AbhyasStage.SEEKER,
                },
            },
        }));
        MeditationSessionCountService.initialize(dispatchMock, getStateMock);
        await MeditationSessionCountService.updateCountOfSittingsTaken();
        await runAllPromises();

        expect(getSeekerSittingCountMock).not.toHaveBeenCalled();
        expect(setCountOfSittingsTakenMock).not.toHaveBeenCalledWith(100);
    });

    it('Should call updateCountOfSittingsGiven when user is preceptor and internet is available', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: true,
            },
            user: {
                authenticated: true,
                hfnProfile: {
                    stage: AbhyasStage.PRECEPTOR,
                },
            },
        }));
        MeditationSessionCountService.initialize(dispatchMock, getStateMock);
        await MeditationSessionCountService.updateCountOfSittingsGiven();
        await runAllPromises();

        expect(getPreceptorSittingCountMock).toHaveBeenCalled();
        expect(
            setCountOfSittingsGivenThroughHeartsAppMock,
        ).toHaveBeenCalledWith(100);
    });

    it('Should not call updateCountOfSittingsGiven when user is preceptor and internet is not available', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: false,
            },
            user: {
                authenticated: true,
                hfnProfile: {
                    stage: AbhyasStage.PRECEPTOR,
                },
            },
        }));
        MeditationSessionCountService.initialize(dispatchMock, getStateMock);
        await MeditationSessionCountService.updateCountOfSittingsGiven();
        await runAllPromises();

        expect(getPreceptorSittingCountMock).not.toHaveBeenCalled();
        expect(
            setCountOfSittingsGivenThroughHeartsAppMock,
        ).not.toHaveBeenCalledWith(100);
    });

    it('Should not call updateCountOfSittingsGiven when user is preceptor and is not loggedin', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: false,
            },
            user: {
                authenticated: false,
                hfnProfile: {
                    stage: AbhyasStage.PRECEPTOR,
                },
            },
        }));
        MeditationSessionCountService.initialize(dispatchMock, getStateMock);
        await MeditationSessionCountService.updateCountOfSittingsGiven();
        await runAllPromises();

        expect(getPreceptorSittingCountMock).not.toHaveBeenCalled();
        expect(
            setCountOfSittingsGivenThroughHeartsAppMock,
        ).not.toHaveBeenCalledWith(100);
    });

    describe('#updateCountOfSittingsGivenOutsideHeartsApp', () => {
        it('Should call updateCountOfSittingsGivenOutsideHeartsApp when user is preceptor and internet is available', async () => {
            const getStateMock = jest.fn().mockImplementation(() => ({
                deviceState: {
                    isApplicationServerReachable: true,
                },
                user: {
                    authenticated: true,
                    hfnProfile: {
                        stage: AbhyasStage.PRECEPTOR,
                    },
                },
            }));
            getSittingsGivenCountResponse({
                withoutUsingApp: 10,
                heartsapp: 20,
            });
            MeditationSessionCountService.initialize(
                dispatchMock,
                getStateMock,
            );
            await MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
            await runAllPromises();

            expect(getSittingsGivenCountMock).toHaveBeenCalled();
            expect(
                setCountOfSittingsGivenThroughHeartsAppMock,
            ).toHaveBeenCalledWith(20);
            expect(setCountOfSittingsGivenOfflineMock).toHaveBeenCalledWith(10);
        });

        it('Should call updateCountOfSittingsGivenOutsideHeartsApp and should not update the outside sitting count when user is preceptor, internet is available and withoutUsingApp sitting count is undefined', async () => {
            const getStateMock = jest.fn().mockImplementation(() => ({
                deviceState: {
                    isApplicationServerReachable: true,
                },
                user: {
                    authenticated: true,
                    hfnProfile: {
                        stage: AbhyasStage.PRECEPTOR,
                    },
                },
            }));
            getSittingsGivenCountResponse({
                withoutUsingApp: undefined,
                heartsapp: 20,
            });
            MeditationSessionCountService.initialize(
                dispatchMock,
                getStateMock,
            );
            await MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
            await runAllPromises();

            expect(getSittingsGivenCountMock).toHaveBeenCalled();
            expect(
                setCountOfSittingsGivenThroughHeartsAppMock,
            ).toHaveBeenCalled();
            expect(setCountOfSittingsGivenOfflineMock).not.toHaveBeenCalled();
        });

        it('Should call updateCountOfSittingsGivenOutsideHeartsApp and should not update the heartsapp sitting count when user is preceptor, internet is available and heartsapp sitting count is undefined', async () => {
            const getStateMock = jest.fn().mockImplementation(() => ({
                deviceState: {
                    isApplicationServerReachable: true,
                },
                user: {
                    authenticated: true,
                    hfnProfile: {
                        stage: AbhyasStage.PRECEPTOR,
                    },
                },
            }));
            getSittingsGivenCountResponse({
                withoutUsingApp: 20,
                heartsapp: undefined,
            });
            MeditationSessionCountService.initialize(
                dispatchMock,
                getStateMock,
            );
            await MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
            await runAllPromises();

            expect(getSittingsGivenCountMock).toHaveBeenCalled();
            expect(
                setCountOfSittingsGivenThroughHeartsAppMock,
            ).not.toHaveBeenCalled();
            expect(setCountOfSittingsGivenOfflineMock).toHaveBeenCalledWith(20);
        });

        it('Should not call updateCountOfSittingsGivenOutsideHeartsApp when user is preceptor and internet is not available', async () => {
            const getStateMock = jest.fn().mockImplementation(() => ({
                deviceState: {
                    isApplicationServerReachable: false,
                },
                user: {
                    authenticated: true,
                    hfnProfile: {
                        stage: AbhyasStage.PRECEPTOR,
                    },
                },
            }));
            getSittingsGivenCountResponse({
                withoutUsingApp: 10,
                heartsapp: 20,
            });
            MeditationSessionCountService.initialize(
                dispatchMock,
                getStateMock,
            );
            await MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
            await runAllPromises();

            expect(getSittingsGivenCountMock).not.toHaveBeenCalled();
            expect(setCountOfSittingsGivenOfflineMock).not.toHaveBeenCalled();
            expect(
                setCountOfSittingsGivenThroughHeartsAppMock,
            ).not.toHaveBeenCalled();
        });

        it('Should not call updateCountOfSittingsGivenOutsideHeartsApp when user is preceptor and is not loggedin', async () => {
            const getStateMock = jest.fn().mockImplementation(() => ({
                deviceState: {
                    isApplicationServerReachable: false,
                },
                user: {
                    authenticated: false,
                    hfnProfile: {
                        stage: AbhyasStage.PRECEPTOR,
                    },
                },
            }));
            getSittingsGivenCountResponse({
                withoutUsingApp: 10,
                heartsapp: 20,
            });
            MeditationSessionCountService.initialize(
                dispatchMock,
                getStateMock,
            );
            await MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
            await runAllPromises();

            expect(getSittingsGivenCountMock).not.toHaveBeenCalled();
            expect(setCountOfSittingsGivenOfflineMock).not.toHaveBeenCalled();
            expect(
                setCountOfSittingsGivenThroughHeartsAppMock,
            ).not.toHaveBeenCalled();
        });
    });
});
