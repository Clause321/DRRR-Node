/**
 * Created by yingfeiwang on 1/26/15.
 */
var server = require('http').createServer();
var io = require('socket.io')(server);

var redis_client = require('redis').createClient();
var Rebound = require("node-rebound");

var his_queue = new Rebound({
    size: 40,
    redis: redis_client,
    namespace: 'rebound-his-queue'
});

io.on('connection', function(client){
    console.log('Client connected...');

    client.on('join', function(data){
        client.icon = data.icon;
        client.username = data.username;
        var res = '--' + client.username + ' logged in.';
        client.broadcast.emit('announce', res);
        his_queue.add(JSON.stringify({type: "announce", content: res}), function(err){});

        his_queue.all(function(err, items){
            for(var i = items.length - 1; i >= 0; i--){
                var obj = JSON.parse(items[i]);
                if(obj.type == 'announce') client.emit('announce', obj.content);
                else client.emit('message', obj.content);
            }
        });
    });

    client.on('message', function(msg){
        var res = {msg: msg, username: client.username, icon: client.icon};
        client.emit('message', res);
        client.broadcast.emit('message', res);
        his_queue.add(JSON.stringify({type: "message", content: res}), function(err){});
    });

    client.on('disconnect', function(){
        var res = '--' + client.username + ' logged out';
        client.emit('announce', res);
        client.broadcast.emit('announce', res);
        his_queue.add(JSON.stringify({type: "announce", content: res}), function(err){});
    });
});

server.listen(8080, 'chat.feiclause.com');

console.log('listening to port 8080');