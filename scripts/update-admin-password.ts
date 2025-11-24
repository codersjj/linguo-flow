import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function updateAdminPassword() {
    const password = 'password123'
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log('Updating admin password...')
    console.log('New hash:', hashedPassword)

    await prisma.user.update({
        where: { email: 'shanewestlife@outlook.com' },
        data: { password: hashedPassword }
    })

    console.log('Password updated successfully!')

    // Verify
    const user = await prisma.user.findUnique({
        where: { email: 'shanewestlife@outlook.com' }
    })

    if (user?.password) {
        const match = await bcrypt.compare(password, user.password)
        console.log('Verification - Password matches:', match)
    }

    await prisma.$disconnect()
}

updateAdminPassword().catch(console.error)
