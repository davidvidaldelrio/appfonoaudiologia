import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';

export function useAudioRecorderService() {
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const state = useAudioRecorderState(recorder);

  const start = async (): Promise<boolean> => {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) return false;
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  };

  const stop = async (): Promise<string | null> => {
    await recorder.stop();
    return recorder.uri;
  };

  return { isRecording: state.isRecording, durationMillis: state.durationMillis, uri: recorder.uri, start, stop };
}