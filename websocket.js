const getCurrentTime = () => {
    const now = new Date();
    // Format the time to "h:mm AM/PM"
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    return now.toLocaleTimeString([], options);
};

const SetupSocketConnections = (io,jwt) => {
  // Socket.IO event handling
  io.use((socket, next) => {
    // Get the JWT token from the handshake headers
    // const token = socket.handshake.headers['authorization'];
    const token = socket.handshake.query.token;
    const connectedEmail = socket.handshake.query.email;

    if (!token) {
      // If no token is present, disconnect the user
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_KEY);
    //   console.log(decoded)
      // Attach user information to the socket object for later use
      // console.log(connectedEmail,decoded.email )
      socket.user = decoded.email;
      next();
    } catch (error) {
      console.error(error);
      // If token verification fails, disconnect the user
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  const groupMembers = {}; // Store group members

  // Socket.IO event handling
  io.on("connection", (socket) => {
    console.log("A user connected", socket.user);

     // Join a group
     socket.on('joinGroup', (groupId, userId) => {
        socket.join(groupId);
        if (!groupMembers[groupId]) {
            groupMembers[groupId] = [];
        }
        groupMembers[groupId].push(userId);
        console.log(`User ${userId} joined group ${groupId}`);
    });

    // Handle custom events
    socket.on("chat message", (groupId,userId,message) => {
      let messageObject = {
        senderName : socket.user,
        user_id : userId,
        time : getCurrentTime(),
        msg :message
      }
    //   console.log("Message from client:", message + groupId);

      io.to(groupId).emit('chat message', messageObject);

      // Broadcast the message to all connected clients
      //io.emit("chat message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = SetupSocketConnections;
