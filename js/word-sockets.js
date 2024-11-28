(
  function() {
    const socket = new WebSocket('ws://localhost:8765')

    // Event handler for successful connection
    socket.onopen = function(event) {
      console.log('WebSocket connection opened');
      socket.send('Hello from the client!'); // Send a message to the server
    };

    // Event handler for incoming messages
    socket.onmessage = function(event) {
      console.log('Message from server:', event.data);
    };

    // Event handler for errors
    socket.onerror = function(event) {
      console.error('WebSocket error:', event);
    };

    // Event handler for connection closure
    socket.onclose = function(event) {
      console.log('WebSocket connection closed');
    };
  }
)()