
import {
  isObject,
  isNumber,
  isString,
  isStringArray,
  isUndefined,
} from '../../lib/modules/type-validation/validate-primitives';
import { JcdTypeError } from '../jcd-type-error';

export class JcdV3Project {

  constructor(
    public projectKey: string,
    public route: string,
    public title: string,
    public playwright: string[],
    public venue: string,
    public producer: string,
    public month: number,
    public year: number,
    public description: string[],
    public productionCredits: string[],
    public mediaAndPress: JcdV3ProjectMediaAndPress[],
  ) {}

  static deserialize(rawProject: unknown): JcdV3Project {
    let jcdV3Project: Record<string, unknown>;
    let projectKey: string,
      route: string,
      title: string,
      playwright: string[],
      venue: string,
      producer: string,
      month: number,
      year: number,
      description: string[],
      productionCredits: string[],
      mediaAndPress: JcdV3ProjectMediaAndPress[]
    ;
    if(!isObject(rawProject)) {
      throw new JcdTypeError('object');
    }
    jcdV3Project = rawProject as Record<string, unknown>;

    if(!isString(jcdV3Project.projectKey)) {
      throw new JcdTypeError('string');
    }
    if(!isString(jcdV3Project.route)) {
      throw new JcdTypeError('string');
    }
    if(!isString(jcdV3Project.title)) {
      throw new JcdTypeError('string');
    }
    if(!isStringArray(jcdV3Project.playwright)) {
      throw new JcdTypeError('string[]');
    }
    if(!isString(jcdV3Project.venue)) {
      throw new JcdTypeError('string');
    }
    if(!isString(jcdV3Project.producer)) {
      throw new JcdTypeError('string');
    }
    if(!isNumber(jcdV3Project.month)) {
      throw new JcdTypeError('number');
    }
    if(!isNumber(jcdV3Project.year)) {
      throw new JcdTypeError('number');
    }
    if(!isStringArray(jcdV3Project.description)) {
      throw new JcdTypeError('string[]');
    }
    if(!isStringArray(jcdV3Project.productionCredits)) {
      throw new JcdTypeError('string[]');
    }
    if(!Array.isArray(jcdV3Project.mediaAndPress)) {
      throw new JcdTypeError('JcdV3MediaAndPress[]');
    }

    projectKey = jcdV3Project.projectKey;
    route = jcdV3Project.route;
    title = jcdV3Project.title;
    playwright = jcdV3Project.playwright;
    venue = jcdV3Project.venue;
    producer = jcdV3Project.producer;
    month = jcdV3Project.month;
    year = jcdV3Project.year;
    description = jcdV3Project.description;
    productionCredits = jcdV3Project.productionCredits;

    try {
      mediaAndPress = jcdV3Project.mediaAndPress.map(JcdV3ProjectMediaAndPress.deserialize);
    } catch(e) {
      if(e instanceof JcdTypeError) {
        throw new JcdTypeError(`${e.message} in JcdV3MediaAndPress[]`);
      } else {
        throw e;
      }
    }

    return new JcdV3Project(
      projectKey,
      route,
      title,
      playwright,
      venue,
      producer,
      month,
      year,
      description,
      productionCredits,
      mediaAndPress,
    );

  }
}

export type JcdV3MediaAndPressLink = {
  label: string;
  uri: string;
};

function isJcdV3MediaAndPressLink(rawMediaAndPressLink: unknown): rawMediaAndPressLink is JcdV3MediaAndPressLink {
  let jcdV3MediaAndPressLink: Record<string, unknown>;

  if(isUndefined(rawMediaAndPressLink)) {
    return true;
  }

  if(!isObject(rawMediaAndPressLink)) {
    return false;
  }
  jcdV3MediaAndPressLink = rawMediaAndPressLink as Record<string, unknown>;

  if(!isString(jcdV3MediaAndPressLink.label)) {
    return false;
  }
  if(!isString(jcdV3MediaAndPressLink.uri)) {
    return false;
  }

  return true;
}

export class JcdV3ProjectMediaAndPress {

  constructor(
    public publication: string,
    public description?: string,
    public link?: JcdV3MediaAndPressLink,
  ) {}

  static deserialize(rawJcdMediaAndPressDetail: unknown): JcdV3ProjectMediaAndPress {
    let jcdMediaAndPressDetail: Record<string, unknown>;
    let publication: string, description: string;
    let link: JcdV3MediaAndPressLink;
    if(!isObject(rawJcdMediaAndPressDetail)) {
      throw new JcdTypeError('object');
    }
    jcdMediaAndPressDetail = rawJcdMediaAndPressDetail as Record<string, unknown>;
    if(!isString(jcdMediaAndPressDetail.publication)) {
      throw new JcdTypeError('string');
    }
    if(
      !isUndefined(jcdMediaAndPressDetail.description)
      && !isString(jcdMediaAndPressDetail.description)
    ) {
      throw new JcdTypeError('string | undefined');
    }

    if(!isJcdV3MediaAndPressLink(jcdMediaAndPressDetail.link)) {
      throw new JcdTypeError('JcdV3MediaAndPressLink');
    }

    publication = jcdMediaAndPressDetail.publication;
    description = jcdMediaAndPressDetail.description;
    link = jcdMediaAndPressDetail?.link;

    return new JcdV3ProjectMediaAndPress(
      publication,
      description,
      link,
    );
  }
}
