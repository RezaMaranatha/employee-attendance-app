const { Kafka } = require('kafkajs');

async function testKafkaMessage() {
  const kafka = new Kafka({
    clientId: 'test-producer',
    brokers: ['localhost:9092'],
  });

  const producer = kafka.producer();

  try {
    console.log('🔌 Connecting to Kafka...');
    await producer.connect();
    console.log('✅ Connected to Kafka');

    const testMessage = {
      eventType: 'USER_CREATED',
      userId: 'test-user-123',
      userData: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'employee',
        department: 'Engineering',
        position: 'Developer',
        phoneNumber: '+1234567890',
      },
      changedBy: 'admin',
      timestamp: new Date().toISOString(),
      changes: [],
    };

    console.log('📤 Sending test message to topic: user-data-changes');
    console.log('Message:', JSON.stringify(testMessage, null, 2));

    await producer.send({
      topic: 'user-data-changes',
      messages: [
        {
          key: testMessage.userId,
          value: JSON.stringify(testMessage),
        },
      ],
    });

    console.log('✅ Test message sent successfully!');
    console.log('📝 Check your logging service console for the received message');

    await producer.disconnect();
    console.log('🔌 Disconnected from Kafka');

  } catch (error) {
    console.error('❌ Failed to send test message:', error);
    process.exit(1);
  }
}

testKafkaMessage();
