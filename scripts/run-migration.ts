import prisma from '../lib/prisma'
import { readFileSync } from 'fs'
import { join } from 'path'

async function runMigration() {
    try {
        console.log('🚀 Starting Better Auth manual migration...')

        // Read the SQL file
        const sqlPath = join(process.cwd(), 'prisma', 'migrations', 'manual_better_auth_migration.sql')
        const sql = readFileSync(sqlPath, 'utf-8')

        // Split by semicolons and execute each statement
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'))

        console.log(`📝 Executing ${statements.length} SQL statements...`)

        for (const statement of statements) {
            if (statement.includes('SELECT')) {
                // For SELECT statements, show the results
                const result = await prisma.$queryRawUnsafe(statement)
                console.log('Query result:', result)
            } else {
                await prisma.$executeRawUnsafe(statement)
            }
        }

        console.log('✅ Migration completed successfully!')
        console.log('📊 Verifying tables...')

        // Verify the migration
        const userCount = await prisma.user.count()
        console.log(`✓ Users: ${userCount}`)

        const sessionCount = await prisma.$queryRaw`SELECT COUNT(*) FROM "Session"`
        console.log(`✓ Sessions table created`)

        const accountCount = await prisma.$queryRaw`SELECT COUNT(*) FROM "Account"`
        console.log(`✓ Accounts table created`)

        const verificationCount = await prisma.$queryRaw`SELECT COUNT(*) FROM "Verification"`
        console.log(`✓ Verification table created`)

        console.log('\n🎉 All done! Better Auth tables are ready.')

    } catch (error) {
        console.error('❌ Migration failed:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

runMigration()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
