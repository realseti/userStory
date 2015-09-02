// that would export all that data to use if you call that file from somewhere else
module.exports = {
	"database" : "mongodb://root:abc123@ds035280.mongolab.com:35280/userstory",
	"port" : process.env.PORT || 3000,
	"secretKey" : "YorSecretKey"
}