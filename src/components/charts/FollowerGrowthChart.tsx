import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', followers: 198000 },
  { month: 'Feb', followers: 205000 },
  { month: 'Mar', followers: 212000 },
  { month: 'Apr', followers: 220000 },
  { month: 'May', followers: 228000 },
  { month: 'Jun', followers: 235000 },
  { month: 'Jul', followers: 245000 },
];

export function FollowerGrowthChart() {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [`${value.toLocaleString()}`, 'Followers']}
          />
          <Line 
            type="monotone" 
            dataKey="followers" 
            stroke="hsl(217, 91%, 60%)" 
            strokeWidth={3}
            dot={{ fill: 'hsl(217, 91%, 60%)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(217, 91%, 60%)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}