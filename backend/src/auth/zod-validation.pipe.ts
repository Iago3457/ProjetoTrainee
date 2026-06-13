import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ZodObject } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
        const parsedValue = this.schema.parse(value);
        return parsedValue;
    } catch (error) {
        const formatErros = error.errors.map(err => ({
            campo: err.path.join('.'),
            mensagem: err.message,
        }));
        throw new BadRequestException({
            mensagem: 'Erro de validação nos dados enviados',
            erros: formatErros,
        });
    }
  }
}