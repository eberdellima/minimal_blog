import { nanoid } from "nanoid"
import slugify from "slugify"


export interface Slugifier {
  slugify: (str: string) => string;
}

export class NanoIdSlugifier implements Slugifier {

  public slugify = (str: string): string => {
    return slugify(str, '_').concat(nanoid());
  }
}