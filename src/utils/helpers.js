export const internalError = (error, res) => {
    if (error.message) {
        return res.status(500).send({ message: error.message });
    }
    return res.status(500).send({ message: error });
}

export const documentFound = (doc, req, res) => {
    if (req.method === 'POST') {
        return res.status(201).send(doc);
    }
    if (req.method === 'DELETE') {
        return res.status(204).send();
    }
    return res.status(200).send(doc);
}

export const handleResponse = (err, doc, req, res) => {
    if (err) {
        return internalError(err, res);
    }
    if (doc) {
        return documentFound(doc, req, res);
    }
    return res.status(404).send({ message: `${req.params.id} not found` });
}

export const decimal2JSON = (v, i, prev) => {
    if (v !== null && typeof v === 'object') {
        if (v.constructor.name === 'Decimal128')
            prev[i] = v.toString();
        else
            Object.entries(v).forEach(([key, value]) => decimal2JSON(value, key, prev ? prev[i] : v));
    }
};