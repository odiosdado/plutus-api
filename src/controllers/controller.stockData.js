import moment from 'moment';
import StockData from '../models/model.stockData';
import Stock from '../models/model.stock';
import { handleResponse } from '../utils/helpers';

export const getAllStockData = async (req, res) => {
  const { query } = req;
  const { date } = query;
  console.log({ query });
  let conditions = {};
  if (date) {
    const startDate = moment(date);
    const endDate = moment(date).add(1, 'day');
    conditions = {
      createdAt: {
        "$gte": startDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        "$lt": endDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
      }
    }
  } 
  StockData.find(conditions)
  .populate({
    path: 'stock'
  }).exec((err, stocks) => {
    return handleResponse(err, stocks, req, res);
  });
}

export const getStockData = async (req, res) => {

  StockData.findById(req.params.id, (err, stockData) => {
    return handleResponse(err, stockData, req, res);
  });
}

export const updateStockData = async (req, res) => {

  StockData.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, stockData) => {
    return handleResponse(err, stockData, req, res);
  });
}

export const deleteStockData = async (req, res) => {

  StockData.findByIdAndRemove(req.params.id, (err, stockData) => {
    return handleResponse(err, stockData, req, res);
  });
}

export const createStockData = async (req, res) => {

  const { body } = req;

  StockData.createStockData(req.params.id, body, (err, stockData) => {
    return handleResponse(err, stockData, req, res);
  });
}
