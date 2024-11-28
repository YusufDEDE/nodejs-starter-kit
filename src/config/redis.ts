import {createClient} from 'redis';

const { REDIS_HOST, REDIS_PORT } = process.env;

const client = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`, // Update with your Redis URL if needed
});

client.on('connect', () => {
    console.log('Connect to Redis...');
});

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.connect().then(() => {
    console.log('Connected to Redis!')
});

export default client;