import Search from '../Homepage/Search.jsx';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../Homepage/Search.css'
//plusic add moze biti kliknut samo ako se vec nalazimo na urlu /molecule/imePrvogSpoja

function Add() {

    const [clicked, setClicked] = useState(false);
    const [secondCompound, setSecondCompound] = useState("");
    const { title } = useParams();
    const firstCompound = title;

    function handleAdd(){
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
            <h1 className="add" onClick={handleAdd()}>+</h1>
            <div v-if={clicked == true} className="search-container">
                <input
                id="search-input"
                value={secondCompound}
                onChange={handleSecondCompoundChange}
                placeholder={"Enter chemical compound name"}
                />
                <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
}

export default Add