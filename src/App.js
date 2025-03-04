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
    const [restaurantPosition, setRestaurantPosition] = useState(null);

    const onClickHandler_ = (location) => {
        setRestaurantPosition(location);
    };

    return ( <
            div style = {
            {
                display: 'flex'
            }
        } >
            <
                RestaurantList list = {
                restaurantList
            }
                               onClickHandler = {
                                   onClickHandler_
                               }
            /> <
            Map apikey = {
            apikey
        }
                userPosition = {
                    userPosition
                }
                restaurantPosition = {
                    restaurantPosition
                }
        /> <
        /div>
    );
}



export default App;
