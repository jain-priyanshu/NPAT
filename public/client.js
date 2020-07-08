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
const placeResult = document.getElementById('place-result')
const animalResult = document.getElementById('animal-result')
const thingsResult = document.getElementById('things-result')

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

socket.on('result', (data) => {
    for(let i = 0; i < data.players.length; i++){
        if(data.players[i].room == data.room){
            const div = document.createElement('div')
            div.innerHTML = `${data.players[i].name} : ${data.players[i].score}`
            nameList.appendChild(div)
        }
    }
})

socket.on('dltResult', () => {
    let len = nameList.childNodes.length
	for (let i = len - 1; i >= 0; i--) {
		nameList.removeChild(nameList.childNodes[i])
	}
})

socket.on('start', (data) => {
    roomMsg.innerHTML = `Room : ${data.room}`
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
    socket.on('mainAgain', () => {
        mainForm.removeEventListener('submit', getMain)
    })
})

socket.on('removeMainForm', () => {
    mainForm.style.display = 'none'
})

socket.on('getVoteForm', (data) => {
    let beingVoted = null;
    for(let i = 0; i < data.order.length; i++){
        if(data.order[i].room == data.room){
            beingVoted = data.order[i]
            nameVote.innerHTML = data.order[i].answers.name
            placeVote.innerHTML = data.order[i].answers.place
            animalVote.innerHTML = data.order[i].answers.animal
            thingsVote.innerHTML = data.order[i].answers.things
            vote.style.display = 'block'
            break;
        }
    }
    var getVote = function(event){
        event.preventDefault()
        console.log(nameResult.checked, placeResult.checked, animalResult.checked, thingsResult.checked)
        socket.emit('sendVoteForm', {
            beingVoted : beingVoted,
            result_arr : [nameResult.checked, placeResult.checked, animalResult.checked, thingsResult.checked],
            room : data.room
        })
        nameResult.checked = false
        placeResult.checked = false
        animalResult.checked = false
        thingsResult.checked = false
    }
    voteForm.addEventListener('submit', getVote)
    socket.on('voteAgain', () => {
        voteForm.removeEventListener('submit', getVote)
    })
})

socket.on('removeVoteForm', () => {
    vote.style.display = 'none'
})