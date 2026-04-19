import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: true}})
export class AgentStudent extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  agentId?: string;

  @property({
    type: 'string',
  })
  studentProfileId?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<AgentStudent>) {
    super(data);
  }
}

export interface AgentStudentRelations {
  // describe navigational properties here
}

export type AgentStudentWithRelations = AgentStudent & AgentStudentRelations;
