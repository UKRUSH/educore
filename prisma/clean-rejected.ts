import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanRejectedApplications() {
  console.log("🧹 Cleaning up REJECTED applications...\n");
  
  try {
    // Delete all REJECTED applications
    const deletedRejected = await prisma.clubApplication.deleteMany({
      where: {
        status: "REJECTED"
      }
    });
    console.log(`✅ Deleted ${deletedRejected.count} REJECTED applications`);
    
    // Also check for any orphaned applications
    const allApps = await prisma.clubApplication.findMany({
      include: {
        club: true,
        applicant: true
      }
    });
    
    console.log(`\n📊 Remaining applications: ${allApps.length}`);
    allApps.forEach(app => {
      console.log(`   - ${app.club.name}: ${app.status} (${app.applicant.email})`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanRejectedApplications();