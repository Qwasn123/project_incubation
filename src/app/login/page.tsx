'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Tab, Tabs } from '@nextui-org/react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTab, setSelectedTab] = useState('user');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!username || !password) {
        setError('请输入用户名和密码');
        return;
      }

      const loginSuccess = await login(username, password, selectedTab as 'admin' | 'user');
      if (loginSuccess) {
        window.location.href = '/dashboard';
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError('登录过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[480px]">
        <CardHeader className="flex gap-3 justify-center p-4 md:p-5 lg:p-6">
          <div className="flex flex-col items-center">
            <Icon icon="ri:feishu-fill" className="w-6 h-6 md:w-8 md:h-8 text-primary-500" />
            <p className="text-lg md:text-xl font-bold mt-2">飞书克隆</p>
          </div>
        </CardHeader>
        <CardBody className="px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6">
          <Tabs 
            selectedKey={selectedTab} 
            onSelectionChange={(key) => {
              setSelectedTab(key.toString());
              setError('');
            }}
            className="mb-4 md:mb-6"
            variant="underlined"
            aria-label="登录选项"
            size="sm"
            classNames={{
              tab: "h-9 md:h-10",
            }}
          >
            <Tab key="user" title="用户登录" />
            <Tab key="admin" title="管理员登录" />
          </Tabs>

          <div className="flex flex-col gap-4 md:gap-6">
            <Input
              label="用户名"
              variant="bordered"
              labelPlacement="outside"
              value={username}
              onValueChange={setUsername}
              placeholder={selectedTab === 'admin' ? "请输入管理员用户名" : "请输入用户名"}
              isRequired
              classNames={{
                base: "max-w-full",
                label: "text-sm md:text-base text-default-600",
                input: "text-sm md:text-base",
                inputWrapper: "h-9 md:h-10",
              }}
            />
            <Input
              label="密码"
              type="password"
              variant="bordered"
              labelPlacement="outside"
              value={password}
              onValueChange={setPassword}
              placeholder="请输入密码"
              isRequired
              classNames={{
                base: "max-w-full",
                label: "text-sm md:text-base text-default-600",
                input: "text-sm md:text-base",
                inputWrapper: "h-9 md:h-10",
              }}
            />
            {error && (
              <p className="text-danger text-xs md:text-sm">{error}</p>
            )}
            <Button
              color="primary"
              onClick={handleLogin}
              isLoading={isLoading}
              radius="sm"
              className="w-full bg-primary-500 text-white h-10 md:h-11 text-sm md:text-base mt-2"
              size="lg"
              variant="solid"
              disableRipple={false}
              spinnerPlacement="start"
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 