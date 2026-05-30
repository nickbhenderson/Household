document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (event) => {
    const editExpenseButton = event.target.closest("[data-edit-expense]");
    const cancelExpenseButton = event.target.closest("[data-cancel-expense]");
    const editSummaryButton = event.target.closest("[data-edit-summary-expense]");
    const cancelSummaryButton = event.target.closest("[data-cancel-summary-expense]");

    if (editExpenseButton) {
      const id = editExpenseButton.dataset.editExpense;
      toggleExpenseEdit(id, true);
      return;
    }

    if (cancelExpenseButton) {
      const id = cancelExpenseButton.dataset.cancelExpense;
      toggleExpenseEdit(id, false);
      return;
    }

    if (editSummaryButton) {
      const id = editSummaryButton.dataset.editSummaryExpense;
      toggleSummaryExpenseEdit(id, true);
      return;
    }

    if (cancelSummaryButton) {
      const id = cancelSummaryButton.dataset.cancelSummaryExpense;
      toggleSummaryExpenseEdit(id, false);
      return;
    }
  });

  document.addEventListener("submit", (event) => {
    const deleteForm = event.target.closest("[data-confirm-delete]");

    if (deleteForm) {
      if (!confirm("Are you sure you want to delete this expense?")) {
        event.preventDefault();
      }

      return;
    }

    const editForm = event.target.closest("[data-edit-form]");

    if (!editForm) return;

    const reasonInput = editForm.querySelector('[name="rentItem[reason]"]');
    const costInput = editForm.querySelector('[name="rentItem[cost]"]');
    const dateInput = editForm.querySelector('[name="rentItem[date]"]');
    const descInput = editForm.querySelector('[name="rentItem[desc]"]');

    const originalReason = editForm.dataset.originalReason || "";
    const originalCost = Number(editForm.dataset.originalCost) || 0;
    const originalDate = editForm.dataset.originalDate || "";
    const originalDesc = editForm.dataset.originalDesc || "";

    const currentReason = reasonInput?.value || "";
    const currentCost = Number(costInput?.value) || 0;
    const currentDate = dateInput?.value || "";
    const currentDesc = descInput?.value || "";

    const noChanges =
      currentReason === originalReason &&
      currentCost === originalCost &&
      currentDate === originalDate &&
      currentDesc === originalDesc;

    if (noChanges) {
      event.preventDefault();

      const id = editForm.dataset.expenseId;

      if (editForm.id.startsWith("expense-edit-summary")) {
        toggleSummaryExpenseEdit(id, false);
      } else {
        toggleExpenseEdit(id, false);
      }
    }
  });

  function toggleExpenseEdit(id, isEditing) {
    const display = document.getElementById(`expense-display-${id}`);
    const form = document.getElementById(`expense-edit-${id}`);

    if (!display || !form) {
      console.warn("Current month edit elements not found for:", id);
      return;
    }

    display.classList.toggle("d-none", isEditing);
    form.classList.toggle("d-none", !isEditing);
  }

  function toggleSummaryExpenseEdit(id, isEditing) {
    const display = document.getElementById(`expense-display-summary-${id}`);
    const form = document.getElementById(`expense-edit-summary-${id}`);

    if (!display || !form) {
      console.warn("Summary edit elements not found for:", id);
      return;
    }

    display.classList.toggle("d-none", isEditing);
    form.classList.toggle("d-none", !isEditing);
  }
});