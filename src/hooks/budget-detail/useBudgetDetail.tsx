import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { findOneBudget } from "../../actions/budgets.actions";
import { IBudgetResponseWithDates } from "../../common/interfaces/api-responses/budget.responses.interfaces";
import { useNotification } from "../notifications/useNotification";
import { parseISO } from "date-fns";
import { budgetStatus } from "../../common/constants/enums/budget-status.enum";
import { formCreateTransaction } from "../../common/interfaces/for-components/form-create-transaction.interface";
import { FormInstance } from "antd";
import { createTransaction } from "../../actions/transactions.actions";
import { useAsyncModal } from "../async-modal/useAsyncModal";
import {
  ITransactionResponse,
  ITransactionResponseWithDate,
} from "../../common/interfaces/api-responses/transaction.responses.interfaces";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// set so that set the dates in UTC format
dayjs.extend(utc);

const initialValues = {
  id: "",
  name: "",
  category: { id: "", name: "", user_id: "" },
  amount: 0,
  end_date: new Date(),
  start_date: new Date(),
  status: budgetStatus.PENDING,
};

export const useBudgetDetail = () => {
  const navigate = useNavigate();

  // request state ---------------------------------------------------
  const [requesting, setRequesting] = useState(false);

  // params ----------------------------------------------------------
  const { budget_id } = useParams();

  // budget
  const [budget, setBudget] = useState<IBudgetResponseWithDates>(initialValues);

  const getBudget = async (budget_id: string) => {
    setRequesting(true);
    const budget = await findOneBudget(budget_id);
    setRequesting(false);
    if (!budget) {
      openNotification("error", "Budget not found", "Budget data not found");
      return setTimeout(() => {
        navigate("/app/budgets");
      }, 5000);
    }
    // transform Dates from strings to Date in UTC
    const start_date = parseISO(budget.start_date);
    const end_date = parseISO(budget.end_date);

    const budgetWithDates = { ...budget, start_date, end_date };

    setBudget(budgetWithDates);
  };

  // transactions --------------------------------------------------------

  const [transactions, setTransactions] = useState<
    ITransactionResponseWithDate[]
  >([]);

  const handleCreateTransactions = async (
    data: formCreateTransaction,
    form: FormInstance
  ): Promise<void> => {
    // convert date form day js to Date
    const dateUTC = dayjs.utc(data.date).toDate();
    dateUTC.setUTCHours(0, 0, 0);
    const newTransactionRegistered = await handleTransactionFormModalOk(() =>
      createTransaction({
        ...data,
        date: dateUTC,
        budget_id: budget.id,
      })
    );

    handleHiddenModal();

    form.resetFields();

    if (newTransactionRegistered === null) {
      openNotification(
        "error",
        "Error recording expense",
        "Check your connection.\nPlease try again later."
      );
      return;
    }

    // transform Dates from strings to Date in UTC
    console.log(
      "newTransactionRegistered.date: " + newTransactionRegistered.date
    );

    const dateWithDate = parseISO(newTransactionRegistered.date);
    const newTransactionRegisteredWithDate = {
      ...newTransactionRegistered,
      date: dateWithDate,
    };
    setTransactions([newTransactionRegisteredWithDate, ...transactions]);
    openNotification("success", "Success", "Budget created successfully");
  };

  // modal ----------------------------------------------------------------

  const {
    openModal,
    modalLoading,
    handleShowModal,
    handleHiddenModal,
    setModalLoading,
  } = useAsyncModal();

  // form ----------------------------------------------------------------

  const handleTransactionFormModalOk = async (
    request: () => Promise<ITransactionResponse | null>
  ) => {
    setModalLoading(true);
    const result = await request();
    setModalLoading(false);
    return result;
  };

  // notifications ----------------------------------------------------------------

  const { NotificationContextHolder, openNotification } = useNotification();

  // useEffect ----------------------------------------------------------------

  useEffect(() => {
    if (budget_id) getBudget(budget_id);
    else {
      openNotification("error", "Data error", "Budget ID not provided");
      setTimeout(() => {
        navigate("/app/budgets");
      }, 5000);
    }
  }, []);

  return {
    //properties
    budget,
    requesting,
    openModal,
    modalLoading,

    // context
    NotificationContextHolder,

    //methods
    handleCreateTransactions,
    handleShowModal,
    handleHiddenModal,
  };
};
