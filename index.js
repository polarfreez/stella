const inputField = document.getElementById('input');
const chatMessages = document.getElementById('chat-messages');
const submitButton = document.getElementById('submit');
const loadingContainer = document.getElementById('loading-container');
let newMessage = null;
let userId = getCookie('userId');

// If the userId is not set, generate a new one
if (!userId) {
    userId = 'website-user-' + Math.random().toString(36).substring(2, 15);
    setCookie('userId', userId);
}

inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Event listener for the submit button click
submitButton.addEventListener('click', () => {
    sendMessage();
});

function sendMessage() {
    // Hide the input field and submit button with fade
    inputField.style.opacity = 0;
    submitButton.style.opacity = 0;
    setTimeout(() => {
        inputField.style.display = 'none';
        submitButton.style.display = 'none';
    }, 500);

    // Show the loading spinner with fade
    loadingContainer.style.display = 'block';
    setTimeout(() => {
        loadingContainer.style.opacity = 1;
    }, 500);

    const query = inputField.value;

    const data = {
        text: query,
        key: '4ba7bc8e-5fda-4691-8427-1f5abddaae0d',
        user_id: userId,
        speak: false
    };

    fetch('https://api.carterlabs.ai/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Input:', data.input);
            console.log('Output:', data.output);

            // Create a new message element
            newMessage = document.createElement('div');
            newMessage.classList.add('message');
            newMessage.textContent = data.output.text;

            // Append the message element to the chat messages container
            chatMessages.appendChild(newMessage);

            // Scroll to the bottom of the chat messages container
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Fade in the message element
            setTimeout(() => {
                newMessage.style.display = 'block';
                const messages = document.querySelectorAll('.message');
                if (messages.length > 1) {
                    messages[messages.length - 2].style.opacity = 0;
                    setTimeout(() => {
                        messages[messages.length - 2].remove();
                    }, 1000);
                }
            }, 100);

            // Show the input field and submit button again with fade
            inputField.style.display = 'block';
            submitButton.style.display = 'block';
            setTimeout(() => {
                inputField.style.opacity = 1;
                submitButton.style.opacity = 1;
            }, 50);

            // Hide the loading spinner with fade
            loadingContainer.style.opacity = 0;
            setTimeout(() => {
                loadingContainer.style.display = 'none';
            }, 500);
        })
        .catch(error => {
            console.error('Error:', error);

            // Show the input field and submit button again with fade
            inputField.style.display = 'block';
            submitButton.style.display = 'block';
            setTimeout(() => {
                inputField.style.opacity = 1;
                submitButton.style.opacity = 1;
            }, 50);

            // Hide the loading spinner with fade
            loadingContainer.style.opacity = 0;
            setTimeout(() => {
                loadingContainer.style.display = 'none';
            }, 500);
        });

    // Clear the input field
    inputField.value = '';
}

// Function to get the value of a cookie
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// Function to set the value of a session cookie
function setCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/";
}

const input = document.querySelector("#input");

input.addEventListener("focus", () => {
    input.style.transition = "width 0.5s";
    input.style.width = "300px";
});

input.addEventListener("blur", () => {
    input.style.transition = "width 0.5s";
    input.style.width = "240px"; // Return to the original size
});

input.addEventListener("input", () => {
    const width = Math.min(input.value.length * 10 + 240, input.clientWidth * 0.8);
    input.style.width = `${width}px`;
});
