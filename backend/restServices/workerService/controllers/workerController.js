const { writeToStream } = require('../utils/locationStreaming');
const {logging} = require('../utils/logging');

exports.updateLocation = async (req, res) => {

    try {

      const {lat,lon}=req.body.data.location;

      await writeToStream(lat,lon,req.user.id);

      res.sendStatus(200);
      
    } catch (error) {

      console.log(error);

      res.sendStatus(500);
      
    }
};

