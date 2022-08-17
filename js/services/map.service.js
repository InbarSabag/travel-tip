
export const mapService = {
    initMap,
    addMarker,
    panTo,
    addMarker  
}

//**** VARIABLES: *********************************************//
// Var that is used throughout this Module (not global)
var gMap
var gLoc

//**** FUNCTIONS: *********************************************//
function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            const gMap = new google.maps.Map(document.getElementById("map"), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
            gMap.addListener("click", (mapsMouseEvent) => {
                gLoc = JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
                // console.log('gLoc:', mapsMouseEvent.pixel)
                
                const locationObj = mapsMouseEvent.pixel
                console.log('locationObj:', locationObj)
                
            })
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    console.log('🚀 ~ panTo ~ laLatLng', laLatLng)
    gMap.panTo(laLatLng)
    addMarker(laLatLng)
    
}

//**** INTERNAL FUNCTIONS: ************************************//
function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 0
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}