'use strict';
const imageRootURL= 'https://api.unsplash.com/search/photos?';
const imageAPI= 'ep8A89YFGZbZ6LVOC0XiSQB1gz_t239jb4znTUynjyk';
let imagePageNumber = 1;

function formatQueryParams(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayImageResults(responseJson){
    $('#image-result-list').empty();
    for (let i= 0; i < responseJson.results.length; i++){
        $('#image-result-list').append(
            `<li><a href=${responseJson.results[i].urls.regular}>
            <img src=${responseJson.results[i].urls.thumb} alt=${responseJson.results[i].description}>
            </a>
            </li>`
        )};
    $('#image-results').removeClass('hidden');
};

function getReferenceImages(poseSearch){
    const params = {
        query: poseSearch,
        page: imagePageNumber,
        per_page: 10,
        client_id: imageAPI
    }

    const queryString = formatQueryParams(params)
    const imageURL = imageRootURL + queryString;

    fetch(imageURL)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(responseJson => displayImageResults(responseJson))
    .catch(err =>{
        $('#js-error-message').text(`Something went wrong: ${err.message}`)
    })
}

function watchForm(){
    $('#js-form').submit(event => {
        event.preventDefault();
        const poseSearch= $('#js-pose').val();
        getReferenceImages(poseSearch);
    })
}
$(function(){
    console.log("App Loaded!")
    watchForm();
})