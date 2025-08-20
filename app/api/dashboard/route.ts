import { NextResponse } from "next/server";
import { PrismaClient, LeadStatus } from "@prisma/client";
import { subDays, format, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

export async function GET() {
  // 5 lead terbaru
  const leadsTerbaru = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });
  // Semua deals
  const deals = await prisma.deal.findMany();
  // 5 aktivitas terakhir
  const activitiesTerakhir = await prisma.activity.findMany({
    orderBy: { date: "desc" },
    take: 5,
    include: { lead: { select: { id: true, name: true } } },
  });
  // Leads per hari (7 hari terakhir)
  const leadsPerHari = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const tanggal = format(date, "yyyy-MM-dd");
    const jumlahLeads = await prisma.lead.count({
      where: {
        createdAt: {
          gte: new Date(tanggal + "T00:00:00.000Z"),
          lt: new Date(tanggal + "T23:59:59.999Z"),
        },
      },
    });
    leadsPerHari.push({ tanggal, jumlahLeads });
  }
  // Deals closed per bulan (6 bulan terakhir, status WON)
  const dealsClosedPerBulan = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const bulan = format(subDays(startOfMonth(now), i * 30), "yyyy-MM");
    const totalNilaiDeals = await prisma.deal.aggregate({
      _sum: { dealValue: true },
      where: {
        status: "WON",
        closedAt: {
          gte: new Date(bulan + "-01T00:00:00.000Z"),
          lt: new Date(bulan + "-31T23:59:59.999Z"),
        },
      },
    });
    dealsClosedPerBulan.push({
      bulan,
      totalNilaiDeals: totalNilaiDeals._sum.dealValue || 0,
    });
  }
  // Distribusi status lead
  const statusArr = [
    LeadStatus.OPEN,
    LeadStatus.CONTACTED,
    LeadStatus.PROPOSAL,
    LeadStatus.CLOSED,
  ];
  const distribusiStatusLead = await Promise.all(
    statusArr.map(async (status) => ({
      status,
      jumlah: await prisma.lead.count({ where: { status } }),
    }))
  );
  // Funnel
  const funnel = await Promise.all(
    statusArr.map(async (tahap) => ({
      tahap,
      jumlah: await prisma.lead.count({ where: { status: tahap } }),
    }))
  );
  // Summary
  const totalLeads = await prisma.lead.count();
  const dealsClosed = await prisma.deal.count({ where: { status: "WON" } });
  const newLeads = await prisma.lead.count({
    where: {
      createdAt: {
        gte: subDays(new Date(), 7),
      },
    },
  });
  const revenueAgg = await prisma.deal.aggregate({
    _sum: { dealValue: true },
    where: { status: "WON" },
  });
  const revenue = revenueAgg._sum.dealValue || 0;
  return NextResponse.json({
    leadsTerbaru,
    deals,
    activitiesTerakhir,
    leadsPerHari,
    dealsClosedPerBulan,
    distribusiStatusLead,
    funnel,
    totalLeads,
    dealsClosed,
    newLeads,
    revenue,
  });
}
