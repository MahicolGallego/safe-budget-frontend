import { useEffect, useState } from "react";
import { monthList } from "../../constants/arrays-list/months";
import { IForSelect } from "../../constants/interfaces/for-components/select.interface";
import { ICategoryResponse } from "../../constants/interfaces/api-responses/categories.responses.interfaces";
import { findAllCategories } from "../../actions/categories.actions";
import { capitalizeFirstLetter } from "../../constants/helpers/capitalize.methods";
import { FormInstance } from "antd";
import { useNotification } from "../notifications/useNotification";
import { IBudgetResponse } from "../../constants/interfaces/api-responses/budget.responses.interfaces";
import {
  createBudget,
  deleteBudget,
  findAllBudgets,
  updateBudget,
} from "../../actions/budgets.actions";
import { FilterBudgetDto } from "../../constants/interfaces/api-requests-dtos/filter-budget.dto";
import { formCreateBudget } from "../../constants/interfaces/for-components/form-create-budget.interface";
import { useAsyncModal } from "../async-modal/useAsyncModal";
import { UpdateBudgetDto } from "../../constants/interfaces/api-requests-dtos/update-budget.dto";
import { parseISO } from "date-fns";

export const useBudgets = () => {
  // budgets ----------------------------------------------------------------

  const [budgetFilters, setBudgetFilters] = useState<FilterBudgetDto>({});

  const [budgets, setBudgets] = useState<IBudgetResponse[]>([]);

  const handleCreateBudget = async (
    data: formCreateBudget,
    form: FormInstance
  ): Promise<void> => {
    let category: string;

    if (data.category === "other" && data.other_category)
      category = data.other_category.toLowerCase().trim();
    else category = data.category.toLowerCase().trim();

    const newBudgetRegistered = (await handleBudgetFormModalOk(() =>
      createBudget({
        name: data.name,
        category_name: category,
        month: data.month,
        amount: data.amount,
      })
    )) as IBudgetResponse;

    handleHiddenModal();

    form.resetFields();

    if (newBudgetRegistered === null) {
      openNotification(
        "error",
        "Error creating budget",
        "Possible causes\nA Budget with this name already exists.\nCheck your connection.\nPlease try again."
      );
      return;
    }

    // transform Dates from strings to Date in UTC
    newBudgetRegistered.start_date = parseISO(
      newBudgetRegistered.start_date as string
    );
    newBudgetRegistered.end_date = parseISO(
      newBudgetRegistered.end_date as string
    );

    setBudgets([newBudgetRegistered, ...budgets]);
    openNotification("success", "Success", "Budget created successfully");
  };

  const handleFindAllBudgets = async (
    filterOptions: FilterBudgetDto
  ): Promise<void> => {
    let data = await findAllBudgets(filterOptions);
    if (data === null) {
      openNotification(
        "error",
        "Error",
        "Error retrieving data or filtered data"
      );
      return;
    }

    // transform Dates from strings to Date in UTC
    if (data.length) {
      data = data.map((budget) => {
        budget.start_date = parseISO(budget.start_date as string);
        budget.end_date = parseISO(budget.end_date as string);
        return budget;
      });
    }

    setBudgets(data);
  };

  const handleUpdateBudget = async (
    budgetToUpdate: IBudgetResponse,
    updateBudgetDto: UpdateBudgetDto,
    form: FormInstance,
    handleRequestUpdateBudget: (
      request: () => Promise<IBudgetResponse | null>
    ) => Promise<IBudgetResponse | null>
  ) => {
    const BudgetToUpdate = { ...budgetToUpdate };
    const updatedBudget = (await handleRequestUpdateBudget(() =>
      updateBudget(budgetToUpdate.id, updateBudgetDto)
    )) as IBudgetResponse;
    if (updatedBudget === null) {
      openNotification(
        "error",
        "Error updating budget",
        "Possible causes\nA Budget with this name already exists.\nCheck your connection.\nPlease try again."
      );
      // regresar los campos a su valor anterior por que no se actualizaron
      form.setFieldsValue({
        name: BudgetToUpdate.name,
        category: categories.find(
          (category) =>
            category.label.toLowerCase() === BudgetToUpdate.category.name
        )?.value,
        amount: BudgetToUpdate.amount,
        month: (BudgetToUpdate.start_date as Date).getUTCMonth(),
        other_category: undefined,
      });
      return;
    }

    // transform Dates from strings to Date
    updatedBudget.start_date = parseISO(updatedBudget.start_date as string);
    updatedBudget.end_date = parseISO(updatedBudget.end_date as string);

    const updateBudgets = budgets.map((budget) => {
      if (budget.id !== BudgetToUpdate.id) return budget;
      return updatedBudget as IBudgetResponse;
    });

    if (updateBudgetDto.month)
      updateBudgets.sort((a, b) => {
        return a.start_date > b.start_date
          ? 1
          : a.start_date < b.start_date
          ? -1
          : 0;
      });
    setBudgets(updateBudgets);
    openNotification("success", "Success", "Budget data updated successfully");
  };

  const handleDeleteBudget = async (budget_id: string): Promise<void> => {
    const result = await handleBudgetFormModalOk(() => deleteBudget(budget_id));

    if (result === null) {
      openNotification(
        "error",
        "Error deleting budget",
        "Check your connection.\nPlease try again."
      );
      return;
    }

    const updateBudgets = budgets.filter((budget) => budget.id !== budget_id);
    setBudgets(updateBudgets);
    openNotification("success", "Success", "Budget deleted successfully");
  };

  const handleBudgetFilters = (
    filter: keyof FilterBudgetDto,
    value: string | number
  ) => {
    setBudgetFilters({ ...budgetFilters, [filter]: value });
  };

  // Months -----------------------------------------------------------------
  const [monthListForSelect, setMonthListForSelect] = useState<IForSelect[]>(
    []
  );

  const monthForSelection = (): IForSelect[] => {
    const currentMonth = new Date().getUTCMonth();
    return monthList.filter((month) => (month.value as number) >= currentMonth);
  };

  // Categories ----------------------------------------------------------------

  const [categories, setCategories] = useState<IForSelect[]>([]);

  const getAndFormatCategories = async () => {
    try {
      const data = await findAllCategories();
      if (!data || !data.length) return;

      const formattedDataForSelect = data.map(
        (category: ICategoryResponse) => ({
          value: category.name,
          label: capitalizeFirstLetter(category.name),
        })
      );
      setCategories(formattedDataForSelect);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
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

  const [hiddenOtherCategory, setHiddenOtherCategory] = useState(true);

  const handleOtherCategory = (
    category_selected: string,
    form: FormInstance
  ) => {
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

  const handleBudgetFormModalOk = async (
    request: () => Promise<IBudgetResponse | { message: string } | null>
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
    setMonthListForSelect(monthForSelection());
  }, []);

  useEffect(() => {
    getAndFormatCategories();
  }, [budgets]);

  useEffect(() => {
    handleFindAllBudgets(budgetFilters);
  }, [budgetFilters]);

  return {
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
    handleFindAllBudgets,
    handleUpdateBudget,
    handleDeleteBudget,
    handleBudgetFilters,
    handleShowModal,
    handleHiddenModal,
    handleOtherCategory,
  };
};
