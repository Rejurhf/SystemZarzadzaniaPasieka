
const express = require('express');
const User = require('../core/user');
const user = new User();
const Apiary = require('../core/apiary');
const apiary = new Apiary();
const ApiaryActions = require('../core/apiaryActions');
const apiaryActions = new ApiaryActions();
const Logger = require('../core/logger');
const logger = new Logger();
const router = express.Router();


// Login posts ---------------------------------------------------------------------------
// Post login data
router.post('/login', (req, res, next) => {
	user.login(req.body.username, req.body.password, function(result){
		if(result){
			req.session.user = result;
			req.session.opp = 1;

			res.redirect('/home');
		}else{
			res.send('Username/Password uncorrect!');
		}
	})
});

// Post registe data
router.post('/register', (req, res, next) => {
	// let userInput = {
	//     firstName: 'Rejurhf',
	//     lastName: 'Rejurhf',
	//     userNo: 'Rejurhf',
	//     password: 'ac4dc',
	//     active: 1,
	//     createdBy: 'Rejurhf',
	//     lastUpdatedBy: 'Rejurhf'
	// };
	
	user.create(userInput, function(lastID){
		if(lastID){
			user.find(lastID, function(result){
				req.session.user = result;
				req.session.opp = 0;
				
				res.redirect('/home');
			})
		}else{
			logger.consoleLog(new Date(), ['POST /register:', 'Error creating a new user...']);
		}
	})
});

// Add -----------------------------------------------------------------------------------
// Add Apiaary
router.post('/apiary', (req, res) => {
	let sUser = req.session.user;
	logger.consoleLog(new Date(), ['POST /apiary:', req.body]);

	if(sUser == null || sUser == undefined){
		logger.consoleLog(new Date(), ['POST /apiary:', 'User not authorized']);
		res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
	}else{
		apiary.createApiary(req.body.apiaryName, req.body.creationDate, sUser.UserNo, 
				sUser.ID, function(result){
			logger.consoleLog(new Date(), ['POST /apiary:', result]);
			if(result === 'SUCCESS'){
				res.status(201).send({
					isError: false, severity: 'Success', 
					message: `Pasieka "${req.body.apiaryName}" dodana.`});
			}else if(result){
				res.status(200).send({
					isError: true, severity: 'Error', 
					message: 'Pasieka o tej nazwie już istnieje.'});
			}else{
				res.status(200).send({
					isError: true, severity: 'Error', 
						message: 'Nie można dodać pasieki.'});
			}
		})
	}
});

// Add Group
router.post('/group', (req, res) => {
	let sUser = req.session.user;
	logger.consoleLog(new Date(), ['POST /group', req.body]);

	if(sUser == null || sUser == undefined){
		logger.consoleLog(new Date(), ['POST /group', 'User not authorized']);
		res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
	}else{
		apiary.createGroup(req.body.apiaryID, req.body.groupName, req.body.creationDate, 
				sUser.UserNo, function(result){
			logger.consoleLog(new Date(), ['POST /group', result]);
			if(result === 'SUCCESS'){
				res.status(201).send({
					isError: false, severity: 'Success', 
					message: `Grupa "${req.body.groupName}" dodana do pasieki.`});
			}else if(result){
				let message = 'Coś poszło nie tak.';

				if(result === 'APIARY_NOT_FOUND')
					message = 'Nie ma pasieki o tej nazwie.'
				else if(result === 'GROUP_ALREADY_EXISTS')
					message = 'Grupa o tej nazwie istnieje już w tej pasiece.'

				res.status(200).send({
					isError: true, severity: 'Error', 
					message: message});
			}else{
				res.status(200).send({
					isError: true, severity: 'Error', message: 'Nie można dodać grupy.'});
			}
		})
	}
});

// Add Hive
router.post('/hive', (req, res) => {
	let sUser = req.session.user;
	logger.consoleLog(new Date(), ['POST /hive', req.body]);

	if(sUser == null || sUser == undefined){
		logger.consoleLog(new Date(), ['POST /hive', 'User not authorized']);
		res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
	}else{
		apiary.createHive(req.body.apiaryID, req.body.groupID, req.body.hiveNum, 
				req.body.creationDate, sUser.UserNo, function(result){
			logger.consoleLog(new Date(), ['POST /hive', result]);
			if(result === 'SUCCESS'){
				res.status(201).send({
					isError: false, severity: 'Success', 
					message: `Ul "${req.body.hiveNum}" został dodany do pasieki.`});
			}else if(result){
				let message = 'Coś poszło nie tak.';

				if(result === 'APIARY_NOT_FOUND')
					message = 'Nie ma pasieki o tej nazwie.';
				else if(result === 'GROUP_NOT_FOUND')
					message = 'Nie ma grupy o tej nazwie.';
				else if(result === 'HIVE_ALREADY_EXISTS')
					message = 'Ul o tym numerze już istnieje.';

				res.status(200).send({
					isError: true, severity: 'Error', 
					message: message});
			}else{
				res.status(200).send({
					isError: true, severity: 'Error', message: 'Nie można dodać ula.'});
			}
		})
	}
});

