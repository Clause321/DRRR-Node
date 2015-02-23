/**
 * Created by yingfeiwang on 1/26/15.
 */
var server = require('http').createServer();
var io = require('socket.io')(server);

var redis_client = require('redis').createClient();
var Rebound = require("node-rebound");

his_queue = new Rebound({
    size: 40,
    redis: redis_client,
    namespace: 'rebound-his-queue'
});

io.on('connection', function(client){
    console.log('Client connected...');

    client.on('join', function(data){
        his_queue.all(function(err, items){
            for(var i = items.length - 1; i >= 0; --i){
                if(items[i].type == 'announce') client.emit('announce', items[i].content);
                else client.emit('message', items[i].content);
            }
        });

        client.icon = data.icon;
        client.username = data.username;
        var res = '--' + client.username + ' logged in.';
        client.emit('announce', res);
        client.broadcast.emit('announce', res);
        his_queue.add({type: 'announce', content: res});
    });

    client.on('message', function(msg){
        var res = {msg: msg, username: client.username, icon: client.icon};
        client.emit('message', res);
        client.broadcast.emit('message', res);
        his_queue.add({type: 'message', content: res});
    });

    client.on('disconnect', function(){
        var res = '--' + client.username + ' logged out';
        client.emit('announce', res);
        client.broadcast.emit('announce', res);
        his_queue.add({type: 'announce', content: res});
    });
});

//server.listen(8080, 'chat.feiclause.com');
server.listen(8080, 'localhost');

console.log('listening to port 8080');