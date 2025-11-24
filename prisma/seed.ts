import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const lessons = [
  {
    id: 'int-001',
    title: 'The Art of Small Talk',
    description: 'Learn the nuances of starting conversations in professional settings.',
    stage: 'intermediate',
    type: 'video',
    duration: '12:30',
    thumbnail: 'https://picsum.photos/800/450?random=1',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript: `Good morning everyone. Today we are going to discuss the subtle art of small talk.
    
Many people believe small talk is just "filler" conversation, but in the business world, it is the glue that holds relationships together.
    
For example, asking "How was your weekend?" isn't just a query about time usage; it's a signal that you see the other person as a human being, not just a resource.
    
Let's look at three key techniques: The Mirror, The Bridge, and The Anchor.`
  },
  {
    id: 'int-002',
    title: 'Ordering at a Restaurant',
    description: 'Master the vocabulary needed for fine dining experiences.',
    stage: 'intermediate',
    type: 'audio',
    duration: '08:45',
    thumbnail: 'https://picsum.photos/800/450?random=2',
    mediaUrl: '',
    transcript: `Host: Good evening, welcome to Le Petit Bistro. Do you have a reservation?
    
Guest: Yes, under the name Smith for two people.
    
Host: Excellent. Right this way.
    
[Sound of walking and sitting]
    
Waiter: Can I start you off with some sparkling water or perhaps an aperitif?`
  },
  {
    id: 'adv-001',
    title: 'Debating Complex Topics',
    description: 'Structures for agreeing, disagreeing, and pivoting arguments.',
    stage: 'advanced',
    type: 'video',
    duration: '15:20',
    thumbnail: 'https://picsum.photos/800/450?random=3',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript: `While I see your point regarding the economic downturn, I have to respectfully disagree with the conclusion that austerity is the only solution.
    
On the contrary, historical data suggests that stimulus spending often yields better long-term recovery rates.
    
Let's pivot to the topic of sustainability. Ideally, we find a middle ground.`
  },
  {
    id: 'mov-001',
    title: 'Classic Cinema: The Monologue',
    description: 'Analyzing famous movie speeches for intonation and stress.',
    stage: 'movies',
    type: 'mixed',
    duration: '05:10',
    thumbnail: 'https://picsum.photos/800/450?random=4',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    transcript: `You talkin' to me? You talkin' to me? Then who the hell else are you talkin' to? You talkin' to me?
    
Well, I'm the only one here. Who the f**k do you think you're talking to?`
  }
];

async function main() {
  console.log('Seeding database...')

  // Seed Lessons
  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        stage: lesson.stage as any,
        type: lesson.type as any,
        duration: lesson.duration,
        thumbnail: lesson.thumbnail,
        mediaUrl: lesson.mediaUrl,
        transcript: lesson.transcript,
      }
    })
  }

  // Seed Admin User
  const adminEmail = 'shanewestlife@outlook.com'
  const adminPassword = await bcrypt.hash('password123', 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword }, // Update password on re-seed
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: adminPassword,
    }
  })

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })