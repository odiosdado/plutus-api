import moment from 'moment';
import AlgorithmValue from '../models/model.algorithmValue';
import { handleResponse } from '../utils/helpers';

export const getReport = async (req, res) => {

  const { query } = req;
  const { date } = query;
  const { type } = query;
  console.log( { query });
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
      path: 'stockData',
      populate: { path: 'stock' }
    }
  ).exec((err, algorithmValue) => {

    for (const alg of algorithmValue) {
      
    }

    // res.setHeader('Content-Type', 'text/csv');
    // res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
    // res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Pragma', 'no-cache');

    return handleResponse(err, algorithmValue, req, res);
  });
}