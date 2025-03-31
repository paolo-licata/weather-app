import React, { useState} from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from "react-native";
import { getWeather, getAirQuality } from "./api";
import { LinearGradient } from "expo-linear-gradient";


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
                    <View style={styles.grid}>
                        {/* Temperature Box */}
                        <View style={styles.box}>
                            <Text style={styles.temp}>{weatherData.main.temp} °C</Text>
                        </View>

                        {/* Weather Description Box */}
                        <View style={styles.box}>
                            <Text style={styles.weather}>{weatherData.weather[0].description}</Text>
                        </View>

                        {/* Wind Box */}
                        <View style={styles.box}>
                            <Text style={styles.wind}>Wind: {weatherData.wind.speed} m/s</Text>
                            <Text style={styles.wind}>Direction: {weatherData.wind.deg}°</Text>
                        </View>
                    </View>
                    
                    {/* Air Quality Section with Linear Gradient */}
                    {airQuality && (
                        <View style={styles.aqiContainer}>
                                <Text style={styles.aqiText}>Air Quality: {getAQIDescription(airQuality)}</Text>
                                <LinearGradient
                                    colors={["#00E400", "#FFFF00", "#FF7E00", "#FF0000", "#8F3F97"]}
                                    start={[0, 0]}
                                    end={[1, 0]}
                                    style={styles.aqiBar}
                                >
                                    <View style={[styles.aqiIndicator, { left: `${(airQuality - 1) * 25}%` }]} />
                                </LinearGradient>                            
                        </View>            
                    )}
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
        alignItems: "center",
    },
    searchInput: {
        height: 40,
        width: 300,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 50,
        marginBottom: 10,
        padding: 8,
        textAlign: "center",
    },
    results: {
        flex: 1,
        flexDirection: "column",
        marginTop: 20,
        alignItems: "center",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: 320,
    },
    box: {
        width: 150,
        height: 100,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    temp: {
        fontSize: 28,
        fontWeight: "bold",
    },
    weather: {
        fontSize: 18,
        fontWeight: "600",
    },
    wind: {
        fontSize: 18,
        fontWeight: "600",
    },
    aqiContainer: {
        width: 300,
        borderWidth: 1,
        borderColor: "black",
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    aqiText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: "600",
    },
    aqiBar: {
        width: "100%",
        height: 10,
        borderRadius: 5,
        position: "relative",
    },
    aqiIndicator: {
        width: 15,
        height: 15,
        backgroundColor: "#000",
        borderRadius: 7.5,
        position: "absolute",
        top: -3,
    },
    error: {
        color: "red",
        marginTop: 10,
    },
})