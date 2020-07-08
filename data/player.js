const players = []
const order = []
const joinPlayer = (socketId) => {
    const player = {
        name: null,
        id: socketId,
        score: 0,
        room: null,
        vote : false,
        answers: {
            name: null,
            place: null,
            animal: null,
            things: null
        },
        round : 1
    }
    players.push(player)
    return player
}

function removePlayer(id) {
	const index = players.findIndex((player) => player.id === id)
	if (index !== -1) {
		players.splice(index, 1)
	}
}

function resetAnswers(room){
    for(let i = 0; i < players.length; i++){
        if(players[i].room == room){
            players[i].round++
            players[i].answers.name = null
            players[i].answers.place = null
            players[i].answers.animal = null
            players[i].answers.things = null
        }
    }
}

function removePlayerFromOrder(id) {
	const index = order.findIndex((player) => player.id === id)
	if (index !== -1) {
		order.splice(index, 1)
	}
}

module.exports = {
    players,
    joinPlayer,
    removePlayer,
    order,
    removePlayerFromOrder,
    resetAnswers
}