const socket = io();

const chatId = document.getElementById('chatId').innerHTML.toString();
const message_input = document.getElementById('message-input');
const senderId = document.getElementById('senderId').innerHTML;
const chatMessages = document.getElementById('chat-messages');

// user join chat
socket.emit('join', chatId);
// Listen for chat history from the server
socket.on('chat history', (history) => {
    // Display chat history on the client side
    //history.forEach((message) => {
    // displayMessage(message);
    // });
    
    for (let i=0; i<history.length; i++){
        displayMessage(history[i]);
    }
});

//Listen for incoming chat messages from the server
socket.on('send_message', (msg) => {
    //Display the received message
    displayMessage(msg);
});

// User typing
const type = () =>{
    message_input.addEventListener('keypress', ()=>{
        const messageInput = document.getElementById('message-input');

        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && messageInput.value.length > 0) {
                //If enter key is pressed and the input is not empty, send the message
                sendMessage();
            } else if (messageInput.value.length > 1) {
                socket.emit('user_typing');
            }
        });
    });

    socket.on('typing',(use)=>{
        document.getElementById('typing').innerHTML = `typing...`

        setTimeout(() => {
            document.getElementById('typing').innerHTML = '';
        }, 4000);
    })
}

type()

//Function to send a message to the server
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = {
        content : messageInput.value.toString(),
        timestamp: new Date(),
        senderId: senderId,
    }

    //Emit the message to the server
    socket.emit('message', {chatId, message});

    //Clear the input field
    messageInput.value = '';

}

// Function to display a new chat message
function displayMessage(message) {
    //- const chatMessages = document.getElementById('chat-messages');
    //- const li = document.createElement('li');
    //- li.textContent = message;
    //- chatMessages.appendChild(li);
    //const isScrolledToBottom = chatMessages.scrollHeight - chatMessages.clientHeight <= chatMessages.scrollTop + 1;

    const timestamp = new Date(message.timestamp);
    
    if (message.senderId === senderId) {
        chatMessages.innerHTML += `
        <div class="right"> 
            <div class="p-2 bg-blue-500 text-white rounded-lg">
                <p class="break-words text-wrap w-80">
                    ${message.content}
                </p>
                <p class="chatTime text-gray-600 truncate">
                    ${timestamp.toLocaleTimeString()}
                </p>
            </div>
        </div>
    `;
    }

    if (message.senderId !== senderId) {
        chatMessages.innerHTML += `
            <div class="left"> 
                <div class="p-2 bg-gray-300 rounded-lg">
                    <p class="break-words text-wrap w-80">
                        ${message.content}
                    </p>
                    <p class="chatTime text-gray-700 truncate">
                        ${timestamp.toLocaleTimeString()}
                    </p>
                </div>
            </div>
        `;
    }

    // // Scroll to the bottom if already at the bottom before the new message
    // if (isScrolledToBottom) {
    //     chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
    // }
    scrollToBottom()
}
    
function scrollToBottom(){
    console.log(chatMessages.scrollHeight)
    chatMessages.scrollTo(0, chatMessages.scrollHeight)
}