package com.hfn.unified.reactnative.modules;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.google.protobuf.BoolValue;
import com.google.protobuf.Int32Value;
import com.google.protobuf.StringValue;
import com.hfn.unified.reactnative.PreceptorSessionStreamContext;
import com.hfn.unified.reactnative.SeekerSessionStreamContext;
import com.hfn.unified.reactnative.modules.assemblers.AvailabilityStatusChangeRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.AvailabilityStatusChangeResponseAssembler;
import com.hfn.unified.reactnative.modules.assemblers.DiaryEntryAssembler;
import com.hfn.unified.reactnative.modules.assemblers.DiaryEntryListAssembler;
import com.hfn.unified.reactnative.modules.assemblers.GetDiaryEntriesRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.GetDiaryEntryBySessionIdRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.GetSeekersToWhomSittingIsGivenWithoutUsingAppRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.GetUserSessionsRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.MeditationSessionAssembler;
import com.hfn.unified.reactnative.modules.assemblers.OnlineMetricsAssembler;
import com.hfn.unified.reactnative.modules.assemblers.PreceptorDNDRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.PreceptorReportRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.PreceptorRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.PreceptorResponseAssembler;
import com.hfn.unified.reactnative.modules.assemblers.SittingGivenCountResponseAssembler;
import com.hfn.unified.reactnative.modules.assemblers.SeekerExitSessionAssembler;
import com.hfn.unified.reactnative.modules.assemblers.SeekerRequestAssembler;
import com.hfn.unified.reactnative.modules.assemblers.SeekerResponseAssembler;
import com.hfn.unified.remote.GRPCClientFactory;
import com.hfn.unified.reactnative.modules.assemblers.SaveSittingsGivenWithoutUsingAppRequestAssembler;


import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.AvailabilityStatusChangeRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.AvailabilityStatusChangeResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.DiaryEntry;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.DiaryEntryList;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetDiaryEntriesRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetDiaryEntryBySessionIdRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetSeekersToWhomSittingIsGivenWithoutUsingAppRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.GetUserSessionsRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.MeditationSession;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.MeditationSessionList;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.OnlineMetrics;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorDNDRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorReportRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.PreceptorResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SaveSittingsGivenWithoutUsingAppRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerInfoResponse;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerRequest;
import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SeekerResponse;

import org.heartfulness.unifiedplatform.interfaces.grpc.meditation.SittingGivenCountResponse;
import org.json.JSONException;

import io.grpc.stub.StreamObserver;

import static com.hfn.unified.reactnative.modules.Constants.FIREBASE_ID_TOKEN;
import static com.hfn.unified.reactnative.modules.Constants.FIREBASE_ID;
import static com.hfn.unified.reactnative.modules.Constants.MESSAGE;
import static com.hfn.unified.reactnative.modules.Constants.SESSION_ID;

public class MeditationServiceReactModule extends ReactContextBaseJavaModule {

    private SeekerSessionStreamContext seekerSession;
    private PreceptorSessionStreamContext preceptorSession;

