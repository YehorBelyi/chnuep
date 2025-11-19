"use client";

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { Spin, Result } from 'antd';
import StudentView from '@/app/components/dashboard_views/StudentView';
import TeacherView from '@/app/components/dashboard_views/TeacherView';

export default function DashboardPage() {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated || !user) {
        return <div className="flex justify-center items-center h-full"><Spin size="large" tip="Завантаження..." /></div>;
    }

    return (
        <>
            {user.role === 'student' && <StudentView user={user} />}

            {(user.role === 'teacher' || user.role === 'admin') && <TeacherView user={user} />}

            {/* If unknown role */}
            {!['student', 'teacher', 'admin'].includes(user.role) && (
                <Result
                    status="403"
                    title="Доступ обмежено"
                    subTitle="Ваша роль не дозволяє переглядати цей вміст."
                />
            )}
        </>
    );
}