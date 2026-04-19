import {inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {StudentTraning} from '../models';
import {StudentTraningRepository} from '../repositories';
import {Success, User} from '../schema';
import {
  GetStudentTrainings,
  StudentTrainingInput,
} from '../schema/inputs/studentTraining.type';
import {
  StudentTraining,
  StudentTrainingData,
} from '../schema/studentTraining.type';

export class StudentTrainingController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(StudentTraningRepository)
    private studentTraningRepository: StudentTraningRepository,
  ) {}
  async createStudentTraining(
    context: any,
    studentData: StudentTrainingInput,
  ): Promise<StudentTraining> {
    try {
      const result = await this.studentTraningRepository.create({
        courseName: studentData.courseName,
        programName: studentData.programName,
        totalMarks: studentData.totalMarks,
        timeDuration: studentData.timeDuration,
        questionType: studentData.questionType,
        testDate: studentData.testDate,
        document: studentData.document,
      });
      return {
        id: result.id,
        courseName: result.courseName,
        programName: result.programName,
        totalMarks: result.totalMarks,
        timeDuration: result.timeDuration,
        questionType: result.questionType,
        testDate: result.testDate,
        document: result.document,
      };
    } catch (error) {
      this.logger.error('SignUpError', error);
      throw error;
    }
  }

  async deleteStudentTraining(
    context: any,
    studentTrainingId: number,
  ): Promise<Success> {
    try {
      const user: User = context.user;
      await this.studentTraningRepository.deleteById(studentTrainingId);
      return {success: true};
    } catch (error) {
      this.logger.error('SignUpError', error);
      throw error;
    }
  }
  async editStudentTraining(
    context: any,
    studentTrainingInput: StudentTrainingInput,
    studentTrainingId: number,
  ): Promise<StudentTraining> {
    try {
      const studentTraining = await this.studentTraningRepository.findById(
        studentTrainingId,
      );
      if (!studentTraining)
        throw HttpErrors.NotFound('student training not found');

      const result = await this.studentTraningRepository.updateById(
        studentTrainingId,
        {...studentTrainingInput, updatedAt: Date.now()},
      );

      const UpdatedStudentTraining =
        await this.studentTraningRepository.findById(studentTrainingId);
      return UpdatedStudentTraining;
    } catch (error) {
      this.logger.error('SignUpError', error);
      throw error;
    }
  }
  async getStudentTraining(
    context: any,
    getStudentTraining?: GetStudentTrainings,
  ): Promise<StudentTrainingData> {
    try {
      const {courseName, pagination} = getStudentTraining || {};
      const whereBuilder = new WhereBuilder<StudentTraning>();
      if (courseName) {
        whereBuilder.ilike('courseName', `${courseName}`);
      }
      const where = whereBuilder?.build();
      const result = await this.studentTraningRepository.find({
        where,
        limit: pagination?.count || 10,
        skip: pagination?.offset || 0,
        order: ['testDate DESC'],
      });
      const total = await this.studentTraningRepository.count(where);
      return {
        studentTrainings: result,
        total: total.count,
      };
    } catch (error) {
      this.logger.error('GetVenueData', error);
      throw error;
    }
  }

  async getStudentTrainingById(
    context: any,
    studentTrainingId: number,
  ): Promise<StudentTraining> {
    try {
      const result = await this.studentTraningRepository.findById(
        studentTrainingId,
      );

      if (!result) throw HttpErrors.NotFound('student training not found');

      return result;
    } catch (error) {
      this.logger.error('GetVenueData', error);
      throw error;
    }
  }
}
