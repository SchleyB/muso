import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Expo, { Permissions, Audio, FileSystem } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
    this.recording = null;
    this.sound = null;
    this.state = {
      haveRecordingPermissions: false,
    };
  }

  componentDidMount() {
    (async () => {
      const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      this.setState({
        haveRecordingPermissions: response.status === 'granted',
      });
    })();
  }

  _record = async () => {
    console.log('record');
    console.log('have Permissions? ', this.state);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    const recording = new Audio.Recording();

    try {
      await recording.prepareToRecordAsync(this.recordingSettings);

      this.recording = recording;

      await recording.startAsync();
    } catch(e) {
      console.log('error: ', e);
    }
  }

  _stopRecord = async () => {
    console.log('stop record');
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      console.log('stop error: ', error);
    }

    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log(`FILE INFO: ${JSON.stringify(info)}`);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    const { sound, status } = await this.recording.createNewLoadedSound(
      {
        isLooping: true,
      },
    );

    this.sound = sound;
  }

  _play = () => {
    if (this.sound != null) {
      this.sound.playAsync();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello Nat!</Text>
        <Button
          title="Start"
          onPress={this._record}
        />
        <Button
          title="Stop"
          onPress={this._stopRecord}
        />
        <Button
          title="Play Sound"
          onPress={this._play}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
