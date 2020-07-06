const socket = io()
const roomForm = document.getElementById('room-form')
const roomName = document.getElementById('room-name')
const playerName = document.getElementById('player-name')
const mainForm = document.getElementById('main-form')
const name = document.getElementById('name')
const place = document.getElementById('place')
const animal = document.getElementById('animal')
const things = document.getElementById('things')

var first = document.querySelector('.first')
var wait = document.querySelector('.wait')
var start = document.querySelector('.start')
var nameList = document.querySelector('.name-list')
var roomMsg = document.querySelector('.roomMsg')

socket.on('getRoom', () => {
    first.style.display = 'block'
    var getRoom = function(event){
        event.preventDefault()
        var room = roomName.value
        var name = playerName.value
        console.log(room, name)
        socket.emit('sendRoom', {room : room, name : name})
        roomName.value = ''
        playerName.value = ''
    }
    roomForm.addEventListener('submit', getRoom)
    socket.on('roomAgain', () => {
        roomForm.removeEventListener('submit', getRoom)
    })
})

socket.on('removeRoomForm', () => {
    first.style.display = 'none';
})

socket.on('wait', () => {
    wait.style.display = 'block'
})

socket.on('dltWait', () => {
    wait.style.display = 'none'
})

socket.on('start', (data) => {
    roomMsg.innerHTML = `Room : ${data.room}`
    for(let i = 0; i < data.players.length; i++){
        if(data.players[i].room == data.room){
            const div = document.createElement('div')
            div.innerHTML = `${data.players[i].name}`
            nameList.appendChild(div)
        }
    }
    start.style.display = 'block'
})

socket.on('getMainForm', () => {
    var getMain = function(event){
        event.preventDefault()
        var name_ = name.value
        var place_ = place.value
        var animal_ = animal.value
        var things_ = things.value
        console.log(name_, place_, animal_, things_)
        socket.emit('sendMainForm', {
            name : name_,
            place : place_,
            animal : animal_,
            things : things_
        })
        name.value = ''
        place.value = ''
        animal.value = ''
        things.value = ''
    }
    mainForm.addEventListener('submit', getMain)
})