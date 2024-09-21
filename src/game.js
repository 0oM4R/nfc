import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  React,
} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import { useState } from 'react';
function Game(props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState();

  if(activeIndex === 0 ) {return <HomeScreen onSuccess={onSuccess} onFail={()=> setActiveIndex(2)}/>;}
  function onSuccess(_data){
    setData(_data);
    setActiveIndex(1);
  }
  if(activeIndex === 1 ) {return (<Success data={data}  onBack={()=>setActiveIndex(0)}/>);}
}

function Success({data, onBack}){
  return (
    <View style={styles.wrapper}>
      <Text>{data}</Text>
      <TouchableOpacity style={styles.btn} onPress={onBack}><Text>Back</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    margin: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
});


function HomeScreen({onSuccess}){
  async function scanTag() {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();

    const asciiPayload = tag.ndefMessage[0].payload;
    asciiPayload.splice(0,3);
    const data = String.fromCharCode(...asciiPayload.filter(char=> char >= 32));


    onSuccess(data);


  }

  async function writeTag(){
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const bytes = Ndef.encodeMessage([Ndef.textRecord('Hello')]);

    if (bytes) {
      await NfcManager.ndefHandler
        .writeNdefMessage(bytes);
    }
    NfcManager.cancelTechnologyRequest();
  }
  return (
    <View style={styles.wrapper}>
      <Text> scanner</Text>
      <TouchableOpacity style={styles.btn} onPress={scanTag}>
        <Text>Scan</Text>
      </TouchableOpacity>
      <Text> Writer</Text>
      <TouchableOpacity style={styles.btn} onPress={writeTag}>
        <Text>Write</Text>
      </TouchableOpacity>
    </View>
  );
}


export default Game;


