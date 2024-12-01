'use client';

import MainLayout from '@/components/Layout/MainLayout';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardBody } from '@nextui-org/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 模拟过去30天的项目进展数据
const generateProjectProgress = () => {
  const data = [];
  const projects = ['飞书克隆', '智慧校园', '智慧医疗', '智慧工厂'];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dataPoint: any = {
      date: dateStr,
    };

    // 为每个项目生成随机进展数据
    projects.forEach(project => {
      // 生成一个0-100的随机数，但要保持一定的连续性
      const prevValue = i < 29 ? data[data.length - 1]?.[project] || 0 : 0;
      const change = Math.random() * 20 - 5; // -5 到 15 的随机变化
      dataPoint[project] = Math.min(Math.max(prevValue + change, 0), 100);
    });

    data.push(dataPoint);
  }

  return data;
};

const projectColors = {
  '飞书克隆': '#1677ff',
  '智慧校园': '#52c41a',
  '智慧医疗': '#faad14',
  '智慧工厂': '#f5222d',
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const progressData = generateProjectProgress();

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">控制台</h1>
        <div className="grid grid-cols-1 gap-6">
          {/* 统计数据卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardBody className="text-center">
                <h3 className="text-xl font-semibold mb-2">今日进展项目</h3>
                <p className="text-3xl font-bold text-primary">4</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <h3 className="text-xl font-semibold mb-2">今日新增任务</h3>
                <p className="text-3xl font-bold text-success">12</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="text-center">
                <h3 className="text-xl font-semibold mb-2">历史完成项目</h3>
                <p className="text-3xl font-bold text-warning">28</p>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-2">欢迎回来</h2>
              <p className="text-gray-600 dark:text-gray-400">
                当前用户：{user?.username}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                角色：{user?.role === 'admin' ? '管理员' : '普通用户'}
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold mb-4">项目进展趋势</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={progressData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.slice(5)} // 只显示月-日
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(1)}%`]}
                      labelFormatter={(label) => `日期：${label}`}
                    />
                    <Legend />
                    {Object.entries(projectColors).map(([project, color]) => (
                      <Line
                        key={project}
                        type="monotone"
                        dataKey={project}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 