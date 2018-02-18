const uuidv4 = require('uuid/v4')
const bcrypt = require('bcryptjs')
const config = require('../../../config/index')

module.exports = class Account {
  constructor (rep) {
    this.accountRep = rep
  }

  async insertUser (data) {
    let isEmail = await this.accountRep.userByEmail(data.email)
    let isUsername = await this.accountRep.userByName(data.username)
    if (!isEmail && !isUsername) {
      let salt = await bcrypt.genSalt(10)
      let hash = await bcrypt.hash(data.password, salt)

      let newUser = {
        username: data.username,
        firstname: data.firstname || null,
        lastname: data.lastname || null,
        email: data.email,
        hash: hash
      }

      let result = await this.accountRep.insertUser(newUser)
      // let to = data.email;
      // let subject = 'Login';
      // let htmlBody = require('./email-templates/email-with-password.html')
      // 	.replace('${username}', data.username)
      // 	.replace('${password}', data.password)
      // 	.replace('${host}', config.get('host'));

      // this.email.email(to, subject, htmlBody);

      let info = {
        success: true,
        id: result.id,
        isActivated: result.is_activated,
        msg: 'user has been saved'
      }
      return info
    } else if (isUsername) {
      let info = {
        success: false,
        msg: 'username exists'
      }
      return info
    } else if (isEmail) {
      let info = {
        success: false,
        msg: 'email exists'
      }
      return info
    }
  }

  // async checkIfNewDataIsCorrect(rep, req, user) {
  // 	let info = {
  // 		msg: "",
  // 		success: false
  // 	};

  // 	//username
  // 	if (user.username !== req.username) {
  // 		let isUsernameExists = await rep.userByName(req.username);
  // 		if (isUsernameExists) {
  // 			info.msg += 'username already exists\n';
  // 			return info;
  // 		}
  // 	}

  // 	//email
  // 	if (user.email !== req.email) {
  // 		let isEmailExists = await rep.userByEmail(req.email);
  // 		if (isEmailExists) {
  // 			info.msg += 'email already exists\n';
  // 			return info;
  // 		}
  // 	}

  // 	//password
  // 	if (req.oldPassword && req.newPassword) {
  // 		let isPasswordCorrect = await bcrypt.compare(req.oldPassword, user.hash);
  // 		if (!isPasswordCorrect) {
  // 			info.msg += 'incorrect current password\n';
  // 			return info;
  // 		}
  // 	}

  // 	info.success = true;
  // 	return info;
  // }

  // async editProfile(req, id) {
  // 	let info;
  // 	let user = await this.accountRep.userById(id);
  // 	if (user) {
  // 		info = await this.checkIfNewDataIsCorrect(this.accountRep, req, user);
  // 		if (!info.success) return info;

  // 		//if all data is correct, save changes
  // 		//username
  // 		if (user.username !== req.username) {
  // 			await this.accountRep.updateUsername(req.username, id);
  // 			info.msg += 'username has been changed\n';
  // 		}

  // 		if (user.first_name !== req.firstname || user.last_name !== req.lastname) {
  // 			if (user.firstname !== req.firstname) {
  // 				await this.accountRep.updateFirstname(req.firstname, id);
  // 			}

  // 			if (user.lastname !== req.lastname) {
  // 				await this.accountRep.updateLastname(req.lastname, id);
  // 			}
  // 			info.msg += 'your name has been changed\n';
  // 		}

  // 		//email
  // 		if (user.email !== req.email) {
  // 			if (user.is_admin) {
  // 				await this.accountRep.updateAdminEmail(req.email, id);
  // 				info.msg += 'email has been changed';
  // 			}
  // 			else {
  // 				let emailId = uuidv4();
  // 				await this.accountRep.updateEmail(req.email, id, emailId);
  // 				let to = req.email;
  // 				let subject = 'Please, confirm your new email ';
  // 				let htmlBody = require('./email-templates/confirm-your-new-email.html')
  // 					.replace('${emailId}', emailId)
  // 					.replace('${host}', config.get('host'));

  // 				this.email.email(to, subject, htmlBody);

  // 				info.msg += 'email has been changed, please, confirm your new email it\n';
  // 			}
  // 		}

  // 		//password
  // 		if (req.oldPassword && req.newPassword) {
  // 			let salt = await bcrypt.genSalt(10);
  // 			let hash = await bcrypt.hash(req.newPassword, salt);

  // 			await this.accountRep.updatePassword(hash, id);

  // 			info.msg += 'password has been changed\n';
  // 		}
  // 		return info;
  // 	}
  // }

  // async insertUserByAdmin(req) {
  // 	let isEmail = await this.accountRep.userByEmail(req.email);
  // 	let isUsername = await this.accountRep.userByName(req.username);
  // 	if (!isEmail && !isUsername) {
  // 		let salt = await bcrypt.genSalt(10);
  // 		let hash = await bcrypt.hash(req.password, salt);

  // 		let newUser = {
  // 			username: req.username,
  // 			firstname: req.firstname || null,
  // 			lastname: req.lastname || null,
  // 			email: req.email,
  // 			hash: hash
  // 		};

  // 		let result = await this.accountRep.insertUserByAdmin(newUser);
  // 		let to = req.email;
  // 		let subject = 'Login';
  // 		let htmlBody = require('./email-templates/email-with-password.html')
  // 			.replace('${username}', req.username)
  // 			.replace('${password}', req.password)
  // 			.replace('${host}', config.get('host'));

  // 		this.email.email(to, subject, htmlBody);

  // 		let info = {
  // 			success: true,
  // 			id: result.id,
  // 			isActivated: result.is_activated,
  // 			msg: 'user has been saved'
  // 		};
  // 		return info;
  // 	}

  // 	else if (isUsername) {
  // 		let info = {
  // 			success: false,
  // 			msg: 'username exists'
  // 		};
  // 		return info;
  // 	}
  // 	else if (isEmail) {
  // 		let info = {
  // 			success: false,
  // 			msg: 'email exists'
  // 		};
  // 		return info;
  // 	}
  // }

  // async updateUserByAdmin(req) {
  // 	let user = await this.accountRep.userById(req.id);
  // 	if (user) {
  // 		let info = await this.checkIfNewDataIsCorrect(this.accountRep, req, user);
  // 		if (!info.success) {
  // 			return info;
  // 		}

  // 		await this.accountRep.updateUserByAdmin(req);
  // 		info.msg += 'changes has been saved';
  // 		return info;
  // 	}
  // }

  // async deleteUserByAdmin(req) {
  // 	let user = await this.accountRep.userById(req.id);
  // 	if (user) {
  // 		if (await this.accountRep.isUserInvited(req.id)) {
  // 			await this.accountRep.deleteUserByAdmin(req.id);
  // 		}

  // 		if (await this.accountRep.isUserWithProvider(req.id)) {
  // 			await this.accountRep.deleteUserByAdminWithProvider(req.id);
  // 		}

  // 		if (await this.accountRep.userById(req.id)) {
  // 			await this.accountRep.deleteUserById(req.id);
  // 		}

  // 		let info = {
  // 			success: true,
  // 			msg: `user has been deleted`
  // 		};
  // 		return info;

  // 	}
  // 	else {
  // 		let info = {
  // 			success: false,
  // 			msg: `error... user hasn't been deleted`
  // 		};
  // 		return info;
  // 	}
  // }

  // async inviteUser(req, id) {
  // 	let user = await this.accountRep.userByEmail(req.email);
  // 	if (!user) {
  // 		let emailId = uuidv4();
  // 		let invite = {
  // 			emailId: emailId,
  // 			userFrom: id,
  // 			expired: new Date(),
  // 			email: req.email
  // 		};
  // 		await this.accountRep.insertInvite(invite);
  // 		let to = req.email;
  // 		let subject = 'Invite';
  // 		let htmlBody = require('./email-templates/invite.html')
  // 			.replace('${emailId}', emailId)
  // 			.replace('${host}', config.get('host'));
  // 		this.email.email(to, subject, htmlBody);

  // 		let info = {
  // 			msg: 'the invitation has been sent',
  // 			success: true
  // 		};
  // 		return info;
  // 	}
  // 	else {
  // 		let info = {
  // 			msg: `the invitation hasn't been sent, because user with ${req.email} email exists`,
  // 			success: false
  // 		};
  // 		return info;
  // 	}
  // }

  // async getInvitedEmail(req) {
  // 	return await this.accountRep.isInvited(req.emailId);
  // }

  // async signup(req) {
  // 	if (!req.emailId) {
  // 		let info = {
  // 			success: false,
  // 			msg: `you don't have access`
  // 		};
  // 		return info;
  // 	}
  // 	else {
  // 		let isInvited = await this.accountRep.isInvited(req.emailId);
  // 		let isEmailChanged = req.email !== isInvited.email;

  // 		if (isInvited) {
  // 			let user = await this.accountRep.isUser(req.username, req.email);
  // 			if (!user) {
  // 				let emailId = uuidv4();
  // 				let isActivated = true;
  // 				let date = new Date();

  // 				if (isEmailChanged) {

  // 					let to = req.email;
  // 					let subject = 'Please, confirm your email ';
  // 					let htmlBody = require('./email-templates/confirm-your-email.html')
  // 						.replace('${emailId}', emailId)
  // 						.replace('${host}', config.get('host'));

  // 					this.email.email(to, subject, htmlBody);
  // 					isActivated = false;
  // 					date = null;
  // 				}

  // 				let salt = await bcrypt.genSalt(10);
  // 				let hash = await bcrypt.hash(req.password, salt);

  // 				let user = {
  // 					username: req.username,
  // 					firstname: req.firstname,
  // 					lastname: req.lastname,
  // 					email: req.email,
  // 					hash: hash,
  // 					isActivated: isActivated
  // 				};

  // 				let key = {
  // 					emailId: emailId,
  // 					date: date
  // 				};
  // 				let inviteKey = {
  // 					emailId: req.emailId
  // 				};

  // 				this.accountRep.insertUserWithKey(user, key, inviteKey);

  // 				let info = {
  // 					success: true,
  // 					msg: isEmailChanged ? 'you are now registered, please, confirm your email' : 'you are now registered'
  // 				};
  // 				return info;
  // 			}
  // 			else if (user.username.toUpperCase() === req.username.toUpperCase()) {
  // 				let info = {
  // 					success: false,
  // 					msg: 'the username already exists'
  // 				};
  // 				return info;
  // 			}
  // 			else if (user.email === req.email) {
  // 				let info = {
  // 					success: false,
  // 					msg: 'the email already exists'
  // 				};
  // 				return info;
  // 			}
  // 		}
  // 		else {
  // 			let info = {
  // 				success: false,
  // 				msg: 'your invite key is wrong'
  // 			};
  // 			return info;
  // 		}
  // 	}
  // }

  // async activateEmail(emailId, req) {
  // 	let user = await this.accountRep.userByEmailId(emailId);
  // 	if (user) {
  // 		let data = new Date();
  // 		await this.accountRep.activateEmail(user.user_id, data);
  // 		user = await this.accountRep.userById(user.user_id);
  // 		req.login(user, (err) => {
  // 			if (err) console.error(err);
  // 		});
  // 		let info = {
  // 			msg: 'the email has been confirmed'
  // 		};
  // 		return info;
  // 	} else {
  // 		let info = {
  // 			msg: 'the link is incorrect'
  // 		};
  // 		return info;
  // 	}
  // }

  // async getFilterTags() {
  // 	let allUsers = await this.accountRep.getAllUsers();
  // 	let allSearchTags = await this.accountRep.getAllSearchTags();
  // 	let allCountries = await this.accountRep.getAllCountries();
  // 	let allTags = await this.accountRep.getAllTags();

  // 	let search_tags = [];
  // 	let countries = [];
  // 	let tags = [];

  // 	allSearchTags.forEach(item => {
  // 		search_tags.push(item.search_tag_name);
  // 	});
  // 	allCountries.forEach(item => {
  // 		countries.push(item.country);
  // 	});
  // 	allTags.forEach(item => {
  // 		tags.push(item.tag_name);
  // 	});

  // 	let info = {
  // 		users: allUsers,
  // 		search_tags,
  // 		countries,
  // 		tags,
  // 		msg: 'success'
  // 	};
  // 	return info;
  // }

  // async deleteFilter(req) {
  // 	let filter = await this.accountRep.filterById(req.id);
  // 	if(filter){
  // 		await this.accountRep.deleteFilter(req.id);
  // 		let info = {
  // 			success: true,
  // 			msg: 'filter has been successfully deleted'
  // 		};
  // 		return info;
  // 	}

  // 	else{
  // 		let info = {
  // 			success: false,
  // 			msg: `error... this filter doesn't exist`
  // 		};
  // 		return info;
  // 	}

  // }

  // async addFilter(req) {
  // 	let filter = await this.accountRep.filterByName(req.title);
  // 	if (!filter) {
  // 		let filter_id = await this.accountRep.addNewFilter(req.title);

  // 		let tagsList = await this.accountRep.getAllSearchTags();
  // 		let countriesList = await this.accountRep.getAllCountries();
  // 		let filterTagsList = await this.accountRep.getAllTags();

  // 		let addArrCountries = [];
  // 		let addArrIncludeTags = [];
  // 		let addArrExcludeTags = [];
  // 		let addArrTags = [];

  // 		// countries logic
  // 		req.countriesArray.forEach(item => {
  // 			if (typeof item === "object") {
  // 				this.accountRep.addNewCountry(filter_id, item.label);
  // 			}
  // 		});
  // 		countriesList.forEach(item => {
  // 			if (req.countriesArray.indexOf(item.country) >= 0) {
  // 				addArrCountries.push(item.country_id);
  // 			}
  // 		});
  // 		await this.accountRep.addCountries(filter_id, addArrCountries);

  // 		// title
  // 		await this.accountRep.changeTitle(filter_id, req.title);

  // 		// distribute logic
  // 		let distribute = req.distribute;
  // 		for (let i in distribute) {
  // 			await this.accountRep.addUsers(filter_id, distribute[i].id, distribute[i].oldId, distribute[i].priority);
  // 		}
  // 		let arr = [];
  // 		for (let i in distribute) {
  // 			arr.push(distribute[i].id);
  // 		}

  // 		// include logic
  // 		req.includeArray.forEach(item => {
  // 			if (typeof item === "object") {
  // 				this.accountRep.addNewIncludesTags(filter_id, item.label);
  // 			}
  // 		});
  // 		tagsList.forEach(item => {
  // 			if (req.includeArray.indexOf(item.search_tag_name) >= 0) {
  // 				addArrIncludeTags.push(item.search_tag_id);
  // 			}
  // 		});
  // 		await this.accountRep.addIncludeTags(filter_id, addArrIncludeTags);

  // 		//exclude logic
  // 		req.excludeArray.forEach(item => {
  // 			if (typeof item === "object") {
  // 				this.accountRep.addNewExcludesTags(filter_id, item.label);
  // 			}
  // 		});
  // 		tagsList.forEach(item => {
  // 			if (req.excludeArray.indexOf(item.search_tag_name) >= 0) {
  // 				addArrExcludeTags.push(item.search_tag_id);
  // 			}
  // 		});
  // 		await this.accountRep.addExcludeTags(filter_id, addArrExcludeTags);

  // 		// filter tags logic
  // 		req.tags.forEach(item => {
  // 			if (typeof item === "object") {
  // 				this.accountRep.addNewTags(filter_id, item.label);
  // 			}
  // 		});
  // 		filterTagsList.forEach(item => {
  // 			if (req.tags.indexOf(item.tag_name) >= 0) {
  // 				addArrTags.push(item.tag_id);
  // 			}
  // 		});
  // 		await this.accountRep.addTags(filter_id, addArrTags);

  // 		let info = {
  // 			msg: 'filter has been saved'
  // 		};
  // 		return info;
  // 	}
  // 	else {
  // 		let info = {
  // 			msg: 'error... please, choose another title of filter'
  // 		};
  // 		return info;
  // 	}
  // }

  // async updateFilter(req) {
  // 	let tagsList = await this.accountRep.getAllSearchTags();
  // 	let countriesList = await this.accountRep.getAllCountries();
  // 	let filterTagsList = await this.accountRep.getAllTags(req.id);

  // 	let removeArrCountries = [];
  // 	let addArrCountries = [];
  // 	let removeArrIncludeTags = [];
  // 	let addArrIncludeTags = [];
  // 	let removeArrExcludeTags = [];
  // 	let addArrExcludeTags = [];
  // 	let removeArrTags = [];
  // 	let addArrTags = [];

  // 	// countries logic
  // 	req.countriesArray.forEach(item => {
  // 		if (typeof item === "object") {
  // 			this.accountRep.addNewCountry(req.id, item.label);
  // 		}
  // 	});
  // 	countriesList.forEach(item => {
  // 		if (req.countriesArray.indexOf(item.country) < 0) {
  // 			removeArrCountries.push(item.country_id);
  // 		}
  // 		if (req.countriesArray.indexOf(item.country) >= 0) {
  // 			addArrCountries.push(item.country_id);
  // 		}
  // 	});
  // 	await this.accountRep.deleteCountries(req.id, removeArrCountries);
  // 	await this.accountRep.addCountries(req.id, addArrCountries);

  // 	// title
  // 	await this.accountRep.changeTitle(req.id, req.title);

  // 	// distribute logic
  // 	let distribute = req.distribute;
  // 	for (let i in distribute) {
  // 		await this.accountRep.addUsers(req.id, distribute[i].id, distribute[i].oldId, distribute[i].priority);
  // 	}
  // 	let arr = [];
  // 	for (let i in distribute) {
  // 		arr.push(distribute[i].id);
  // 	}
  // 	await this.accountRep.removeUsers(req.id, arr);

  // 	// include logic
  // 	req.includeArray.forEach(item => {
  // 		if (typeof item === "object") {
  // 			this.accountRep.addNewIncludesTags(req.id, item.label);
  // 		}
  // 	});
  // 	tagsList.forEach(item => {
  // 		if (req.includeArray.indexOf(item.search_tag_name) < 0) {
  // 			removeArrIncludeTags.push(item.search_tag_id);
  // 		}
  // 		if (req.includeArray.indexOf(item.search_tag_name) >= 0) {
  // 			addArrIncludeTags.push(item.search_tag_id);
  // 		}
  // 	});
  // 	await this.accountRep.deleteIncludeTags(req.id, removeArrIncludeTags);
  // 	await this.accountRep.addIncludeTags(req.id, addArrIncludeTags);

  // 	//exclude logic
  // 	req.excludeArray.forEach(item => {
  // 		if (typeof item === "object") {
  // 			this.accountRep.addNewExcludesTags(req.id, item.label);
  // 		}
  // 	});
  // 	tagsList.forEach(item => {
  // 		if (req.excludeArray.indexOf(item.search_tag_name) < 0) {
  // 			removeArrExcludeTags.push(item.search_tag_id);
  // 		}
  // 		if (req.excludeArray.indexOf(item.search_tag_name) >= 0) {
  // 			addArrExcludeTags.push(item.search_tag_id);
  // 		}
  // 	});
  // 	await this.accountRep.deleteExcludeTags(req.id, removeArrExcludeTags);
  // 	await this.accountRep.addExcludeTags(req.id, addArrExcludeTags);

  // 	// filter tags logic
  // 	req.tags.forEach(item => {
  // 		if (typeof item === "object") {
  // 			this.accountRep.addNewTags(req.id, item.label);
  // 		}
  // 	});
  // 	filterTagsList.forEach(item => {
  // 		if (req.tags.indexOf(item.tag_name) < 0) {
  // 			removeArrTags.push(item.tag_id);
  // 		}
  // 		if (req.tags.indexOf(item.tag_name) >= 0) {
  // 			addArrTags.push(item.tag_id);
  // 		}
  // 	});
  // 	await this.accountRep.deleteTags(req.id, removeArrTags);
  // 	await this.accountRep.addTags(req.id, addArrTags);

  // 	let info = {
  // 		msg: 'changes have been applied'
  // 	};
  // 	return info;
  // }

  // async getFilter(req) {
  // 	let filter = await this.accountRep.filterById(req.id);
  // 	if (filter) {
  // 		let allUsers = await this.accountRep.getAllUsers();
  // 		let allSearchTags = await this.accountRep.getAllSearchTags();
  // 		let allCountries = await this.accountRep.getAllCountries();
  // 		let allTags = await this.accountRep.getAllTags();

  // 		let search_tags = [];
  // 		let countries = [];
  // 		let tags = [];

  // 		allSearchTags.forEach(item => {
  // 			search_tags.push(item.search_tag_name);
  // 		});
  // 		allCountries.forEach(item => {
  // 			countries.push(item.country);
  // 		});
  // 		allTags.forEach(item => {
  // 			tags.push(item.tag_name);
  // 		});

  // 		let users = await this.accountRep.getFilterUsers(req.id);
  // 		let countriesList = await this.accountRep.getFilterCountries(req.id);
  // 		let searchTagsItems = await this.accountRep.getFilterSearchTags(req.id);
  // 		let selectedTags = await this.accountRep.getFilterTags(req.id);
  // 		let tagsList = await this.accountRep.getTags();

  // 		let include_search_tags = [];
  // 		let exclude_search_tags = [];
  // 		let exclude_countries = [];
  // 		let selected_tags = [];

  // 		searchTagsItems.map(item => {
  // 			if (item.include_tag === true) {
  // 				include_search_tags.push(item.search_tag_name);
  // 			}
  // 			if (item.exclude_tag === true) {
  // 				exclude_search_tags.push(item.search_tag_name);
  // 			}
  // 		});
  // 		countriesList.map(item => {
  // 			if (item.exclude_country === true) {
  // 				exclude_countries.push(item.country);
  // 			}
  // 		});
  // 		selectedTags.map(item => selected_tags.push(item.tag_name));

  // 		let info = {
  // 			allUsers,
  // 			title: filter.title,
  // 			include_search_tags,
  // 			exclude_search_tags,
  // 			exclude_countries,
  // 			selected_tags,
  // 			users,
  // 			countries,
  // 			search_tags,
  // 			tags,
  // 			msg: 'success'
  // 		};
  // 		return info;
  // 	} else {
  // 		let info = {
  // 			msg: `this filter doesn't exist`
  // 		};
  // 		return info;
  // 	}
  // }
}
