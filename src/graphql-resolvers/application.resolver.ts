import {Roles} from './../schema/enums.type';
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-graphql
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {
  GraphQLBindings,
  ID,
  ResolverData,
  arg,
  authorized,
  mutation,
  query,
  resolver,
} from '@loopback/graphql';
import {ApplicationController} from '../controllers';
import {
  ApplicationNotes,
  ApplicationStatus,
  ApplicationTrackRecord,
  GetApplicationStatusRes,
  Intake,
  StudentApplication,
  StudentApplications,
  SubjectsData,
  Success,
  UniversitiesData,
} from '../schema';
import {
  ApplicationNoteInput,
  ApplicationRequirementInput,
  ApplicationTrackRecordInput,
  GetAllApplicationsInput,
  GetApplicationFilter,
} from '../schema/inputs';
@resolver()
export class ApplicationResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.ApplicationController')
    private applicationController: ApplicationController,
  ) {}

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => UniversitiesData)
  async getUniForApplication(
    @arg('GetApplicationFilter', {
      nullable: true,
      description: 'filter the data using below field',
    })
    getApplicationFilter: GetApplicationFilter,
  ): Promise<UniversitiesData> {
    return this.applicationController.getUniForApplication(
      this.resolverData.context,
      getApplicationFilter,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => SubjectsData)
  async getSubjectsForApplication(
    @arg('GetApplicationFilter', {
      nullable: true,
      description: 'filter the data using below field',
    })
    getApplicationFilter: GetApplicationFilter,
  ): Promise<SubjectsData> {
    return this.applicationController.getSubjectsForApplication(
      this.resolverData.context,
      getApplicationFilter,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => StudentApplications)
  async getApplications(
    @arg('getAllApplicationsInput', {
      description: 'if none is passed then it will return all the applications',
    })
    getAllApplicationsInput: GetAllApplicationsInput,
    @arg('offset', {
      defaultValue: 0,
      description: 'Number of results to to skip, default is 0',
    })
    offset: number,
    @arg('count', {
      defaultValue: 10,
      description: 'Number of results to return, default is 10',
    })
    count: number,
  ): Promise<StudentApplications> {
    return this.applicationController.getAll(
      this.resolverData.context,
      getAllApplicationsInput,
      offset,
      count,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => StudentApplication)
  async getApplicationById(
    @arg('applicationId', {
      description: 'get all applications of the studentId',
    })
    applicationId: number,
  ): Promise<StudentApplication> {
    return this.applicationController.getById(
      this.resolverData.context,
      applicationId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => StudentApplication)
  async addApplicationReq(
    @arg('applicationId')
    applicationId: number,
    @arg('reqDocTitle', {
      description: 'Title of the document required',
    })
    reqDocTitle: string,
  ): Promise<StudentApplication> {
    return this.applicationController.addApplicationReq(
      this.resolverData.context,
      applicationId,
      reqDocTitle,
    );
  }

  // @authorized([
  //   Roles.ADMIN,
  //   Roles.RIO,
  //   Roles.SUPER_ADMIN,
  //   Roles.STUDENT,
  //   Roles.UNI_FOCAL_PERSON,
  //   Roles.AGENT,
  // ])
  // @mutation(returns => StudentApplication)
  // async updateApplication(
  //   @arg('applicationId', {
  //     description: 'get all applications of the studentId',
  //   })
  //   applicationId: number,
  //   // @arg('applicationRequiredDocsId', type => ID)
  //   // applicationRequiredDocsId: string,
  //   @arg('UpdateApplicationInput')
  //   updateApplicationInput: UpdateApplicationInput,
  // ): Promise<StudentApplication> {
  //   return this.applicationController.update(
  //     this.resolverData.context,
  //     applicationId,

  //     updateApplicationInput,
  //   );
  // }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => StudentApplication)
  async createApplyApplication(
    @arg('studentId', {
      description: 'initiate application for the studentId',
    })
    studentId: string,
    @arg('courseId') courseId: string,
    @arg('intakes') intakes: Intake,
    @arg('agentProfileId', {
      description: 'This is agent profile id and not agent user id',
      nullable: true,
    })
    agentProfileId?: string,
  ): Promise<StudentApplication> {
    return this.applicationController.create(
      this.resolverData.context,
      studentId,
      courseId,
      intakes,
      agentProfileId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => ApplicationTrackRecord)
  async updateApplicationRequiremtentsByid(
    @arg('applicationRequirement')
    applicationRequirement: ApplicationTrackRecordInput,
    @arg('applicationId')
    applicationId: number,
  ): Promise<ApplicationTrackRecord> {
    return this.applicationController.updateApplicationRequiremtents(
      this.resolverData.context,
      applicationRequirement,
      applicationId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async updateAdmissionFeeVerificationById(
    @arg('addmissionFeeVerication')
    addmissionFeeVerification: ApplicationRequirementInput,
    @arg('applicationId')
    applicationId: number,
    @arg('eventName')
    eventName: string,
  ): Promise<Success> {
    return this.applicationController.updateAdmissionFeeVerificationBy(
      this.resolverData.context,
      addmissionFeeVerification,
      applicationId,
      eventName,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async updateRefundLetterById(
    @arg('refundLetter')
    refundLetter: ApplicationRequirementInput,
    @arg('applicationId')
    applicationId: number,
    @arg('eventName')
    eventName: string,
  ): Promise<Success> {
    return this.applicationController.updateRefundLetter(
      this.resolverData.context,
      refundLetter,
      applicationId,
      eventName,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => ApplicationNotes)
  async createApplciationNotes(
    @arg('applicationNotes')
    applicationNotes: ApplicationNoteInput,

    @arg('applicationId')
    applicationId: number,
  ): Promise<ApplicationNotes> {
    return this.applicationController.createApplciationNotes(
      this.resolverData.context,
      applicationNotes,
      applicationId,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => ApplicationNotes)
  async getApplicationNotes(
    @arg('applicationId')
    applicationId: number,
  ): Promise<ApplicationNotes> {
    return this.applicationController.GetApplicationNotes(
      this.resolverData.context,
      applicationId,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @query(returns => GetApplicationStatusRes)
  async getApplicationStatus(
    @arg('applicationId')
    applicationId: number,
  ): Promise<GetApplicationStatusRes> {
    return this.applicationController.GetApplicationStatus(
      this.resolverData.context,
      applicationId,
    );
  }
  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.UNI_FOCAL_PERSON,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async submitApplicationRequirements(
    @arg('eventName')
    eventName: string,
    @arg('applicationId')
    applicationId: number,
    @arg('status', type => ApplicationStatus, {
      nullable: true,
      defaultValue: ApplicationStatus.SUBMITTED,
    })
    status?: ApplicationStatus,
  ): Promise<Success> {
    return this.applicationController.SubmitApplicationRequirements(
      this.resolverData.context,
      eventName,
      applicationId,
      status,
    );
  }

  @authorized([Roles.STUDENT, Roles.STAFF, Roles.AGENT, Roles.STAFF])
  @mutation(returns => String)
  async generateFeePaymentSession(
    @arg('applicationId', type => ID) applicationId: number,
  ) {
    return this.applicationController.createApplicationFeePaymentSession(
      this.resolverData.context,
      applicationId,
    );
  }

  @authorized([
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.UNI_FOCAL_PERSON,
    Roles.SUPER_ADMIN,
  ])
  @mutation(returns => Success)
  async updateOfferLetter(
    @arg('applicationId', type => ID) applicationId: number,
    @arg('offerLetterUrl') offerLetterUrl: string,
    @arg('eventName')
    eventName: string,
  ): Promise<Success> {
    return this.applicationController.updateOfferLetter(
      this.resolverData.context,
      applicationId,
      offerLetterUrl,
      eventName,
    );
  }

  @authorized([
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.UNI_FOCAL_PERSON,
    Roles.SUPER_ADMIN,
  ])
  @mutation(returns => Success)
  async updateVisaSupportLetter(
    @arg('applicationId', type => ID) applicationId: number,
    @arg('visaSupportLetterUrl') visaSupportLetterUrl: string,

    @arg('eventName')
    eventName: string,
  ): Promise<Success> {
    return this.applicationController.updateVisaSupportLetter(
      this.resolverData.context,
      applicationId,
      visaSupportLetterUrl,
      eventName,
    );
  }

  @authorized([
    Roles.ADMIN,
    Roles.RIO,
    Roles.SUPER_ADMIN,
    Roles.UNI_FOCAL_PERSON,
    Roles.SUPER_ADMIN,
    Roles.STUDENT,
    Roles.AGENT,
    Roles.STAFF,
  ])
  @mutation(returns => Success)
  async deleteApplicationById(
    @arg('applicationId', type => ID) applicationId: number,
  ): Promise<Success> {
    return this.applicationController.deleteApplication(
      this.resolverData.context,
      applicationId,
    );
  }
}
