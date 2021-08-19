
const pool = require('./pool');
const Logger = require('../core/logger');
const logger = new Logger();
const Apiary = require('../core/apiary');
const apiary = new Apiary();

function ApiaryActions(){};

ApiaryActions.prototype = {
	// Add Actions -----------------------------------------------------------------------
	addInspection: async function(dataDict, createdBy, callback){
        let sqlAddInspection = `INSERT INTO INSPECTION(FamilyID, DateTime, State, Size, 
				Comment, CreatedBy, LastUpdatedBy, Active)
            VALUE(?, ?, ?, ?, ?, ?, ?, 1)`;
        
        let comment = null;
        if(dataDict.comment && dataDict.comment != undefined && dataDict.comment.length > 0)
            comment = dataDict.comment;
            
        try{
            let hiveFound = await apiary.findActiveHive1(dataDict.hiveID);
            if(!hiveFound)
                throw 'HIVE_NOT_FOUND';
			let familyFound = await apiary.findActiveFamily(dataDict.hiveID);
			if(!familyFound)
				throw 'FAMILY_NOT_FOUND';

           	let resultInspection = await pool.query(sqlAddInspection, 
                [familyFound.ID, dataDict.creationDate, dataDict.state, 
                    dataDict.size, dataDict.comment, createdBy, createdBy]);
			
			console.log(resultInspection);

            if(!resultInspection || resultInspection.affectedRows == 0)
                throw 'FAILED_TO_ADD_INSPECTION';

            if(resultInspection.affectedRows === 1) {
                callback('SUCCESS');
            }else
                callback(null);
            
        } catch (err) {
            callback(err);
        }
    },

	addFeeding: async function(dataDict, createdBy, callback){
		let sqlAddFeeding = `INSERT INTO FEEDING(DateTime, FoodType, Comment, 
				CreatedBy, LastUpdatedBy, Active)
			VALUE(?, ?, ?, ?, ?, 1)`;
		let sqlAddFamAct = `INSERT INTO FAMILY_ACTION(FamilyID, ActionType, ReferenceID, 
				CreatedBy, LastUpdatedBy, Active)
			VALUE(?, 'FEEDING', ?, ?, ?, 1)`;
		
		let comment = null;
		if(dataDict.comment && dataDict.comment != undefined && dataDict.comment.length > 0)
			comment = dataDict.comment;
			
		try{
			let resultFeeding = await pool.query(sqlAddFeeding, [dataDict.creationDate, 
				dataDict.foodType, dataDict.comment, createdBy, createdBy]);
			
			let famActList = [];
			for(let fID in dataDict['familyID[]']){
				famActList.push(pool.query(sqlAddFamAct, [dataDict['familyID[]'][fID], 
					resultFeeding.insertId, createdBy, createdBy]));
			}
			let result = await Promise.all(famActList);

			if(!result || result.length === 0 || result[0].affectedRows === 0)
				throw 'FAILED_TO_ADD_FEEDING';

			if(result[0]) {
				callback('SUCCESS');
			}else
				callback(null);
			
		} catch (err) {
			callback(err);
		}
	},

	addTreatment: async function(dataDict, createdBy, callback){
		let sqlAddTreatment = `INSERT INTO TREATMENT(DateTime, Disease, Medicine, Comment, 
				CreatedBy, LastUpdatedBy, Active)
			VALUE(?, ?, ?, ?, ?, ?, 1)`;
		let sqlAddFamAct = `INSERT INTO FAMILY_ACTION(FamilyID, ActionType, ReferenceID, 
				CreatedBy, LastUpdatedBy, Active)
			VALUE(?, 'TREATMENT', ?, ?, ?, 1)`;
		
		let comment = null;
		if(dataDict.comment && dataDict.comment != undefined && dataDict.comment.length > 0)
			comment = dataDict.comment;
			
		try{
			let resultTreatment = await pool.query(sqlAddTreatment, [dataDict.creationDate, 
				dataDict.disease, dataDict.medicine, dataDict.comment, createdBy, createdBy]);
			
			let famActList = [];
			for(let fID in dataDict['familyID[]']){
				famActList.push(pool.query(sqlAddFamAct, [dataDict['familyID[]'][fID], 
					resultTreatment.insertId, createdBy, createdBy]));
			}
			let result = await Promise.all(famActList);

			if(!result || result.length === 0 || result[0].affectedRows === 0)
				throw 'FAILED_TO_ADD_TREATMENT';

			if(result[0]) {
				callback('SUCCESS');
			}else
				callback(null);
			
		} catch (err) {
			callback(err);
		}
	},

	addHoneyHarvesting: async function(dataDict, createdBy, callback){
		let sqlAddHarvesting = `INSERT INTO HONEY_HARVESTING(DateTime, HoneyType, 
				AmountLiter, Comment, CreatedBy, LastUpdatedBy, Active)
			VALUE(?, ?, ?, ?, ?, ?, 1)`;
		let sqlAddFamAct = `INSERT INTO FAMILY_ACTION(FamilyID, ActionType, ReferenceID, 
				CreatedBy, LastUpdatedBy, Active)
			VALUE(?, 'HONEY_HARVESTING', ?, ?, ?, 1)`;
		
		let comment = null;
		if(dataDict.comment && dataDict.comment != undefined && dataDict.comment.length > 0)
			comment = dataDict.comment;
			
		try{
			let resultHarvesting = await pool.query(sqlAddHarvesting, [dataDict.creationDate, 
				dataDict.honeyType, dataDict.amountLiter, dataDict.comment, createdBy, createdBy]);
			
			let famActList = [];
			for(let fID in dataDict['familyID[]']){
				famActList.push(pool.query(sqlAddFamAct, [dataDict['familyID[]'][fID], 
					resultHarvesting.insertId, createdBy, createdBy]));
			}
			let result = await Promise.all(famActList);

			if(!result || result.length === 0 || result[0].affectedRows === 0)
				throw 'FAILED_TO_ADD_HARVESTING';

			if(result[0]) {
				callback('SUCCESS');
			}else
				callback(null);
			
		} catch (err) {
			callback(err);
		}
	}
}

module.exports = ApiaryActions;
