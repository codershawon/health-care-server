import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ICloudinaryResponse, IUploadedFile } from "../interfaces/file";
    // Configuration
    cloudinary.config({ 
        cloud_name: 'ds8f2pzrp', 
        api_key: '646675459549461', 
        api_secret: 'PLPTH1VafPQCscu10WcplZ84V4I' 
    });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(),"uploads"))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

      // Upload an image
   const uploadToCloudinary= async(file: IUploadedFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) =>{
      cloudinary.uploader
      .upload(
          file.path,
          (err: Error, result: ICloudinaryResponse)=>{
            fs.unlinkSync(file.path);
            if(err){
              reject(err)
            }
            resolve(result)
          }
      )
    })
 
   }

  export const fileUploader={
    upload,
    uploadToCloudinary
  }