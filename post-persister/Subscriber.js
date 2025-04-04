import { create } from 'ipfs-core';
import { gql, request } from 'graphql-request';

const GRAPHQL_ENDPOINT = "http://localhost:4002/graphql";

const CREATE_POST_MUTATION = gql`
  mutation createPost($title: String!, $content: String!, $userId: ID!) {
    createPost(title: $title, content: $content, userId: $userId) {
      id
      title
      content
    }
  }
`;

async function createSubscriber() {
    const node = await create({
        repo: './ipfs-subscriber',
        config: {
            Addresses: {
                Swarm: ["/ip4/127.0.0.1/tcp/5001"]
            },
            Bootstrap: []
        }
    });

    if (node.libp2p && node.libp2p.peerId) {
        console.log(`📩 Subscriber ready: ${node.libp2p.peerId.toString()}`);
    } else {
        console.error('Error: peerId is not available');
        return;
    }

    const topic = 'example-topic';

    await node.pubsub.subscribe(topic, async (msg) => {
        try {
            const decodedMessage = new TextDecoder().decode(msg.data);
            console.log(`📩 Received: ${decodedMessage}`);

            const postData = JSON.parse(decodedMessage)?.createPost;
            if (!postData) throw new Error("Invalid post data received.");

            const response = await request(GRAPHQL_ENDPOINT, CREATE_POST_MUTATION, postData);
            console.log(`✅ Post saved to DB:`, response.createPost);
        } catch (error) {
            console.error(`❌ Error processing message:`, error.message);
        }
    });

    console.log(`✅ Subscribed to ${topic}`);
}

createSubscriber().catch(console.error);
