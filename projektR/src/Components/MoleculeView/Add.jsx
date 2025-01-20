import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../Homepage/Search.css'
//plusic add moze biti kliknut samo ako se vec nalazimo na urlu /molecule/imePrvogSpoja

function Add() {

    const [clicked, setClicked] = useState(false);
    const [secondCompound, setSecondCompound] = useState("");
    const { title } = useParams();
    const firstCompound = title;
    const navigate = useNavigate();
    

    const handleAdd = () => {
        setClicked(true);
    }

    async function handleSearch(event) {
        if(!secondCompound){
            console.log("Second compound not given");
            return;
        } else if (!firstCompound){
            console.log("First compound not given");
        }

        navigate(`/compare/${firstCompound}/${secondCompound}`);
    }

    function handleSecondCompoundChange(event) {
        setSecondCompound(event.target.value);
        console.log("handleCompoundChange " + event.target.value);
    }

    return (
        <div>
            <button className="add" onClick={handleAdd}>+</button>
            {clicked && ( // Conditionally render search input only when clicked is true
                <div className="search-container">
                <input
                    id="search-input"
                    value={secondCompound}
                    onChange={handleSecondCompoundChange}
                    placeholder="Enter chemical compound name"
                />
                <button className="search-btn" onClick={handleSearch}>Search</button>
                </div>
            )}
        </div>
    );
}

export default Add