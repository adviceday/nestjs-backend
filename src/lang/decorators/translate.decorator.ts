import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { TranslateInterceptor } from '../interseptors/translate.interceptor';
import { responseType } from '../../types/repsonse-type.type';

/**
 * Combine TranslateInterceptor and setting metadata for it
 *
 * @param resType - type of response of current route
 * @param fields - fields that need to be translated
 *
 * @link responseType
 */
export function Translate(resType: responseType, fields: string[]) {
  return applyDecorators(
    SetMetadata('responseType', resType),
    SetMetadata('translatedFields', fields),
    UseInterceptors(TranslateInterceptor),
  );
}
