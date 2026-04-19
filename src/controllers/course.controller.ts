// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Courses} from '../models';
import {
  ApplicationRepository,
  CoursesRepository,
  RequiredTestCourseRepository,
  UniversityProfileRepository,
} from '../repositories';
import {RequiredTestCourse, Success} from '../schema';
import {Course, SubjectsData} from '../schema/course.type';
import {CourseInput, Filter, RequiredTestCourseInput} from '../schema/inputs';
import {StripeService} from '../services';

export class CourseController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(CoursesRepository)
    private coursesRepository: CoursesRepository,
    @repository(ApplicationRepository)
    private applicationRepo: ApplicationRepository,

    @repository(RequiredTestCourseRepository)
    private requiredTestCourseRepo: RequiredTestCourseRepository,

    @repository(UniversityProfileRepository)
    private universityRepository: UniversityProfileRepository,
    @service(StripeService)
    private stripe: StripeService,
  ) {}

  async add(context: any, addCourseData: CourseInput): Promise<Course> {
    const transaction =
      await this.coursesRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const {universityId, departmentId, requiredTestCourses, ...rest} =
        addCourseData;
      const university = await this.universityRepository.findById(universityId);
      if (!university) throw new HttpErrors[400]('University id is not valid');
      const course = await this.coursesRepository.create(
        {
          ...rest,
          universityProfileId: universityId,
          uniDepartmentId: departmentId,
        },
        {transaction},
      );
      let reqTests: RequiredTestCourse[] = [];
      if (requiredTestCourses && requiredTestCourses.length > 0) {
        reqTests = await this.requiredTestCourseRepo.createAll(
          requiredTestCourses.map((testCourse: RequiredTestCourseInput) => ({
            ...testCourse,
            coursesId: course.id,
            universityId: course.uniDepartmentId,
            departmentId: course.universityProfileId,
          })),
          {transaction},
        );
      }
      const applicationFeeProduct =
        await this.stripe.addApplicationFeeAsProduct(university, course);
      await this.coursesRepository.updateById(
        course.id,
        {
          applicationFeeStripeId: applicationFeeProduct.default_price,
          productId: applicationFeeProduct.id,
        },
        {transaction},
      );
      await transaction.commit();
      return {
        ...course,
        requiredTestCourses: reqTests,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('addCourse', error);
      throw error;
    }
  }

  async edit(
    context: any,
    courseId: string,
    courseInput: CourseInput,
  ): Promise<Course> {
    const transaction =
      await this.coursesRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const course = await this.coursesRepository.findById(courseId, {
        include: ['requiredTestCourses'],
      });

      if (!course)
        throw new HttpErrors.NotFound(`Course with id ${courseId} not found`);
      const {departmentId, universityId, requiredTestCourses, ...rest} =
        courseInput;
      let updateCourse = await this.coursesRepository.updateById(
        courseId,
        {
          ...rest,
          uniDepartmentId: departmentId,
          universityProfileId: universityId,
          updatedAt: Date.now(),
        },
        {transaction},
      );

      await this.requiredTestCourseRepo.deleteAll(
        {coursesId: courseId},
        {transaction},
      );

      let reqTests: RequiredTestCourse[] = [];
      if (requiredTestCourses && requiredTestCourses.length > 0) {
        reqTests = await this.requiredTestCourseRepo.createAll(
          requiredTestCourses.map((testCourse: RequiredTestCourseInput) => ({
            ...testCourse,
            coursesId: courseId,
            departmentId: course.uniDepartmentId,
            universityId: course.universityProfileId,
          })),
          {transaction},
        );
      }

      const university = await this.universityRepository.findById(universityId);
      if (!university) throw new HttpErrors[400]('University id is not valid');
      await transaction.commit();
      try {
        const updatedCourse = await this.coursesRepository.findById(courseId);

        const applicationFeeProduct =
          await this.stripe.UpdateApplicationFeeAsProduct(
            university,
            updatedCourse,
            updatedCourse.productId,
          );


        // const productPrice = await this.stripe.UpdatePrice(
        //   university,
        //   updatedCourse,
        //   course.applicationFeeStripeId,
        // );
        const productPrice = await this.stripe.UpdatePriceObject(
          university,
          updatedCourse,
          applicationFeeProduct.id,
        );
        // await this.stripe.archivePriceObject(
        //   updatedCourse.applicationFeeStripeId,
        // );
        await this.coursesRepository.updateById(courseId, {
          applicationFeeStripeId: productPrice.id,
        });
      } catch (err) {
        throw err;
      }

      return {
        ...course,
        ...rest,
        requiredTestCourses: reqTests,
        updatedAt: new Date(Date.now()),
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('editCourse', error);
      throw error;
    }
  }

  async deleteById(context: any, courseId: string): Promise<Success> {
    const transaction =
      await this.coursesRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const course = await this.coursesRepository.findById(courseId);

      if (!course)
        throw new HttpErrors.NotFound(
          `Department with id ${courseId} not found`,
        );

      await Promise.all([
        this.coursesRepository.deleteById(courseId, {transaction}),
        this.requiredTestCourseRepo.deleteAll(
          {coursesId: courseId},
          {transaction},
        ),
      ]);
      const application = await this.applicationRepo.find({
        where: {coursesId: courseId},
      });

      const applicationIds = application.map(item => item.id);

      if (applicationIds.length) {
        await this.applicationRepo.deleteAll({id: {inq: applicationIds}});
      }

      await transaction.commit();
      return {
        success: true,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('Course deleteById', error);
      throw error;
    }
  }

  async getCourses(
    context: any,
    departmentId: string,
    offset: number,
    count: number,
    filter?: Filter,
  ): Promise<SubjectsData> {
    try {
      const {name: title} = filter || {};
      let whereBuilder = new WhereBuilder<Courses>();
      if (title) {
        whereBuilder = whereBuilder.ilike('title', `%${title}%`);
        // if (id) {
        // } else if (country) {
        //   whereBuilder.ilike('name', `%${name}%`);
        // } else if (name) {
        //   whereBuilder.ilike('name', `%${name}%`);
        // } else if (email) {
        //   whereBuilder.ilike('email', `%${email}%`);
        // }
      }
      whereBuilder?.eq('uniDepartmentId', departmentId);
      const where = whereBuilder?.build();
      const courses = await this.coursesRepository.find({
        where,
        limit: count,
        skip: offset,
      });
      let total = {count: 0};
      if (where) {
        total = await this.coursesRepository.count(where);
      } else {
        total = await this.coursesRepository.count();
      }

      return {courses, total: total.count};
    } catch (err) {
      throw err;
    }
  }
}
