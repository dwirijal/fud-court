
export interface Indicator {
    id: string;
    title: string;
    units: string;
}

export interface IndicatorGroup {
    title: string;
    icon: string;
    description: string;
    indicators: Indicator[];
}

export const indicatorGroups: IndicatorGroup[] = [
    {
        title: "Pertumbuhan Ekonomi",
        icon: "📈",
        description: "Mengukur kesehatan dan pertumbuhan output ekonomi suatu negara.",
        indicators: [
            { id: 'GDP', title: 'Gross Domestic Product', units: 'Billions of Dollars' },
            { id: 'GDPC1', title: 'Real GDP', units: 'Billions of Chained 2012 Dollars' },
            { id: 'A191RL1Q225SBEA', title: 'GDP Growth Rate (YoY)', units: 'Percent' },
            { id: 'A939RX0Q048SBEA', title: 'GDP per Capita', units: 'Dollars' },
            { id: 'INDPRO', title: 'Industrial Production', units: 'Index' },
        ],
    },
    {
        title: "Pasar Tenaga Kerja",
        icon: "💼",
        description: "Indikator yang berkaitan dengan ketenagakerjaan, pengangguran, dan kesehatan pasar kerja.",
        indicators: [
            { id: 'UNRATE', title: 'Unemployment Rate', units: 'Percent' },
            { id: 'CIVPART', title: 'Labor Force Participation Rate', units: 'Percent' },
            { id: 'PAYEMS', title: 'Nonfarm Payrolls', units: 'Thousands of Persons' },
            { id: 'ICSA', title: 'Initial Jobless Claims', units: 'Number' },
            { id: 'JTSJOL', title: 'Job Openings', units: 'Thousands' },
        ],
    },
    {
        title: "Inflasi & Harga",
        icon: "💰",
        description: "Mengukur laju kenaikan tingkat harga umum barang dan jasa.",
        indicators: [
            { id: 'CPIAUCSL', title: 'Consumer Price Index (CPI)', units: 'Index' },
            { id: 'CPILFESL', title: 'Core CPI (ex food & energy)', units: 'Index' },
            { id: 'PPIACO', title: 'Producer Price Index (PPI)', units: 'Index' },
            { id: 'PCEPI', title: 'PCE Price Index', units: 'Index' },
        ],
    },
    {
        title: "Kebijakan Moneter",
        icon: "🏦",
        description: "Tindakan bank sentral untuk mengelola jumlah uang beredar dan suku bunga.",
        indicators: [
            { id: 'FEDFUNDS', title: 'Federal Funds Rate', units: 'Percent' },
            { id: 'GS10', title: '10-Year Treasury Yield', units: 'Percent' },
            { id: 'M2SL', title: 'M2 Money Stock', units: 'Billions of Dollars' },
        ],
    },
    {
        title: "Pasar Keuangan",
        icon: "💹",
        description: "Indikator yang mencerminkan kesehatan dan sentimen pasar keuangan.",
        indicators: [
            { id: 'SP500', title: 'S&P 500', units: 'Index' },
            { id: 'VIXCLS', title: 'VIX (Volatility Index)', units: 'Index' },
            { id: 'DTWEXBGS', title: 'Dollar Index', units: 'Index' },
        ],
    },
    {
        title: "Sektor Perumahan",
        icon: "🏠",
        description: "Data yang berkaitan dengan harga, konstruksi, dan penjualan di pasar perumahan.",
        indicators: [
            { id: 'CSUSHPISA', title: 'Case-Shiller Home Price Index', units: 'Index' },
            { id: 'HOUST', title: 'Housing Starts', units: 'Thousands of Units' },
            { id: 'HSN1F', title: 'New Home Sales', units: 'Thousands of Units' },
        ],
    },
    {
        title: "Sentimen & Konsumen",
        icon: "📊",
        description: "Mengukur kepercayaan dan sentimen konsumen dan bisnis terhadap ekonomi.",
        indicators: [
            { id: 'UMCSENT', title: 'Consumer Sentiment (Michigan)', units: 'Index' },
            { id: 'OPHNFB', title: 'Small Business Optimism', units: 'Index' },
            { id: 'MANEMP', title: 'PMI Manufacturing', units: 'Index' },
        ],
    },
];
