/**
 * Created by yingfeiwang on 1/26/15.
 */
var server = require('http').createServer();
var io = require('socket.io')(server);

io.on('connection', function(client){
    console.log('Client connected...');

    client.on('join', function(data){
        client.icon = data.icon;
        client.username = data.username;
        var res = '--' + client.username + ' logged in.';
        client.emit('announce', res);
        client.broadcast.emit('announce', res);
    });

    client.on('message', function(msg){
        var res = {msg: msg, username: client.username, icon: client.icon};
        client.emit('message', res);
        client.broadcast.emit('message', res);
    });

    client.on('disconnect', function(){
        var res = '--' + client.username + ' logged out';
        client.emit('announce', res);
        client.broadcast.emit('announce', res);
    });
});

server.listen(8080, 'chat.feiclause.com');

console.log('listening to port 8080');