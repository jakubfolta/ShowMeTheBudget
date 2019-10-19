export let stri = 'Hello world';

export const Expense = class {
constructor (description, value, id) {

      this.description = description;
      this.value = value;
      this.id = id;
      this.percentage = -1;
}

calcPercentage(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  }
}
