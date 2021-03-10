import dbConnect from '@/src/util/dbConnect'
import User from '@/src/models/User';

export default async (req, res) => {
  const { method } = req
  

  await dbConnect()

  if(method === 'POST'){
    try {
      const user = await User.create(
        req.body
      )
      res.status(201).json({ success: true, data: user })
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false })
    }
  }


};
