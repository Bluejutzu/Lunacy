function disconnectAndClear(connections: RBXScriptConnection[]) {
    for (const connection of connections) {
        connection.Disconnect();
    }
    connections.clear()
}

export default disconnectAndClear;