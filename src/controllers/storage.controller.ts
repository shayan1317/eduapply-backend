import {inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {
  Request,
  Response,
  RestBindings,
  post,
  requestBody,
} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export class StorageController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor() {}

  @post('/upload', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: '',
      },
    },
  })
  async upload(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = multer.memoryStorage();
      const upload = multer({storage});

      upload.any()(request, response, async (err: any) => {
        if (err) {
          this.logger.error('UploadFileError', err);
          reject(err);
        } else {
          let res = new Array();
          const uploadDir = path.join(process.cwd(), 'public/uploads');
          
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
          }

          for (const file of (request as any).files) {
            const now = new Date();
            const name_parts = file.originalname.split('.');
            const name = name_parts[0];
            const extension = name_parts.length > 1 ? name_parts[name_parts.length - 1] : 'undefined';
            let filename = `${name}_${now.getTime()}.${extension}`;
            
            try {
              const filePath = path.join(uploadDir, filename);
              fs.writeFileSync(filePath, file.buffer);
              
              const baseUrl = process.env.BASE_URL ?? 'http://localhost:4000';
              const fileUrl = `${baseUrl}/uploads/${filename}`;
              res.push(fileUrl);
            } catch (err) {
              this.logger.error('FileSaveError', err);
              reject(err);
            }
          }
          resolve(res);
        }
      });
    });
  }
}
