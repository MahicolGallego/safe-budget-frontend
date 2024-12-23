import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Typography,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  FormOutlined,
} from "@ant-design/icons";
import styles from "./styles.module.css";
import { IBudgetCard } from "../../common/interfaces/for-components/budget-card.interface";
import {
  capitalizeFirstLetter,
  capitalizeFull,
} from "../../common/helpers/capitalize.methods.helper";
import { monthList } from "../../common/constants/arrays-list/months";
import { useAsyncModal } from "../../hooks/async-modal/useAsyncModal";
import { useState } from "react";
import { IBudgetResponse } from "../../common/interfaces/api-responses/budget.responses.interfaces";
import { formCreateBudget } from "../../common/interfaces/for-components/form-create-budget.interface";
import { UpdateBudgetDto } from "../../common/interfaces/api-requests-dtos/update-budget.dto";
import { budgetStatus } from "../../common/constants/enums/budget-status.enum";
import { useNavigate } from "react-router";
import { formatInputCurrencyString } from "../../common/helpers/formatter-input-currency-string.helper";

type budgetFormKeys = keyof formCreateBudget;
const { Item } = Form;
const { Text } = Typography;

export const BudgetCard = ({
  budget,
  categories,
  monthListForSelect,
  budgetUpdateFunction,
  budgetDeleteFunction,
}: IBudgetCard) => {
  const navigate = useNavigate();
  // variables ----------------------------------------------------------------
  const year = budget.start_date.getUTCFullYear();
  const category_name = budget.category.name;
  const indexMonth = budget.start_date.getUTCMonth();
  const month_name = monthList[indexMonth].label;
  const formatedDate = `${month_name}/${year}`;
  const budgetCategoryIndex = categories.find(
    (category) => category.label.toLowerCase() === budget.category.name
  )?.value;

  // form ----------------------------------------------------------------
  const [form] = Form.useForm();
  const [hiddenOtherCategory, setHiddenOtherCategory] = useState(true);

  const handleOtherCategory = (category_selected: string) => {
    if (category_selected === "other") {
      setHiddenOtherCategory(false);
    } else {
      if (hiddenOtherCategory === false) {
        setHiddenOtherCategory(true);

        // clean other_category value - field
        // so that it "forgets" that field in its internal state.
        // to prevent you from validating it erroneously even if
        // another category is selected
        form.setFieldsValue({ other_category: undefined });
      }
    }
  };

  // update budget ----------------------------------------------------------------
  const handleUpdateBudget = async (key: budgetFormKeys) => {
    // extract value from form field because onBlur does not retuning this one by default
    let value = form.getFieldValue(key);

    if (key === "category") {
      if (value === "other") return;
      value = value.toLowerCase();
    }

    if (key === "other_category") key = "category";

    if (key === "month") {
      if (value === budget.start_date.getUTCMonth()) return;
    } else if (value === budget[key]) return;

    const updateBudgetDto: UpdateBudgetDto = {
      [key === "category" ? "category_name" : key]: value,
    };
    await budgetUpdateFunction(
      budget,
      updateBudgetDto,
      form,
      handleRequestUpdateBudget
    );
  };

  const handleRequestUpdateBudget = async (
    request: () => Promise<IBudgetResponse | null>
  ): Promise<IBudgetResponse | null> => {
    setModalLoading(true);
    const result = await request();
    setModalLoading(false);
    return result;
  };

  // modal
  const {
    openModal,
    modalLoading,
    handleShowModal,
    handleHiddenModal,
    setModalLoading,
  } = useAsyncModal();

  return (
    <>
      <div className={styles.budgetCardContainer}>
        <div
          className={styles.budgetCardContainerInfo}
          onClick={() => {
            navigate(`/app/budget/${budget.id}`);
          }}
        >
          <div>
            <h4>{budget.name}</h4>
            <h5>{capitalizeFull(category_name)}</h5>
            <h5>{formatedDate}</h5>
          </div>
          <h4>{capitalizeFirstLetter(budget.status)}</h4>
        </div>
        <div className={styles.budgetCardContainerButtons}>
          <Button
            className={styles.editButton}
            type="primary"
            icon={<FormOutlined />}
            iconPosition="end"
            onClick={handleShowModal}
          ></Button>
          <Popconfirm
            title={`Delete budget: ${budget.name}`}
            description="Are you sure to delete this budget?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              budgetDeleteFunction(budget.id);
            }}
            placement="bottom"
          >
            <Button
              className={styles.deleteButton}
              type="primary"
              icon={<DeleteOutlined />}
              iconPosition="end"
              onClick={() => {}}
            ></Button>
          </Popconfirm>
        </div>
      </div>
      {/*Budget update form Modal*/}
      <Modal
        open={openModal}
        title="Edit Budget"
        closeIcon={false}
        style={{ top: 50 }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              handleHiddenModal();
            }}
            icon={<CloseOutlined />}
            loading={modalLoading}
            danger
          >
            {modalLoading ? "Updating" : "Close"}
          </Button>,
        ]}
      >
        {/*Budget update form*/}
        <Form
          form={form}
          initialValues={{
            name: budget.name,
            category: budgetCategoryIndex,
            amount: budget.amount,
            month: budget.start_date.getUTCMonth(),
            other_category: undefined,
          }}
          name={`form-update-budget:${budget.id}`}
          layout="vertical"
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
              onBlur={async () => {
                try {
                  // validate if the new value of the field is valid
                  // before continuing with the request so as not to
                  // perform innecesary request
                  await form.validateFields(["name"]);

                  // try update budget if the validate field is ok
                  handleUpdateBudget("name");
                } catch (error) {
                  console.log("Field validation failed:", error);
                }
              }}
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
              onChange={(value) => {
                handleOtherCategory(value);
                handleUpdateBudget("category");
              }}
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
              <Input
                placeholder="new category..."
                onBlur={async () => {
                  try {
                    await form.validateFields(["other_category"]);
                    handleUpdateBudget("other_category");
                  } catch (error) {
                    console.log("Field validation failed:", error);
                  }
                }}
              />
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
              max={99999999.99}
              step={1}
              onChange={() => {}}
              formatter={formatInputCurrencyString}
              parser={(value) => value?.replace(/,/g, "") as unknown as number}
              precision={2}
              addonBefore={<DollarOutlined />}
              onBlur={async () => {
                try {
                  await form.validateFields(["amount"]);
                  handleUpdateBudget("amount");
                } catch (error) {
                  console.log("Field validation failed:", error);
                }
              }}
            />
          </Item>
          <Space direction="vertical">
            <Item
              label="Month"
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
                options={monthListForSelect}
                onChange={() => {
                  handleUpdateBudget("month");
                }}
                disabled={budget.status !== budgetStatus.PENDING ? true : false}
              />
            </Item>
            <Text style={{ fontSize: 10, color: "gray" }}>
              *Only current or future months of the current year can be assigned
              <br />
              *Cannot update the associated month to budget if its status is
              active or completed
            </Text>
          </Space>
        </Form>
      </Modal>
    </>
  );
};
