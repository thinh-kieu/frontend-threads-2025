import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';

import { authApi } from '@/infrastructure/net';

import { USER_TOKEN_ENDPOINTS } from '../apis/user-token/endpoints';
import { LoginRequest, LoginResponse } from '../apis/user-token/login';

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<LoginResponse | null>(null);

  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const response = await authApi.post<LoginResponse>(
        USER_TOKEN_ENDPOINTS.login,
        values,
      );
      setUserData(response.data);
      message.success('Login successful!');
    } catch (error: any) {
      message.error(error?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onFinish={handleLogin} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            autoComplete="username"
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" block loading={loading}>
            {'Login'}
          </Button>
        </Form.Item>
      </Form>

      {userData && (
        <div style={{ marginTop: 24, padding: 16, background: '#f0f0f0' }}>
          <h3>Login Response:</h3>
          <pre style={{ overflow: 'auto' }}>
            {JSON.stringify(userData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
