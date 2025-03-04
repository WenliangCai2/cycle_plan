import Map from './Map';
import React, { useState } from 'react';
import RestaurantList from "./RestaurantList";


const apikey = '8kY020yd2oSy4ivQKBlxf_a5Bhtizzu0A9deSUakGz8'

const userPosition = { lat: 54.9783, lng: -1.6174 }; // Newcastle
const restaurantList = [
    {
        name: "Eldon Square",
        location: { lat: 54.9747, lng: -1.6134 },
    },
    {
        name: "Tesco Express",
        location: { lat: 54.9775, lng: -1.6142 },
    },
    {
        name: "Grainger Market",
        location: { lat: 54.9728, lng: -1.6145  },
    },
    {
        name: "The Gate",
        location: { lat: 54.9719, lng: -1.6175 },
    },
];

function App() {
    const [selectedRestaurants, setSelectedRestaurants] = useState([]);

    const handleRestaurantClick = (location) => {
        setSelectedRestaurants(prev => {
            const exists = prev.some(l => l.lat === location.lat && l.lng === location.lng);
            return exists
                ? prev.filter(l => !(l.lat === location.lat && l.lng === location.lng))
                : [...prev, location];
        });
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '20px' }}>
                <button onClick={() => setSelectedRestaurants([])}>
                    clean
                </button>
                <RestaurantList
                    list={restaurantList}
                    selectedLocations={selectedRestaurants}
                    onClickHandler={handleRestaurantClick}
                />
            </div>
            <Map
                apikey={apikey}
                userPosition={userPosition}
                selectedLocations={selectedRestaurants}
            />
        </div>
    );
}



export default App;
