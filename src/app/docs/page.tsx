'use client';

import { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardBody, Tab, Tabs, Button } from '@nextui-org/react';
import MarkdownEditor from '@/components/MarkdownEditor';
import { Icon } from '@iconify/react';

// 模拟文档数据
const documentData = {
  '飞书克隆': [
    {
      id: 'feishu-quickstart',
      title: '快速开始',
      content: `# 快速开始指南

## 简介
欢迎使用飞书克隆项目！本指南将帮助你快速上手我们的系统。

## 功能特点
- 即时通讯
- 文档协作
- 日程管理
- 视频会议

## 开始使用
1. 注册账号
2. 创建团队
3. 邀请成员
4. 开始协作
`,
    },
    {
      id: 'feishu-features',
      title: '基本功能',
      content: '# 基本功能介绍\n\n这里是基本功能的详细说明...',
    }
  ],
  '智慧校园': [
    {
      id: 'campus-overview',
      title: '系统概述',
      content: '# 智慧校园系统概述\n\n这里是系统概述的详细说明...',
    }
  ],
  '智慧医疗': [
    {
      id: 'medical-intro',
      title: '产品简介',
      content: '# 智慧医疗系统介绍\n\n这里是产品简介的详细说明...',
    }
  ],
  '智慧工厂': [
    {
      id: 'factory-guide',
      title: '使用指南',
      content: '# 智慧工厂使用指南\n\n这里是使用指南的详细说明...',
    }
  ]
};

export default function DocsPage() {
  const [selectedProject, setSelectedProject] = useState('飞书克隆');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState('');

  const currentDocs = documentData[selectedProject] || [];
  const currentDoc = selectedDoc 
    ? currentDocs.find(doc => doc.id === selectedDoc)
    : currentDocs[0];

  const handleEdit = () => {
    setEditingContent(currentDoc?.content || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    // 这里应该调用API保存文档内容
    console.log('Saving document:', editingContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingContent('');
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">文档中心</h1>
          {currentDoc && !isEditing && (
            <Button
              color="primary"
              variant="flat"
              startContent={<Icon icon="mdi:pencil" className="w-4 h-4" />}
              onClick={handleEdit}
            >
              编辑文档
            </Button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <Button
                color="danger"
                variant="flat"
                startContent={<Icon icon="mdi:close" className="w-4 h-4" />}
                onClick={handleCancel}
              >
                取消
              </Button>
              <Button
                color="primary"
                startContent={<Icon icon="mdi:content-save" className="w-4 h-4" />}
                onClick={handleSave}
              >
                保存
              </Button>
            </div>
          )}
        </div>
        
        <Card className="mb-6">
          <CardBody>
            <Tabs 
              selectedKey={selectedProject} 
              onSelectionChange={(key) => {
                setSelectedProject(key.toString());
                setSelectedDoc(null);
                setIsEditing(false);
              }}
              variant="underlined"
              aria-label="Project tabs"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-primary"
              }}
            >
              {Object.keys(documentData).map((project) => (
                <Tab key={project} title={project}>
                  <div className="mt-6">
                    <div className="grid grid-cols-12 gap-6">
                      {/* 文档列表 */}
                      <div className="col-span-12 md:col-span-3">
                        <div className="space-y-2">
                          {documentData[project].map((doc) => (
                            <div
                              key={doc.id}
                              className={`
                                p-3 rounded-lg cursor-pointer transition-colors
                                ${doc.id === (selectedDoc || currentDocs[0]?.id)
                                  ? 'bg-primary-50 text-primary-500'
                                  : 'hover:bg-default-100'
                                }
                              `}
                              onClick={() => {
                                setSelectedDoc(doc.id);
                                setIsEditing(false);
                              }}
                            >
                              {doc.title}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 文档内容 */}
                      <div className="col-span-12 md:col-span-9">
                        {isEditing ? (
                          <MarkdownEditor
                            initialValue={editingContent}
                            onChange={setEditingContent}
                            height={600}
                          />
                        ) : (
                          <Card>
                            <CardBody>
                              <div className="prose dark:prose-invert max-w-none">
                                <MarkdownEditor
                                  initialValue={currentDoc?.content || ''}
                                  preview="preview"
                                  height={600}
                                />
                              </div>
                            </CardBody>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                </Tab>
              ))}
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
}
