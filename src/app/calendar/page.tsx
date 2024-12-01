'use client';

import { useState } from 'react';
import { 
  Card, CardBody, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, Textarea, Select, SelectItem,
  Chip, Avatar
} from '@nextui-org/react';
import MainLayout from '@/components/Layout/MainLayout';
import { Icon } from '@iconify/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { toast } from 'sonner';

// 添加项目接口
interface Project {
  id: string;
  name: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

// 扩展任务接口，添加项目ID
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assignee: string;
  dueDate?: string;
}

// 修改项目数据
const sampleProjects: Project[] = [
  { id: '1', name: '飞书克隆', color: 'primary' },
  { id: '2', name: '智慧校园', color: 'success' },
  { id: '3', name: '智慧医疗', color: 'warning' },
  { id: '4', name: '智慧工厂', color: 'danger' },
];

// 修改初始任务数据
const initialTasks: Task[] = [
  {
    id: '1',
    title: '实现登录功能',
    description: '包含用户登录、管理员登录，支持记住密码',
    status: 'done',
    priority: 'high',
    projectId: '1',
    assignee: '张三',
    dueDate: '2024-03-18',
  },
  {
    id: '2',
    title: '个人信息页面',
    description: '用户可以查看和编辑个人信息，包括头像、昵称等',
    status: 'done',
    priority: 'medium',
    projectId: '1',
    assignee: '张三',
    dueDate: '2024-03-19',
  },
  {
    id: '3',
    title: '日程看板开发',
    description: '实现类似Jira的看板功能，支持任务拖拽',
    status: 'inProgress',
    priority: 'high',
    projectId: '1',
    assignee: '张三',
    dueDate: '2024-03-20',
  },
  {
    id: '4',
    title: '深色模式支持',
    description: '为所有页面添加深色模式支持',
    status: 'inProgress',
    priority: 'medium',
    projectId: '1',
    assignee: '张三',
    dueDate: '2024-03-21',
  },
  {
    id: '5',
    title: '项目概览页面',
    description: '展示项目进度、任务统计等信息',
    status: 'todo',
    priority: 'high',
    projectId: '1',
    assignee: '张三',
    dueDate: '2024-03-22',
  },
  {
    id: '6',
    title: '智慧校园-首页设计',
    description: '设计并实现智慧校园项目的首页布局',
    status: 'todo',
    priority: 'high',
    projectId: '2',
    assignee: '李四',
    dueDate: '2024-03-25',
  },
  {
    id: '7',
    title: '智慧医疗-需求分析',
    description: '进行智慧医疗项目的需求调研和分析',
    status: 'todo',
    priority: 'medium',
    projectId: '3',
    assignee: '王五',
    dueDate: '2024-03-28',
  },
  {
    id: '8',
    title: '智慧工厂-技术选型',
    description: '评估并确定智慧工厂项目的技术栈',
    status: 'todo',
    priority: 'high',
    projectId: '4',
    assignee: '赵六',
    dueDate: '2024-03-30',
  },
];

const statusColumns = [
  { id: 'todo', label: '待处理', icon: 'mdi:clipboard-text-outline' },
  { id: 'inProgress', label: '进行中', icon: 'mdi:progress-clock' },
  { id: 'done', label: '已完成', icon: 'mdi:checkbox-marked-circle-outline' },
];

const priorityColors = {
  low: 'bg-success-100 text-success-600',
  medium: 'bg-warning-100 text-warning-600',
  high: 'bg-danger-100 text-danger-600',
};

const priorityIcons = {
  low: 'mdi:flag-outline',
  medium: 'mdi:flag-variant',
  high: 'mdi:flag',
};

// 添加优先级选项
const priorityOptions = [
  { value: 'low', label: '低', icon: 'mdi:flag-outline' },
  { value: 'medium', label: '中', icon: 'mdi:flag-variant' },
  { value: 'high', label: '高', icon: 'mdi:flag' },
];

