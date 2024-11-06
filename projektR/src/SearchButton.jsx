
function SearchButton(){

    function handleInput(event){
        if(event.target.value === "") return ;
        fetch("/`${event.target.value}`").then(
            console.log(event.target.value)
        )
    }

    return(
        <button className="search-btn" onClick={handleInput}>
           SEARCH
        </button>
    );
}

export default SearchButton