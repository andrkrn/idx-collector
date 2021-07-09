import puppeteer from "puppeteer";

interface Summary {
  data: Data[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

type Data = {
  [key in keyof Stock]: string | number;
};

interface Stock {
  Bid: number;
  BidVolume: number;
  Change: number;
  Close: number;
  Date: string;
  DelistingDate: string;
  FirstTrade: number;
  ForeignBuy: number;
  ForeignSell: number;
  Frequency: number;
  High: number;
  IDStockSummary: number;
  IndexIndividual: number;
  ListedShares: number;
  Low: number;
  No: number;
  NonRegularFrequency: number;
  NonRegularValue: number;
  NonRegularVolume: number;
  Offer: number;
  OfferVolume: number;
  OpenPrice: number;
  Previous: number;
  Remarks: string;
  StockCode: string;
  StockName: string;
  TradebleShares: number;
  Value: number;
  Volume: number;
  WeightForIndex: number;
  percentage?: number;
  persen?: number;
}

class IDX {
  public stocks: Data[];

  constructor() {
    this.stocks = [];
  }

  async collect() {
    console.log(process.env.PUPPETEER_EXECUTABLE_PATH);
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disabled-setupid-sandbox",
        "--disable-dev-shm-usage",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: false,
    });
    const page = await browser.newPage();
    const targetUrl =
      "https://www.idx.co.id/umbraco/Surface/TradingSummary/GetStockSummary";

    await page.goto(
      "https://www.idx.co.id/en-us/market-data/trading-summary/stock-summary/"
    );

    await page.reload();

    const res = await page.waitForResponse(async (response) => {
      return response.url().startsWith(targetUrl);
    });

    const stocks: Summary = await res.json();
    try {
      this.stocks = stocks.data;
    } catch (err) {
      console.error(err);
    }

    await browser.close();
  }
}

export default IDX;
