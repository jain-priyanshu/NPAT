const socket = io()
const roomForm = document.getElementById('room-form')
const roomName = document.getElementById('room-name')
const playerName = document.getElementById('player-name')

var first = document.querySelector('.first')
var wait = document.querySelector('.wait')
var start = document.querySelector('.start')

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

socket.on('start', () => {
    start.style.display = 'block'
})