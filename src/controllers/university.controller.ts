// Uncomment these imports to begin using these cool features!

import {inject, service} from '@loopback/core';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {IsolationLevel, WhereBuilder, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Documents, Location, Rankings, UniversityProfile} from '../models';
import {
  CoursesRepository,
  DocumentsRepository,
  LocationRepository,
  RankingsRepository,
  RequiredTestCourseRepository,
  RioProfileRepository,
  UniDepartmentRepository,
  UniversityProfileRepository,
  UserRepository,
} from '../repositories';
import {
  RioProfile,
  Roles,
  Success,
  UniversitiesData,
  UniversityData,
  UniversityProfile as UniversityProfileSchema,
  VerificationStatus,
} from '../schema';
import {CreateUniversityData, EditUniInput, Filter} from '../schema/inputs';
import {
  HasherService,
  JwtService,
  SmtpMailService,
  StripeService,
  UtilService,
} from '../services';
import {RioController} from './rio.controller';

export class UniversityController {
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  constructor(
    @repository(UserRepository)
    private userRepo: UserRepository,

    @service(HasherService)
    private hasherService: HasherService,

    @repository(DocumentsRepository)
    private documentsRepository: DocumentsRepository,

    @service(JwtService)
    private jwtService: JwtService,

    @repository(LocationRepository)
    private locationRepository: LocationRepository,

    @repository(RankingsRepository)
    private rankingsRepository: RankingsRepository,

    @repository(CoursesRepository)
    private coursesRepository: CoursesRepository,

    @repository(UniDepartmentRepository)
    private uniDepartmentRepos: UniDepartmentRepository,

    @repository(UniversityProfileRepository)
    private universityProfileRepository: UniversityProfileRepository,

    @repository(RioProfileRepository)
    private rioProfileRepository: RioProfileRepository,

    @service(UtilService)
    private utilService: UtilService,
    @service(StripeService)
    private stripe: StripeService,
    @service(SmtpMailService)
    private mailService: SmtpMailService,

    @repository(RequiredTestCourseRepository)
    private requiredTestCourseRepo: RequiredTestCourseRepository,

    @inject('controllers.RioController')
    private rioController: RioController,
  ) {}

