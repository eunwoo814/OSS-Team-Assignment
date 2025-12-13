import axios from "axios";

export type WeatherNow = {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  time: string;
  text: string;
};

function codeToText(code: number) {
  if (code === 0) return "맑음";
  if (code === 1 || code === 2 || code === 3) return "구름";
  if (code === 45 || code === 48) return "안개";
  if ([51, 53, 55, 56, 57].includes(code)) return "이슬비";
  if ([61, 63, 65, 66, 67].includes(code)) return "비";
  if ([71, 73, 75, 77].includes(code)) return "눈";
  if ([80, 81, 82].includes(code)) return "소나기";
  if ([95, 96, 99].includes(code)) return "뇌우";
  return "알 수 없음";
}

export async function fetchWeatherNow(lat: number, lon: number): Promise<WeatherNow> {
  const url = "https://api.open-meteo.com/v1/forecast";
  const params = {
    latitude: lat,
    longitude: lon,
    current: "temperature_2m,weather_code,wind_speed_10m",
    timezone: "Asia/Seoul",
  };

  const res = await axios.get(url, { params });
  const cur = res.data?.current;

  const weatherCode = Number(cur?.weather_code ?? 0);

  return {
    temperature: Number(cur?.temperature_2m ?? 0),
    windSpeed: Number(cur?.wind_speed_10m ?? 0),
    weatherCode,
    time: String(cur?.time ?? ""),
    text: codeToText(weatherCode),
  };
}
