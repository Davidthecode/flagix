export const mockDailyVariationUsageProjectWide = [
  {
    date: "2025-11-25",
    on: 12_000,
    off: 25_000,
    "variant-one": 500,
    "variant-two": 800,
    "checking-three": 100,
  },
  {
    date: "2025-11-26",
    on: 12_500,
    off: 24_000,
    "variant-one": 550,
    "variant-two": 850,
    "checking-three": 120,
  },
  {
    date: "2025-11-27",
    on: 13_000,
    off: 23_500,
    "variant-one": 600,
    "variant-two": 900,
    "checking-three": 150,
  },
  {
    date: "2025-11-28",
    on: 13_500,
    off: 23_000,
    "variant-one": 650,
    "variant-two": 950,
    "checking-three": 180,
  },
  {
    date: "2025-11-29",
    on: 14_000,
    off: 22_500,
    "variant-one": 700,
    "variant-two": 1000,
    "checking-three": 200,
  },
  {
    date: "2025-11-30",
    on: 14_500,
    off: 22_000,
    "variant-one": 750,
    "variant-two": 1100,
    "checking-three": 220,
  },
  {
    date: "2025-12-01",
    on: 15_000,
    off: 21_500,
    "variant-one": 800,
    "variant-two": 1200,
    "checking-three": 250,
  },
];

export const mockDailyTopFlagImpressions = [
  {
    date: "2025-11-25",
    "dark-mode-beta": 80_000,
    "instant-search-enabled": 50_000,
    "email-capture-v2": 20_000,
    "new-checkout-flow": 15_000,
    "mobile-nav-refactor": 10_000,
  },
  {
    date: "2025-11-26",
    "dark-mode-beta": 82_000,
    "instant-search-enabled": 55_000,
    "email-capture-v2": 21_000,
    "new-checkout-flow": 16_000,
    "mobile-nav-refactor": 12_000,
  },
  {
    date: "2025-11-27",
    "dark-mode-beta": 85_000,
    "instant-search-enabled": 60_000,
    "email-capture-v2": 22_000,
    "new-checkout-flow": 17_000,
    "mobile-nav-refactor": 11_000,
  },
  {
    date: "2025-11-28",
    "dark-mode-beta": 90_000,
    "instant-search-enabled": 58_000,
    "email-capture-v2": 23_000,
    "new-checkout-flow": 19_000,
    "mobile-nav-refactor": 13_000,
  },
  {
    date: "2025-11-29",
    "dark-mode-beta": 95_000,
    "instant-search-enabled": 62_000,
    "email-capture-v2": 24_000,
    "new-checkout-flow": 21_000,
    "mobile-nav-refactor": 14_000,
  },
  {
    date: "2025-11-30",
    "dark-mode-beta": 100_000,
    "instant-search-enabled": 65_000,
    "email-capture-v2": 26_000,
    "new-checkout-flow": 20_000,
    "mobile-nav-refactor": 15_000,
  },
  {
    date: "2025-12-01",
    "dark-mode-beta": 105_000,
    "instant-search-enabled": 68_000,
    "email-capture-v2": 28_000,
    "new-checkout-flow": 22_000,
    "mobile-nav-refactor": 16_000,
  },
];

// Daily Impressions data for the last 7 days
export const mockFlagUsageData = {
  dailyImpressions: [
    { date: "2025-11-25", impressions: 150_000 },
    { date: "2025-11-26", impressions: 145_000 },
    { date: "2025-11-27", impressions: 160_000 },
    { date: "2025-11-28", impressions: 175_000 },
    { date: "2025-11-29", impressions: 180_000 },
    { date: "2025-11-30", impressions: 210_000 },
    { date: "2025-12-01", impressions: 195_000 },
  ],
  dailyVariationUsageProjectWide: mockDailyVariationUsageProjectWide,
  dailyTopFlagImpressions: mockDailyTopFlagImpressions,
  flagDistribution: [
    { flagKey: "dark-mode-beta", on: 400_000, off: 600_000, total: 1_000_000 },
    { flagKey: "new-checkout-flow", on: 50_000, off: 50_000, total: 100_000 },
    { flagKey: "email-capture-v2", on: 120_000, off: 80_000, total: 200_000 },
    {
      flagKey: "instant-search-enabled",
      on: 700_000,
      off: 300_000,
      total: 1_000_000,
    },
    { flagKey: "mobile-nav-refactor", on: 30_000, off: 70_000, total: 100_000 },
    { flagKey: "old-flag-to-delete", on: 100, off: 100, total: 200 },
  ],
};

// A/B Test Results mock
export const mockABTestResults = [
  {
    experimentName: "New Checkout Flow Test",
    flagKey: "new-checkout-flow",
    metric: "Purchase Completion",
    controlVariation: "off",
    // ⭐️ NEW STRUCTURE: Group results by environment
    environmentResults: [
      {
        environmentName: "production",
        environmentId: "env_prod_xyz",
        variations: [
          {
            name: "off", // Control
            conversions: 2000,
            participants: 50_000,
            conversionRate: 0.04,
            lift: 0.0,
            significance: 1.0,
            status: "tie" as const,
          },
          {
            name: "on", // Variant A (A clear winner in production)
            conversions: 2200,
            participants: 50_000,
            conversionRate: 0.044,
            lift: 0.1, // 10% lift
            significance: 0.98, // Statistically significant
            status: "winning" as const,
          },
        ],
      },
      {
        environmentName: "staging",
        environmentId: "env_stage_abc",
        variations: [
          {
            name: "off", // Control
            conversions: 100,
            participants: 5000,
            conversionRate: 0.02,
            lift: 0.0,
            significance: 1.0,
            status: "tie" as const,
          },
          {
            name: "on", // Variant A (Not a winner in staging, fewer participants)
            conversions: 105,
            participants: 5000,
            conversionRate: 0.021,
            lift: 0.05, // 5% lift
            significance: 0.45, // Not significant
            status: "tie" as const,
          },
        ],
      },
    ],
  },
  {
    experimentName: "Dark Mode Button Location",
    flagKey: "dark-mode-position",
    metric: "Time on Site (min)",
    controlVariation: "top-right",
    // ⭐️ Only running in production
    environmentResults: [
      {
        environmentName: "production",
        environmentId: "env_prod_abc",
        variations: [
          {
            name: "top-right", // Control
            conversions: 1500,
            participants: 25_000,
            conversionRate: 0.06,
            lift: 0.0,
            significance: 1.0,
            status: "tie" as const,
          },
          {
            name: "side-nav", // Variant B (Not significant yet)
            conversions: 1550,
            participants: 25_000,
            conversionRate: 0.062,
            lift: 0.033,
            significance: 0.7,
            status: "tie" as const,
          },
        ],
      },
    ],
  },
];

// Conceptual Mock for daily conversion rates (not the final data source)
export const dummyDailyConversionRates = [
  { date: "2025-11-25", off: 0.04, on: 0.041 },
  { date: "2025-11-26", off: 0.041, on: 0.042 },
  { date: "2025-11-27", off: 0.039, on: 0.045 },
  { date: "2025-11-28", off: 0.04, on: 0.044 },
  { date: "2025-11-29", off: 0.041, on: 0.046 },
  { date: "2025-11-30", off: 0.04, on: 0.048 },
  { date: "2025-12-01", off: 0.042, on: 0.05 },
];
