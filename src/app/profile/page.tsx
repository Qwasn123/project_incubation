'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Avatar, Divider } from '@nextui-org/react';
import { useAuthStore } from '@/store/useAuthStore';
import MainLayout from '@/components/Layout/MainLayout';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    phone: '',
    department: '',
    position: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        nickname: user.nickname || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        position: user.position || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const [updateResult] = await Promise.all([
        updateProfile(formData),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);
      
      setIsEditing(false);
      toast.success('保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row gap-4 p-6">
            <div className="flex items-center gap-4">
              <Avatar
                name={user?.nickname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase()}
                size="lg"
                className="w-20 h-20 text-2xl bg-primary-100 text-primary-500"
              />
              <div>
                <h1 className="text-xl font-bold">{user?.nickname || user?.username}</h1>
                <p className="text-sm text-gray-500">
                  {user?.role === 'admin' ? '管理员' : '普通用户'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              {isEditing ? (
                <>
                  <Button
                    variant="bordered"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user?.username || '',
                        nickname: user?.nickname || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        department: user?.department || '',
                        position: user?.position || '',
                      });
                    }}
                    startContent={<Icon icon="mdi:close" className="w-4 h-4" />}
                  >
                    取消
                  </Button>
                  <Button
                    color="primary"
                    variant="flat"
                    onClick={handleSave}
                    isLoading={isLoading}
                    startContent={!isLoading && <Icon icon="mdi:check" className="w-4 h-4" />}
                  >
                    保存
                  </Button>
                </>
              ) : (
                <Button
                  color="primary"
                  variant="light"
                  startContent={<Icon icon="mdi:edit" className="w-4 h-4" />}
                  onClick={() => setIsEditing(true)}
                >
                  编辑资料
                </Button>
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="用户名"
                value={formData.username}
                isReadOnly
                variant="flat"
                labelPlacement="outside"
                description="用户名不可修改"
                classNames={{
                  input: "bg-default-100",
                }}
                startContent={
                  <Icon icon="mdi:account" className="w-4 h-4 text-default-400" />
                }
              />
              <Input
                label="昵称"
                value={formData.nickname}
                onValueChange={(value) => setFormData({ ...formData, nickname: value })}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                labelPlacement="outside"
                classNames={{
                  input: !isEditing ? "bg-default-100" : "",
                }}
                startContent={
                  <Icon icon="mdi:card-account-details" className="w-4 h-4 text-default-400" />
                }
              />
              <Input
                label="邮箱"
                value={formData.email}
                onValueChange={(value) => setFormData({ ...formData, email: value })}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                labelPlacement="outside"
                classNames={{
                  input: !isEditing ? "bg-default-100" : "",
                }}
                startContent={
                  <Icon icon="mdi:email" className="w-4 h-4 text-default-400" />
                }
              />
              <Input
                label="手机号"
                value={formData.phone}
                onValueChange={(value) => setFormData({ ...formData, phone: value })}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                labelPlacement="outside"
                classNames={{
                  input: !isEditing ? "bg-default-100" : "",
                }}
                startContent={
                  <Icon icon="mdi:phone" className="w-4 h-4 text-default-400" />
                }
              />
              <Input
                label="部门"
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                labelPlacement="outside"
                classNames={{
                  input: !isEditing ? "bg-default-100" : "",
                }}
                startContent={
                  <Icon icon="mdi:domain" className="w-4 h-4 text-default-400" />
                }
              />
              <Input
                label="职位"
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                labelPlacement="outside"
                classNames={{
                  input: !isEditing ? "bg-default-100" : "",
                }}
                startContent={
                  <Icon icon="mdi:badge-account" className="w-4 h-4 text-default-400" />
                }
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
} 