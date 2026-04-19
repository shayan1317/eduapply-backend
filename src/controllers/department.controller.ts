// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UniDepartment} from '../models';
import {CoursesRepository, UniDepartmentRepository} from '../repositories';
import {Success} from '../schema';
import {
  UniDepartmentData,
  UniDepartmentOutput,
} from '../schema/department.type';
import {DepartmentInput, Filter} from '../schema/inputs';
export class DepartmentController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UniDepartmentRepository)
    private uniDepartmentRepo: UniDepartmentRepository,

    @repository(CoursesRepository)
    private coursesRepository: CoursesRepository,
  ) {}

  async add(
    context: any,
    departmentInput: DepartmentInput,
  ): Promise<UniDepartmentOutput> {
    const transaction =
      await this.uniDepartmentRepo.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const {universityId, ...rest} = departmentInput;
      const insertedDepartment = await this.uniDepartmentRepo.create(
        {
          ...rest,
          universityProfileId: universityId,
        },
        {transaction},
      );
      await transaction.commit();
      return insertedDepartment;
    } catch (error) {
      await transaction.rollback();

      this.logger.error('addDepartment', error);
      throw error;
    }
  }

  async edit(
    context: any,
    departmentId: string,
    departmentInput: DepartmentInput,
  ): Promise<UniDepartmentOutput> {
    const transaction =
      await this.uniDepartmentRepo.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const department = await this.uniDepartmentRepo.findById(departmentId, {
        include: ['courses'],
      });
      if (!department)
        throw new HttpErrors.NotFound(
          `Department with id ${departmentId} not found`,
        );
      await this.uniDepartmentRepo.updateById(departmentId, {
        ...departmentInput,
        updatedAt: Date.now(),
      });
      await transaction.commit();
      return {
        ...department,
        ...departmentInput,
        updatedAt: new Date(Date.now()),
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('editDepartment', error);
      throw error;
    }
  }

  async deleteById(context: any, departmentId: string): Promise<Success> {
    const transaction =
      await this.uniDepartmentRepo.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const department = await this.uniDepartmentRepo.findById(departmentId);
      if (!department)
        throw new HttpErrors.NotFound(
          `Department with id ${departmentId} not found`,
        );
      await Promise.all([
        this.uniDepartmentRepo.deleteById(departmentId, {transaction}),
        this.coursesRepository.deleteAll(
          {uniDepartmentId: departmentId},
          {transaction},
        ),
      ]);
      await transaction.commit();
      return {
        success: true,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('Department deleteById', error);
      throw error;
    }
  }
  async getDepartments(
    context: any,
    universityId: string,
    offset: number,
    count: number,
    filter?: Filter,
  ): Promise<UniDepartmentData> {
    try {
      const {name} = filter || {};
      let whereBuilder = new WhereBuilder<UniDepartment>();

      if (name) {
        whereBuilder.ilike('name', `%${name}%`);
        // if (id) {
        // } else if (country) {
        //   whereBuilder.ilike('name', `%${name}%`);
        // } else if (name) {
        //   whereBuilder.ilike('name', `%${name}%`);
        // } else if (email) {
        //   whereBuilder.ilike('email', `%${email}%`);
        // }
      }
      whereBuilder?.eq('universityProfileId', universityId);

      const where = whereBuilder?.build();
      const departments = await this.uniDepartmentRepo.find({
        where,
        limit: count,
        skip: offset,
        include: [{relation: 'courses'}],
      });
   

      let total = {count: 0};
      if (where) {
        total = await this.uniDepartmentRepo.count(where);
      } else {
        total = await this.uniDepartmentRepo.count();
      }

      return {uniDepartment: departments, total: total.count};
    } catch (error) {
      this.logger.error('Department deleted', error);
      throw error;
    }
  }
}
