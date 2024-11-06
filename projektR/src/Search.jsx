import React, {useState} from 'react';

import SearchButton from './SearchButton';

function Search(){

    const[chemCompound, setChemCompound] = useState("");

    function handleCompoundChange(event){
        setChemCompound(event.target.value);
    }

    return(
        <>
            <div className="search-container">
                <input id="search-input" value={chemCompound} onChange={handleCompoundChange} 
                placeholder='Enter chemical compound name'/>
                <SearchButton/>
            </div>       
        </>
    );

}

export default Search