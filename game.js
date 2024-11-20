const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let playerColor;
let players = [];

// Attente du démarrage du jeu
socket.on('start', (data) => {
    playerColor = data.color;
    players = data.players;
    requestAnimationFrame(updateGame);
});

// Mettre à jour les positions des joueurs
socket.on('update', (data) => {
    players = data;
});

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer l'écran

    // Dessiner tous les joueurs
    players.forEach(player => {
        ctx.fillStyle = player.color;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(updateGame); // Mettre à jour l'écran
}

// Contrôler le joueur
document.addEventListener('keydown', (e) => {
    let movement = { x: 0, y: 0 };

    if (e.key === 'ArrowUp') movement.y = -5;
    if (e.key === 'ArrowDown') movement.y = 5;
    if (e.key === 'ArrowLeft') movement.x = -5;
    if (e.key === 'ArrowRight') movement.x = 5;

    if (movement.x || movement.y) {
        const player = players.find(p => p.color === playerColor);
        if (player) {
            player.x += movement.x;
            player.y += movement.y;
            socket.emit('move', { x: player.x, y: player.y });
        }
    }
});
