import React, { useState} from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import { getWeather, getAirQuality } from "./api";

export const WeatherApp = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {

            setError(null);

            const data = await getWeather(city);
            setWeatherData(data);

            //Get lat and long for the air quality API call
            const { lat, lon } = data.coord;
            const aqi = await getAirQuality(lat, lon);
            setAirQuality(aqi);

        } catch (error) {
            alert("Error while fetching data: " + error.message);
            setWeatherData(null);
            setAirQuality(null);
        }
    };

    const getAQIDescription = (aqi) => {
        const descriptions = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
        return descriptions[aqi - 1] || "Unknown";
    };

    return (
        <SafeAreaView style={styles.container} >
            <TextInput
                placeholder="Enter the city name..."
                value={city}
                onChangeText={(text) => setCity(text)}
                style={styles.searchInput}
            />
            <Button onPress={handleSearch} title="Search" color="#007AFF" />

            {error && <Text style={styles.error}>{error}</Text>}

            {weatherData && (
                <View style={styles.results}>
                    <Text>Temperature: {weatherData.main.temp} °C</Text>
                    <Text>Weather: {weatherData.weather[0].description}</Text>
                    <Text>Wind Speed: {weatherData.wind.speed} m/s</Text>
                    <Text>Wind Direction: {weatherData.wind.deg}°</Text>
                    {airQuality && (
                        <Text>Air Quality: {getAQIDescription(airQuality)}</Text>
                    )}
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
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
    error: {
        color: "red",
        marginTop: 10,
    },
})