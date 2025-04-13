const displaySearch = ()=>{
    
    const selectMethod = document.querySelector("#selectMethod").value;
    if(selectMethod == "Search City"){
        document.querySelector("#searchCtn").style.display = "flex"
    }else{
        document.querySelector("#searchCtn").style.display = "none"

    }
}



function renderCurrentLocationData(){
    try {
        
    } catch (error) {
        
    }

}

renderCurrentLocationData();

