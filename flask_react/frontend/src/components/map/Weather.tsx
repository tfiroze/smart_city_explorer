import React, { useState, useEffect, useCallback } from "react";
import './Weather.css'

interface WeatherInfo {
    WeatherText: string;
    WeatherIcon: number;
    IsDayTime: boolean;
    Temperature: {
        Metric: {
            Value: number;
            Unit: string;
        };
    };
}

const Weather: React.FC = () => {
    const [weather, setWeather] = useState<WeatherInfo | null>(null);
    const [dayOrNight, setDayOrNight] = useState(true)
    const [weatherIcon, setWeatherIcon] = useState('')
    
    const fetchWeather = useCallback(async () => {
        const response = await fetch("https://ai-weather-by-meteosource.p.rapidapi.com/current");
        const json: WeatherInfo = await response.json();
        setWeather(json);
    }, []);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    useEffect(() => {
        if(weather) {
            setWeatherIcon(`img2/icons/${weather.WeatherIcon}.svg`);
            weather.IsDayTime ? setDayOrNight(true) : setDayOrNight(false);
        }
    }, [weather]);

    return (
        <div>
            {weather && (
                <>
                    {dayOrNight ? (
                        <nav className="navbar navbar-expand bg-light">
                            <img src={weatherIcon} alt="" width="70" height="70" />
                            <div className="container-fluid">
                                <div id="navbarSupportedContent">
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <a className="nav-link" aria-current="page" href="#">{weather.WeatherText}</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">{weather.Temperature.Metric.Value}{weather.Temperature.Metric.Unit} in Manhattan, NY</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    ) : (
                        <nav className="navbar navbar-expand-lg bg-secondary">
                            <img src={weatherIcon} alt="" width="70" height="70" />
                            <div className="container-fluid">
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-white">
                                        <li className="nav-item">
                                            <a className="nav-link active" aria-current="page" href="#">{weather.WeatherText}</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">{weather.Temperature.Metric.Value}{weather.Temperature.Metric.Unit} in Manhattan, NY</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    )}
                </>
            )}
        </div>
    );
}

export default Weather;
