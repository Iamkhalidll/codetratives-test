// prisma/seeds/analytics.seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export async function seedAnalytics(prisma: PrismaClient) {
  try {
    // Read the analytics data
    const analyticsData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../db/pickbazar/analytics.json'),
        'utf-8'
      )
    );

    // Create or update analytics record
    const analytics = await prisma.analytics.upsert({
      where: {
        id: 1, // Assuming we'll always have one analytics record
      },
      update: {
        totalRevenue: analyticsData.totalRevenue,
        totalRefunds: analyticsData.totalRefunds,
        totalShops: analyticsData.totalShops,
        totalVendors: analyticsData.totalVendors,
        todaysRevenue: analyticsData.todaysRevenue,
        totalOrders: analyticsData.totalOrders,
        newCustomers: analyticsData.newCustomers,
        todayTotalOrderByStatus: analyticsData.todayTotalOrderByStatus,
        weeklyTotalOrderByStatus: analyticsData.weeklyTotalOrderByStatus,
        monthlyTotalOrderByStatus: analyticsData.monthlyTotalOrderByStatus,
        yearlyTotalOrderByStatus: analyticsData.yearlyTotalOrderByStatus,
        totalYearSaleByMonth: analyticsData.totalYearSaleByMonth,
      },
      create: {
        totalRevenue: analyticsData.totalRevenue,
        totalRefunds: analyticsData.totalRefunds,
        totalShops: analyticsData.totalShops,
        totalVendors: analyticsData.totalVendors,
        todaysRevenue: analyticsData.todaysRevenue,
        totalOrders: analyticsData.totalOrders,
        newCustomers: analyticsData.newCustomers,
        todayTotalOrderByStatus: analyticsData.todayTotalOrderByStatus,
        weeklyTotalOrderByStatus: analyticsData.weeklyTotalOrderByStatus,
        monthlyTotalOrderByStatus: analyticsData.monthlyTotalOrderByStatus,
        yearlyTotalOrderByStatus: analyticsData.yearlyTotalOrderByStatus,
        totalYearSaleByMonth: analyticsData.totalYearSaleByMonth,
      },
    });

    // Optionally, if you want to store monthly sales separately
    const currentYear = new Date().getFullYear();
    for (const sale of analyticsData.totalYearSaleByMonth) {
      await prisma.monthlySale.upsert({
        where: {
          month_year: {
            month: sale.month,
            year: currentYear,
          },
        },
        update: {
          total: sale.total,
          analyticsId: analytics.id,
        },
        create: {
          month: sale.month,
          total: sale.total,
          year: currentYear,
          analyticsId: analytics.id,
        },
      });
    }

    console.log('✅ Analytics seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding analytics:', error);
    throw error;
  }
}