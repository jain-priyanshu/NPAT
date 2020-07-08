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
        }
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
    removePlayerFromOrder
}