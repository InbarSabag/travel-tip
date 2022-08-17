export const locService = {
    getLocs,
    createLoc,
    createLocList,
    getLocs,
    getLocByID,
    deleteLoc,
    findLoc
}

import { mapService } from './map.service.js'
import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'

// todo 3: create pickLoc - 

//**** VARIABLES: *********************************************//
let gLocs = []
const STORAGE_KEY = 'locsDB'

//**** FUNCTIONS: *********************************************//
function createLoc(name, lat, lng) {
    let loc = {
        id: utilService.makeId(),
        name,
        lat,
        lng,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
    gLocs.push(loc)
    storageService.save(STORAGE_KEY, gLocs)
    return loc
}

function createLocList() {
    if(storageService.load(STORAGE_KEY) || storageService.load(STORAGE_KEY) === [] ){
        gLocs = storageService.load(STORAGE_KEY)
    } 
    else{
        createLoc('Greatplace', 32.047104, 34.832384)
        createLoc('Neveragain', 33.047104, 35.832384)
    }
    storageService.save(STORAGE_KEY, gLocs)
    console.log('🚀 ~ createLocList ~ gLocs', gLocs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 2000)
    })
}

function getLocByID(id){
    return gLocs.find(loc => loc.id === id) 
} 

function deleteLoc(id){
    const idxToDelete = gLocs.findIndex(loc => loc.id === id)
    gLocs.splice(idxToDelete,1)
    storageService.save(STORAGE_KEY, gLocs)
}

function findLoc(val){
    const API_KEY = 0
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${val},+CA&key=${API_KEY}`)
    .then(res => {
        const prmLoc = res.data
        const lat = prmLoc.results[0].geometry.location.lat
        const lng = prmLoc.results[0].geometry.location.lng
        
        mapService.panTo(lat, lng)        
    })
}
