import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import styles from "./style.module.css";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DollarOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useBudgets } from "../../../hooks/budgets/useBudgets";
import { budgetStatus } from "../../../constants/arrays-list/budget-status";
import { monthList } from "../../../constants/arrays-list/months";
import { BudgetList } from "../../../components/share/Budgets/budget-list";
const { Item } = Form;
const { Text } = Typography;

const Budgets = () => {
  const [form] = Form.useForm(); // Instancia del formulario

  const {
    // properties
    budgets,
    monthListForSelect,
    categories,
    openModal,
    modalLoading,
    hiddenOtherCategory,

    // context
    NotificationContextHolder,

    // methods
    handleCreateBudget,
    handleBudgetFilters,
    handleUpdateBudget,
    handleDeleteBudget,
    handleShowModal,
    handleHiddenModal,
    handleOtherCategory,
  } = useBudgets();

  return (
    <div className={styles.budgetsContainer}>
      {/*Assign the context where notifications will be rendered*/}
      {NotificationContextHolder}
      {/*Title and create button*/}
      <div className={styles.titleContainer}>
        <h2>Budgets</h2>
        <Button
          className={styles.createBudgetButton}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleShowModal()}
        >
          Create
        </Button>
      </div>
      {/*Budget creation form Modal*/}
      <Modal
        open={openModal}
        title="Create a new budget"
        closeIcon={false}
        style={{ top: 50 }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              handleHiddenModal();
              form.resetFields();
            }}
            icon={<CloseOutlined />}
            danger
          >
            Cancel
          </Button>,
          <Button
            className={styles.createBudgetButton}
            key="submit"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={modalLoading}
            form="form-create-login"
          >
            Create
          </Button>,
        ]}
      >
        {/*Budget creation form*/}
        <Form
          form={form}
          className={styles.formLogin}
          name="form-create-login"
          layout="vertical"
          onFinish={(data) => {
            handleCreateBudget(data, form);
          }}
        >
          <Item
            className={styles.input}
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input a name for the budget!",
              },
              {
                min: 3,
                message: "Name should be at least 3 characters long!",
              },
            ]}
          >
            <Input
              placeholder="budget name..."
              addonBefore={<EditOutlined />}
            />
          </Item>
          <Item
            label="Category"
            className={styles.input}
            name="category"
            rules={[
              {
                required: true,
                message: "Please select a category for the budget!",
              },
            ]}
          >
            <Select
              style={{ width: 120 }}
              onChange={(value) => handleOtherCategory(value, form)}
              options={[...categories, { value: "other", label: "Other" }]}
            />
          </Item>
          {!hiddenOtherCategory && (
            <Item
              className={styles.input}
              name="other_category"
              label="new category"
              rules={[
                {
                  required: true,
                  message: "Please input a new category name!",
                },
                {
                  min: 3,
                  message: "Name should be at least 3 characters long!",
                },
              ]}
            >
              <Input placeholder="new category..." />
            </Item>
          )}
          <Item
            className={styles.input}
            name="amount"
            label="Amount"
            rules={[
              {
                required: true,
                message: "Minimum amount must be at least 0.1",
              },
            ]}
          >
            <InputNumber<number>
              style={{ width: 200 }}
              defaultValue={0}
              max={99999999.99}
              step={0.01}
              onChange={() => {}}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/,/g, "") as unknown as number}
              precision={2}
              addonBefore={<DollarOutlined />}
            />
          </Item>
          {/*Filters fields*/}
          <Space direction="vertical">
            <Item
              label="Month"
              className={styles.input}
              name="month"
              rules={[
                {
                  required: true,
                  message: "Please asign a month!",
                },
              ]}
            >
              <Select
                style={{ width: 120 }}
                onChange={(value) => handleOtherCategory(value, form)}
                options={monthListForSelect}
              />
            </Item>
            <Text style={{ fontSize: 10, color: "gray" }}>
              *Only current or future months of the current year can be assigned
            </Text>
          </Space>
        </Form>
      </Modal>
      <div>
        <Space wrap>
          <Space direction="vertical" size="small">
            <Text>
              <CalendarOutlined style={{ marginRight: 3 }} />
              Month
            </Text>
            <Select
              defaultValue={"..."}
              style={{ width: 120 }}
              options={[{ value: "", label: "..." }, ...monthList]}
              onChange={(value) => {
                console.log(value);
                handleBudgetFilters("month", value);
              }}
            />
          </Space>

          <Space direction="vertical" size="small">
            <Text>
              <ClockCircleOutlined style={{ marginRight: 3 }} />
              Status
            </Text>
            <Select
              defaultValue={"..."}
              style={{ width: 120 }}
              options={[{ value: "", label: "..." }, ...budgetStatus]}
              onChange={(value) => {
                handleBudgetFilters("status", value);
              }}
            />
          </Space>

          <Space direction="vertical" size="small">
            <Text>
              <TagOutlined style={{ marginRight: 3 }} />
              Category
            </Text>
            <Select
              defaultValue={"..."}
              style={{ width: 120 }}
              options={[{ value: "", label: "..." }, ...categories]}
              onChange={(value) => {
                handleBudgetFilters("category", value);
              }}
            />
          </Space>
        </Space>
      </div>

      {/*Budgets list*/}
      {budgets.length > 0 && (
        <div className={styles.BudgetsContainer}>
          <BudgetList
            // set a new list instead of give the references in memory
            budgets={budgets}
            updateFunction={handleUpdateBudget}
            deleteFunction={handleDeleteBudget}
          />
        </div>
      )}
    </div>
  );
};

export default Budgets;
