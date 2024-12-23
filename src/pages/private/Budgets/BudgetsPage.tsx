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
import { budgetStatus } from "../../../common/constants/arrays-list/budget-status";
import { monthList } from "../../../common/constants/arrays-list/months";
import { BudgetList } from "../../../components/Budgets/budget-list";
import { useAuthStore } from "../../../store/auth.store";
import { Onboarding } from "../../../components/Onboarding/Onboarding";
import { formatInputCurrencyString } from "../../../common/helpers/formatter-input-currency-string.helper";
const { Item } = Form;
const { Text } = Typography;

const Budgets = () => {
  const { user } = useAuthStore();
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
    <>
      {/*Onboarding*/}
      {!user?.onboarding ? (
        <Onboarding />
      ) : (
        <>
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
                form="form-create-budget"
              >
                Create
              </Button>,
            ]}
          >
            {/*Budget creation form*/}
            <Form
              form={form}
              name="form-create-budget"
              layout="vertical"
              onFinish={(data) => {
                handleCreateBudget(data, form);
              }}
            >
              <Item
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
                  name="other_category"
                  label="New category"
                  rules={[
                    {
                      required: true,
                      message: "Please input a new category name!",
                    },
                    {
                      min: 3,
                      message:
                        "Category name should be at least 3 characters long!",
                    },
                  ]}
                >
                  <Input placeholder="new category..." />
                </Item>
              )}
              <Item
                name="amount"
                label="Amount"
                rules={[
                  {
                    required: true,
                    message: "the amount is required!",
                  },
                  {
                    type: "number",
                    min: 0.1,
                    message: "Minimum amount must be at least 0.1",
                  },
                ]}
              >
                <InputNumber<number>
                  style={{ width: 200 }}
                  defaultValue={0}
                  max={99999999.99}
                  step={1}
                  onChange={() => {}}
                  formatter={formatInputCurrencyString}
                  parser={(value) =>
                    value?.replace(/,/g, "") as unknown as number
                  }
                  precision={2}
                  addonBefore={<DollarOutlined />}
                />
              </Item>
              <Space direction="vertical">
                <Item
                  label="Month"
                  className={styles.input}
                  name="month"
                  rules={[
                    {
                      required: true,
                      message: "Please assign a month!",
                    },
                  ]}
                >
                  <Select style={{ width: 120 }} options={monthListForSelect} />
                </Item>
                <Text style={{ fontSize: 10, color: "gray" }}>
                  *Only current or future months of the current year can be
                  assigned
                </Text>
              </Space>
            </Form>
          </Modal>
          {/*Filters fields*/}

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

          {/*Budgets list*/}
          {budgets.length > 0 && (
            <div className={styles.budgetsContainer}>
              <BudgetList
                // set a new list instead of give the references in memory
                budgets={budgets}
                categories={categories}
                monthListForSelect={monthListForSelect}
                budgetUpdateFunction={handleUpdateBudget}
                budgetDeleteFunction={handleDeleteBudget}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Budgets;
