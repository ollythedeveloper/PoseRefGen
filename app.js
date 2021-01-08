'use strict';
//Constants used in the functions
const imageRootURL= 'https://api.unsplash.com/search/photos?';
const imageAPI= 'ep8A89YFGZbZ6LVOC0XiSQB1gz_t239jb4znTUynjyk';
const videoRootURL= 'https://www.googleapis.com/youtube/v3/search?';
const videoAPI= 'AIzaSyB_80hd_V9QuYE39fqQ75hIFpYrTApnNuM';
let imagePageNumber = 1;

//This function formats the queryString used in the getReferenceImages and getYoutubeVideos functions
function formatQueryParams(params){
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//This function formats how the requested Unsplash data is displayed on the webpage
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

//This function formats how the requested Youtube data is displayed on the webpage
function displayVideoReslts(responseJson){
    $('#video-result-list').empty();
    for(let i = 0; i < responseJson.items.length; i++){
        $('#video-result-list').append(
            `<li>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${responseJson.items[i].id.videoId}" 
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
            encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </li>`
        )};
    $('#video-results').removeClass('hidden');
};

//This function formats the query url and requests data from the Unsplash API
//If there are no errors the JSON response is put into the displayImageResults function
//If there is an error, its caught and an error message displayed on the page
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
//This function formats the query url and requests data from the Youtube API
//If there are no errors the JSON response is put into the displayVideoResults function
//If there is an error, its caught and an error message is displayed on the page
function getYoutubeVideos(poseSearch){
    const params = {
        key: videoAPI,
        q: 'how to draw ' + poseSearch,
        part:'snippet',
        maxResults: 4,
        videoEmbeddable: true,
        type: 'video'
    }

    const queryString = formatQueryParams(params)
    const videoUrl = videoRootURL + queryString
    
    fetch(videoUrl)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(responseJson => displayVideoReslts(responseJson))
    .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`)
    })
}
//This function prevents the submit event default and puts the submited value(poseSearch) into
//the getReferenceImages and getYoutubeVidoes functions
function watchForm(){
    $('#js-form').submit(event => {
        event.preventDefault();
        const poseSearch= $('#js-pose').val();
        getReferenceImages(poseSearch);
        getYoutubeVideos(poseSearch);
    })
}
$(function(){
    watchForm();
})
