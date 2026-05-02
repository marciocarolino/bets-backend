import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class IngestRequestDto {
  @IsObject()
  @IsNotEmpty()
  rawData: Record<string, unknown>;

  @IsString()
  @IsOptional()
  externalId?: string;
}