// 添加状态选项
const statusOptions = [
  { value: 'todo', label: '待处理', icon: 'mdi:clipboard-text-outline' },
  { value: 'inProgress', label: '进行中', icon: 'mdi:progress-clock' },
  { value: 'done', label: '已完成', icon: 'mdi:checkbox-marked-circle-outline' },
];

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    projectId: '1',
    assignee: '',
    dueDate: new Date().toISOString().split('T')[0],
  });

  // 过滤当前项目的任务
  const filteredTasks = tasks.filter(task => 
    selectedProject === 'all' || task.projectId === selectedProject
  );

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const allTasks = Array.from(tasks);

    // 找到要移动的任务的实际索引
    const taskIndex = allTasks.findIndex(t => t.id === result.draggableId);
    if (taskIndex === -1) return;

    // 移除任务
    const [movedTask] = allTasks.splice(taskIndex, 1);

    // 更新任务状态
    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destination.droppableId as Task['status'];
    }

    // 找到目标位置的实际索引
    const destinationTasks = allTasks.filter(t => t.status === destination.droppableId);
    const insertIndex = allTasks.findIndex(t => t.status === destination.droppableId) + destination.index;
    
    // 插入任务到新位置
    allTasks.splice(insertIndex, 0, movedTask);

    // 更新状态
    setTasks(allTasks);
  };

  const handleAddTask = async () => {
    if (!newTask.title) {
      toast.error('请输入任务标题');
      return;
    }

    if (!newTask.assignee) {
      toast.error('请输入负责人姓名');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description || '',
        status: newTask.status as Task['status'],
        priority: newTask.priority as Task['priority'],
        projectId: newTask.projectId as string,
        assignee: newTask.assignee as string,
        dueDate: newTask.dueDate,
      };

      setTasks(prev => [...prev, task]);
      setIsModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        projectId: '1',
        assignee: '',
        dueDate: new Date().toISOString().split('T')[0],
      });
      toast.success('任务添加成功');
    } catch (error) {
      console.error('添加任务失败:', error);
      toast.error('添加任务失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 添加编辑任务的处理函数
  const handleEditTask = async () => {
    if (!editingTask) return;
    
    if (!editingTask.title) {
      toast.error('请输入任务标题');
      return;
    }

    if (!editingTask.assignee) {
      toast.error('请输入负责人姓名');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? editingTask : task
      ));
      
      setIsEditModalOpen(false);
      setEditingTask(null);
      toast.success('任务更新成功');
    } catch (error) {
      console.error('更新任务失败:', error);
      toast.error('更新任务失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 添加删除任务的处理函数
  const handleDeleteTask = async (taskId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('任务删除成功');
    } catch (error) {
      console.error('删除任务失败:', error);
      toast.error('删除任务失败');
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">日程安排</h1>
          <div className="flex items-center gap-4">
            <Select
              label="选择项目"
              selectedKeys={[selectedProject]}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-48"
              variant="bordered"
              startContent={<Icon icon="mdi:folder" className="w-4 h-4" />}
            >
              <SelectItem 
                key="all" 
                value="all"
                startContent={<Icon icon="mdi:folder" className="w-4 h-4" />}
              >
                全部项目
              </SelectItem>
              {sampleProjects.map((project) => (
                <SelectItem 
                  key={project.id} 
                  value={project.id}
                  startContent={<Icon icon="mdi:folder-outline" className="w-4 h-4" />}
                >
                  {project.name}
                </SelectItem>
              ))}
            </Select>
            <Button
              color="primary"
              startContent={<Icon icon="mdi:plus" className="w-5 h-5" />}
              onPress={() => setIsModalOpen(true)}
            >
              添加任务
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              {statusColumns.map((column) => {
                const columnTasks = filteredTasks.filter(task => task.status === column.id);
                
                return (
                  <div key={column.id} className="flex flex-col h-[calc(100vh-13rem)]">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <Icon icon={column.icon} className="w-5 h-5 text-default-500" />
                      <span className="font-medium">{column.label}</span>
                      <span className="text-default-400 text-sm ml-auto">
                        {columnTasks.length}
                      </span>
                    </div>
                    
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 overflow-auto rounded-lg p-2 ${
                            snapshot.isDraggingOver 
                              ? 'bg-default-100 dark:bg-content2' 
                              : 'bg-default-50 dark:bg-content1'
                          }`}
                        >
                          {columnTasks.map((task, index) => (
                            <Draggable 
                              key={task.id} 
                              draggableId={task.id} 
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                  className={`mb-3 last:mb-0 ${
                                    snapshot.isDragging ? 'opacity-50' : ''
                                  }`}
                                >
                                  <Card>
                                    <CardBody className="p-3">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <h3 className="font-medium text-sm mb-1 truncate">
                                            {task.title}
                                          </h3>
                                          <p className="text-default-500 text-xs line-clamp-2">
                                            {task.description}
                                          </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                          <Dropdown placement="bottom-end">
                                            <DropdownTrigger>
                                              <div className="cursor-pointer p-1 rounded-full hover:bg-default-100">
                                                <Icon icon="mdi:dots-vertical" className="w-4 h-4" />
                                              </div>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="任务操作">
                                              <DropdownItem
                                                startContent={<Icon icon="mdi:pencil" className="w-4 h-4" />}
                                                onPress={() => {
                                                  setEditingTask(task);
                                                  setIsEditModalOpen(true);
                                                }}
                                              >
                                                编辑
                                              </DropdownItem>
                                              <DropdownItem
                                                startContent={<Icon icon="mdi:delete" className="w-4 h-4" />}
                                                className="text-danger"
                                                color="danger"
                                                onPress={() => handleDeleteTask(task.id)}
                                              >
                                                删除
                                              </DropdownItem>
                                            </DropdownMenu>
                                          </Dropdown>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2 mt-3">
                                        <div className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[task.priority]}`}>
                                          <Icon icon={priorityIcons[task.priority]} className="w-3 h-3 inline-block mr-1" />
                                          {task.priority === 'low' ? '低' : task.priority === 'medium' ? '中' : '高'}
                                        </div>
                                        {task.assignee && (
                                          <div className="text-xs text-default-500">
                                            <Icon icon="mdi:account" className="w-3 h-3 inline-block mr-1" />
                                            {task.assignee}
                                          </div>
                                        )}
                                        {task.dueDate && (
                                          <div className="text-xs text-default-500 ml-auto">
                                            <Icon icon="mdi:calendar" className="w-3 h-3 inline-block mr-1" />
                                            {task.dueDate}
                                          </div>
                                        )}
                                      </div>
                                    </CardBody>
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>

        {/* 添加任务模态框 */}
        <Modal 
          isOpen={isModalOpen} 
          onOpenChange={setIsModalOpen}
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  添加任务
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Input
                      label="标题"
                      placeholder="请输入任务标题"
                      value={newTask.title}
                      onValueChange={(value) => setNewTask({ ...newTask, title: value })}
                      isRequired
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon icon="mdi:text" className="w-4 h-4 text-default-400" />
                      }
                    />
                    <Textarea
                      label="描述"
                      placeholder="请输入任务描述"
                      value={newTask.description}
                      onValueChange={(value) => setNewTask({ ...newTask, description: value })}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon icon="mdi:text-box" className="w-4 h-4 text-default-400 mt-2" />
                      }
                    />
                    <Select
                      label="状态"
                      selectedKeys={[newTask.status || 'todo']}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon 
                          icon={statusOptions.find(opt => opt.value === newTask.status)?.icon || statusOptions[0].icon}
                          className="w-4 h-4 text-default-400"
                        />
                      }
                    >
                      {statusOptions.map((status) => (
                        <SelectItem 
                          key={status.value} 
                          value={status.value}
                          startContent={
                            <Icon icon={status.icon} className="w-4 h-4" />
                          }
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="优先级"
                      selectedKeys={[newTask.priority || 'medium']}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon 
                          icon={priorityOptions.find(opt => opt.value === newTask.priority)?.icon || priorityOptions[1].icon}
                          className="w-4 h-4 text-default-400"
                        />
                      }
                    >
                      {priorityOptions.map((priority) => (
                        <SelectItem 
                          key={priority.value} 
                          value={priority.value}
                          startContent={
                            <Icon icon={priority.icon} className="w-4 h-4" />
                          }
                        >
                          {priority.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="所属项目"
                      selectedKeys={[newTask.projectId || '1']}
                      onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={<Icon icon="mdi:folder" className="w-4 h-4 text-default-400" />}
                    >
                      {sampleProjects.map((project) => (
                        <SelectItem 
                          key={project.id} 
                          value={project.id}
                          startContent={<Icon icon="mdi:folder-outline" className="w-4 h-4" />}
                        >
                          {project.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label="负责人"
                      placeholder="请输入负责人姓名"
                      value={newTask.assignee}
                      onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon icon="mdi:account" className="w-4 h-4 text-default-400" />
                      }
                    />
                    <Input
                      type="date"
                      label="截止日期"
                      value={newTask.dueDate}
                      onValueChange={(value) => setNewTask({ ...newTask, dueDate: value })}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon icon="mdi:calendar" className="w-4 h-4 text-default-400" />
                      }
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="bordered"
                    onPress={onClose}
                  >
                    取消
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleAddTask}
                    isLoading={isLoading}
                  >
                    添加
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* 添加编辑任务模态框 */}
        <Modal 
          isOpen={isEditModalOpen} 
          onOpenChange={setIsEditModalOpen}
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  编辑任务
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <Input
                      label="标题"
                      placeholder="请输入任务标题"
                      value={editingTask?.title}
                      onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, title: value } : null)}
                      isRequired
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon icon="mdi:text" className="w-4 h-4 text-default-400" />
                      }
                    />
                    <Textarea
                      label="描述"
                      placeholder="请输入任务描述"
                      value={editingTask?.description}
                      onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, description: value } : null)}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon icon="mdi:text-box" className="w-4 h-4 text-default-400 mt-2" />
                      }
                    />
                    <Select
                      label="状态"
                      selectedKeys={[editingTask?.status || 'todo']}
                      onChange={(e) => setEditingTask(prev => prev ? { ...prev, status: e.target.value as Task['status'] } : null)}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon 
                          icon={statusOptions.find(opt => opt.value === editingTask?.status)?.icon || statusOptions[0].icon}
                          className="w-4 h-4 text-default-400"
                        />
                      }
                    >
                      {statusOptions.map((status) => (
                        <SelectItem 
                          key={status.value} 
                          value={status.value}
                          startContent={<Icon icon={status.icon} className="w-4 h-4" />}
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="优先级"
                      selectedKeys={[editingTask?.priority || 'medium']}
                      onChange={(e) => setEditingTask(prev => prev ? { ...prev, priority: e.target.value as Task['priority'] } : null)}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon 
                          icon={priorityOptions.find(opt => opt.value === editingTask?.priority)?.icon || priorityOptions[1].icon}
                          className="w-4 h-4 text-default-400"
                        />
                      }
                    >
                      {priorityOptions.map((priority) => (
                        <SelectItem 
                          key={priority.value} 
                          value={priority.value}
                          startContent={<Icon icon={priority.icon} className="w-4 h-4" />}
                        >
                          {priority.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="所属项目"
                      selectedKeys={[editingTask?.projectId || '1']}
                      onChange={(e) => setEditingTask(prev => prev ? { ...prev, projectId: e.target.value } : null)}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={<Icon icon="mdi:folder" className="w-4 h-4 text-default-400" />}
                    >
                      {sampleProjects.map((project) => (
                        <SelectItem 
                          key={project.id} 
                          value={project.id}
                          startContent={<Icon icon="mdi:folder-outline" className="w-4 h-4" />}
                        >
                          {project.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label="负责人"
                      placeholder="请输入负责人姓名"
                      value={editingTask?.assignee}
                      onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, assignee: value } : null)}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon icon="mdi:account" className="w-4 h-4 text-default-400" />
                      }
                    />
                    <Input
                      type="date"
                      label="截止日期"
                      value={editingTask?.dueDate}
                      onValueChange={(value) => setEditingTask(prev => prev ? { ...prev, dueDate: value } : null)}
                      variant="bordered"
                      labelPlacement="outside"
                      startContent={
                        <Icon icon="mdi:calendar" className="w-4 h-4 text-default-400" />
                      }
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="bordered"
                    onPress={onClose}
                  >
                    取消
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleEditTask}
                    isLoading={isLoading}
                  >
                    保存
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </MainLayout>
  );
} 