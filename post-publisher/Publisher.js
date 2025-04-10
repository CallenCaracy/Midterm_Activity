import { create } from 'ipfs-core';

function generatePost() {
    const randomNum = Math.floor(Math.random() * 10000);
    return {
        id: Math.floor(Math.random() * 1000).toString(),
        title: `Post Title ${randomNum}`,
        content: `Content for post number ${randomNum}`,
        userId: Math.floor(Math.random() * 5 + 1).toString()
    };
}

async function createPublisher() {
    const node = await create({
        repo: './ipfs-publisher',
        config: {
            Addresses: {
                Swarm: ["/ip4/127.0.0.1/tcp/5002"]
            },
            Bootstrap: []
        }
    });

    if (node.libp2p && node.libp2p.peerId) {
        console.log(`📤 Publisher ready: ${node.libp2p.peerId.toString()}`);
    } else {
        console.error('Error: peerId is not available');
        return;
    }

    const topic = 'example-topic';

    setInterval(async () => {
        const post = generatePost();
        const message = JSON.stringify({
            createPost: post
        });

        try {
            await node.pubsub.publish(topic, new TextEncoder().encode(message));
            console.log(`📤 Published: ${message}`);
        } catch (err) {
            console.error(`❌ Publish Error: ${err.message}`);
        }
    }, 3000);
}

createPublisher().catch(console.error);