    public MeditationServiceReactModule(ReactApplicationContext reactContext) {
        super(reactContext);
        seekerSession = new SeekerSessionStreamContext(reactContext);
        preceptorSession = new PreceptorSessionStreamContext(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "MeditationService";
    }

    @ReactMethod
    public void isAnyPendingSeekerSessionRequest(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            String firebaseId = requestMap.getString(FIREBASE_ID);

            BoolValue pendingSessions = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .isAnyPendingSeekerSessionRequest(StringValue.newBuilder().setValue(firebaseId).build());

            responsePromise.resolve(pendingSessions.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getMeditationSession(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            String sessionId = requestMap.getString(SESSION_ID);

            MeditationSession meditationSession = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getMeditationSession(StringValue.newBuilder().setValue(sessionId).build());

            String response = new MeditationSessionAssembler().toJson(meditationSession);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void startSeekerSessionStreaming(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SeekerRequest request = new SeekerRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            StreamObserver<SeekerRequest> requestObserver = GRPCClientFactory.get().meditationService().getAsyncStub(firebaseIdToken)
                    .seekerSession(seekerSession);
            seekerSession.setRequestObserver(requestObserver);
            requestObserver.onNext(request);
            responsePromise.resolve(true);
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void sendSeekerSessionStreamingCommand(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SeekerRequest request = new SeekerRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            if(seekerSession.getRequestObserver() != null) {
                seekerSession.getRequestObserver().onNext(request);
                responsePromise.resolve(true);
            } else {
                responsePromise.resolve(false);
            }
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void closeSeekerSessionStreaming(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            if(seekerSession.getRequestObserver() != null) {
                seekerSession.getRequestObserver().onCompleted();
                seekerSession.setRequestObserver(null);
            }
            responsePromise.resolve(true);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void seekerSeekNow(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SeekerRequest request = new SeekerRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            SeekerResponse seekerResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .seekerSeekNow(request);

            String response = new SeekerResponseAssembler().toJson(seekerResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void seekerClose(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            SeekerRequest request = new SeekerRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            SeekerResponse seekerResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .seekerClose(request);

            String response = new SeekerResponseAssembler().toJson(seekerResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getExistingSessionByUser(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            String firebaseId = requestMap.getString(FIREBASE_ID);

            MeditationSession meditationSession = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getExistingSessionByUser(StringValue.newBuilder().setValue(firebaseId).build());

            String response = new MeditationSessionAssembler().toJson(meditationSession);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void seekerExitSession(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);

            SeekerRequest request = new SeekerRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            BoolValue seekerExitSessionResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .seekerExitSession(request);

            String response = new SeekerExitSessionAssembler().toJson(seekerExitSessionResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    //==================================================
    //=============== Preceptor ========================
    //==================================================
    @ReactMethod
    public void getOnlineMetrics(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);

            OnlineMetrics onlineMetrics = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getOnlineMetrics(OnlineMetrics.newBuilder().build());

            String response = new OnlineMetricsAssembler().toJson(onlineMetrics);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getPreceptorAvailabilityStatus(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            String firebaseId = requestMap.getString(FIREBASE_ID);

            BoolValue available = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getPreceptorAvailabilityStatus(StringValue.newBuilder().setValue(firebaseId).build());

            responsePromise.resolve(available.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void updatePreceptorAvailabilityStatus(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            AvailabilityStatusChangeRequest request = new AvailabilityStatusChangeRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            AvailabilityStatusChangeResponse statusChangeResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .updatePreceptorAvailabilityStatus(request);

            String response = new AvailabilityStatusChangeResponseAssembler().toJson(statusChangeResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void preceptorAccept(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            PreceptorRequest request = new PreceptorRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            PreceptorResponse preceptorResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .preceptorAccept(request);

            String response = new PreceptorResponseAssembler().toJson(preceptorResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void preceptorCancel(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            PreceptorRequest request = new PreceptorRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            PreceptorResponse preceptorResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .preceptorCancel(request);

            String response = new PreceptorResponseAssembler().toJson(preceptorResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void preceptorStartMeditation(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            PreceptorRequest request = new PreceptorRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            PreceptorResponse preceptorResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .preceptorStartMeditation(request);

            String response = new PreceptorResponseAssembler().toJson(preceptorResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void preceptorEndMeditation(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            PreceptorRequest request = new PreceptorRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            PreceptorResponse preceptorResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .preceptorEndMeditation(request);

            String response = new PreceptorResponseAssembler().toJson(preceptorResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void preceptorClose(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            PreceptorRequest request = new PreceptorRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            PreceptorResponse preceptorResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .preceptorClose(request);

            String response = new PreceptorResponseAssembler().toJson(preceptorResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }


    @ReactMethod
    public void startPreceptorSessionStreaming(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            PreceptorRequest request = new PreceptorRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            StreamObserver<PreceptorRequest> requestObserver = GRPCClientFactory.get().meditationService().getAsyncStub(firebaseIdToken)
                    .preceptorSession(preceptorSession);
            preceptorSession.setRequestObserver(requestObserver);
            requestObserver.onNext(request);
            responsePromise.resolve(true);
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void sendPreceptoSessionStreamingCommand(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            PreceptorRequest request = new PreceptorRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            if(preceptorSession.getRequestObserver() != null) {
                preceptorSession.getRequestObserver().onNext(request);
                responsePromise.resolve(true);
            }

            responsePromise.resolve(false);
        } catch (JSONException e) {
            Log.d("GetSRDetailJavaModule", e.getMessage());
            e.printStackTrace();
            responsePromise.reject(e);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }



    @ReactMethod
    public void closePreceptorSessionStreaming(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            if(preceptorSession.getRequestObserver() != null) {
                preceptorSession.getRequestObserver().onCompleted();
                preceptorSession.setRequestObserver(null);
            }
            responsePromise.resolve(true);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void updatePreceptorDNDStatus(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            PreceptorDNDRequest request = new PreceptorDNDRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            BoolValue preceptorResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .updatePreceptorDNDStatus(request);

            responsePromise.resolve(preceptorResponse.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void createUpdateDiaryEntry(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            DiaryEntry request = new DiaryEntryAssembler().fromJson(requestMap.getString(MESSAGE));

            StringValue result = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .saveDiaryEntry(request);

            responsePromise.resolve(result.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void deleteDiaryEntry(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            DiaryEntry request = new DiaryEntryAssembler().fromJson(requestMap.getString(MESSAGE));

            BoolValue result = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .deleteDiaryEntry(StringValue.newBuilder().setValue(request.getId()).build());

            responsePromise.resolve(result.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getNextDiaryEntries(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            GetDiaryEntriesRequest request = new GetDiaryEntriesRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            DiaryEntryList result = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getNextDiaryEntries(request);

            responsePromise.resolve(DiaryEntryListAssembler.toJson(result));
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getPreviousDiaryEntries(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            GetDiaryEntriesRequest request = new GetDiaryEntriesRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            DiaryEntryList result = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getPreviousDiaryEntries(request);

            responsePromise.resolve(DiaryEntryListAssembler.toJson(result));
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getPreceptorSittingCount(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            String firebaseId = requestMap.getString(FIREBASE_ID);

            Int32Value count = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getPreceptorSittingCount(StringValue.newBuilder().setValue(firebaseId).build());

            responsePromise.resolve(count.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getSittingsGivenCount(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            String firebaseId = requestMap.getString(FIREBASE_ID);

            SittingGivenCountResponse preceptorSittingCountResponse = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getSittingsGivenCount(StringValue.newBuilder().setValue(firebaseId).build());

            String response = new SittingGivenCountResponseAssembler().toJson(preceptorSittingCountResponse);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getSeekerSittingCount(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            String firebaseId = requestMap.getString(FIREBASE_ID);

            Int32Value count = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getSeekerSittingCount(StringValue.newBuilder().setValue(firebaseId).build());

            responsePromise.resolve(count.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getUserSessionHistory(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            GetUserSessionsRequest request = new GetUserSessionsRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            MeditationSessionList list = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getUserSessionHistory(request);

            responsePromise.resolve(GetUserSessionsRequestAssembler.toJson(list));
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void getDiaryEntryBySessionId(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            GetDiaryEntryBySessionIdRequest request = new GetDiaryEntryBySessionIdRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            DiaryEntry diaryEntry = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getDiaryEntryBySessionId(request);

            responsePromise.resolve(GetDiaryEntryBySessionIdRequestAssembler.toJson(diaryEntry));
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }

    @ReactMethod
    public void preceptorReport(final ReadableMap requestMap, final  Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);
            PreceptorReportRequest request = new PreceptorReportRequestAssembler().fromJson(requestMap.getString(MESSAGE));

            BoolValue result = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .preceptorReport(request);

            responsePromise.resolve(result.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }
    @ReactMethod
    public void saveSittingsGivenWithoutUsingApp(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);

            SaveSittingsGivenWithoutUsingAppRequest request = new SaveSittingsGivenWithoutUsingAppRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            BoolValue result = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .saveSittingsGivenWithoutUsingApp(request);

            responsePromise.resolve(result.getValue());
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }
    @ReactMethod
    public void getSeekersToWhomSittingIsGivenWithoutUsingApp(final ReadableMap requestMap, final Promise responsePromise) {
        try {
            String firebaseIdToken = requestMap.getString(FIREBASE_ID_TOKEN);

            GetSeekersToWhomSittingIsGivenWithoutUsingAppRequest request = new GetSeekersToWhomSittingIsGivenWithoutUsingAppRequestAssembler().fromJson(requestMap.getString(MESSAGE));
            SeekerInfoResponse result = GRPCClientFactory.get()
                    .meditationService()
                    .getBlockingStub(firebaseIdToken)
                    .getSeekersToWhomSittingIsGivenWithoutUsingApp(request);

            String response = new GetSeekersToWhomSittingIsGivenWithoutUsingAppRequestAssembler().toJson(result);
            responsePromise.resolve(response);
        } catch (Exception e) {
            e.printStackTrace();
            responsePromise.reject(e);
        }
    }
}
