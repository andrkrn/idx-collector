import IDX from "./idx";
import Spreadsheet from "./spreadsheet";

(async function () {
  const idx = new IDX();
  await idx.collect();

  const spreadsheet = new Spreadsheet();
  await spreadsheet.updateStockPrice(idx.stocks);
})();
