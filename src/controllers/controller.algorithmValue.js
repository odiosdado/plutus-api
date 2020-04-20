import moment from 'moment';
import AlgorithmValue from '../models/model.algorithmValue';
import { handleResponse, isEmpty } from '../utils/helpers';

export const getAlgorithmValues = async (req, res) => {

  const { query } = req;
  console.log({ query })

  if (isEmpty(query)) {
    AlgorithmValue.find({ algorithm: req.params.id }, (err, algorithmValues) => {
      return handleResponse(err, algorithmValues, req, res);
    });
    return;
  }

  const { date } = query;
  const { top } = query;

  if( !date || !top) {
    return res.status(400).send({ message: `Missing required query parameters 'date=YYYY-MM-DD' and 'top=5,10,etc'` });
  }

  const startDate = moment(date);
  const endDate = moment(date).add(1, 'day');

  AlgorithmValue.find({
    algorithm: req.params.id,
    value: { $ne: null },
    createdAt: {
      "$gte": startDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      "$lt": endDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    }
  })
  .sort({
    value: -1
  })
  .limit(parseInt(top))
  .populate(
    {
      path: 'stockData',
      populate: { path: 'stock' }
    }
  ).exec((err, algorithmValue) => {
    return handleResponse(err, algorithmValue, req, res);
  });
}

export const getAllAlgorithmValues = async (req, res) => {

  AlgorithmValue.find({}, (err, algorithmValues) => {
    return handleResponse(err, algorithmValues, req, res);
  });
}

export const deleteAlgorithmValue = async (req, res) => {

  AlgorithmValue.findByIdAndRemove(req.params.id, (err, algorithmValue) => {
    return handleResponse(err, algorithmValue, req, res);
  });
}

export const createAlgorithmValue = async (req, res) => {

  const algorithmId = req.params.id;
  const { body } = req;

  AlgorithmValue.createAlgorithmValue(algorithmId, body, (err, algorithmValue) => {
    return handleResponse(err, algorithmValue, req, res);
  });
}