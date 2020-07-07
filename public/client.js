const socket = io()
const roomForm = document.getElementById('room-form')
const roomName = document.getElementById('room-name')
const playerName = document.getElementById('player-name')
const mainForm = document.getElementById('main-form')
const voteForm = document.getElementById('vote-form')
const name = document.getElementById('name')
const place = document.getElementById('place')
const animal = document.getElementById('animal')
const things = document.getElementById('things')
const nameResult = document.getElementById('name-result')
const placeResult = document.getElementById('placeResult')
const animalResult = document.getElementById('animalResult')
const thingsResult = document.getElementById('thingsResult')

var first = document.querySelector('.first')
var wait = document.querySelector('.wait')
var start = document.querySelector('.start')
var vote = document.querySelector('.vote')
var nameList = document.querySelector('.name-list')
var roomMsg = document.querySelector('.roomMsg')
var nameVote = document.querySelector('.name-vote')
var placeVote = document.querySelector('.place-vote')
var animalVote = document.querySelector('.animal-vote')
var thingsVote = document.querySelector('.things-vote')

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

socket.on('getMainForm', (data) => {
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
            things : things_,
            room : data.room
        })
        name.value = ''
        place.value = ''
        animal.value = ''
        things.value = ''
    }
    mainForm.addEventListener('submit', getMain)
})

socket.on('removeMainForm', () => {
    mainForm.style.display = 'none'
})

socket.on('getVoteForm', (data) => {
    for(let i = 0; i < data.order.length; i++){
        if(data.order[i].room == data.room){
            nameVote.innerHTML = data.order[i].answers.name
            placeVote.innerHTML = data.order[i].answers.place
            animalVote.innerHTML = data.order[i].answers.animal
            thingsVote.innerHTML = data.order[i].answers.things
            vote.style.display = 'block'
            break;
        }
    }
    
})