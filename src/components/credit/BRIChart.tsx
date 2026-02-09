import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
    { month: 'Aug', score: 105 },
    { month: 'Sep', score: 45 },
    { month: 'Oct', score: 12 },
    { month: 'Nov', score: 3.5 },
    { month: 'Dec', score: 3.2 },
    { month: 'Jan', score: 3.1 },
];

const BRIChart = () => {
    return (
        <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [`${value}%`, 'Index Score']}
                    />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                    />
                    <text x="50%" y="10" textAnchor="middle" dominantBaseline="middle" fill="#666" fontSize="12">
                        Lower is Better (0-3% is Best)
                    </text>
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BRIChart;
