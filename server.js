const path = require('path')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const {
    players,
    joinPlayer,
    removePlayer,
    order,
    removePlayerFromOrder
} = require('./data/player')
const { join } = require('path')

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html')
})

io.on('connect', (socket) => {

    socket.on('disconnect', () => {
        removePlayer(socket.id)
        removePlayerFromOrder(socket.id)
    })

    const player = joinPlayer(socket.id)
    console.log(players)
    socket.emit('getRoom')

    socket.on('sendRoom', (data) => {
        player.room = data.room
        player.name = data.name
        let c = 0;
        for(let i = 0; i < players.length; i++){
            if(players[i].room == data.room){
                c += 1;
            }
        }
        if(c > 3){
            player.room = null;
            player.name = null;
            console.log('room full')
            socket.emit('roomAgain')
            socket.emit('getRoom')
        }
        else if(c == 3){
            socket.join(data.room)
            socket.broadcast.to(data.room).emit('dltWait')
            io.to(data.room).emit('start', {room : data.room})
            io.to(data.room).emit('result', {players : players, room : data.room})
            io.to(data.room).emit('getMainForm', {room : data.room})
            socket.emit('removeRoomForm')
        }
        else{
            socket.join(data.room)
            socket.emit('removeRoomForm')
            socket.emit('wait')
        }
    })

    socket.on('sendMainForm', (data) => {
        console.log(data.name, data.place, data.animal, data.things)
        player.answers.name = data.name
        player.answers.place = data.place
        player.answers.animal = data.animal
        player.answers.things = data.things
        let c = 0
        for(let i = 0; i < players.length; i++){
            if(players[i].room == data.room && players[i].answers.name == null){
                c++
            }
        }
        if(c > 0){
            order.push(player)
            socket.emit('removeMainForm')
            socket.emit('wait')
        }
        else{
            order.push(player)
            socket.emit('removeMainForm')
            socket.broadcast.to(data.room).emit('dltWait')
            io.to(data.room).emit('getVoteForm', {order : order, room : data.room})
        }
    })

    socket.on('sendVoteForm', (data) => {
        player.vote = true
        let score = 0
        for(let i = 0; i < data.result_arr.length; i++){
            if(data.result_arr[i] == true){
                score += 5
            }
        }
        var id = data.beingVoted.id
        var index = players.findIndex((player) => player.id == id)
        players[index].score += score
        let c = 0
        for(let i = 0; i < players.length; i++){
            if(players[i].room == data.room && players[i].vote == false){
                c++
            }
        }
        if(c > 0){
            socket.emit('removeVoteForm')
            socket.emit('wait')
            io.to(data.room).emit('dltResult')
            io.to(data.room).emit('result', {players : players, room : data.room})
        }
        else{
            for(let i = 0; i < players.length; i++){
                if(players[i].room == data.room){
                    players[i].vote = false
                }
            }
            io.to(data.room).emit('dltResult')
            io.to(data.room).emit('result', {players : players, room : data.room})
            socket.broadcast.to(data.room).emit('dltWait')
            socket.emit('removeVoteForm')
            removePlayerFromOrder(id)
            let remaining = 0;
            for(let i = 0; i < order.length; i++){
                if(order[i].room == data.room){
                    remaining++
                }
            }
            if(remaining > 0){
                io.to(data.room).emit('voteAgain')
                io.to(data.room).emit('getVoteForm', {order : order, room : data.room})
            }
            else{
                console.log('play again?')
            }
        }
    })
})

http.listen(process.env.PORT || 5000, () => {
    console.log('Connected')
})