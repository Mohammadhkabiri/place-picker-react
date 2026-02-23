import Places from "./Places.jsx";
import { useState, useEffect } from "react";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailibePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    setIsFetching(true);
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/places");
        const responseData = await response.json();
        setAvailibePlaces(responseData.places);
        if (!response.ok) {
          throw new Error("cant load data");
        }
      } catch (error) {
        setError(error);
      }
      setIsFetching(false);
    }
    fetchData();
  }, []);

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      loadingText={"Fetching place data..."}
      isLoading={isFetching}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
