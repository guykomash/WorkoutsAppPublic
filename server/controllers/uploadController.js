const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');

const getSignedUrl = async (req, res) => {
  const userId = req?.cookies.userId;
  if (!userId)
    return res.status(500).json({ message: 'no userId found in request' });

  const key = `${userId}/account-image.jpeg`;

  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'eu-central-1',
  });
  try {
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'workouts-accounts-images',
        ContentType: 'image/*',
        Key: key,
      },
      (err, url) => res.send({ key, url })
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'error in uploading image' });
  }
};

module.exports = { getSignedUrl };
