'use client';

import { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardBody, Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { useAuthStore } from '@/store/useAuthStore';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  lastUpdated: string;
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  // 模拟项目数据
  const projects: Project[] = [
    {
      id: '1',
      name: '飞书克隆项目',
      description: '使用 Next.js 和 Tailwind CSS 构建的飞书克隆项目',
      status: 'active',
      lastUpdated: '2024-03-20',
    },
    {
      id: '2',
      name: '数据分析平台',
      description: '企业级数据分析和可视化平台',
      status: 'pending',
      lastUpdated: '2024-03-19',
    },
    {
      id: '3',
      name: '客户管理系统',
      description: '销售团队使用的 CRM 系统',
      status: 'completed',
      lastUpdated: '2024-03-18',
    },
  ];

  const statusColors = {
    active: 'text-green-500 bg-green-50',
    pending: 'text-yellow-500 bg-yellow-50',
    completed: 'text-blue-500 bg-blue-50',
  };

  const statusText = {
    active: '进行中',
    pending: '待开始',
    completed: '已完成',
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* 页面标题和操作栏 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">我的项目</h1>
          {isAdmin && (
            <Button 
              color="primary"
              className="w-full sm:w-auto"
              startContent={<Icon icon="mdi:plus" className="w-5 h-5" />}
            >
              创建项目
            </Button>
          )}
        </div>

        {/* 搜索和筛选 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Input
            placeholder="搜索项目..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="mdi:search" className="w-5 h-5 text-gray-400" />}
            className="w-full sm:w-64"
          />
          <Dropdown>
            <DropdownTrigger>
              <Button 
                variant="bordered" 
                className="w-full sm:w-auto"
                startContent={<Icon icon="mdi:filter-variant" className="w-5 h-5" />}
              >
                {statusFilter === 'all' ? '所有状态' : statusText[statusFilter as keyof typeof statusText]}
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="状态筛选"
              onAction={(key) => setStatusFilter(key as string)}
              selectedKeys={new Set([statusFilter])}
              selectionMode="single"
            >
              <DropdownItem key="all">所有状态</DropdownItem>
              <DropdownItem key="active">进行中</DropdownItem>
              <DropdownItem key="pending">待开始</DropdownItem>
              <DropdownItem key="completed">已完成</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* 项目列表 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardBody className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  {isAdmin && (
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly variant="light" size="sm">
                          <Icon icon="mdi:dots-vertical" className="w-5 h-5" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="项目操作">
                        <DropdownItem
                          startContent={<Icon icon="mdi:pencil" className="w-4 h-4" />}
                        >
                          编辑
                        </DropdownItem>
                        <DropdownItem
                          startContent={<Icon icon="mdi:share" className="w-4 h-4" />}
                        >
                          分享
                        </DropdownItem>
                        <DropdownItem
                          startContent={<Icon icon="mdi:archive" className="w-4 h-4" />}
                        >
                          归档
                        </DropdownItem>
                        <DropdownItem
                          className="text-danger"
                          color="danger"
                          startContent={<Icon icon="mdi:delete" className="w-4 h-4" />}
                        >
                          删除
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status]}`}>
                    {statusText[project.status]}
                  </span>
                  <span className="text-xs text-gray-500">
                    更新于 {project.lastUpdated}
                  </span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Icon icon="mdi:folder-open-outline" className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600">没有找到匹配的项目</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 