export const locService = {
    getLocs
}

// todo 4: Build the LocationService managing Locations: {id, name, lat, lng, weather, createdAt, updatedAt}
// todo 3: create create loc - 
// todo 5: saveLocationsToStorage (bring storage service)
// todo 7: loc service getLocByID(id) 
// todo 7: loc service deleteLoc(id) -> renderLocList(list)


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


