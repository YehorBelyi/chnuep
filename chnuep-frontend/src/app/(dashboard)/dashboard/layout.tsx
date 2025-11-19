"use client";

import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, theme, Avatar, Dropdown } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    MessageOutlined,
    TeamOutlined,
    LogoutOutlined,
    HomeOutlined
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { logout } from '@/lib/store/features/auth/authSlice';
import { useLogoutMutation } from '@/lib/store/features/auth/authApi';
import Link from 'next/link';

const { Header, Content, Footer, Sider } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const [logoutApi] = useLogoutMutation();

    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        await logoutApi();
        dispatch(logout());
        router.push('/');
    };

    // Render menu depending on user role
    const getMenuItems = () => {
        const baseItems = [
            { key: '/dashboard', icon: <HomeOutlined />, label: 'Головна' },
            { key: '/dashboard/profile', icon: <UserOutlined />, label: 'Мій профіль' },
            { key: '/dashboard/chat', icon: <MessageOutlined />, label: 'Повідомлення' },
        ];

        if (user?.role === 'student') {
            baseItems.splice(1, 0, { key: '/dashboard/courses', icon: <BookOutlined />, label: 'Мої курси' });
        }

        if (user?.role === 'teacher' || user?.role === 'admin') {
            baseItems.splice(1, 0, { key: '/dashboard/manage-courses', icon: <BookOutlined />, label: 'Керування курсами' });
        }

        if (user?.role === 'admin') {
            baseItems.push({ key: '/dashboard/users', icon: <TeamOutlined />, label: 'Користувачі' });
        }

        return baseItems;
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                {/* Sidebar logo */}
                <div className="h-16 m-4 flex items-center justify-center bg-white/10 rounded-lg text-white font-bold text-lg truncate">
                    {collapsed ? "" : "CHNUEP"}
                </div>

                <Menu
                    theme="dark"
                    defaultSelectedKeys={[pathname]}
                    mode="inline"
                    items={getMenuItems()}
                    onClick={({ key }) => router.push(key)}
                />
            </Sider>

            <Layout>
                {/* Upper dashboard panel */}
                <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Breadcrumb items={[{ title: 'Dashboard' }, { title: pathname.split('/').pop() }]} />

                    <div className="flex items-center gap-3">
                        <span className="font-medium">{user?.full_name}</span>
                        <Dropdown menu={{ items: [{ key: 'logout', label: 'Вийти', icon: <LogoutOutlined />, onClick: handleLogout, danger: true }] }}>
                            <Avatar src={user?.avatar_url} icon={<UserOutlined />} className="cursor-pointer bg-blue-500" />
                        </Dropdown>
                    </div>
                </Header>

                <Content style={{ margin: '16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    CHNUEP ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
}