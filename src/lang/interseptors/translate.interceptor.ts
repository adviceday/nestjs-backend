import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { lang } from '../types/lang.type';
import { Request } from 'express';
import { responseType } from '../../types/repsonse-type.type';
import { Tree } from '../../types/tree.type';

/**
 * Interceptor to translate response fields
 * on selected language
 *
 * @link Translate
 */
@Injectable()
export class TranslateInterceptor implements NestInterceptor {
  /**
   * Init all providers
   *
   * @param reflector - to grab translated fields from metadata
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * make all transforms automatically
   * detect object or array responses
   *
   * @param context - to access request & response
   * @param next - next observable
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const lang = req.get('lang') as lang;
    if (!lang) {
      throw new BadRequestException('You should lang header for this request');
    }

    this.translatedFields = this.reflector.get(
      'translatedFields',
      context.getHandler(),
    );
    this.responseType = this.reflector.get(
      'responseType',
      context.getHandler(),
    );

    return next.handle().pipe(
      map((res) => {
        if (this.responseType === 'array') {
          return res.map((obj) => this.setLang(obj, lang));
        } else if (this.responseType === 'object') {
          return this.setLang(res, lang);
        } else if (this.responseType === 'tree') {
          this.iterateTree(res, (obj) => this.setLang(obj, lang));
          return res;
        }
      }),
    );
  }

  /**
   * Method for iteration through tree structure
   * @param tree - tree structure for iterating
   * @param fn - function that applying for all nodes of tree
   * @private
   */
  private iterateTree(tree: Tree<object>, fn: (obj: object) => void): void {
    if (!tree.children.length) {
      fn(tree.node);
    } else {
      fn(tree.node);
      tree.children.forEach((child) => {
        this.iterateTree(child, fn);
      });
    }
  }

  /**
   * Tells how to loop through response
   * set in intercept method
   *
   * @link intercept
   * @private
   */
  private responseType: responseType;

  /**
   * fields that need to be translated
   * set in intercept method
   *
   * @link intercept
   * @private
   */
  private translatedFields: string[] = [];

  /**
   * Get object with some fields containing JSON
   * with translations
   *
   * @param target - object that need to be translated
   * @param lang - which lang pass into fields
   * @private
   */
  private setLang(target: object, lang: lang): object {
    for (const key in target) {
      if (this.translatedFields.includes(key)) {
        if (typeof target[key] !== 'string') {
          throw new BadRequestException('Wrong fields to translate');
        }

        const parse = JSON.parse(target[key] as unknown as string);
        if (!(lang in parse)) {
          throw new BadRequestException(
            'Language provided in lang header is not exist in this object',
          );
        }

        target[key] = parse[lang];
      }
    }
    return target;
  }
}
