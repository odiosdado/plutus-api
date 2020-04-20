import moment from 'moment';
import AlgorithmValue from '../models/model.algorithmValue';
import { handleResponse } from '../utils/helpers';
import stringify from 'csv-stringify';

export const getReport = async (req, res) => {

  const { query } = req;
  const { date } = query;
  const { type } = query;
  console.log({ query });
  const startDate = moment(date);
  const endDate = moment(date).add(1, 'day');

  AlgorithmValue.find({
    algorithm: req.params.id,
    createdAt: {
      "$gte": startDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      "$lt": endDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    }
  }).populate(
    {
      path: 'algorithm',
      path: 'stockData',
      populate: { path: 'stock' }
    }
  ).exec((err, reportValues) => {

    if (err) { return handleResponse(err, reportValues, req, res); }
    
    const reportData = []
    for (const alg of reportValues) {
      const row = {
        symbol: alg.stockData.stock.symbol,
        company: alg.stockData.stock.name,
        value: alg.value.toString(),
        netIncome: alg.stockData.netIncome,
        assets: alg.stockData.assets,
        liabilities: alg.stockData.liabilities,
        shares: alg.stockData.shares,
        price: alg.stockData.price,
      }
      reportData.push(row)
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="plutus-report-${Date.now()}.csv"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');
    stringify(reportData, { header: true })
      .pipe(res);
  });
}