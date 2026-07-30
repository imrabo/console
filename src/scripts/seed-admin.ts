import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

import { ensureIAdminUser } from "@/lib/firebase/seed-admin";


async function main() {
    await ensureIAdminUser();
    console.log("Admin seeded successfully.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});