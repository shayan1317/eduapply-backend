import {inject} from '@loopback/core';
import {
  arg,
  authorized,
  GraphQLBindings,
  ID,
  mutation,
  query,
  resolver,
  ResolverData,
} from '@loopback/graphql';
import {StudentTrainingController} from '../controllers';
import {Roles, Success} from '../schema';
import {
  GetStudentTrainings,
  StudentTrainingInput,
} from '../schema/inputs/studentTraining.type';
import {
  StudentTraining,
  StudentTrainingData,
} from '../schema/studentTraining.type';

@resolver()
export class StudentTrainingResolver {
  constructor(
    @inject(GraphQLBindings.RESOLVER_DATA)
    private resolverData: ResolverData,

    @inject('controllers.StudentTrainingController')
    private studentTrainingController: StudentTrainingController,
  ) {}

  @query(returns => StudentTrainingData)
  async getStudentTraining(
    @arg('getStudentTrainings') getStudentTrainings?: GetStudentTrainings,
  ): Promise<StudentTrainingData> {
    return this.studentTrainingController.getStudentTraining(
      this.resolverData.context,
      getStudentTrainings || {},
    );
  }

  @query(returns => StudentTraining)
  async getStudentTrainingById(
    @arg('studentTrainingId', type => ID)
    studentTrainingId: number,
  ): Promise<StudentTraining> {
    return this.studentTrainingController.getStudentTrainingById(
      this.resolverData.context,
      studentTrainingId,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => StudentTraining)
  async createStudentTraining(
    @arg('studentTrainingInput') studentTrainingInput: StudentTrainingInput,
  ): Promise<StudentTraining> {
    return this.studentTrainingController.createStudentTraining(
      this.resolverData.context,
      studentTrainingInput,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => Success)
  async deleteStudentTrainingbyId(
    @arg('studentTrainingId') studentTrainingId: number,
  ): Promise<Success> {
    return this.studentTrainingController.deleteStudentTraining(
      this.resolverData.context,
      studentTrainingId,
    );
  }

  @authorized([Roles.ADMIN, Roles.RIO, Roles.SUPER_ADMIN])
  @mutation(returns => StudentTraining)
  async ediStudentTraining(
    @arg('studentTrainingId', type => ID) studentTrainingId: number,
    @arg('studentTrainingInput')
    studentTrainingInput: StudentTrainingInput,
  ): Promise<StudentTraining> {
    return this.studentTrainingController.editStudentTraining(
      this.resolverData.context,
      studentTrainingInput,
      studentTrainingId,
    );
  }
}
