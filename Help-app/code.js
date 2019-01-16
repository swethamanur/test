var map,lat,lng;
let keywordsHandle = document.getElementById('keywords');
let searchHandle = document.getElementById('search');
let errorHandle = document.getElementById('error');
let searchButtonHandle = document.getElementById('searchButton');
var querySearch = [];
var request;
var markers = [];


    //event handlers 
    searchHandle.addEventListener('submit',function(e){
        e.preventDefault();
        querySearch.push(keywordsHandle.value);
        keywordsHandle.value = null;
        errorHandle.innerHTML = null;
        getLocation();
    },false);

    keywordsHandle.addEventListener('blur',function(){
        searchButtonHandle.disabled= false;
        querySearch.push(keywordsHandle.value)
        console.log(querySearch);
    },false);

    //initialze a map
    function initMap(lat,lng) {

        //create a map 
        map = new google.maps.Map(document.getElementById('map'), {

            center: {lat, lng},
            zoom: 10
        });

        //create a request object to submit to nearbySearch method
        request ={
            location: {lat,lng},
            radius: 8047,
            query: querySearch
        };
        
        //create marker on map for user's location
        var userMarker = new google.maps.Marker({
            position: request.location,
            map,
            icon: 'file:///C:/full-stack-mern-july/projects/APP-Ideas/Coffee-shop-locator/Help-app/icons/person.png',
            label: {
            text: 'you are here!',
            fontWeight: 'bold'}
        });

        //pushing the user's marker to the markers array
        markers.push(userMarker);

        placesService(map,request);

            //add event listener on the map to choose a diff user's location
        google.maps.event.addListener(map,'rightclick',function(event){

            //create marker and pan
            placeMarkerAndPanTo(event.latLng,map);
            
            //create a new request object to be sent to PlacesService
            var newRequest ={
                location: event.latLng,
                radius: 8047,
                query: querySearch
            };

            //generate nearby places
            placesService(map,newRequest);
        });
    
    };

    /*****************************Helper Functions********************************************** */ 
    
    //Marker for new position
    function placeMarkerAndPanTo(latLng,map){
        clearMarker(markers);
             
        var newMarker = new google.maps.Marker({
            position: latLng,
            map,
            label: {
                text: 'New Location',
                fontWeight: 'bold'
            }
        });
        markers.push(newMarker);
        map.panTo(latLng);

    };

    //function for placesService object
    function placesService(map,newRequest){
          var service = new google.maps.places.PlacesService(map);
          service.textSearch(newRequest,callback);
    };

    //callback function from the placesService -nearBySearch method
    function callback(results,status){
        
    if(status == google.maps.places.PlacesServiceStatus.OK){
        if(results.length != 0){
            results.forEach((result) =>{
                createMarker(result);
            })
        }else{
            errorHandle.innerHTML = 'Oops! We could not find anything with that! Try with better words'
        }
        }
    };

    //create marker function
    function createMarker(place){
        var marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        //icon: 'file:///C:/Users/Manjunath/AppData/Local/Temp/Temp1_map-icons-master.zip/map-icons-master/src/icons/cafe.svg',
        });

        //pushing this marker to the markers array
        markers.push(marker);  

        //create infowindow and event listener
        var infoWindow = new google.maps.InfoWindow({
            content: `<b>${place.name}</b>`
        });

        google.maps.event.addListener(marker,'click',function(){
            infoWindow.open(map, marker);
        })
    };

    //clear Marker function
    function clearMarker(markers){
        console.log(markers,'inside clear marker');
        // markers.forEach((marker) =>{
        //     marker.setMap(null);
        // });
        for(var i = 0; i < markers.length; i++){
            markers[i].setMap(null);
        }
        markers.length = 0;
    };

    //geolocation function to get user's current location using HTML5 geolocation
    function getLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success);//success is a callback function that gets called upon success that takes an object as input
        }
        else{
            console.log('Sorry, geolocation is not supported in your bworser');
        }
    };

    //callback function that generates a postion object and determines the location's lat and lng
    function success(position){
        console.log('2. generated coordinates','lat',lat);
        lat = position.coords.latitude;
        console.log('3. generated coordinates','lat',lat);
        lng = position.coords.longitude;

        initMap(lat,lng);
        
    };   
      