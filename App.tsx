import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MoveableMaskedImage from "./src/image-editing/collage/newMoveableMaskedImage";
/*
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const image = {
  width: 1576,
  height: 2590,
  source_url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Gustav_Klimt_047.jpg"
}

export default () => (
    <MoveableMaskedImage
        image={image}
        initialScale={0.4}
        size={{width: 500, height: 750}}
    />
)
