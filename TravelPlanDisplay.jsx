import { useState, useRef } from "react";
import { FaMapMarkerAlt, FaStar, FaHotel } from "react-icons/fa";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

// Fix default icon issues in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const createNumberedIcon = (number) => {
  return L.divIcon({
    html: `<div style="
      background-color: #2a64e8; 
      color: white; 
      border-radius: 50%; 
      width: 28px; 
      height: 28px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: bold;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 0 2px rgba(0,0,0,0.5);
    ">${number}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const normalizeCoords = (coords) => {
  if (Array.isArray(coords)) return coords;
  if (typeof coords === "string") return coords.split(",").map(Number);
  return [0, 0];
};

const MapView = ({ hotels, itinerary, selectedDay }) => {
  const dayPlan = itinerary.find((d) => d.day === selectedDay);

  const hotelMarkers = hotels.map((hotel, i) => {
    const [lat, lng] = normalizeCoords(hotel.coords);
    return {
      id: `hotel-${i}`,
      name: hotel.name,
      coords: [lat, lng],
      type: "hotel",
      price: hotel.price,
      rating: hotel.rating,
      addr: hotel.addr,
    };
  });

  const placeMarkers = dayPlan
    ? dayPlan.places.map((place, i) => {
        const [lat, lng] = normalizeCoords(place.coords);
        return {
          id: `place-${i}`,
          name: place.name,
          coords: [lat, lng],
          desc: place.desc,
          ticket: place.ticket,
          travel_time: place.travel_time,
          rating: place.rating,
          best_time: place.best_time,
          type: "place",
        };
      })
    : [];

  const markers = [...hotelMarkers, ...placeMarkers];
  const center = markers.length > 0 ? markers[0].coords : [20, 77];
  const route = placeMarkers.map((m) => m.coords);

  return (
    <MapContainer
      center={center}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MarkerClusterGroup>
        {markers.map(({ id, name, coords, type, ...rest }, index) => (
          <Marker
            key={id}
            position={coords}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup>
              <strong>{name}</strong>
              {type === "hotel" ? (
                <>
                  <br />
                  <span>{rest.addr}</span>
                  <br />
                  <span>💰 {rest.price}</span>
                  <br />
                  <span>🌟 {rest.rating}</span>
                </>
              ) : (
                <>
                  <br />
                  <span>{rest.desc}</span>
                  <br />
                  <span>🎟 Ticket: {rest.ticket}</span>
                  <br />
                  <span>🕐 Travel Time: {rest.travel_time}</span>
                  <br />
                  <span>🌟 Rating: {rest.rating}</span>
                  <br />
                  <span>🕰 Best Time: {rest.best_time}</span>
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {route.length > 1 && <Polyline positions={route} color="red" />}
    </MapContainer>
  );
};

const TravelPlanDisplay = ({ data }) => {
  if (!data) return null;

  const hotelSectionRef = useRef();
  const itinerarySectionRefs = useRef([]);
  const { hotels, itinerary } = data;
  const [selectedDay, setSelectedDay] = useState(itinerary[0]?.day || 1);

  const addToItineraryRefs = (el, index) => {
    if (el && !itinerarySectionRefs.current.includes(el)) {
      itinerarySectionRefs.current[index] = el;
    }
  };

  const printContent = () => {
    const content = document.createElement("div");

    const hotelSection = hotelSectionRef.current.cloneNode(true);
    content.appendChild(hotelSection);

    const itineraryTitle = document.createElement("h2");
    itineraryTitle.className = "text-2xl font-bold mb-4 mt-8";
    itineraryTitle.textContent = "Full Itinerary";
    content.appendChild(itineraryTitle);

    itinerary.forEach((dayPlan, index) => {
      const dayTitle = document.createElement("h3");
      dayTitle.className = "text-xl font-semibold mb-3 mt-6";
      dayTitle.textContent = `Day ${dayPlan.day}`;
      content.appendChild(dayTitle);

      if (itinerarySectionRefs.current[index]) {
        const daySection = itinerarySectionRefs.current[index].cloneNode(true);
        content.appendChild(daySection);
      }
    });

    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(
      `body { font-family: Arial, sans-serif; padding: 20px; }`
    );
    printWindow.document.write("</style></head><body>");
    printWindow.document.write(content.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        <button
          onClick={printContent}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow"
        >
          🖨️ Print Full Itinerary
        </button>
      </div>

      <div className="mt-6 space-y-10">
        {/* Hotels */}
        <section ref={hotelSectionRef}>
          <h2 className="text-2xl font-bold mb-4">🏨 Hotels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {hotels.map((hotel, i) => {
              const [lat, lng] = normalizeCoords(hotel.coords);
              const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

              return (
                <div
                  key={i}
                  className="border rounded-xl p-4 bg-white w-auto shadow-sm flex items-start gap-4"
                >
                  <div className="text-blue-600 text-2xl pt-1">
                    <FaHotel />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{hotel.addr}</p>
                    <p className="text-sm">💰 {hotel.price}</p>
                    <p className="text-sm">🌟 {hotel.rating}</p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm mt-1 inline-block underline"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Itinerary */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🗺️ Itinerary</h2>

          <div className="flex space-x-3 mb-6">
            {itinerary.map(({ day }) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded-full border ${
                  selectedDay === day
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Day {day}
              </button>
            ))}
          </div>

          <MapView
            hotels={hotels}
            itinerary={itinerary}
            selectedDay={selectedDay}
          />

          {itinerary.map((dayPlan, index) => (
            <div
              key={dayPlan.day}
              ref={(el) => addToItineraryRefs(el, index)}
              className={`mt-6 space-y-5 ${
                selectedDay === dayPlan.day ? "" : "hidden"
              }`}
            >
              {dayPlan.places.map((place, j) => {
                const [lat, lng] = normalizeCoords(place.coords);
                const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

                return (
                  <div
                    key={j}
                    className="border rounded-xl p-4 bg-white shadow-sm flex items-start gap-4"
                  >
                    <div className="text-red-500 text-2xl pt-1">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h4 className="font-semibold text-md">{place.name}</h4>
                      <p className="text-sm text-gray-700">{place.desc}</p>

                      <div className="text-xs mt-2 space-y-0.5 text-gray-600">
                        <p>🎟 Ticket: {place.ticket}</p>
                        <p>🕐 Travel Time: {place.travel_time}</p>
                        <p>
                          🌟 Rating: {place.rating}{" "}
                          <FaStar className="inline text-yellow-400 ml-1" />
                        </p>
                        <p>🕰 Best Time: {place.best_time}</p>
                      </div>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm mt-2 inline-block underline"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </section>
      </div>
    </>
  );
};

export default TravelPlanDisplay;
