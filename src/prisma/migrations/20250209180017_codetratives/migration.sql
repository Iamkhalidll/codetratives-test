-- CreateTable
CREATE TABLE "analytics" (
    "id" SERIAL NOT NULL,
    "totalRevenue" DECIMAL(10,2) NOT NULL,
    "totalRefunds" DECIMAL(10,2) NOT NULL,
    "totalShops" INTEGER NOT NULL,
    "totalVendors" INTEGER NOT NULL,
    "todaysRevenue" DECIMAL(10,2) NOT NULL,
    "totalOrders" INTEGER NOT NULL,
    "newCustomers" INTEGER NOT NULL,
    "todayTotalOrderByStatus" JSONB NOT NULL,
    "weeklyTotalOrderByStatus" JSONB NOT NULL,
    "monthlyTotalOrderByStatus" JSONB NOT NULL,
    "yearlyTotalOrderByStatus" JSONB NOT NULL,
    "totalYearSaleByMonth" JSONB[],
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthly_sales" (
    "id" SERIAL NOT NULL,
    "month" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "analyticsId" INTEGER NOT NULL,

    CONSTRAINT "monthly_sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monthly_sales_month_year_key" ON "monthly_sales"("month", "year");

-- AddForeignKey
ALTER TABLE "monthly_sales" ADD CONSTRAINT "monthly_sales_analyticsId_fkey" FOREIGN KEY ("analyticsId") REFERENCES "analytics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