// Add Family
router.post('/family', (req, res) => {
	let sUser = req.session.user;
	logger.consoleLog(new Date(), ['POST /family', req.body]);

	if(sUser == null || sUser == undefined){
		logger.consoleLog(new Date(), ['POST /family', 'User not authorized']);
		res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
	}else{
		apiary.createFamily(req.body, sUser.UserNo, 
				function(result){
			logger.consoleLog(new Date(), ['POST /family', result]);
			if(result === 'SUCCESS'){
				res.status(201).send({
					isError: false, severity: 'Success', 
					message: `Rodzina została dodana.`});
			}else if(result){
				let message = 'Coś poszło nie tak.';

				if(result === 'HIVE_NOT_FOUND')
					message = 'Nie ma takiego Ula.';

				res.status(200).send({
					isError: true, severity: 'Error', 
					message: message});
			}else{
				res.status(200).send({
					isError: true, severity: 'Error', message: 'Nie można dodać rodziny.'});
			}
		})
	}
});

// Actions -------------------------------------------------------------------------------
// Add Inspection
router.post('/inspection', (req, res) => {
	let sUser = req.session.user;
	logger.consoleLog(new Date(), ['POST /inspection:', req.body]);

	if(sUser == null || sUser == undefined){
		logger.consoleLog(new Date(), ['POST /inspection:', 'User not authorized']);
		res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
	}else{
		apiaryActions.addInspection(req.body, sUser.UserNo, 
				function(result){
			logger.consoleLog(new Date(), ['POST /inspection', result]);
			if(result === 'SUCCESS'){
				res.status(201).send({
					isError: false, severity: 'Success', 
					message: `Przegląd został dodany`});
			}else if(result){
				let message = 'Coś poszło nie tak.';

				if(result === 'HIVE_NOT_FOUND')
					message = 'Nie ma takiego Ula.';
				if(result === 'Family_NOT_FOUND')
					message = 'Nie ma takiej Rodziny.';

				res.status(200).send({
					isError: true, severity: 'Error', 
					message: message});
			}else{
				res.status(200).send({
					isError: true, severity: 'Error', message: 'Nie można dodać przeglądu.'});
			}
		})
	}
});

// Add Feeding
router.post('/feeding', (req, res) => {
	let sUser = req.session.user;
	if(!Array.isArray(req.body['familyID[]']))
        req.body['familyID[]'] = [req.body['familyID[]']];
	logger.consoleLog(new Date(), ['POST /feeding:', req.body]);

	if(sUser == null || sUser == undefined){
		logger.consoleLog(new Date(), ['POST /feeding:', 'User not authorized']);
		res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
	}else{
		apiaryActions.addFeeding(req.body, sUser.UserNo, function(result){
			logger.consoleLog(new Date(), ['POST /feeding', result]);
			if(result === 'SUCCESS'){
				res.status(201).send({
					isError: false, severity: 'Success', 
					message: `Podkarmianie zostało dodane`});
			}else if(result){
				let message = 'Coś poszło nie tak.';

				if(result === 'FAILED_TO_ADD_FEEDING')
					message = 'Nie udao się dodać podkarmiania';

				res.status(200).send({
					isError: true, severity: 'Error', 
					message: message});
			}else{
				res.status(200).send({
					isError: true, severity: 'Error', message: 'Nie można dodać podkarmiania.'});
			}
		})
	}
});

// Add Treatment
router.post('/treatment', (req, res) => {
	let sUser = req.session.user;
	if(!Array.isArray(req.body['familyID[]']))
        req.body['familyID[]'] = [req.body['familyID[]']];
	logger.consoleLog(new Date(), ['POST /treatment:', req.body]);

	if(sUser == null || sUser == undefined){
		logger.consoleLog(new Date(), ['POST /treatment:', 'User not authorized']);
		res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
	}else{
		apiaryActions.addTreatment(req.body, sUser.UserNo, function(result){
			logger.consoleLog(new Date(), ['POST /treatment', result]);
			if(result === 'SUCCESS'){
				res.status(201).send({
					isError: false, severity: 'Success', 
					message: `Leczenie zostało dodane`});
			}else if(result){
				let message = 'Coś poszło nie tak.';

				if(result === 'FAILED_TO_ADD_TREATMENT')
					message = 'Nie udao się dodać leczenia';

				res.status(200).send({
					isError: true, severity: 'Error', 
					message: message});
			}else{
				res.status(200).send({
					isError: true, severity: 'Error', message: 'Nie można dodać leczenia.'});
			}
		})
	}
});

// Add Honey Harvesting
router.post('/harvesting', (req, res) => {
	let sUser = req.session.user;
	if(!Array.isArray(req.body['familyID[]']))
        req.body['familyID[]'] = [req.body['familyID[]']];
	logger.consoleLog(new Date(), ['POST /harvesting:', req.body]);

	if(sUser == null || sUser == undefined){
		logger.consoleLog(new Date(), ['POST /harvesting:', 'User not authorized']);
		res.status(401).send('Nie znaleziono użytkownika spróbuj przeładować stronę.');
	}else{
		apiaryActions.addHoneyHarvesting(req.body, sUser.UserNo, function(result){
			logger.consoleLog(new Date(), ['POST /harvesting', result]);
			if(result === 'SUCCESS'){
				res.status(201).send({
					isError: false, severity: 'Success', 
					message: `Wybieranie miodu zostało dodane`});
			}else if(result){
				let message = 'Coś poszło nie tak.';

				if(result === 'FAILED_TO_ADD_HARVESTING')
					message = 'Nie udao się dodać wybierania miodu';

				res.status(200).send({
					isError: true, severity: 'Error', 
					message: message});
			}else{
				res.status(200).send({
					isError: true, severity: 'Error', message: 'Nie można dodać wybierania miodu.'});
			}
		})
	}
});
 
module.exports = router;
