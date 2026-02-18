import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) => {
  return AVAILABLE_PLACES.find((place) => place.id === id);
});

function getStoredIds() {
  return JSON.parse(localStorage.getItem("selectedPlaces")) || [];
}

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availiblePlaces, setAvailiblePlaces] = useState([]);
  const [modalIsOpen, setModaIsOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude,
      );
      setAvailiblePlaces(sortedPlaces);
    });
  }, []);

  useEffect(() => {
    const pickedIds = pickedPlaces.map((place) => place.id);
    localStorage.setItem("selectedPlaces", JSON.stringify(pickedIds));
  }, [pickedPlaces]);

  function handleStartRemovePlace(id) {
    setModaIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModaIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    // const storedIds = getStoredIds() || [];
    // if (storedIds.indexOf(id) === -1) {
    //   localStorage.setItem(
    //     "selectedPlaces",
    //     JSON.stringify([id, ...storedIds]),
    //   );
    // }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current),
    );
   setModaIsOpen(false);

    // const storedIds = getStoredIds();
    // localStorage.setItem(
    //   "selectedPlaces",
    //   JSON.stringify(
    //     storedIds.filter((id) => {
    //       return id !== selectedPlace.current;
    //     }),
    //   ),
    // );
  }

  return (
    <>
      <Modal open={modalIsOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availiblePlaces}
          fallbackText={"Sorting places by distance..."}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
