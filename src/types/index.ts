export interface DashboardData {
    metrics: {
      revenue: number
      users: number
      sales: number
      growth: number
    }
    chart: {
      labels: string[]
      values: number[]
    }
  }