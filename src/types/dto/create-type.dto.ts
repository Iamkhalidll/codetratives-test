export class CreateTypeDto {
    name: string;
    slug: string;
    language?: string;
    translated_languages?: string[];  // snake_case version
    translatedLanguages?: string[];   // camelCase version
    icon?: string;
    settings?: any;
    banners?: any[];
    promotional_sliders?: any[];      // snake_case version
    promotionalSliders?: any[];       // camelCase version
  }