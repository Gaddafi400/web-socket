const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
console.log('protocol: ' + protocol)

const serverUrl = `${protocol}://${window.location.host}`
console.log('serverUrl : ' + serverUrl)

const socket = new WebSocket(serverUrl)

socket.onopen = function(event) {
    console.log('Connected to the WebSocket server')
};

socket.onerror = function(error) {
    console.error('WebSocket Error:', error)
};

socket.onmessage = function(event) {
    const chatBox = document.getElementById('chat-box');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');

    if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
            newMessage.textContent = reader.result;
            console.log('on message: ', reader.result);
            chatBox.appendChild(newMessage);
        };
        reader.readAsText(event.data);
    } else {
        newMessage.textContent = event.data;
        console.log('on message: ', event.data);
        chatBox.appendChild(newMessage);
    }
};

document.getElementById('send-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value.trim();

    if (message) {
        socket.send(message);
        messageInput.value = '';
    }
});