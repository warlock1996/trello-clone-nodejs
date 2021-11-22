const { verify } = require("../utils/jwt");

exports.checkAuth = async (req, res, next) => {
	try {
		const bearerToken = req.get("Authorization");
		if (bearerToken) {
			const decoded = await verify(bearerToken);
			console.log(decoded)
			return
		}

		res.status(401).json({
			error: true,
			message: 'Unauthorized!'
		})

            
    } catch (error) {
		console.log(error)
    }
};
