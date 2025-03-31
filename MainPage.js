import React, { useState} from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import { getWeather, getAirQuality } from "./api";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from 'expo-blur';

// Import background images
const weatherBackgrounds = {
    Clear: require("./assets/sunny.jpg"), 
    Clouds: require("./assets/cloudy.jpg"),
    Rain: require("./assets/rainy.jpg"),
    Snow: require("./assets/snowy.jpg"),
    Thunderstorm: require("./assets/thunder.jpg"),
    Mist: require("./assets/mist.jpg"),
    Default: require("./assets/default.jpg"),
};

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

    const getCardinalDirection = (deg) => {
        if (deg > 337.5 || deg <= 22.5) return "N";
        if (deg > 22.5 && deg <= 67.5) return "NE";
        if (deg > 67.5 && deg <= 112.5) return "E";
        if (deg > 112.5 && deg <= 157.5) return "SE";
        if (deg > 157.5 && deg <= 202.5) return "S";
        if (deg > 202.5 && deg <= 247.5) return "SW";
        if (deg > 247.5 && deg <= 292.5) return "W";
        if (deg > 292.5 && deg <= 337.5) return "NW";
    };

    // Get background image based on weather
    const weatherCondition = weatherData?.weather[0]?.main || "Default";
    const backgroundImage = weatherBackgrounds[weatherCondition] || weatherBackgrounds["Default"];

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
        <SafeAreaView style={styles.container} >
            <TextInput
                placeholder="Enter the city name..."
                value={city}
                onChangeText={(text) => setCity(text)}
                style={styles.searchInput}
            />
            <Button onPress={handleSearch} title="Search" color="#FFF" />

            {error && <Text style={styles.error}>{error}</Text>}

            {weatherData && (
                <View style={styles.results}>
                    <View style={styles.grid}>
                        {/* Temperature Box */}
                        <View style={styles.glassBox}>
                            <BlurView intensity={50} tint="light" style={styles.blur}>
                                <Text style={styles.temp}>{weatherData.main.temp} °C</Text>
                            </BlurView>
                        </View>

                        {/* Weather Description Box */}
                        <View style={styles.glassBox}>
                            <BlurView intensity={50} tint="light" style={styles.blur}>
                                <Text style={styles.weather}>{weatherData.weather[0].description}</Text>
                            </BlurView>
                        </View>

                        {/* Wind Box */}
                        <View style={styles.glassBox}>
                            <BlurView intensity={50} tint="light" style={styles.blur}>
                                <Text style={styles.wind}>Wind: {weatherData.wind.speed} m/s</Text>
                                <Text style={styles.wind}>Direction: {getCardinalDirection(weatherData.wind.deg)}</Text>
                            </BlurView>
                        </View>

                        {/* Humidity Box */}
                        <View style={styles.glassBox}>
                            <BlurView intensity={50} tint="light" style={styles.blur}>
                                <Text style={styles.humid}>{weatherData.main.humidity}% humidity</Text>
                            </BlurView>
                        </View>
                    </View>
                    
                    {/* Air Quality Section with Linear Gradient */}
                    {airQuality && (
                        <View style={styles.aqiContainer}>
                            {/* Text display for air quality */}
                            <Text style={styles.aqiText}>Air Quality: {getAQIDescription(airQuality)}</Text>

                            {/* Linear Gradient Bar */}
                            <View style={styles.aqiBarContainer}>
                                <LinearGradient
                                    colors={["#ff007e","#FF0000", "#fdcb05", "#63fd05", "#05fdbd" ]}
                                    start={[0, 0]}
                                    end={[1, 0]}
                                    style={styles.aqiBar}
                                >
                                    {/* Indicator inside the LinearGradient */}
                                    <View style={[styles.aqiIndicator, { right: `${(airQuality - 1) * (100 / 5)}%` }]} />
                                </LinearGradient>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 20,
        margin: 20,
        alignItems: "center",
    },
    searchInput: {
        fontSize: 18,
        height: 40,
        width: 300,
        color: "white",
        borderColor: "white",
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
    glassBox: {
        width: 150,
        height: 100,
        overflow: "hidden",
        borderRadius: 10,
        marginBottom: 10,
    },
    blur: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.01)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },    
    temp: {
        fontSize: 28,
        color: "white",
        fontWeight: "bold",
    },
    weather: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    wind: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    humid: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    aqiContainer: {
        width: 320,
        marginVertical: 15,
        alignItems: "center",
        zIndex: 1,
    },
    
    aqiText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#fff",
    },
    
    aqiBarContainer: {
        width: "100%",
        height: 15,
        marginTop: 8,
        borderRadius: 5,
        overflow: "hidden",
        position: "relative",
    },
    
    aqiBar: {
        flex: 1,
        height: "100%",
        justifyContent: "center",
        borderRadius: 5,
        position: "relative",
    },
    
    aqiIndicator: {
        width: 15,
        height: 15,
        backgroundColor: "#fff",
        borderRadius: 7.5,
        position: "absolute",
        zIndex: 2,
    },
    error: {
        color: "red",
        marginTop: 10,
    },
})