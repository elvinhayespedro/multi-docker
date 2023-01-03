const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(_index) {
    if (_index < 2) return 1;
    return fib(_index - 1) + fib(_index - 2);
}

sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

// anytime value is inserted to redis
sub.subscribe('insert');