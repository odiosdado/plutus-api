import mongoose from 'mongoose';
import logger from '../logger';
import Stock from '../models/model.stock';
import { decimal2JSON } from '../utils/helpers';

const { Schema } = mongoose;

const StockDataSchema = new Schema({
    netIncome: {
        type: Schema.Types.Decimal128
    },
    assets: {
        type: Schema.Types.Decimal128
    },
    liabilities: {
        type: Schema.Types.Decimal128        
    },
    shares: {
        type: Schema.Types.Decimal128
    },
    price: {
        type: Schema.Types.Decimal128
    },
    stock: {
        type: Schema.Types.ObjectId, ref: 'Stock' 
    },
}, { timestamps: true});

StockDataSchema.set('toJSON', {getters: true, virtuals: true});

StockDataSchema.options.toJSON = {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        decimal2JSON(ret);
        return ret;
    }
};

StockDataSchema.statics.createStockData = function (stockId, body, callback) {
    const that = this;
    let stockData = new that({
        ... body,
        stock: stockId
    });
    stockData.save((error, stockData) => {
        if (error) {
            logger.log('error', `Error saving new stock data error: ${error}`);
            return callback(error);
        }
        if (stockData) {
            stockData.populate('stock', (err) => {
                if (err) {
                    logger.log('error', `Error saving new stock data error: ${error}`);
                    return callback(err);
                }
                Stock.findOneAndUpdate({ _id: stockId }, { latestStockData: stockData.id }, { upsert: true }, async (err, stock) => {
                    console.log({ err, stock })
                    return callback(null, stockData);
                })
            });
        }
    });
};

export default mongoose.model('StockData', StockDataSchema);