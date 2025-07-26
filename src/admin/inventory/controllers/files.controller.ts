import { Controller, Delete, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Express } from 'express'; // Import Express for Multer File types

// Import Swagger Decorators
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';

// src/upload/upload.controller.ts
@ApiTags('Uploads') // Group all endpoints in this controller under the "Uploads" tag
@Controller('upload')
export class FileUploadController {

  // POST /upload/image - Upload single image
  @Post('image')
  @ApiOperation({ summary: 'Upload a single image file', description: 'Uploads a single image file to the server.' })
  @ApiConsumes('multipart/form-data') // Required for Swagger to correctly display file upload input
//   @ApiFile({ name: 'file', description: 'The image file to upload (e.g., JPEG, PNG, GIF).' })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file format or upload error.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseInterceptors(FileInterceptor('file')) // 'file' matches the name in @ApiFile
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    // Your implementation here, e.g., save the file
    console.log('Uploaded single file:', file);
    return {
      message: 'Single image uploaded successfully!',
      filename: file?.originalname,
      size: file?.size,
      mimetype: file?.mimetype,
    };
  }

  // POST /upload/images - Upload multiple images
  @Post('images')
  @ApiOperation({ summary: 'Upload multiple image files', description: 'Uploads up to 10 image files to the server.' })
  @ApiConsumes('multipart/form-data') // Required for Swagger
//   @ApiFiles({ name: 'files', description: 'An array of image files to upload (e.g., JPEG, PNG, GIF).', maxCount: 10 })
  @ApiResponse({ status: 201, description: 'Images uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid file format, too many files, or upload error.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseInterceptors(FilesInterceptor('files', 10)) // 'files' matches the name in @ApiFiles, 10 is maxCount
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    // Your implementation here, e.g., save each file
    console.log('Uploaded multiple files:', files);
    return {
      message: 'Multiple images uploaded successfully!',
      count: files.length,
      filenames: files.map(f => f.originalname),
    };
  }

  // DELETE /upload/:filename - Delete uploaded file
  @Delete(':filename')
  @ApiOperation({ summary: 'Delete an uploaded file', description: 'Deletes a specific file by its filename from the server.' })
  @ApiParam({ name: 'filename', description: 'The name of the file to delete (e.g., unique-id-image.jpg)', type: String })
  @ApiResponse({ status: 204, description: 'File successfully deleted.' }) // 204 No Content for successful deletion
  @ApiResponse({ status: 404, description: 'File not found.' })
  @ApiResponse({ status: 400, description: 'Invalid filename or deletion error.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  deleteFile(@Param('filename') filename: string) {
    // Your implementation here, e.g., remove file from storage
    console.log(`Attempting to delete file: ${filename}`);
    return { message: `File ${filename} deleted successfully (mock)` };
  }
}