  async createUniversity(
    context: any,
    createUniDate: CreateUniversityData,
  ): Promise<UniversityData> {
    const transaction =
      await this.universityProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const {
        documents = [],
        locations = [],
        rankings = [],
        email,
        rios = [],
        ...restUniData
      } = createUniDate;
      const username = email.toLowerCase();
      const user = await this.userRepo.findOne({where: {username}});
      if (user)
        throw new HttpErrors.Conflict('User already exists with same email');
      const randomPassword = this.utilService.generateRandomNumber(8);
      //send email to the new created student, their password and email
      const password = await this.hasherService.hashPassword(randomPassword);
      const newUniUser = await this.userRepo.create(
        {
          username,
          password,
          roleId: Roles.UNI_FOCAL_PERSON,
          verificationStatus: VerificationStatus.PASSWORD_SENT_IN_EMAIL,
        },
        {transaction},
      );
      const lastRecord = await this.universityProfileRepository.findOne({
        order: ['universityNumber DESC'],
      });
      const newUniversity = await this.universityProfileRepository.create(
        {
          ...restUniData,
          email: username,
          universityNumber: lastRecord ? lastRecord.universityNumber + 1 : 1,
        },
        {transaction},
      );

      let createDocs: Documents[] = [];
      if (documents?.length) {
        const docs = documents.map(url => ({url, userId: newUniUser.id}));
        createDocs = await this.documentsRepository.createAll(docs, {
          transaction,
        });
      }

      let insertedLocation: Location[] = [];
      if (locations?.length) {
        const loc = locations.map(item => ({
          lat: item?.lat,
          lon: item?.lon,
          universityProfileId: newUniversity.id,
        }));
        insertedLocation = await this.locationRepository.createAll(loc, {
          transaction,
        });
      }

      let insertedRankings: Rankings[] = [];
      if (rankings?.length) {
        const ranks = rankings.map(item => ({
          publisher: item.publisher,
          rank: item.rank,
          universityProfileId: newUniversity.id,
        }));
        insertedRankings = await this.rankingsRepository.createAll(ranks, {
          transaction,
        });
      }

      let insertedRios: RioProfile[] = [];

      if (rios?.length) {
        //@ts-ignore
        insertedRios = await this.rioController.createAllUserAndProfile(
          context,
          rios,
          newUniversity.id,
        );
      }
      await transaction.commit();
      const jwtResetPasswordToken = this.jwtService.generateSetupPasswordToken({
        userId: newUniUser.id,
        email: username,
      });
      try {
        const RIO_PORTAL_BASE_URL =
          process.env.ADMIN_BASE_URL ?? 'http://eduapply-admin.doerz.dev/';

        await this.mailService.sendSetupPasswordLink({
          name: `${createUniDate.name}`,
          to: username,
          //foronted should have a route to setup-student-password with param token
          link: `${RIO_PORTAL_BASE_URL}/setup-rio-password?token=${jwtResetPasswordToken}`,
        });
      } catch (error) {
        this.logger.error('SignUpError', error);
      }

      return {
        id: newUniversity.id,
        universityProfile: {
          ...newUniversity,
          locations: insertedLocation,
          rankings: insertedRankings,
          rioProfilesData: {
            rioProfiles: insertedRios,
            total: insertedRios.length,
            // universityId: newUniversity.id,
          },
        },
        documents: createDocs,
      };
    } catch (error) {
      await transaction.rollback();

      this.logger.error('SignUpError', error);
      throw error;
    }
  }

  async getUniversity(context: any, uniId: string): Promise<UniversityData> {
    try {
      const uni = await this.universityProfileRepository.findById(uniId, {
        // include: ['courses', 'locations', 'rankings']
        include: [
          {relation: 'locations'},
          {relation: 'rankings'},
          {
            relation: 'uniDepartments',
            scope: {
              include: [
                {
                  relation: 'courses',
                  scope: {include: [{relation: 'requiredTestCourses'}]},
                },
              ],
            },
          },
          {relation: 'rioProfiles'},
        ],
      });
      // const docs = await this.documentsRepository.find({where: {userId: uni.}})
      return {
        id: uni.id,
        universityProfile: {
          ...uni,
          rioProfilesData: {
            rioProfiles: uni?.rioProfiles,
            total: uni?.rioProfiles?.length || 0,
            // universityId: uni.id,
          },
        },
        documents: [], //todo--> fix uni docs
      };
    } catch (error) {
      this.logger.error('error getStudent', uniId, error);
      throw error;
    }
  }

  async getUniversities(
    context: any,
    offset: number,
    count: number,
    filter?: Filter,
  ): Promise<UniversitiesData> {
    try {
      const {country, id, name, email} = filter || {};
      let whereBuilder = null;
      if (country || id || name || email) {
        whereBuilder = new WhereBuilder<UniversityProfile>();
        if (id) {
          whereBuilder.eq('universityNumber', id);
        } else if (country) {
          whereBuilder.ilike('country', `%${country}%`);
        } else if (name) {
          whereBuilder.ilike('name', `%${name}%`);
        } else if (email) {
          whereBuilder.ilike('email', `%${email}%`);
        }
      }
      const where = whereBuilder?.build();
      const universitiesProfile = await this.universityProfileRepository.find({
        where,
        limit: count,
        skip: offset,
        order: ['createdAt DESC'],
        include: [
          {relation: 'rioProfiles'},
          {relation: 'locations'},
          {relation: 'rankings'},
          {relation: 'uniDepartments', scope: {include: ['courses']}},
        ],
      });

      let total = {count: 0};
      if (whereBuilder) {
        total = await this.universityProfileRepository.count(where);
      } else {
        total = await this.universityProfileRepository.count();
      }

      const uniProfileSchemaWithRio: UniversitiesData['universitiesProfile'] =
        universitiesProfile.map(uni => ({
          ...uni,
          rioProfilesData: {
            rioProfiles: uni.rioProfiles,
            total: uni?.rioProfiles?.length || 0,
            universityId: uni.id,
          },
        }));
      return {
        universitiesProfile: uniProfileSchemaWithRio,
        total: total.count,
      };
    } catch (error) {
      this.logger.error('error getUniversities', error);
      throw error;
    }
  }

  async deleteById(context: any, uniId: string): Promise<Success> {
    const transaction =
      await this.universityProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const uni = await this.universityProfileRepository.findById(uniId);
      const rioProfiles = await this.rioProfileRepository.find({
        where: {universityProfileId: uni.id},
      });
      const rioUserIds = rioProfiles.map(({userId}) => userId);

      await Promise.all([
        this.universityProfileRepository.deleteById(uniId, {transaction}),
        this.userRepo.deleteAll({username: uni.email}, {transaction}),
        this.coursesRepository.deleteAll(
          {universityProfileId: uni.id},
          {transaction},
        ),
        this.locationRepository.deleteAll(
          {universityProfileId: uni.id},
          {transaction},
        ),
        this.rankingsRepository.deleteAll(
          {universityProfileId: uni.id},
          {transaction},
        ),
        this.uniDepartmentRepos.deleteAll(
          {universityProfileId: uni.id},
          {transaction},
        ),
        this.requiredTestCourseRepo.deleteAll(
          {universityId: uni.id},
          {transaction},
        ),
        this.rioProfileRepository.deleteAll(
          {universityProfileId: uni.id},
          {transaction},
        ),
        this.userRepo.deleteAll({id: {inq: rioUserIds}}, {transaction}),
        // todo --> uni.userId
        // this.documentsRepository.deleteAll({userId: uni.userId}, {transaction}),
      ]);
      await transaction.commit();
      return {success: true};
    } catch (error) {
      await transaction.rollback();

      this.logger.error('error deleteUni', uniId, error);
      throw error;
    }
  }

  async edit(
    context: any,
    uniId: string,
    editUniInput: EditUniInput,
  ): Promise<UniversityProfileSchema> {
    const transaction =
      await this.universityProfileRepository.dataSource.beginTransaction(
        IsolationLevel.READ_COMMITTED,
      );
    try {
      const {
        locations: newLocation,
        rankings: newRankings,
        ...rest
      } = editUniInput;
      const uni = await this.universityProfileRepository.findById(uniId, {
        include: [
          {
            relation: 'uniDepartments',
          },
          {relation: 'courses'},
        ],
      });
      await this.universityProfileRepository.updateById(uniId, {
        ...rest,
        updatedAt: Date.now(),
      });

      //remove oldData
      await Promise.all([
        this.locationRepository.deleteAll(
          {universityProfileId: uniId},
          {transaction},
        ),
        this.rankingsRepository.deleteAll(
          {universityProfileId: uniId},
          {transaction},
        ),
      ]);

      //insert new data
      let insertedLocation: Location[] = [];
      if (newLocation?.length) {
        const loc = newLocation.map(item => ({
          lat: item?.lat,
          lon: item?.lon,
          universityProfileId: uniId,
        }));
        insertedLocation = await this.locationRepository.createAll(loc, {
          transaction,
        });
      }

      let insertedRankings: Rankings[] = [];
      if (newRankings?.length) {
        const ranks = newRankings.map(item => ({
          publisher: item.publisher,
          rank: item.rank,
          universityProfileId: uniId,
        }));
        insertedRankings = await this.rankingsRepository.createAll(ranks, {
          transaction,
        });
      }
      const university = await this.universityProfileRepository.findById(uniId);

      const {courses} = uni;
      if (courses?.length) {

        const coursesId = courses?.map(item => item.productId);


        const updatedProducts = Promise.all(
          courses?.map(async item => {
            const updatedProduct =
              await this.stripe.UpdateApplicationFeeAsProduct(
                university,
                item,
                item.productId,
              );

            const updatedPrice = await this.stripe.UpdatePriceObject(
              university,
              item,
              updatedProduct.id,
            );

            // await this.stripe.archivePriceObject(item.applicationFeeStripeId);
            await this.coursesRepository.updateById(item.id, {
              applicationFeeStripeId: updatedPrice.id,
            });
          }),
        );
      }

     
      await transaction.commit();
      return {
        ...uni,
        ...editUniInput,
        updatedAt: new Date(Date.now()),
        locations: insertedLocation,
        rankings: insertedRankings,
        // rioProfilesData: {
        //   rioProfiles: updatedRios,
        //   total: updatedRios.length,
        //   universityId: uniId,
        // },
      };
    } catch (error) {
      await transaction.rollback();
      this.logger.error('UpdateUniError', error);
      throw error;
    }
  }
}
