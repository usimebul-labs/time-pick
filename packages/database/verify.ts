
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    console.log('Verifying EventConfirmation schema...');

    try {
        // 1. Create a dummy event
        const event = await prisma.event.create({
            data: {
                title: 'Verification Event',
                type: 'monthly',
                startDate: new Date(),
                endDate: new Date(),
            },
        });
        console.log(`Created event: ${event.id}`);

        // 2. Create a confirmation
        const confirmation = await prisma.eventConfirmation.create({
            data: {
                eventId: event.id,
                startAt: new Date(),
                endAt: new Date(),
                message: 'This is confirmed!',
                participantIds: ['user-1', 'user-2'],
            },
        });
        console.log(`Created confirmation: ${confirmation.id}`);

        // 3. Read back
        const readBack = await prisma.eventConfirmation.findUnique({
            where: { eventId: event.id },
            include: { event: true },
        });

        if (!readBack) throw new Error('Failed to read back confirmation');
        if (readBack.message !== 'This is confirmed!') throw new Error('Message mismatch');
        if (readBack.participantIds.length !== 2) throw new Error('Participant count mismatch');

        console.log('Verification successful!');

        // Cleanup
        await prisma.event.delete({ where: { id: event.id } });
        console.log('Cleanup done.');

    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
