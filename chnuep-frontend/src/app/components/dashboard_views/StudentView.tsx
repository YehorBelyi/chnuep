"use client";
import { Card, Col, Row, Statistic, Progress } from 'antd';
import { BookOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

export default function StudentView({ user }: { user: any }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Вітаємо, {user.full_name}! 👋</h2>

            <Row gutter={16} className="mb-8">
                <Col span={8}>
                    <Card bordered={false} className="bg-blue-50">
                        <Statistic title="Активні курси" value={4} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="bg-green-50">
                        <Statistic title="Здані роботи" value={12} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="bg-orange-50">
                        <Statistic title="Середній бал" value={88} suffix="/ 100" />
                    </Card>
                </Col>
            </Row>

            <h3 className="text-xl font-semibold mb-4">Мої Курси (Нещодавні)</h3>
            <Row gutter={[16, 16]}>
                {[1, 2, 3].map((i) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={i}>
                        <Card
                            hoverable
                            cover={<div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>}
                            actions={[<ClockCircleOutlined key="info" />]}
                        >
                            <Card.Meta
                                title={`Основи програмування ${i}`}
                                description={<Progress percent={30 * i} size="small" />}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}