import express from 'express';
import * as algorithmController from '../controllers/controller.algorithm';
import * as algorithmValueController from '../controllers/controller.algorithmValue';
import * as reportController from '../controllers/controller.report';

const router = express.Router();

router.get('/', algorithmController.getAllAlgorithms);

router.get('/:id', algorithmController.getAlgorithm);
router.put('/:id', algorithmController.updateAlgorithm);
router.delete('/:id', algorithmController.deleteAlgorithm);

router.get('/:id/algorithm-values', algorithmValueController.getAlgorithmValues);
router.get('/:id/algorithm-values/:symbol', algorithmValueController.getAlgorithmValuesBySymbol);
router.post('/:id/algorithm-values', algorithmValueController.createAlgorithmValue);

router.get('/:id/report', reportController.getReport);

export default router;