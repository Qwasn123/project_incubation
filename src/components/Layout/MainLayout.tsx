'use client';

import { Icon } from '@iconify/react';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@nextui-org/react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    {
      icon: "mdi:view-dashboard",
      label: "项目总览",
      path: "/dashboard",
    },
    {
      icon: "mdi:folder-multiple",
      label: "项目管理",
      path: "/projects",
    },
    {
      icon: "mdi:calendar",
      label: "日程安排",
      path: "/calendar",
    },
    {
      icon: "mdi:file-document",
      label: "文档中心",
      path: "/docs",
    },
  ];

  const UserMenu = () => (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 px-2 py-1 rounded-lg">
          <Avatar
            name={user?.nickname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
            size="sm"
            className="bg-primary-100 text-primary-500"
          />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user?.nickname || user?.username}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role === 'admin' ? '管理员' : '普通用户'}
            </span>
          </div>
          <Icon icon="mdi:chevron-down" className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="用户菜单">
        <DropdownItem
          key="profile"
          startContent={<Icon icon="mdi:account" className="w-4 h-4" />}
          onClick={() => router.push('/profile')}
        >
          个人信息
        </DropdownItem>
        <DropdownItem
          key="settings"
          startContent={<Icon icon="mdi:cog" className="w-4 h-4" />}
        >
          设置
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          startContent={<Icon icon="mdi:logout" className="w-4 h-4" />}
          onClick={handleLogout}
        >
          退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-background">
      {/* 移动端顶部导航 */}
      <header className="h-14 flex items-center justify-between px-4 bg-background border-b border-divider lg:hidden">
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="light"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Icon icon="mdi:menu" className="w-5 h-5 text-default-500" />
          </Button>
          <Icon icon="ri:feishu-fill" className="w-6 h-6 text-primary-500" />
          <span className="font-semibold text-lg">飞书克隆</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="light"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="min-w-unit-10 w-10 h-10"
          >
            <Icon 
              icon={theme === 'dark' ? "mdi:weather-night" : "mdi:weather-sunny"} 
              className="w-5 h-5 text-default-500"
            />
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* PC端侧边栏 */}
      <aside className={`
        hidden lg:flex flex-col bg-background border-r border-divider
        transition-[width] duration-300 ease-in-out !z-40
        ${sidebarCollapsed ? 'w-[4rem]' : 'w-[16rem]'}
      `}>
        <div className="h-14 flex items-center px-3 border-b border-divider">
          <Button
            isIconOnly
            variant="light"
            onClick={toggleSidebar}
            className="w-9 h-9 shrink-0"
          >
            <Icon 
              icon={sidebarCollapsed ? "mdi:menu-open" : "mdi:menu"} 
              className="w-5 h-5 text-gray-500"
            />
          </Button>
          <div className={`
            ml-2 font-semibold text-lg whitespace-nowrap overflow-hidden
            transition-[opacity,transform] duration-300 ease-in-out
            ${sidebarCollapsed ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'}
          `}>
            飞书克隆
          </div>
        </div>
        <nav className="flex-1 py-6 overflow-hidden">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`
                flex items-center h-12 gap-3 mx-2 rounded-lg transition-all duration-300
                mb-3 last:mb-0
                ${pathname === item.path 
                  ? 'bg-primary-50 text-primary-500 dark:bg-primary-50 dark:text-primary-foreground' 
                  : 'text-default-700 hover:bg-default-100 dark:text-default-500 dark:hover:bg-content2'
                }
                ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'}
              `}
            >
              <Icon icon={item.icon} className={`
                w-5 h-5 shrink-0
                ${pathname === item.path ? 'text-primary-500 dark:text-primary-foreground' : 'text-default-500 dark:text-default-500'}
              `} />
              <span className={`
                text-sm font-medium whitespace-nowrap overflow-hidden
                transition-[opacity,transform,width] duration-300 ease-in-out
                ${sidebarCollapsed ? 'w-0 opacity-0 -translate-x-4' : 'w-auto opacity-100 translate-x-0'}
              `}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className={`
          border-t border-divider transition-[opacity] duration-300 ease-in-out
          ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}
        `}>
          <div className="p-4">
            <UserMenu />
          </div>
        </div>
      </aside>

      {/* 移动端侧边栏抽屉 */}
      <div className={`
        fixed inset-0 bg-black/50 transition-opacity lg:hidden z-50
        ${sidebarCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `} onClick={toggleSidebar}>
        <div className={`
          fixed inset-y-0 left-0 w-64 bg-background transform transition-transform
          ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        `} onClick={e => e.stopPropagation()}>
          {/* 移动端侧边栏内容 */}
          <nav className="flex-1 py-6">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`
                  flex items-center px-3 h-12 gap-3 mx-2 rounded-lg transition-colors
                  mb-3 last:mb-0
                  ${pathname === item.path 
                    ? 'bg-primary-50 text-primary-500' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
                onClick={toggleSidebar}
              >
                <Icon icon={item.icon} className={`w-5 h-5 
                  ${pathname === item.path ? 'text-primary-500' : 'text-gray-500'}
                `} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* PC端顶部导航 */}
        <header className="hidden lg:flex h-14 items-center justify-end gap-2 px-4 bg-background border-b border-divider">
          <Button
            isIconOnly
            variant="light"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="min-w-unit-10 w-10 h-10"
          >
            <Icon 
              icon={theme === 'dark' ? "mdi:weather-night" : "mdi:weather-sunny"} 
              className="w-5 h-5 text-default-500"
            />
          </Button>
          <UserMenu />
        </header>
        
        {/* 主要内容 */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 bg-gradient-to-b from-background via-default-50/50 to-default-100/50 dark:from-background dark:via-content1 dark:to-content2/50">
          {children}
        </main>
      </div>
    </div>
  );
} 