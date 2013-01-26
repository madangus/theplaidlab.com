
/*
 * GET home page.
 */

exports.index = function(req, res){
	var now = new Date();
	var copyYear = now.getFullYear();
	res.render('index', { title: 'theplaidlab.com', copyYear: copyYear });
};