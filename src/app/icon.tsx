import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#1c1d2c",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Lock body */}
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <rect x="2" y="9" width="14" height="11" rx="2" fill="#d9b76e" />
          <path
            d="M5 9V6a4 4 0 0 1 8 0v3"
            stroke="#d9b76e"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="9" cy="14" r="1.5" fill="#1c1d2c" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
