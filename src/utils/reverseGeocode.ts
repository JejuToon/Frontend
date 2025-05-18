export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ko`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const components = data.results[0].address_components;

      const dong = components.find(
        (comp: any) =>
          comp.types.includes("administrative_area_level_4") || // 면/동/읍
          comp.types.includes("sublocality_level_2")
      );

      const eupmyeon = components.find((comp: any) =>
        comp.types.includes("sublocality_level_1")
      );

      const si = components.find((comp: any) =>
        comp.types.includes("locality")
      );

      const region = [si?.long_name, eupmyeon?.long_name, dong?.long_name]
        .filter(Boolean)
        .join(" ");

      return region || "알 수 없는 위치";
    } else {
      return null;
    }
  } catch {
    return null;
  }
}
