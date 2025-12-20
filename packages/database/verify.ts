
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
    console.log('Verifying EventConfirmation schema...');

    try {
        try {
            // 1. Create a dummy calendar
            const calendar = await prisma.calendar.create({
                data: {
                    title: 'Verification Calendar',
                    type: 'monthly',
                    startDate: new Date(),
                    endDate: new Date(),
                },
            });
            console.log(`Created calendar: ${calendar.id}`);

            // 2. Create a confirmation
            const confirmation = await prisma.eventConfirmation.create({
                data: {
                    calendarId: calendar.id,
                    startAt: new Date(),
                    endAt: new Date(),
                    message: 'This is confirmed!',
                    participantIds: ['user-1', 'user-2'],
                },
            });
            console.log(`Created confirmation: ${confirmation.id}`);

            // 3. Read back
            const readBack = await prisma.eventConfirmation.findUnique({
                where: { calendarId: calendar.id },
                include: { calendar: true },
            });

            if (!readBack) throw new Error('Failed to read back confirmation');
            if (readBack.message !== 'This is confirmed!') throw new Error('Message mismatch');
            if (readBack.participantIds.length !== 2) throw new Error('Participant count mismatch');

            console.log('Verification successful!');

            // Cleanup
            await prisma.calendar.delete({ where: { id: calendar.id } });
            console.log('Cleanup done.');

        } catch (error) {
            console.error('Verification failed:', error);
            process.exit(1);
        } finally {
            await prisma.$disconnect();
        }
    }

verify();
