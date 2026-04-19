import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Application, ApplicationRelations, Courses, StudentApplicationTrackRecord, Video, ApplicationNote, StudentProfile, ApplicationStatus} from '../models';
import {CoursesRepository} from './courses.repository';
import {StudentApplicationTrackRecordRepository} from './student-application-track-record.repository';
import {VideoRepository} from './video.repository';
import {ApplicationNoteRepository} from './application-note.repository';
import {StudentProfileRepository} from './student-profile.repository';
import {ApplicationStatusRepository} from './application-status.repository';

export class ApplicationRepository extends DefaultCrudRepository<
  Application,
  typeof Application.prototype.id,
  ApplicationRelations
> {

  public readonly studentApplicationTrackRecords: HasManyRepositoryFactory<StudentApplicationTrackRecord, typeof Application.prototype.id>;

  public readonly courses: BelongsToAccessor<Courses, typeof Application.prototype.id>;

  public readonly videos: HasManyRepositoryFactory<Video, typeof Application.prototype.id>;

  public readonly applicationNotes: HasManyRepositoryFactory<ApplicationNote, typeof Application.prototype.id>;

  public readonly studentProfile: BelongsToAccessor<StudentProfile, typeof Application.prototype.id>;

  public readonly applicationStatuses: HasManyRepositoryFactory<ApplicationStatus, typeof Application.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource, @repository.getter('StudentApplicationTrackRecordRepository') protected studentApplicationTrackRecordRepositoryGetter: Getter<StudentApplicationTrackRecordRepository>, @repository.getter('CoursesRepository') protected coursesRepositoryGetter: Getter<CoursesRepository>, @repository.getter('VideoRepository') protected videoRepositoryGetter: Getter<VideoRepository>, @repository.getter('ApplicationNoteRepository') protected applicationNoteRepositoryGetter: Getter<ApplicationNoteRepository>, @repository.getter('StudentProfileRepository') protected studentProfileRepositoryGetter: Getter<StudentProfileRepository>, @repository.getter('ApplicationStatusRepository') protected applicationStatusRepositoryGetter: Getter<ApplicationStatusRepository>,
  ) {
    super(Application, dataSource);
    this.applicationStatuses = this.createHasManyRepositoryFactoryFor('applicationStatuses', applicationStatusRepositoryGetter,);
    this.registerInclusionResolver('applicationStatuses', this.applicationStatuses.inclusionResolver);
    this.studentProfile = this.createBelongsToAccessorFor('studentProfile', studentProfileRepositoryGetter,);
    this.registerInclusionResolver('studentProfile', this.studentProfile.inclusionResolver);
    this.applicationNotes = this.createHasManyRepositoryFactoryFor('applicationNotes', applicationNoteRepositoryGetter,);
    this.registerInclusionResolver('applicationNotes', this.applicationNotes.inclusionResolver);
    this.videos = this.createHasManyRepositoryFactoryFor('videos', videoRepositoryGetter,);
    this.registerInclusionResolver('videos', this.videos.inclusionResolver);
    this.courses = this.createBelongsToAccessorFor('courses', coursesRepositoryGetter,);
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
    this.studentApplicationTrackRecords = this.createHasManyRepositoryFactoryFor('studentApplicationTrackRecords', studentApplicationTrackRecordRepositoryGetter,);
    this.registerInclusionResolver('studentApplicationTrackRecords', this.studentApplicationTrackRecords.inclusionResolver);
  }
}
