const ressourceModel = require('../models/ressourceSchema');


module.exports.createRessource = async (req, res) => {
    try {
      const ressource = await ressourceModel.create(req.body);
      res.status(201).json(ressource);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  module.exports.getRessourcesByCourse = async (req, res) => {
    try {
      const ressources = await ressourceModel.find({ formations: req.params.formationsId });
      res.json(ressources);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };