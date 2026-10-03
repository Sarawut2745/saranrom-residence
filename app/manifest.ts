import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "เดอะ สราญรมย์ - จดมิเตอร์น้ำไฟ",
    short_name: "จดมิเตอร์",
    description: "ระบบจดมิเตอร์น้ำไฟและออกบิล The Saranrom Residence & Apartment",
    start_url: "/staff/meter-reading",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    orientation: "portrait",
    icons: [
      {
        src: "/logo-icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
