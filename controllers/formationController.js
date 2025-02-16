const formationModel = require('../models/formationSchema');
 
module.exports.getAllFormation = async (req,res) => {
try {
    //personalisation d'erreur
    const formationList = await formationModel.find();
    if (!formationList || formationList.length ===0){
        throw new Error("Aucun formation trouvé");
    }

    res.status(200).json(formationList)
} catch (error) {
    res.status(500).json({message : error.message});
}
}

module.exports.getFormationById = async (req,res) => {
    try {

        const id = req.params.id
        const formation = await formationModel.findById(id);
        //personalisation d'erreur
        if (!formation || formation.length ===0){
            throw new Error("Formation introuvable");
        }
    
        res.status(200).json(formation);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
    }

    module.exports.deleteFormationById = async (req,res) => {
        try {
    
            const id = req.params.id

            const formationById = await formationModel.findByIdAndDelete(id);
            
            //personalisation d'erreur
            if (!formationById || formationById.length ===0){
                throw new Error("Formation introuvable");
            }
            await formationModel.findByIdAndDelete(id);
        
            res.status(200).json("deleted");
        } catch (error) {
            res.status(500).json({message : error.message});
        }
        }

        module.exports.addFormation = async (req,res) => {
            try {
        
                const {titre , description , formateur , date , niveau} = req.body;
    
                
                
                //personalisation d'erreur
                
                const formation = await formationModel.create({
                    titre,description,formateur,date,niveau})
                
            
                res.status(200).json({formation});
            } catch (error) {
                res.status(500).json({message : error.message});
            }
            }

            module.exports.updateFormation = async (req,res) => {
                try {
                    const id = req.params.id;
                    const {titre , description , formateur , date , niveau} = req.body;
        
                    
                    const formationById = await formationModel.findById(id);
        //personalisation d'erreur
                    if (!formationById ){
                       throw new Error("Formation introuvable");
                       }
                    
                    
                    
                     const updated = await formationModel.findByIdAndUpdate(id,{
                        $set:{titre,description,formateur,date,niveau},
                })
                    
                
                    res.status(200).json({updated});
                } catch (error) {
                    res.status(500).json({message : error.message});
                }
                }