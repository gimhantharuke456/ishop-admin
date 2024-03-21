import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Table, Space } from "antd";
import {
  addOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} from "../services/orderService";

const Order = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const items = await getOrders();
    setOrders(items);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editingOrder) {
      await updateOrder(editingOrder.id, values);
    } else {
      await addOrder(values);
    }
    setIsModalVisible(false);
    fetchOrders();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingOrder(null);
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    fetchOrders();
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    form.setFieldsValue(order);
    showModal();
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    // Add more columns as needed based on your order structure
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          form.resetFields();
          setEditingOrder(null);
          showModal();
        }}
      >
        Add New Order
      </Button>
      <Modal
        title={editingOrder ? "Edit Order" : "Add New Order"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          {/* Define Form.Items for order details like customerName, orderDate, etc. */}
        </Form>
      </Modal>
      <Table columns={columns} dataSource={orders} rowKey="id" />
    </div>
  );
};

export default Order;
