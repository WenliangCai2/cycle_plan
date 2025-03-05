import Map from './Map';
import React, { useState, useEffect } from 'react';
import RestaurantList from "./RestaurantList";

const apikey = '8kY020yd2oSy4ivQKBlxf_a5Bhtizzu0A9deSUakGz8';

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
        location: { lat: 54.9728, lng: -1.6145 },
    },
    {
        name: "The Gate",
        location: { lat: 54.9719, lng: -1.6175 },
    },
];

function App() {
    const [selectedRestaurants, setSelectedRestaurants] = useState([]);
    const [customPoints, setCustomPoints] = useState([]); // Store custom points
    const [newPointName, setNewPointName] = useState(''); // Custom point name
    const [newPointLocation, setNewPointLocation] = useState({ lat: null, lng: null }); // Custom point location

    // Handle restaurant click event
    const handleRestaurantClick = (location) => {
        setSelectedRestaurants(prev => {
            const exists = prev.some(l => l.lat === location.lat && l.lng === location.lng);
            return exists
                ? prev.filter(l => !(l.lat === location.lat && l.lng === location.lng))
                : [...prev, location];
        });
    };

    // Handle custom point form submission
    const handleAddCustomPoint = (e) => {
        e.preventDefault();
        console.log('Form submitted'); // Log submission
        if (newPointName && newPointLocation.lat && newPointLocation.lng) {
            const newPoint = {
                name: newPointName,
                location: newPointLocation,
                isCustom: true, // Mark as custom point
            };
            setCustomPoints(prev => [...prev, newPoint]);
            setNewPointName('');
            setNewPointLocation({ lat: null, lng: null });
        } else {
            console.error('Missing name or location'); // Log error
        }
    };

    // Handle map click event (to get custom point location)
    const handleMapClick = (lat, lng) => {
        console.log('Map click received:', lat, lng); // Log map click
        setNewPointLocation({ lat, lng });
    };

    // Merge predefined points and custom points
    const allPoints = [...restaurantList, ...customPoints];

    // Listen for changes in customPoints state
    useEffect(() => {
        console.log('Custom points updated:', customPoints); // Log custom points update
    }, [customPoints]);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Left Panel */}
            <div style={{ width: '300px', padding: '20px', backgroundColor: '#f5f5f5', boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)' }}>
                {/* Add Custom Point Form */}
                <form onSubmit={handleAddCustomPoint} style={{ marginBottom: '20px' }}>
                    <h3 style={styles.heading}>Add Custom Point</h3>
                    <input
                        type="text"
                        placeholder="Enter custom point name"
                        value={newPointName}
                        onChange={(e) => setNewPointName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <div style={{ marginTop: '10px' }}>
                        <span style={styles.label}>Click on the map to select location</span>
                        <div style={styles.locationDisplay}>
                            {newPointLocation.lat && newPointLocation.lng
                                ? `Selected Location: ${newPointLocation.lat.toFixed(4)}, ${newPointLocation.lng.toFixed(4)}`
                                : 'No location selected'}
                        </div>
                    </div>
                    <button
                        type="submit"
                        style={styles.button}
                    >
                        Add Custom Point
                    </button>
                </form>

                {/* Clear Selection Button */}
                <button
                    onClick={() => setSelectedRestaurants([])}
                    style={styles.button}
                >
                    Clear Selection
                </button>

                {/* Display All Points (including custom points) */}
                <RestaurantList
                    list={allPoints}
                    selectedLocations={selectedRestaurants}
                    onClickHandler={handleRestaurantClick}
                />
            </div>

            {/* Map Component */}
            <div style={{ flex: 1 }}>
                <Map
                    apikey={apikey}
                    userPosition={userPosition}
                    selectedLocations={selectedRestaurants}
                    onMapClick={handleMapClick} // Pass map click event handler
                    customPoints={customPoints} // Pass custom points
                    restaurantList={restaurantList}
                />
            </div>
        </div>
    );
}

// CSS Styles
const styles = {
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '20px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
    },
    heading: {
        fontSize: '18px',
        marginBottom: '10px',
        color: '#333',
    },
    label: {
        fontSize: '14px',
        color: '#666',
    },
    locationDisplay: {
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginTop: '5px',
        fontSize: '14px',
        color: '#333',
    },
};

export default App;