<template>
  <div>
    <!-- Диалог создания расхода -->
    <v-dialog v-model="dialog" max-width="1000" min-width="1000">
      <v-card class="dialog-card">
        <v-card-title>
          <span class="text-h5">Добавить новый расход</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="newExpense.user"
              label="Имя пользователя"
              required
              class="input-field"
            ></v-text-field>
            <v-text-field
              v-model="newExpense.date"
              label="Дата (YYYY-MM-DD)"
              required
              class="input-field"
            ></v-text-field>
            <v-text-field
              v-model="newExpense.amount"
              label="Сумма"
              type="number"
              required
              class="input-field"
            ></v-text-field>
            <v-text-field
              v-model="newExpense.category"
              label="Категория"
              required
              class="input-field"
            ></v-text-field>
            <v-textarea
              v-model="newExpense.description"
              label="Описание"
              class="input-field"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="addExpense">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Таблица для отображения расходов -->
    <v-data-table :items="expenses" :headers="headers" hide-default-footer class="expense-table">
      <template v-slot:top>
        <v-btn color="primary" @click="dialog = true">Добавить расход</v-btn>
        <div class="total">Общая сумма = {{ total }} тг.</div>
      </template>

      <template v-slot:item="{ item }">
        <tr :class="{'hover-row': true}">
          <td>{{ item.user }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.description }}</td>
          <td><v-icon @click="deleteExpense(item)">mdi-delete</v-icon></td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const dialog = ref(false);
const valid = ref(false);
const defaultExpense = {
  user: "",
  date: "",
  amount: null,
  category: "",
  description: "",
};

const newExpense = ref({ ...defaultExpense });

const expenses = ref([]);
const headers = ref([
  { title: "Пользователь", value: "user", sortable: true },
  { title: "Дата", value: "date", sortable: true },
  { title: "Сумма", value: "amount", sortable: true },
  { title: "Категория", value: "category", sortable: true },
  { title: "Описание", value: "description", sortable: true },
]);

const total = ref(0);

// Получение данных о расходах
const fetchExpenses = async () => {
  try {
    const response = await axios.get("http://localhost:3000/expenses");
    expenses.value = response.data;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

// Добавление нового расхода
const addExpense = async () => {
  try {
    await axios.post("http://localhost:3000/expenses", newExpense.value);
    dialog.value = false;
    fetchExpenses(); // Обновляем список расходов
    fetchTotal();
    resetForm();
  } catch (error) {
    console.error("Ошибка при добавлении расхода:", error);
  }
};

const resetForm = () => {
  newExpense.value = { ...defaultExpense }; // Сбрасываем объект
};

const deleteExpense = async (expens) => {
  try {
    await axios.delete(
      `http://localhost:3000/expenses/${expens.id}`,
      newExpense.value
    );
    fetchExpenses(); // Обновляем список расходов
    fetchTotal();
  } catch (error) {
    console.error("Ошибка при добавлении расхода:", error);
  }
};

const fetchTotal = async () => {
  try {
    const response = await axios.get("http://localhost:3000/analysis/total");
    total.value = response.data.total;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

onMounted(() => {
  fetchExpenses();
  fetchTotal();
});
</script>

<style scoped>
.dialog-card {
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.input-field {
  margin-bottom: 1rem;
}

.total {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d3748;
}

.expense-table {
  margin-top: 2rem;
}

.hover-row:hover {
  background-color: #f1f1f1;
}

v-btn {
  border-radius: 12px;
  transition: background-color 0.2s;
}

v-btn:hover {
  background-color: #4caf50;
}

v-btn:focus {
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.5);
}
</style>
