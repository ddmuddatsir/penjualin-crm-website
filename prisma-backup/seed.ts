import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const password = await bcrypt.hash("password123", 10);
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@crm.com" },
      update: {},
      create: {
        name: "Admin CRM",
        email: "admin@crm.com",
        password,
        role: "ADMIN",
      },
    }),
    prisma.user.upsert({
      where: { email: "manager@crm.com" },
      update: {},
      create: {
        name: "Manager CRM",
        email: "manager@crm.com",
        password,
        role: "MANAGER",
      },
    }),
    prisma.user.upsert({
      where: { email: "sales@crm.com" },
      update: {},
      create: {
        name: "Sales CRM",
        email: "sales@crm.com",
        password,
        role: "SALES",
      },
    }),
    prisma.user.upsert({
      where: { email: "user4@crm.com" },
      update: {},
      create: {
        name: "User Four",
        email: "user4@crm.com",
        password,
        role: "SALES",
      },
    }),
  ]);

  // Seed Leads dengan tanggal yang tersebar sepanjang 2025
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        name: "Lead One",
        company: "Company A",
        email: "lead1@company.com",
        status: "OPEN",
        assignedToId: users[0].id,
        createdAt: new Date("2025-01-15"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Two",
        company: "Company B",
        email: "lead2@company.com",
        status: "CONTACTED",
        assignedToId: users[1].id,
        createdAt: new Date("2025-02-20"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Three",
        company: "Company C",
        email: "lead3@company.com",
        status: "PROPOSAL",
        assignedToId: users[2].id,
        createdAt: new Date("2025-03-10"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Four",
        company: "Company D",
        email: "lead4@company.com",
        status: "CLOSED",
        assignedToId: users[3].id,
        createdAt: new Date("2025-04-05"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Five",
        company: "Company E",
        email: "lead5@company.com",
        status: "OPEN",
        assignedToId: users[0].id,
        createdAt: new Date("2025-05-12"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Six",
        company: "Company F",
        email: "lead6@company.com",
        status: "CONTACTED",
        assignedToId: users[1].id,
        createdAt: new Date("2025-06-18"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Seven",
        company: "Company G",
        email: "lead7@company.com",
        status: "PROPOSAL",
        assignedToId: users[2].id,
        createdAt: new Date("2025-07-22"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Eight",
        company: "Company H",
        email: "lead8@company.com",
        status: "CLOSED",
        assignedToId: users[3].id,
        createdAt: new Date("2025-08-14"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Nine",
        company: "Company I",
        email: "lead9@company.com",
        status: "OPEN",
        assignedToId: users[0].id,
        createdAt: new Date("2025-09-08"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Ten",
        company: "Company J",
        email: "lead10@company.com",
        status: "CONTACTED",
        assignedToId: users[1].id,
        createdAt: new Date("2025-10-25"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Eleven",
        company: "Company K",
        email: "lead11@company.com",
        status: "PROPOSAL",
        assignedToId: users[2].id,
        createdAt: new Date("2025-11-16"),
      },
    }),
    prisma.lead.create({
      data: {
        name: "Lead Twelve",
        company: "Company L",
        email: "lead12@company.com",
        status: "CLOSED",
        assignedToId: users[3].id,
        createdAt: new Date("2025-12-03"),
      },
    }),
  ]);

  // Seed Activities dengan tanggal yang tersebar sepanjang 2025
  await Promise.all([
    prisma.activity.create({
      data: {
        type: "MEETING",
        title: "Initial Meeting",
        date: new Date("2025-01-20"),
        leadId: leads[0].id,
        userId: users[0].id,
        notes: "Discussed requirements.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "CALL",
        title: "Follow-up Call",
        date: new Date("2025-02-25"),
        leadId: leads[1].id,
        userId: users[1].id,
        notes: "Client interested.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "DEMO",
        title: "Product Demo",
        date: new Date("2025-03-15"),
        leadId: leads[2].id,
        userId: users[2].id,
        notes: "Demo successful.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "EMAIL",
        title: "Send Proposal",
        date: new Date("2025-04-10"),
        leadId: leads[3].id,
        userId: users[3].id,
        notes: "Proposal sent.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "MEETING",
        title: "Contract Discussion",
        date: new Date("2025-05-18"),
        leadId: leads[4].id,
        userId: users[0].id,
        notes: "Negotiating terms.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "CALL",
        title: "Technical Call",
        date: new Date("2025-06-22"),
        leadId: leads[5].id,
        userId: users[1].id,
        notes: "Technical requirements.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "DEMO",
        title: "Advanced Demo",
        date: new Date("2025-07-28"),
        leadId: leads[6].id,
        userId: users[2].id,
        notes: "Showed advanced features.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "EMAIL",
        title: "Final Proposal",
        date: new Date("2025-08-19"),
        leadId: leads[7].id,
        userId: users[3].id,
        notes: "Final proposal sent.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "MEETING",
        title: "Closing Meeting",
        date: new Date("2025-09-12"),
        leadId: leads[8].id,
        userId: users[0].id,
        notes: "Ready to close.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "CALL",
        title: "Final Call",
        date: new Date("2025-10-30"),
        leadId: leads[9].id,
        userId: users[1].id,
        notes: "Last minute questions.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "DEMO",
        title: "Implementation Demo",
        date: new Date("2025-11-20"),
        leadId: leads[10].id,
        userId: users[2].id,
        notes: "Implementation walkthrough.",
      },
    }),
    prisma.activity.create({
      data: {
        type: "EMAIL",
        title: "Year End Follow-up",
        date: new Date("2025-12-08"),
        leadId: leads[11].id,
        userId: users[3].id,
        notes: "Year end follow-up.",
      },
    }),
  ]);

  // Seed Deals dengan tanggal yang tersebar sepanjang 2025
  await Promise.all([
    prisma.deal.create({
      data: {
        leadId: leads[0].id,
        dealValue: 10000000,
        status: "WON",
        closedAt: new Date("2025-01-30"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[1].id,
        dealValue: 15000000,
        status: "WON",
        closedAt: new Date("2025-02-28"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[2].id,
        dealValue: 8000000,
        status: "WON",
        closedAt: new Date("2025-03-25"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[3].id,
        dealValue: 12000000,
        status: "WON",
        closedAt: new Date("2025-04-15"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[4].id,
        dealValue: 20000000,
        status: "WON",
        closedAt: new Date("2025-05-20"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[5].id,
        dealValue: 18000000,
        status: "WON",
        closedAt: new Date("2025-06-25"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[6].id,
        dealValue: 14000000,
        status: "WON",
        closedAt: new Date("2025-07-30"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[7].id,
        dealValue: 16000000,
        status: "WON",
        closedAt: new Date("2025-08-22"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[8].id,
        dealValue: 22000000,
        status: "WON",
        closedAt: new Date("2025-09-18"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[9].id,
        dealValue: 19000000,
        status: "WON",
        closedAt: new Date("2025-10-28"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[10].id,
        dealValue: 25000000,
        status: "WON",
        closedAt: new Date("2025-11-25"),
      },
    }),
    prisma.deal.create({
      data: {
        leadId: leads[11].id,
        dealValue: 30000000,
        status: "OPEN",
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
