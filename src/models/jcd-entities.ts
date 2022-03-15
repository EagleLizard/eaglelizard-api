
import { isNumber, isObject, isString, isUndefined } from '../lib/modules/type-validation/validate-primitives';
import { JcdTypeError } from './jcd-type-error';

export interface JcdProjectListItem {
  projectKey: string;
  orderIndex: number;
}

export class JcdProject {

  constructor(
    public orderIndex: number,
    public title: string,
    public projectKey: string,
    public coverImageUri: string,
    public route: string,
  ) {}

  static deserialize(rawJcdProject: unknown): JcdProject {
    let jcdProject: JcdProject;
    let orderIndex: number, title: string, projectKey: string, coverImageUri: string,
      route: string;
    if(!isObject(rawJcdProject)) {
      throw new JcdTypeError('object');
    }

    jcdProject = rawJcdProject as JcdProject;
    orderIndex = jcdProject.orderIndex;
    title = jcdProject.title;
    projectKey = jcdProject.projectKey;
    coverImageUri = jcdProject.coverImageUri;
    route = jcdProject.route;

    if(!isNumber(orderIndex)) {
      throw new JcdTypeError('number');
    }
    if(!isString(title)) {
      throw new JcdTypeError('string');
    }
    if(!isString(projectKey)) {
      throw new JcdTypeError('string');
    }
    if(!isString(coverImageUri)) {
      throw new JcdTypeError('string');
    }
    if(!isString(route)) {
      throw new JcdTypeError('string');
    }

    return new JcdProject(
      orderIndex,
      title,
      projectKey,
      coverImageUri,
      route,
    );
  }
}

interface JcdMediaAndPressLink {
  label: string;
  uri: string;
}

export class JcdMediaAndPressDetail {

  constructor(
    public publication: string,
    public description?: string,
    public link?: JcdMediaAndPressLink,
  ) {}

  static deserialize(rawJcdMediaAndPressDetail: unknown): JcdMediaAndPressDetail {
    let jcdMediaAndPressDetail: JcdMediaAndPressDetail;
    let publication: string, description: string;
    let link: JcdMediaAndPressLink, label: string, uri: string;
    if(!isObject(rawJcdMediaAndPressDetail)) {
      throw new JcdTypeError('object');
    }
    jcdMediaAndPressDetail = rawJcdMediaAndPressDetail as JcdMediaAndPressDetail;
    publication = jcdMediaAndPressDetail.publication;
    description = jcdMediaAndPressDetail.description;
    link = jcdMediaAndPressDetail?.link;
    label = jcdMediaAndPressDetail?.link?.label;
    uri = jcdMediaAndPressDetail?.link?.uri;
    if(!isString(publication)) {
      throw new JcdTypeError('string');
    }
    if(
      !isUndefined(description)
      && !isString(description)
    ) {
      throw new JcdTypeError('string | undefined');
    }

    if(
      !isUndefined(link)
      && !isObject(link)
    ) {
      throw new JcdTypeError('object | undefined');
    }

    if(isObject(link)) {
      if(!isString(label)) {
        throw new JcdTypeError('string');
      }
      if(!isString(uri)) {
        throw new JcdTypeError('string');
      }
    }

    return new JcdMediaAndPressDetail(
      publication,
      description,
      link,
    );
  }
}

export class JcdProjectDetails {
  constructor(
    public org: string,
    public month: number,
    public year: number,
    public credit: string,
    public credits: string[],
    public originalCredits: string[],
    public mediaAndPress: JcdMediaAndPressDetail[],
  ) {}

  static deserialize(rawJcdProjectDetails: unknown) {
    let jcdProjectDetails: JcdProjectDetails;
    let org: string, month: number, year: number, credit: string,
      credits: string[], originalCredits: string[],
      mediaAndPress: JcdMediaAndPressDetail[]
    ;
    if(!isObject(rawJcdProjectDetails)) {
      throw new JcdTypeError('object');
    }
    jcdProjectDetails = rawJcdProjectDetails as JcdProjectDetails;
    org = jcdProjectDetails.org;
    month = jcdProjectDetails.month;
    year = jcdProjectDetails.year;
    credit = jcdProjectDetails.credit;
    credits = jcdProjectDetails.credits;
    originalCredits = jcdProjectDetails.originalCredits;

    if(!isString(org)) {
      throw new JcdTypeError('string');
    }
    if(!isNumber(month)) {
      throw new JcdTypeError('number');
    }
    if(!isNumber(year)) {
      throw new JcdTypeError('number');
    }
    if(!isString(credit)) {
      throw new JcdTypeError('string');
    }
    if(!Array.isArray(credits)) {
      throw new JcdTypeError('array');
    }
    if(!credits.every(isString)) {
      throw new JcdTypeError('string');
    }
    if(!Array.isArray(originalCredits)) {
      throw new JcdTypeError('array');
    }
    if(!originalCredits.every(isString)) {
      throw new JcdTypeError('string');
    }

    if(!Array.isArray(jcdProjectDetails.mediaAndPress)) {
      throw new JcdTypeError('array');
    }
    mediaAndPress = jcdProjectDetails.mediaAndPress
      .map(JcdMediaAndPressDetail.deserialize)
    ;

    return new JcdProjectDetails(
      org,
      month,
      year,
      credit,
      credits,
      originalCredits,
      mediaAndPress,
    );
  }
}

export class JcdProjectPage {
  constructor(
    public galleryImageUris: string[],
    public projectDetails: JcdProjectDetails,
  ) {}

  static deserialize(rawJcdProjectPage: unknown): JcdProjectPage {
    let jcdProjectPage: JcdProjectPage;
    let galleryImageUris: string[], projectDetails: JcdProjectDetails;

    if(!isObject(rawJcdProjectPage)) {
      throw new JcdTypeError('object');
    }
    jcdProjectPage = rawJcdProjectPage as JcdProjectPage;
    galleryImageUris = jcdProjectPage.galleryImageUris;

    if(!Array.isArray(galleryImageUris)) {
      throw new JcdTypeError('array');
    }
    if(!galleryImageUris.every(isString)) {
      throw new JcdTypeError('string');
    }
    projectDetails = JcdProjectDetails.deserialize(jcdProjectPage.projectDetails);

    return new JcdProjectPage(
      galleryImageUris,
      projectDetails,
    );
  }
}
