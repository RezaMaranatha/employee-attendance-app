const { Kafka } = require('kafkajs');

async function testConnection() {
  const kafka = new Kafka({
    clientId: 'test-client',
    brokers: ['localhost:9092'],
    retry: {
      initialRetryTime: 1000,
      retries: 3
    }
  });

  const producer = kafka.producer();

  try {
    console.log('Testing Kafka connection...');
    await producer.connect();
    console.log('✅ Successfully connected to Kafka!');
    
    // Test creating a topic
    const admin = kafka.admin();
    await admin.connect();
    
    const topics = await admin.listTopics();
    console.log('Available topics:', topics);
    
    await admin.disconnect();
    await producer.disconnect();
    
  } catch (error) {
    console.error('❌ Failed to connect to Kafka:', error.message);
    process.exit(1);
  }
}

testConnection();
