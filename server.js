const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static('public'));

// Tableau pour gérer les joueurs
let players = [];

io.on('connection', (socket) => {
    console.log('Un joueur est connecté: ' + socket.id);

    // Assigner une couleur unique à chaque joueur
    const color = getRandomColor();

    players.push({ id: socket.id, color: color, lives: 3, x: 100, y: 100 });

    socket.emit('start', { players, color });  // Envoie de la liste des joueurs et de la couleur

    socket.on('move', (data) => {
        // Mise à jour des positions des joueurs
        let player = players.find(p => p.id === socket.id);
        if (player) {
            player.x = data.x;
            player.y = data.y;
        }
        io.emit('update', players);  // Envoie des nouvelles positions à tous
    });

    socket.on('shoot', (data) => {
        // Logique pour gérer le tir et la détection de collision
        console.log(`${socket.id} tire à ${data.angle}`);
        // Ici, tu peux ajouter la logique pour vérifier si le tir touche un autre joueur
    });

    socket.on('disconnect', () => {
        console.log('Un joueur a quitté: ' + socket.id);
        players = players.filter(p => p.id !== socket.id);
        io.emit('update', players);
    });
});

// Fonction pour générer une couleur aléatoire
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

server.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
