"use client";

import React, { useEffect, useState } from 'react';
import { Badge, Popover, List, Button, Empty } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useGetNotificationsQuery, useMarkReadMutation, Notification } from '@/lib/store/features/notifications/notificationsApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

export default function NotificationBell() {
    const { user } = useSelector((state: RootState) => state.auth);
    const { data: initialNotifications } = useGetNotificationsQuery(undefined, { skip: !user });
    const [markRead] = useMarkReadMutation();

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (initialNotifications) {
            setNotifications(initialNotifications);
        }
    }, [initialNotifications]);

    useEffect(() => {
        if (!user) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/notifications/ws`;

        const socket = new WebSocket(wsUrl);

        socket.onmessage = (event) => {
            const newNotif = JSON.parse(event.data);
            setNotifications(prev => [newNotif, ...prev]);
        };

        return () => {
            socket.close();
        };
    }, [user]);

    const handleRead = (id: number) => {
        markRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const content = (
        <div className="w-80 max-h-96 overflow-y-auto">
            <List
                dataSource={notifications}
                renderItem={(item) => (
                    <List.Item
                        className={`cursor-pointer hover:bg-gray-50 transition p-3 ${!item.is_read ? "bg-blue-50" : ""}`}
                        onClick={() => !item.is_read && handleRead(item.id)}
                    >
                        <div className="w-full">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm ${!item.is_read ? "font-bold text-blue-900" : "text-gray-700"}`}>
                                    {item.message}
                                </span>
                                {!item.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>}
                            </div>
                            <div className="text-xs text-gray-400">
                                {new Date(item.created_at).toLocaleString()}
                            </div>
                        </div>
                    </List.Item>
                )}
            />
            {notifications.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Немає сповіщень" />}
        </div>
    );

    return (
        <Popover content={content} title="Сповіщення" trigger="click" placement="bottomRight">
            <Badge count={unreadCount} size="small" offset={[-5, 5]}>
                <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '20px' }} />} />
            </Badge>
        </Popover>
    );
}