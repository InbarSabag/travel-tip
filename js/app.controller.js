import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const appController = {
    renderLocationModal,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoToLoc = onGoToLoc
window.onDelete = onDelete
window.onAddMarker = onAddMarker
window.onPickLoc = onPickLoc


//**** FUNCTIONS: *********************************************//

function onInit() {
    locService.createLocList()
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
    renderLocList()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}


function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            onGoToLoc(pos.coords.latitude, pos.coords.longitude)
            panTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function renderLocList() {
    locService.getLocs()
        .then(locs => {
            console.log('🚀 ~ renderLocList ~ locs', locs)
            const locsCards = locs.map(loc => `
    <div class="loc-card">
        <div class="card-head">
            <p class="loc-name">${loc.name}</p>
        </div>
        <div class="card-body">
            <p class="position"><span class="bold">coordinates:</span>&nbsp;${loc.lat}&nbsp;,&nbsp;${loc.lng}</p>
            <p class="date"><span class="bold">Saved at:</span>&nbsp;${loc.createdAt}</p>
            <button class="btn btn-go" onclick="onGoToLoc(${loc.lat},${loc.lng})">Go there!</button>
            <button class="btn btn-delete" onclick="onDelete(${loc.id})">Delete</button>
        </div>
    </div>
    `)
            document.querySelector('.loc-cards-container').innerHTML = locsCards.join('')
        })
}

function onGoToLoc(lat, lng) {
    mapService.panTo(lat, lng)
}

function onDelete(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'The location has been deleted.',
                'success'
            )
        }
    })
    locService.deleteLoc(id)
    renderLocList()
}


// fix who call this func? it cant be called from the service func - init map..
function onPickLoc(lat, lng) {
    mapService.addMarker({ lat, lng })
    const { value: nameTag } = await Swal.fire({
        title: 'Enter name tag',
        input: 'text',
        inputValue: inputValue,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })

    if (nameTag) {
        Swal.fire(`You choose to call this location "${nameTag}"`)
        locService.createLoc(nameTag, lat, lng)
    }

}