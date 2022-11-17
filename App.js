import { StyleSheet, Text, View, FlatList, Image, Pressable } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import MapView, {Marker, enableLatestRenderer} from 'react-native-maps';

enableLatestRenderer();

const App = () => {
  const [items, setItems] = useState([])
  const mapRef = useRef(null)

  useEffect(() => {
    fetch('https://www.melivecode.com/api/attractions')
      .then(res => res.json())
      .then((result) => {
        setItems(result)
      })
  }, [])

  const go = (latitude, longitude) => {
    mapRef.current.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 3,
      longitudeDelta: 3,
    })
  }

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Pressable onPress={() => go(item.latitude, item.longitude)}>
        <Text>{item.name}</Text>
        <Image source={{ uri: item.coverimage }} 
          style={{ width: 300, height: 150 }} />
      </Pressable>
    </View>
  );

  if (items.length === 0) {
    return (<View><Text>Loading...</Text></View>)
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: items[0].latitude,
          longitude: items[0].longitude,
          latitudeDelta: 3,
          longitudeDelta: 3,
        }}
      >
        {items.map((item, index) => (
          <Marker 
            key={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude
            }}
            title={item.name}
          />
        ))}
      </MapView>
      <View style={styles.listView}>
        <FlatList
          horizontal={true}
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  listView: {
    position: "absolute",
    bottom: 0
  },
  listItem: {
    padding: 5
  }
})