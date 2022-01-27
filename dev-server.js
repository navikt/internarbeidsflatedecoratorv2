const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: '/hereIsWS' });

function handleJsonMessage(ws, json) {
    if (!json.type || json.type !== 'control') {
        throw Error('Unknown type');
    }

    const data = json.data;

    wss.clients.forEach((client) => client.send(data));
}

function handleMessage(ws, message) {
    try {
        const json = JSON.parse(message);
        handleJsonMessage(ws, json);
    } catch {
        console.log('Received message: ', message);
        ws.send('Message received: ' + message);
    }
}

wss.on('connection', (ws) => {
    console.log('New connection');

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', (message) => handleMessage(ws, message));

    ws.send('Welcome');
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
            console.log('Connection terminated');
            ws.terminate();
        }
        ws.isAlive = false;
        ws.ping(null, false, true);
    });
}, 10000);

server.listen('2999', () => {
    console.log('Started dev-server at 2999');
});
