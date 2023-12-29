const socket = io();

        //Function to send a message to the server
        function sendMessage() {
            const messageInput = document.getElementById('message-input');
            const message = messageInput.value;
            console.log(message);
            //console.log("message sent");
            //Emit the message to the server
            socket.emit('message', message);

            //Clear the input field
            messageInput.value = '';

        }

        // Function to display a new chat message
        function displayMessage(message) {
            //- const chatMessages = document.getElementById('chat-messages');
            //- const li = document.createElement('li');
            //- li.textContent = message;
            //- chatMessages.appendChild(li);
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML += `
            <div> 
                <div id='message'>
                    <p>
                        ${message}
                    </p>
                </div>
            </div>
            `
        }
        

        //Listen for incoming chat messages from the server
        socket.on('send_message', (msg) => {
        //Display the received message
        displayMessage(msg);
        });

// const socket = io()

// const user = "odong";//document.getElementById('name').innerHTML
// const chat_window = document.getElementById('chat_messages');
// const chat_input = document.getElementById('message_input');
// const send_button = document.getElementById('send');

// const send = ()=>{
//     if(chat_input.value.length >= 1){
//         socket.emit('message',{
//             chat_input: chat_input.value,
//             user: user
//         })

//         chat_input.value = ''
//     }
// }

// send_button.addEventListener('click',()=>{
//     console.log("button clicked");
//    send()
// })

socket.on('send_message',(msg)=>{

    chat_window.innerHTML += `
    <div> 
        <div id='message'>
            <p>
                <strong>${msg.user}:</strong> ${msg.chat_input}
            </p>
        </div>
    </div>
    `
})

// User typing
// const type = () =>{
//     chat_input.addEventListener('keypress', ()=>{
//         if(chat_input.value.length > 1){
//             //socket.emit('user_typing', l_online)
//         }
//         if (event.key === 'Enter') {
//            send()
//         }
//     })

//     socket.on('typing',(use)=>{
//         //hed.innerHTML = `${use} is typing . . .`

//         setTimeout(() => {
//             //hed.innerHTML = l_online
//         }, 5000);
//     })
// }

// type()