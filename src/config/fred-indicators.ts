import { BarChart3, Briefcase, TrendingUp, Landmark, AreaChart, Home, Users, Scale, LineChart, DollarSign, Percent, BarChart, TrendingDown, CreditCard, Banknote, Building, ShoppingCart, Activity } from 'lucide-react';

export interface Indicator {
    id: string;
    title: string;
    units: string;
}

export interface IndicatorGroup {
    title: string;
    icon: React.ComponentType<any>;
    description: string;
    indicators: Indicator[];
}

export const indicatorGroups: IndicatorGroup[] = [
    {
        title: "Economic Growth",
        icon: BarChart3,
        description: "Measures the health and growth of a country's economic output.",
        indicators: [
            { id: 'GDPC1', title: 'Real GDP', units: 'Billions of Chained 2017 Dollars' },
            { id: 'GDP', title: 'Nominal GDP', units: 'Billions of Dollars' },
            { id: 'A191RL1Q225SBEA', title: 'GDP Growth Rate (YoY)', units: 'Percent' },
            { id: 'A939RX0Q048SBEA', title: 'GDP per Capita', units: 'Dollars' },
            { id: 'INDPRO', title: 'Industrial Production Index', units: 'Index' },
            { id: 'TCU', title: 'Capacity Utilization', units: 'Percent of Capacity' },
            { id: 'USSLIND', title: 'Leading Economic Index (LEI)', units: 'Index' },
            { id: 'GPDIC1', title: 'Real Gross Private Domestic Investment', units: 'Billions of Chained 2017 Dollars' },
            { id: 'PCEC96', title: 'Real Personal Consumption Expenditures', units: 'Billions of Chained 2017 Dollars' },
            { id: 'GCEC1', title: 'Real Government Consumption', units: 'Billions of Chained 2017 Dollars' },
        ],
    },
    {
        title: "Labor Market",
        icon: Briefcase,
        description: "Measures labor force health and potential economic overheating.",
        indicators: [
            { id: 'UNRATE', title: 'Unemployment Rate', units: 'Percent' },
            { id: 'CIVPART', title: 'Labor Force Participation Rate', units: 'Percent' },
            { id: 'PAYEMS', title: 'Nonfarm Payrolls', units: 'Thousands of Persons' },
            { id: 'ICSA', title: 'Initial Jobless Claims', units: 'Number' },
            { id: 'JTSJOL', title: 'Job Openings (JOLTS)', units: 'Thousands of Persons' },
            { id: 'CES0500000003', title: 'Average Hourly Earnings', units: 'Dollars per Hour' },
            { id: 'EMRATIO', title: 'Employment-to-Population Ratio', units: 'Percent' },
        ],
    },
    {
        title: "Inflation & Prices",
        icon: TrendingUp,
        description: "Measures the rate of increase in the general price level of goods and services.",
        indicators: [
            { id: 'CPIAUCSL', title: 'CPI (All Items)', units: 'Index' },
            { id: 'CPILFESL', title: 'Core CPI (Excluding Food & Energy)', units: 'Index' },
            { id: 'PPIACO', title: 'PPI (Final Demand)', units: 'Index' },
            { id: 'PCEPI', title: 'PCE Price Index', units: 'Index' },
            { id: 'PCEPILFE', title: 'Core PCE Price Index', units: 'Index' },
            { id: 'PCETRIM12M159SFRBDAL', title: 'Trimmed Mean PCE', units: 'Percent' },
            { id: 'T5YIFR', title: 'Inflation Expectations (5Y)', units: 'Percent' },
        ],
    },
    {
        title: "Monetary Policy",
        icon: Landmark,
        description: "Federal Reserve's policy direction and market response.",
        indicators: [
            { id: 'DFEDTARU', title: 'Federal Funds Target Rate – Upper Bound', units: 'Percent' },
            { id: 'FEDFUNDS', title: 'Effective Fed Funds Rate', units: 'Percent' },
            { id: 'WALCL', title: 'Fed Balance Sheet (Total Assets)', units: 'Billions of Dollars' },
            { id: 'WRESBAL', title: 'Reserve Balances', units: 'Billions of Dollars' },
            { id: 'INTDSRUSM193N', title: 'Discount Rate', units: 'Percent' },
        ],
    },
    {
        title: "Bond Market",
        icon: LineChart,
        description: "Measures cost of capital and inflation/growth projections.",
        indicators: [
            { id: 'GS10', title: '10-Year Treasury Yield', units: 'Percent' },
            { id: 'GS2', title: '2-Year Treasury Yield', units: 'Percent' },
            { id: 'GS30', title: '30-Year Treasury Yield', units: 'Percent' },
            { id: 'DFII5', title: '5-Year TIPS Yield', units: 'Percent' },
            { id: 'DFII10', title: '10-Year TIPS Yield', units: 'Percent' },
            { id: 'T5YIE', title: '5-Year Breakeven Inflation', units: 'Percent' },
            { id: 'T10YIE', title: '10-Year Breakeven Inflation', units: 'Percent' },
            { id: 'MORTGAGE15US', title: '15-Year Mortgage Rate', units: 'Percent' },
        ],
    },
    {
        title: "Financial Markets",
        icon: AreaChart,
        description: "Equity market data, volatility, and credit risk indices.",
        indicators: [
            { id: 'SP500', title: 'S&P 500 Index', units: 'Index' },
            { id: 'VIXCLS', title: 'VIX (Volatility Index)', units: 'Index' },
            { id: 'BAA10Y', title: 'Credit Spreads (BAA - 10Y)', units: 'Percent' },
        ],
    },
    {
        title: "U.S. Dollar Index",
        icon: Scale,
        description: "Measures the value of the U.S. dollar relative to a basket of foreign currencies.",
        indicators: [
            { id: 'DTWEXBGS', title: 'Trade Weighted U.S. Dollar Index', units: 'Index' },
        ],
    },
    {
        title: "Housing Sector",
        icon: Home,
        description: "Measures property conditions, mortgage demand, and construction.",
        indicators: [
            { id: 'EXHOSLUSM495S', title: 'Existing Home Sales', units: 'Thousands of Units' },
            { id: 'HSN1FNSA', title: 'New Home Sales', units: 'Thousands of Units' },
            { id: 'HOUST', title: 'Housing Starts', units: 'Thousands of Units' },
            { id: 'PERMIT', title: 'Building Permits', units: 'Thousands of Units' },
            { id: 'MORTGAGE30US', title: '30Y Mortgage Rate', units: 'Percent' },
            { id: 'CSUSHPISA', title: 'Case-Shiller Home Price Index', units: 'Index' },
        ],
    },
    {
        title: "Consumer & Sentiment",
        icon: Users,
        description: "Consumer and business perceptions of the economy.",
        indicators: [
            { id: 'UMCSENT', title: 'Consumer Sentiment (UMich)', units: 'Index' },
            { id: 'UMCSENTEX', title: 'Consumer Expectations (UMich)', units: 'Index' },
            { id: 'CONCCONF', title: 'Conference Board Consumer Confidence', units: 'Index' },
            { id: 'SBOITOTL', title: 'NFIB Small Business Optimism', units: 'Index' },
            { id: 'RSAFS', title: 'Retail Sales (YoY)', units: 'Percent' },
        ],
    },
];