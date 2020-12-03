import React from 'react';
import {AppRegistry, Button, Image, StyleSheet, View} from 'react-native';
import {DocumentDirectoryPath, downloadFile} from 'react-native-fs';

export default function App() {
  const [output, setOutput] = React.useState('');
  const [path, setPath] = React.useState('');
  let jobId = -1;

  function DownloadFileTest(url: string) {
    if (jobId !== -1) {
      setOutput('A download is already in progress');
    }

    const progress = (data: {bytesWritten: number; contentLength: number}) => {
      // eslint-disable-next-line no-bitwise
      const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
      const text = `Progress ${percentage}%`;
      setOutput(text);
    };

    const begin = (_res: any) => {
      setOutput('Download has begun');
    };
    const progressDivider = 1;
    setPath('http://lorempixel.com/400/200/');
    // const downloadDest = `${DocumentDirectoryPath}/${(Math.random() * 1000) | 0}.jpg`;
    const downloadDest = '~/GitHub/test.jpg';
    console.log(downloadDest);

    const ret = downloadFile({
      fromUrl: url,
      toFile: downloadDest,
      begin,
      progress,
      progressDivider,
    });

    jobId = ret.jobId;
    ret.promise
      .then((_res) => {
        // setOutput(JSON.stringify(res));
        console.log(output);
        setPath('file://' + downloadDest);
        jobId = -1;
      })
      .catch((err) => {
        console.error(err);
        setOutput(JSON.stringify(err, null, 2));
        jobId = -1;
      });
  }

  return (
    <View style={styles.button}>
      <Button
        title="Download"
        onPress={() => DownloadFileTest('http://lorempixel.com/400/200/')}
      />
      <Image source={{uri: path}} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: 50,
    height: 32,
  },
});

AppRegistry.registerComponent('ReactNativeFs', () => App);
