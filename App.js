import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Expo, { Permissions, Audio, FileSystem } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
    this.recording = null;
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

  async _record() {
    const recording = new Audio.Recording();

    try {
      await recording.prepareToRecordAsync(this.recordingSettings);

      this.recording = recording;

      await recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    } catch(e) {
      console.log('error: ', e);
    }
  }

  async _stopRecord() {
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
     // const info = await FileSystem.getInfoAsync(this.recording.getURI());
    // console.log(`FILE INFO: ${JSON.stringify(info)}`);
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
