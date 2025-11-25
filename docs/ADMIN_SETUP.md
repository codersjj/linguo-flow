# Admin Access Setup

## Environment Variables

To enable admin access to the admin panel, you need to add the following environment variables to your `.env` file:

```bash
# Admin Access
# Set this to the email address of the admin user (server-side check)
ADMIN_EMAIL=your-admin-email@example.com

# Public Admin Email (for client-side admin button visibility)
# This should match ADMIN_EMAIL
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

## How It Works

1. **Server-side Protection**: The `/admin` routes are protected by checking if the logged-in user's email matches `ADMIN_EMAIL` (in `app/admin/layout.tsx`)

2. **Client-side UI**: The admin button in the navbar only appears for users whose email matches `NEXT_PUBLIC_ADMIN_EMAIL`

3. **Admin Button Location**: 
   - Desktop: Between the search bar and user info in the navbar
   - Mobile: In the mobile menu dropdown

## Usage

Once configured, admin users will see a "Admin" button with a shield icon in the navigation bar. Clicking it will take them to `/admin` where they can manage lessons.
