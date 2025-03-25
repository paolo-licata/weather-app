import React, { useState} from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import { getWeather } from "./api";

export const WeatherApp = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);

    const handleSearch = async () => {
        try {
            const data = await getWeather(city);
            setWeatherData(data);
        } catch (error) {
            alert("Error while fetching data: " + error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container} >
            <TextInput
                placeholder="Enter the city name..."
                value={city}
                onChangeText={(text) => setCity(text)}
                style={styles.searchInput}
            />
            <Button onPress={handleSearch} title="Search" color="#007AFF" />
            {weatherData && (
                <View style={styles.results}>
                    <Text>Temperature: {weatherData.main.temp} °C</Text>
                    <Text>Weather: {weatherData.weather[0].description}</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        margin: 20,
    },
    searchInput: {
        height: 40,
        width:300,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 100,
        marginBottom: 10,
        padding: 8,
    },
    buttonContainer: {
        marginVertical: 10,
        width: '80%',
        alignSelf: 'center',
    },
    results: {
        marginTop: 20,
    },
})