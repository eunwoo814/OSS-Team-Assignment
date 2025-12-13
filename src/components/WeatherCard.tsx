import { useEffect, useState } from "react";
import { fetchWeatherNow, WeatherNow } from "../lib/weather";

type Props = {
  lat: number;
  lon: number;
  title?: string;
};

export default function WeatherCard({ lat, lon, title = "현재 날씨" }: Props) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState<WeatherNow | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    fetchWeatherNow(lat, lon)
      .then((w) => {
        if (!alive) return;
        setData(w);
      })
      .catch(() => {
        if (!alive) return;
        setErr("날씨 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [lat, lon]);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "12px 14px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        {loading ? (
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            불러오는 중...
          </div>
        ) : err ? (
          <div style={{ fontSize: 13, color: "#ef4444", marginTop: 4 }}>
            {err}
          </div>
        ) : data ? (
          <div style={{ fontSize: 13, color: "#4b5563", marginTop: 4 }}>
            {data.text} · {data.temperature}°C · 바람 {data.windSpeed} m/s
          </div>
        ) : null}
      </div>
      <div style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
        {data?.time ? data.time.replace("T", " ") : ""}
      </div>
    </div>
  );
}
