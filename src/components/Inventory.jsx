import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Table, Space, InputNumber } from "antd";
import {
  addInventoryItem,
  getInventoryItems,
  updateInventoryItem,
  deleteInventoryItem,
} from "../services/inventoryService";

const Inventory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const items = await getInventoryItems();
    setInventory(items);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editingItem) {
      await updateInventoryItem(editingItem.id, values);
      setEditingItem(null);
    } else {
      await addInventoryItem(values);
    }
    form.resetFields();
    setIsModalVisible(false);
    fetchInventory();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    await deleteInventoryItem(id);
    fetchInventory();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    showModal();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price (LKR)",
      dataIndex: "price",
      key: "price",
    },
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
      <Button type="primary" onClick={showModal}>
        Add New Item
      </Button>
      <Modal
        title="Add New Inventory Item"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="name"
            label="Item Name"
            rules={[
              { required: true, message: "Please input the name of the item!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Item Price"
            rules={[
              {
                required: true,
                message: "Please input the price of the item!",
              },
              {
                type: "number",
                min: 0,
                message: "Price must be a non-negative number",
              },
            ]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input the item description!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Table columns={columns} dataSource={inventory} rowKey="id" />
    </div>
  );
};

export default Inventory;
